import { AccountSidebar } from "../../components/account/AccountSidebar";
import { StoreShell } from "../../components/layout/StoreShell";

export default function AccountLayout({ children }) {
  return (
    <StoreShell>
      <div className="bg-[#0f0e17] min-h-screen text-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-[280px] shrink-0">
              <AccountSidebar />
            </aside>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
