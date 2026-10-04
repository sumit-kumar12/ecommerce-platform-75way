import SentClient from "./SentClient";

export default async function ForgotPasswordSentPage({ searchParams }) {
  const params = await searchParams;
  return <SentClient email={params?.email ?? ""} />;
}
