import PracticeSearchClient from '@/components/practices/PracticeSearchClient';
import { getPublishedPractices } from '@/server/queries/practices';

export default async function PracticeSearchPage() {
  const practices = await getPublishedPractices();

  return <PracticeSearchClient practices={practices} />;
}
