"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { StoreShell } from "../../../components/layout/StoreShell";
import { useStoreCategories } from "../../../lib/useStoreCategories";

export default function OldOrderRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const { categories } = useStoreCategories();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/account/orders/${params.id}`);
    }
  }, [params, router]);

  return (
    <StoreShell categories={categories}>
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Redirecting to your order...
      </div>
    </StoreShell>
  );
}
