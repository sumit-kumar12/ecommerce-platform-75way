import { redirect } from "next/navigation";

export default function SecurityAdminRoot() {
  redirect("/security-admin/audit-logs");
}
