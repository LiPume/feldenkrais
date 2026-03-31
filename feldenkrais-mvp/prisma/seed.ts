import { config as loadEnv } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, PracticeStatus } from '@prisma/client';
import { BODY_REGION_SEED } from './seed-data/body-regions';
import { FEEDBACK_LABEL_SEED } from './seed-data/feedback-labels';
import { PRACTICE_SEED } from './seed-data/practices';

loadEnv({ path: '.env.local' });
loadEnv();

function createSeedClient() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Missing DIRECT_URL or DATABASE_URL for seeding.');
  }

  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

const prisma = createSeedClient();

async function seedBodyRegions() {
  for (const region of BODY_REGION_SEED) {
    await prisma.bodyRegion.upsert({
      where: { code: region.code },
      create: {
        code: region.code,
        nameZh: region.nameZh,
        viewSide: region.viewSide === 'front' ? 'FRONT' : 'BACK',
        sortOrder: region.sortOrder,
        svgKey: region.svgKey,
      },
      update: {
        nameZh: region.nameZh,
        viewSide: region.viewSide === 'front' ? 'FRONT' : 'BACK',
        sortOrder: region.sortOrder,
        svgKey: region.svgKey,
      },
    });
  }
}

async function seedFeedbackLabels() {
  for (const label of FEEDBACK_LABEL_SEED) {
    await prisma.feedbackLabel.upsert({
      where: { code: label.code },
      create: {
        code: label.code,
        nameZh: label.nameZh,
        sortOrder: label.sortOrder,
        isActive: label.isActive,
      },
      update: {
        nameZh: label.nameZh,
        sortOrder: label.sortOrder,
        isActive: label.isActive,
      },
    });
  }
}

async function seedPractices() {
  const bodyRegionMap = new Map(
    (await prisma.bodyRegion.findMany({
      select: {
        id: true,
        code: true,
      },
    })).map((region) => [region.code, region.id]),
  );

  for (const practice of PRACTICE_SEED) {
    const bodyRegionCreates = practice.bodyRegionCodes.map((code) => {
      const bodyRegionId = bodyRegionMap.get(code);

      if (!bodyRegionId) {
        throw new Error(`Body region not found for code: ${code}`);
      }

      return {
        bodyRegionId,
      };
    });

    await prisma.practice.upsert({
      where: { slug: practice.slug },
      create: {
        slug: practice.slug,
        title: practice.title,
        courseName: practice.courseName,
        summary: practice.summary,
        contentText: practice.contentText,
        audioUrl: practice.audioUrl,
        durationSec: practice.durationSec,
        status: PracticeStatus.PUBLISHED,
        bodyRegionLinks: {
          create: bodyRegionCreates,
        },
      },
      update: {
        title: practice.title,
        courseName: practice.courseName,
        summary: practice.summary,
        contentText: practice.contentText,
        audioUrl: practice.audioUrl,
        durationSec: practice.durationSec,
        status: PracticeStatus.PUBLISHED,
        bodyRegionLinks: {
          deleteMany: {},
          create: bodyRegionCreates,
        },
      },
    });
  }
}

async function main() {
  await seedBodyRegions();
  await seedFeedbackLabels();
  await seedPractices();

  console.info(
    `Seed completed: ${BODY_REGION_SEED.length} body regions, ${FEEDBACK_LABEL_SEED.length} feedback labels, ${PRACTICE_SEED.length} practices.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
