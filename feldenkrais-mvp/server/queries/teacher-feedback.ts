import { UserRole, type Prisma } from '@prisma/client';
import { isInternalStudentEmail } from '@/lib/auth/student-account';
import { formatDateOnly } from '@/lib/utils/date';
import type { BodyRegionCode } from '@/types/body-region';
import type {
  TeacherDashboardData,
  TeacherFeedbackFilters,
  TeacherPracticeDetailData,
  TeacherStudentHistory,
} from '@/types/feedback';
import { getPrismaClient } from '@/server/db/prisma';
import {
  buildFeedbackSessionWhereInput,
  getPaginatedFeedbackSessionsByPracticeId,
  getFeedbackSessionsByStudentProfileId,
} from '@/server/queries/feedback';

function sortBodyRegionStats(
  stats: TeacherDashboardData['bodyRegionStats'],
) {
  return [...stats].sort((left, right) => right.count - left.count);
}

function sortLabelStats(
  stats: TeacherDashboardData['labelStats'],
) {
  return [...stats].sort((left, right) => right.count - left.count);
}

function mapTeacherFiltersToSessionFilters(
  filters: TeacherFeedbackFilters,
) {
  return {
    feedbackPhase: filters.phase,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };
}

function hasWhereConditions(where: Prisma.FeedbackSessionWhereInput): boolean {
  return Object.keys(where).length > 0;
}

export async function getTeacherDashboardData(
  filters: TeacherFeedbackFilters = {},
): Promise<TeacherDashboardData> {
  const prisma = getPrismaClient();
  const sessionWhere = buildFeedbackSessionWhereInput(
    mapTeacherFiltersToSessionFilters(filters),
  );
  const relationScopedBodyEntryWhere = hasWhereConditions(sessionWhere)
    ? {
        session: {
          is: sessionWhere,
        },
      }
    : undefined;
  const relationScopedLabelWhere = hasWhereConditions(sessionWhere)
    ? {
        entry: {
          is: {
            session: {
              is: sessionWhere,
            },
          },
        },
      }
    : undefined;
  const [
    totalFeedbackSessions,
    practiceGroups,
    bodyRegionGroups,
    labelGroups,
    studentGroups,
    studentProfiles,
  ] =
    await Promise.all([
      prisma.feedbackSession.count({
        where: sessionWhere,
      }),
      prisma.feedbackSession.groupBy({
        by: ['practiceId'],
        where: {
          ...sessionWhere,
          practiceId: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
      }),
      prisma.feedbackBodyPartEntry.groupBy({
        by: ['bodyRegionId'],
        where: relationScopedBodyEntryWhere,
        _count: {
          _all: true,
        },
      }),
      prisma.feedbackBodyPartEntryLabel.groupBy({
        by: ['labelId'],
        where: relationScopedLabelWhere,
        _count: {
          _all: true,
        },
      }),
      prisma.feedbackSession.groupBy({
        by: ['studentProfileId'],
        where: sessionWhere,
        _count: {
          _all: true,
        },
        _max: {
          feedbackDate: true,
        },
      }),
      prisma.userProfile.findMany({
        where: {
          role: UserRole.STUDENT,
        },
        select: {
          id: true,
          fullName: true,
          studentId: true,
          email: true,
        },
      }),
    ]);

  const [practices, bodyRegions, labels] = await Promise.all([
    practiceGroups.length > 0
      ? prisma.practice.findMany({
          where: {
            id: {
              in: practiceGroups.flatMap((group) =>
                group.practiceId ? [group.practiceId] : [],
              ),
            },
          },
          select: {
            id: true,
            title: true,
          },
        })
      : Promise.resolve([]),
    bodyRegionGroups.length > 0
      ? prisma.bodyRegion.findMany({
          where: {
            id: {
              in: bodyRegionGroups.map((group) => group.bodyRegionId),
            },
          },
          select: {
            id: true,
            code: true,
            nameZh: true,
          },
        })
      : Promise.resolve([]),
    labelGroups.length > 0
      ? prisma.feedbackLabel.findMany({
          where: {
            id: {
              in: labelGroups.map((group) => group.labelId),
            },
          },
          select: {
            id: true,
            code: true,
            nameZh: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const practiceMap = new Map(practices.map((practice) => [practice.id, practice.title]));
  const bodyRegionMap = new Map(
    bodyRegions.map((bodyRegion) => [
      bodyRegion.id,
      { code: bodyRegion.code, nameZh: bodyRegion.nameZh },
    ]),
  );
  const labelMap = new Map(
    labels.map((label) => [label.id, { code: label.code, nameZh: label.nameZh }]),
  );
  const studentMap = new Map(
    studentGroups.map((group) => [
      group.studentProfileId,
      {
        feedbackCount: group._count._all,
        lastFeedbackDate: group._max.feedbackDate
          ? formatDateOnly(group._max.feedbackDate)
          : undefined,
      },
    ]),
  );
  const studentSummaries = studentProfiles
    .map((profile) => {
      const studentGroup = studentMap.get(profile.id);

      return {
        studentProfileId: profile.id,
        studentName: profile.fullName ?? profile.studentId ?? profile.email,
        studentId: profile.studentId ?? undefined,
        studentEmail: isInternalStudentEmail(profile.email) ? undefined : profile.email,
        feedbackCount: studentGroup?.feedbackCount ?? 0,
        hasSubmitted: (studentGroup?.feedbackCount ?? 0) > 0,
        lastFeedbackDate: studentGroup?.lastFeedbackDate,
      };
    })
    .sort((left, right) => {
      const leftStudentId = left.studentId ?? '';
      const rightStudentId = right.studentId ?? '';

      if (leftStudentId !== rightStudentId) {
        return leftStudentId.localeCompare(rightStudentId);
      }

      return left.studentName.localeCompare(right.studentName);
    });
  const submittedStudentCount = studentSummaries.filter((item) => item.hasSubmitted).length;

  return {
    totalFeedbackSessions,
    registeredStudentCount: studentProfiles.length,
    submittedStudentCount,
    missingStudentCount: studentProfiles.length - submittedStudentCount,
    practiceStats: practiceGroups
      .map((group) => {
        if (!group.practiceId) {
          return null;
        }

        return {
          practiceId: group.practiceId,
          practiceTitle: practiceMap.get(group.practiceId) ?? '未命名练习',
          feedbackCount: group._count._all,
        };
      })
      .filter((group) => group !== null)
      .sort((left, right) => right.feedbackCount - left.feedbackCount),
    bodyRegionStats: bodyRegionGroups
      .map((group) => {
        const bodyRegion = bodyRegionMap.get(group.bodyRegionId);

        if (!bodyRegion) {
          return null;
        }

        return {
          bodyRegionCode: bodyRegion.code as BodyRegionCode,
          bodyRegionName: bodyRegion.nameZh,
          count: group._count._all,
        };
      })
      .filter((group) => group !== null)
      .sort((left, right) => right.count - left.count),
    labelStats: labelGroups
      .map((group) => {
        const label = labelMap.get(group.labelId);

        if (!label) {
          return null;
        }

        return {
          labelCode: label.code as TeacherDashboardData['labelStats'][number]['labelCode'],
          labelName: label.nameZh,
          count: group._count._all,
        };
      })
      .filter((group) => group !== null)
      .sort((left, right) => right.count - left.count),
    studentSummaries,
  };
}

export async function getTeacherStudentHistory(
  studentProfileId: string,
): Promise<TeacherStudentHistory | null> {
  const prisma = getPrismaClient();
  const profile = await prisma.userProfile.findUnique({
    where: {
      id: studentProfileId,
    },
    select: {
      id: true,
      fullName: true,
      studentId: true,
      email: true,
    },
  });

  if (!profile) {
    return null;
  }

  const sessions = await getFeedbackSessionsByStudentProfileId(profile.id);

  return {
    student: {
      id: profile.id,
      name: profile.fullName ?? profile.studentId ?? profile.email,
      studentId: profile.studentId ?? undefined,
      email: isInternalStudentEmail(profile.email) ? undefined : profile.email,
    },
    sessions,
  };
}

export async function getTeacherPracticeDetail(
  practiceId: string,
  filters: TeacherFeedbackFilters = {},
  pagination: {
    after?: string;
    before?: string;
    pageSize?: number;
  } = {},
): Promise<TeacherPracticeDetailData | null> {
  const prisma = getPrismaClient();
  const practice = await prisma.practice.findUnique({
    where: {
      id: practiceId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      courseName: true,
      summary: true,
    },
  });

  if (!practice) {
    return null;
  }

  const sessionWhere = buildFeedbackSessionWhereInput({
    practiceId: practice.id,
    ...mapTeacherFiltersToSessionFilters(filters),
  });
  const relationScopedBodyEntryWhere = {
    session: {
      is: sessionWhere,
    },
  };
  const relationScopedLabelWhere = {
    entry: {
      is: {
        session: {
          is: sessionWhere,
        },
      },
    },
  };
  const [feedbackCount, studentGroups, bodyRegionGroups, labelGroups, recentFeedback] =
    await Promise.all([
      prisma.feedbackSession.count({
        where: sessionWhere,
      }),
      prisma.feedbackSession.groupBy({
        by: ['studentProfileId'],
        where: sessionWhere,
      }),
      prisma.feedbackBodyPartEntry.groupBy({
        by: ['bodyRegionId'],
        where: relationScopedBodyEntryWhere,
        _count: {
          _all: true,
        },
      }),
      prisma.feedbackBodyPartEntryLabel.groupBy({
        by: ['labelId'],
        where: relationScopedLabelWhere,
        _count: {
          _all: true,
        },
      }),
      getPaginatedFeedbackSessionsByPracticeId(
        practice.id,
        mapTeacherFiltersToSessionFilters(filters),
        pagination,
      ),
    ]);
  const [bodyRegions, labels] = await Promise.all([
    bodyRegionGroups.length > 0
      ? prisma.bodyRegion.findMany({
          where: {
            id: {
              in: bodyRegionGroups.map((group) => group.bodyRegionId),
            },
          },
          select: {
            id: true,
            code: true,
            nameZh: true,
          },
        })
      : Promise.resolve([]),
    labelGroups.length > 0
      ? prisma.feedbackLabel.findMany({
          where: {
            id: {
              in: labelGroups.map((group) => group.labelId),
            },
          },
          select: {
            id: true,
            code: true,
            nameZh: true,
          },
        })
      : Promise.resolve([]),
  ]);
  const bodyRegionMap = new Map(
    bodyRegions.map((bodyRegion) => [
      bodyRegion.id,
      { code: bodyRegion.code, nameZh: bodyRegion.nameZh },
    ]),
  );
  const labelMap = new Map(
    labels.map((label) => [label.id, { code: label.code, nameZh: label.nameZh }]),
  );

  return {
    practice,
    feedbackCount,
    studentCount: studentGroups.length,
    bodyRegionStats: sortBodyRegionStats(
      bodyRegionGroups
        .map((group) => {
          const bodyRegion = bodyRegionMap.get(group.bodyRegionId);

          if (!bodyRegion) {
            return null;
          }

          return {
            bodyRegionCode: bodyRegion.code as BodyRegionCode,
            bodyRegionName: bodyRegion.nameZh,
            count: group._count._all,
          };
        })
        .filter((group) => group !== null),
    ),
    labelStats: sortLabelStats(
      labelGroups
        .map((group) => {
          const label = labelMap.get(group.labelId);

          if (!label) {
            return null;
          }

          return {
            labelCode: label.code as TeacherDashboardData['labelStats'][number]['labelCode'],
            labelName: label.nameZh,
            count: group._count._all,
          };
        })
        .filter((group) => group !== null),
    ),
    recentFeedback,
  };
}
