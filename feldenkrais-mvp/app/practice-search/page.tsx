import PracticeSearchClient from '@/components/practices/PracticeSearchClient';
import { getPublishedPractices } from '@/server/queries/practices';

export const dynamic = 'force-dynamic';

export default async function PracticeSearchPage() {
  const practices = await getPublishedPractices();

  return <PracticeSearchClient practices={practices} />;
}
