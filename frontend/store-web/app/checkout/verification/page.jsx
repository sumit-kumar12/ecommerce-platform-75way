import VerificationClient from "./VerificationClient";

const readParam = (value) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return typeof value === "string" ? value : "";
};

export default async function CheckoutVerificationPage({ searchParams }) {
  const params = await searchParams;
  return (
    <VerificationClient
      orderId={readParam(params?.orderId)}
      status={readParam(params?.status)}
      mode={readParam(params?.mode)}
      reason={readParam(params?.reason)}
    />
  );
}
