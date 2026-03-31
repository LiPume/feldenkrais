import type { Prisma } from '@prisma/client';
import type { BodyRegionCode } from '@/types/body-region';
import type { PracticeDetail, PracticeListItem } from '@/types/practice';
import { getPrismaClient } from '@/server/db/prisma';

const practiceInclude = {
  bodyRegionLinks: {
    include: {
      bodyRegion: {
        select: {
          code: true,
        },
      },
    },
    orderBy: {
      bodyRegion: {
        sortOrder: 'asc' as const,
      },
    },
  },
} satisfies Prisma.PracticeInclude;

type PracticeWithRegions = Prisma.PracticeGetPayload<{
  include: typeof practiceInclude;
}>;

function mapPractice(practice: PracticeWithRegions): PracticeDetail {
  return {
    id: practice.id,
    title: practice.title,
    slug: practice.slug,
    courseName: practice.courseName,
    summary: practice.summary,
    contentText: practice.contentText,
    audioUrl: practice.audioUrl,
    durationSec: practice.durationSec,
    bodyRegionCodes: practice.bodyRegionLinks.map((link) => link.bodyRegion.code as BodyRegionCode),
  };
}

export async function getPublishedPractices(): Promise<PracticeListItem[]> {
  const prisma = getPrismaClient();
  const practices = await prisma.practice.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: practiceInclude,
    orderBy: {
      title: 'asc',
    },
  });

  return practices.map(mapPractice);
}

export async function getPublishedPracticeBySlug(slug: string): Promise<PracticeDetail | null> {
  const prisma = getPrismaClient();
  const practice = await prisma.practice.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: practiceInclude,
  });

  return practice ? mapPractice(practice) : null;
}

export async function getPracticeById(id: string): Promise<PracticeDetail | null> {
  const prisma = getPrismaClient();
  const practice = await prisma.practice.findUnique({
    where: {
      id,
    },
    include: practiceInclude,
  });

  return practice ? mapPractice(practice) : null;
}
