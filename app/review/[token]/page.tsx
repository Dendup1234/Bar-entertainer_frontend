import { redirect } from 'next/navigation';

export default async function LegacyReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/reviews/${token}`);
}
