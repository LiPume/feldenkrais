import type { Prisma } from '@prisma/client';
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
  const [totalFeedbackSessions, practiceGroups, bodyRegionGroups, labelGroups, studentGroups] =
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
    ]);

  const [practices, bodyRegions, labels, studentProfiles] = await Promise.all([
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
    studentGroups.length > 0
      ? prisma.userProfile.findMany({
          where: {
            id: {
              in: studentGroups.map((group) => group.studentProfileId),
            },
          },
          select: {
            id: true,
            fullName: true,
            email: true,
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
    studentProfiles.map((profile) => [
      profile.id,
      {
        name: profile.fullName ?? profile.email,
        email: profile.email,
      },
    ]),
  );

  return {
    totalFeedbackSessions,
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
    studentSummaries: studentGroups
      .map((group) => {
        const student = studentMap.get(group.studentProfileId);

        if (!student) {
          return null;
        }

        return {
          studentProfileId: group.studentProfileId,
          studentName: student.name,
          studentEmail: student.email,
          feedbackCount: group._count._all,
          lastFeedbackDate: group._max.feedbackDate
            ? formatDateOnly(group._max.feedbackDate)
            : undefined,
        };
      })
      .filter((group) => group !== null)
      .sort((left, right) => {
        if (right.feedbackCount !== left.feedbackCount) {
          return right.feedbackCount - left.feedbackCount;
        }

        return (right.lastFeedbackDate ?? '').localeCompare(left.lastFeedbackDate ?? '');
      }),
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
      name: profile.fullName ?? profile.email,
      email: profile.email,
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
