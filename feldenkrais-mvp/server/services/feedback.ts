import { FeedbackPhase, LeftRightDiff } from '@prisma/client';
import { LEGACY_PRACTICE_ID_TO_SLUG } from '@/lib/constants/legacy-feedback';
import { parseDateOnly } from '@/lib/utils/date';
import type { CreateFeedbackSessionPayload, LegacyFeedbackRecord } from '@/types/feedback';
import { getPrismaClient } from '@/server/db/prisma';

const phaseMap: Record<CreateFeedbackSessionPayload['feedbackPhase'], FeedbackPhase> = {
  before: FeedbackPhase.BEFORE,
  after: FeedbackPhase.AFTER,
};

const leftRightMap = {
  none: LeftRightDiff.NONE,
  left_more: LeftRightDiff.LEFT_MORE,
  right_more: LeftRightDiff.RIGHT_MORE,
  unclear: LeftRightDiff.UNCLEAR,
} as const;

export async function createFeedbackSessionForStudent(
  studentProfileId: string,
  payload: CreateFeedbackSessionPayload,
) {
  const prisma = getPrismaClient();
  const requestedPracticeId = payload.practiceId;
  const requestedRegionCodes = payload.entries.map((entry) => entry.bodyRegionCode);
  const requestedLabelCodes = Array.from(
    new Set(payload.entries.flatMap((entry) => entry.labelCodes)),
  );

  const [practice, bodyRegions, labels] = await Promise.all([
    requestedPracticeId
      ? prisma.practice.findUnique({
          where: { id: requestedPracticeId },
          select: { id: true, title: true },
        })
      : Promise.resolve(null),
    prisma.bodyRegion.findMany({
      where: {
        code: {
          in: requestedRegionCodes,
        },
      },
      select: {
        id: true,
        code: true,
      },
    }),
    requestedLabelCodes.length > 0
      ? prisma.feedbackLabel.findMany({
          where: {
            code: {
              in: requestedLabelCodes,
            },
            isActive: true,
          },
          select: {
            id: true,
            code: true,
          },
        })
      : Promise.resolve([]),
  ]);

  if (requestedPracticeId && !practice) {
    throw new Error('所选练习不存在或已被移除，请刷新后重试。');
  }

  if (bodyRegions.length !== requestedRegionCodes.length) {
    throw new Error('部分身体部位不存在，请刷新页面后重试。');
  }

  if (labels.length !== requestedLabelCodes.length) {
    throw new Error('部分反馈标签不存在或已停用，请刷新页面后重试。');
  }

  const bodyRegionIdMap = new Map(bodyRegions.map((region) => [region.code, region.id]));
  const labelIdMap = new Map(labels.map((label) => [label.code, label.id]));

  const session = await prisma.feedbackSession.create({
    data: {
      studentProfileId,
      practiceId: practice?.id,
      practiceTitleSnapshot: practice?.title ?? payload.practiceTitleSnapshot,
      feedbackPhase: phaseMap[payload.feedbackPhase],
      feedbackDate: parseDateOnly(payload.feedbackDate),
      bodyPartEntries: {
        create: payload.entries.map((entry) => ({
          bodyRegionId: bodyRegionIdMap.get(entry.bodyRegionCode)!,
          sortOrder: entry.sortOrder,
          intensityScore: entry.intensityScore,
          leftRightDiff: leftRightMap[entry.leftRightDiff],
          note: entry.note,
          labels:
            entry.labelCodes.length > 0
              ? {
                  create: entry.labelCodes.map((labelCode) => ({
                    labelId: labelIdMap.get(labelCode)!,
                  })),
                }
              : undefined,
        })),
      },
    },
    select: {
      id: true,
    },
  });

  return session;
}

function isUuidLike(value: string | undefined): value is string {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeTitle(title: string | undefined): string | undefined {
  return title?.trim() || undefined;
}

function mapLegacyRecordToPayload(
  record: LegacyFeedbackRecord,
  resolvedPracticeId?: string,
): CreateFeedbackSessionPayload {
  return {
    practiceId: resolvedPracticeId,
    practiceTitleSnapshot: normalizeTitle(record.practiceTitle),
    feedbackPhase: record.feedbackPhase,
    feedbackDate: record.feedbackDate,
    entries: record.bodyRegionCodes.map((bodyRegionCode, index) => ({
      bodyRegionCode,
      sortOrder: index,
      intensityScore: record.intensityScore,
      labelCodes: record.feelingTags,
      leftRightDiff: record.leftRightDiff ?? 'none',
      note: record.note,
    })),
  };
}

export async function importLegacyFeedbackSessionsForStudent(
  studentProfileId: string,
  records: LegacyFeedbackRecord[],
) {
  const prisma = getPrismaClient();
  const uuidPracticeIds = records.flatMap((record) =>
    isUuidLike(record.practiceId) ? [record.practiceId] : [],
  );
  const legacySlugs = records.flatMap((record) => {
    const practiceId = record.practiceId?.trim();

    if (!practiceId) {
      return [];
    }

    const slug = LEGACY_PRACTICE_ID_TO_SLUG[practiceId];
    return slug ? [slug] : [];
  });
  const titles = records.flatMap((record) => {
    const title = normalizeTitle(record.practiceTitle);
    return title ? [title] : [];
  });
  const practiceWhereClauses = [
    uuidPracticeIds.length > 0
      ? {
          id: {
            in: uuidPracticeIds,
          },
        }
      : null,
    legacySlugs.length > 0
      ? {
          slug: {
            in: legacySlugs,
          },
        }
      : null,
    titles.length > 0
      ? {
          title: {
            in: titles,
          },
        }
      : null,
  ].filter((condition) => condition !== null);

  const practices = practiceWhereClauses.length > 0
    ? await prisma.practice.findMany({
        where: {
          OR: practiceWhereClauses,
        },
        select: {
          id: true,
          slug: true,
          title: true,
        },
      })
    : [];

  const practiceById = new Map(practices.map((practice) => [practice.id, practice.id]));
  const practiceBySlug = new Map(practices.map((practice) => [practice.slug, practice.id]));
  const practiceByTitle = new Map(practices.map((practice) => [practice.title, practice.id]));

  let importedCount = 0;

  for (const record of records) {
    const normalizedPracticeId = record.practiceId?.trim();
    const legacySlug = normalizedPracticeId
      ? LEGACY_PRACTICE_ID_TO_SLUG[normalizedPracticeId]
      : undefined;
    const resolvedPracticeId =
      (normalizedPracticeId ? practiceById.get(normalizedPracticeId) : undefined)
      ?? (legacySlug ? practiceBySlug.get(legacySlug) : undefined)
      ?? (normalizeTitle(record.practiceTitle)
        ? practiceByTitle.get(normalizeTitle(record.practiceTitle)!)
        : undefined);

    await createFeedbackSessionForStudent(
      studentProfileId,
      mapLegacyRecordToPayload(record, resolvedPracticeId),
    );
    importedCount += 1;
  }

  return {
    importedCount,
  };
}
