import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage({ params }) {
  return <ResetPasswordClient token={params.token} />;
}
