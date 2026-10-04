import LoginClient from "./LoginClient";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  return <LoginClient registered={params.registered} reset={params.reset} />;
}
