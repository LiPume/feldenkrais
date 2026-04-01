import {
  FeedbackPhase,
  LeftRightDiff,
  type Prisma,
} from '@prisma/client';
import { isInternalStudentEmail } from '@/lib/auth/student-account';
import { formatDateOnly } from '@/lib/utils/date';
import { parseDateOnly } from '@/lib/utils/date';
import type { BodyRegionCode } from '@/types/body-region';
import type {
  FeedbackBodyPartListItem,
  FeedbackLabelCode,
  FeedbackPhaseValue,
  FeedbackSessionQueryFilters,
  FeedbackSessionListItem,
  LeftRightDiffValue,
  PaginatedFeedbackSessions,
} from '@/types/feedback';
import { getPrismaClient } from '@/server/db/prisma';

const feedbackSessionInclude = {
  practice: {
    select: {
      id: true,
      slug: true,
      title: true,
    },
  },
  studentProfile: {
    select: {
      id: true,
      fullName: true,
      studentId: true,
      email: true,
    },
  },
  bodyPartEntries: {
    include: {
      bodyRegion: {
        select: {
          code: true,
          nameZh: true,
        },
      },
      labels: {
        include: {
          label: {
            select: {
              code: true,
              nameZh: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc' as const,
        },
      },
    },
    orderBy: [
      { sortOrder: 'asc' as const },
      { createdAt: 'asc' as const },
    ],
  },
} satisfies Prisma.FeedbackSessionInclude;

type FeedbackSessionWithRelations = Prisma.FeedbackSessionGetPayload<{
  include: typeof feedbackSessionInclude;
}>;

const phaseMap: Record<FeedbackPhaseValue, FeedbackPhase> = {
  before: FeedbackPhase.BEFORE,
  after: FeedbackPhase.AFTER,
};

type FeedbackSessionCursor = {
  createdAt: Date;
  id: string;
};

function mapFeedbackPhase(phase: FeedbackPhase): FeedbackPhaseValue {
  return phase === FeedbackPhase.BEFORE ? 'before' : 'after';
}

function mapLeftRightDiff(diff: LeftRightDiff | null): LeftRightDiffValue {
  switch (diff) {
    case LeftRightDiff.LEFT_MORE:
      return 'left_more';
    case LeftRightDiff.RIGHT_MORE:
      return 'right_more';
    case LeftRightDiff.UNCLEAR:
      return 'unclear';
    case LeftRightDiff.NONE:
    default:
      return 'none';
  }
}

function mapFeedbackEntry(
  entry: FeedbackSessionWithRelations['bodyPartEntries'][number],
): FeedbackBodyPartListItem {
  return {
    id: entry.id,
    bodyRegionCode: entry.bodyRegion.code as BodyRegionCode,
    bodyRegionName: entry.bodyRegion.nameZh,
    sortOrder: entry.sortOrder,
    intensityScore: entry.intensityScore,
    labelCodes: entry.labels.map((link) => link.label.code as FeedbackLabelCode),
    labelNames: entry.labels.map((link) => link.label.nameZh),
    leftRightDiff: mapLeftRightDiff(entry.leftRightDiff),
    note: entry.note ?? undefined,
  };
}

function mapFeedbackSession(session: FeedbackSessionWithRelations): FeedbackSessionListItem {
  const studentName =
    session.studentProfile.fullName ??
    session.studentProfile.studentId ??
    session.studentProfile.email;
  const studentEmail = isInternalStudentEmail(session.studentProfile.email)
    ? undefined
    : session.studentProfile.email;

  return {
    id: session.id,
    practiceId: session.practice?.id ?? undefined,
    practiceTitle: session.practice?.title ?? session.practiceTitleSnapshot ?? undefined,
    practiceSlug: session.practice?.slug ?? undefined,
    feedbackPhase: mapFeedbackPhase(session.feedbackPhase),
    feedbackDate: formatDateOnly(session.feedbackDate),
    createdAt: session.createdAt.toISOString(),
    studentProfileId: session.studentProfile.id,
    studentName,
    studentId: session.studentProfile.studentId ?? undefined,
    studentEmail,
    entries: session.bodyPartEntries.map(mapFeedbackEntry),
  };
}

export async function getFeedbackSessionsByStudentProfileId(
  studentProfileId: string,
  filters: Omit<FeedbackSessionQueryFilters, 'studentProfileId'> = {},
): Promise<FeedbackSessionListItem[]> {
  return getFeedbackSessions({
    ...filters,
    studentProfileId,
  });
}

export async function getFeedbackSessionsByPracticeId(
  practiceId: string,
  filters: Omit<FeedbackSessionQueryFilters, 'practiceId'> = {},
): Promise<FeedbackSessionListItem[]> {
  return getFeedbackSessions({
    ...filters,
    practiceId,
  });
}

export async function getPaginatedFeedbackSessionsByPracticeId(
  practiceId: string,
  filters: Omit<FeedbackSessionQueryFilters, 'practiceId'> = {},
  pagination: {
    pageSize?: number;
    after?: string;
    before?: string;
  } = {},
): Promise<PaginatedFeedbackSessions> {
  return getPaginatedFeedbackSessions(
    {
      ...filters,
      practiceId,
    },
    pagination,
  );
}

async function getFeedbackSessions(
  filters: FeedbackSessionQueryFilters,
): Promise<FeedbackSessionListItem[]> {
  const prisma = getPrismaClient();
  const where = buildFeedbackSessionWhereInput(filters);
  const sessions = await prisma.feedbackSession.findMany({
    where,
    include: feedbackSessionInclude,
    orderBy: [
      { feedbackDate: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return sessions.map(mapFeedbackSession);
}

async function getPaginatedFeedbackSessions(
  filters: FeedbackSessionQueryFilters,
  pagination: {
    pageSize?: number;
    after?: string;
    before?: string;
  },
): Promise<PaginatedFeedbackSessions> {
  const prisma = getPrismaClient();
  const pageSize = pagination.pageSize ?? 12;
  const baseWhere = buildFeedbackSessionWhereInput(filters);
  const afterCursor = pagination.after
    ? decodeFeedbackSessionCursor(pagination.after)
    : null;
  const beforeCursor = !afterCursor && pagination.before
    ? decodeFeedbackSessionCursor(pagination.before)
    : null;
  const where = buildCursorScopedWhereInput(baseWhere, {
    after: afterCursor,
    before: beforeCursor,
  });
  const rows = await prisma.feedbackSession.findMany({
    where,
    include: feedbackSessionInclude,
    orderBy: beforeCursor
      ? [
          { createdAt: 'asc' },
          { id: 'asc' },
        ]
      : [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
    take: pageSize + 1,
  });

  if (beforeCursor) {
    const hasPreviousPage = rows.length > pageSize;
    const pageRows = rows.slice(0, pageSize).reverse();
    const sessions = pageRows.map(mapFeedbackSession);

    return {
      sessions,
      pageInfo: {
        pageSize,
        hasNextPage: sessions.length > 0,
        hasPreviousPage,
        nextCursor:
          sessions.length > 0
            ? encodeFeedbackSessionCursor(
                sessions[sessions.length - 1].createdAt,
                sessions[sessions.length - 1].id,
              )
            : undefined,
        previousCursor:
          hasPreviousPage && sessions.length > 0
            ? encodeFeedbackSessionCursor(sessions[0].createdAt, sessions[0].id)
            : undefined,
      },
    };
  }

  const hasNextPage = rows.length > pageSize;
  const pageRows = rows.slice(0, pageSize);
  const sessions = pageRows.map(mapFeedbackSession);
  const hasPreviousPage = Boolean(afterCursor);

  return {
    sessions,
    pageInfo: {
      pageSize,
      hasNextPage,
      hasPreviousPage,
      nextCursor:
        hasNextPage && sessions.length > 0
          ? encodeFeedbackSessionCursor(
              sessions[sessions.length - 1].createdAt,
              sessions[sessions.length - 1].id,
            )
          : undefined,
      previousCursor:
        hasPreviousPage && sessions.length > 0
          ? encodeFeedbackSessionCursor(sessions[0].createdAt, sessions[0].id)
          : undefined,
    },
  };
}

export function buildFeedbackSessionWhereInput(
  filters: FeedbackSessionQueryFilters,
): Prisma.FeedbackSessionWhereInput {
  const where: Prisma.FeedbackSessionWhereInput = {};

  if (filters.studentProfileId) {
    where.studentProfileId = filters.studentProfileId;
  }

  if (filters.practiceId) {
    where.practiceId = filters.practiceId;
  }

  if (filters.feedbackPhase) {
    where.feedbackPhase = phaseMap[filters.feedbackPhase];
  }

  if (filters.dateFrom || filters.dateTo) {
    where.feedbackDate = {
      ...(filters.dateFrom ? { gte: parseDateOnly(filters.dateFrom) } : {}),
      ...(filters.dateTo ? { lte: parseDateOnly(filters.dateTo) } : {}),
    };
  }

  return where;
}

function buildCursorScopedWhereInput(
  baseWhere: Prisma.FeedbackSessionWhereInput,
  cursorParams: {
    after?: FeedbackSessionCursor | null;
    before?: FeedbackSessionCursor | null;
  },
): Prisma.FeedbackSessionWhereInput {
  if (cursorParams.after) {
    return {
      AND: [
        baseWhere,
        {
          OR: [
            {
              createdAt: {
                lt: cursorParams.after.createdAt,
              },
            },
            {
              createdAt: cursorParams.after.createdAt,
              id: {
                lt: cursorParams.after.id,
              },
            },
          ],
        },
      ],
    };
  }

  if (cursorParams.before) {
    return {
      AND: [
        baseWhere,
        {
          OR: [
            {
              createdAt: {
                gt: cursorParams.before.createdAt,
              },
            },
            {
              createdAt: cursorParams.before.createdAt,
              id: {
                gt: cursorParams.before.id,
              },
            },
          ],
        },
      ],
    };
  }

  return baseWhere;
}

function encodeFeedbackSessionCursor(createdAtIso: string, id: string): string {
  return `${createdAtIso}|${id}`;
}

function decodeFeedbackSessionCursor(value: string): FeedbackSessionCursor | null {
  const separatorIndex = value.indexOf('|');

  if (separatorIndex === -1) {
    return null;
  }

  const createdAtValue = value.slice(0, separatorIndex);
  const id = value.slice(separatorIndex + 1);
  const createdAt = new Date(createdAtValue);

  if (!id || Number.isNaN(createdAt.getTime())) {
    return null;
  }

  return {
    createdAt,
    id,
  };
}
