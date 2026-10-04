"use client";
import { useState } from "react";
import { StoreHeader } from "./StoreHeader";
import { StoreFooter } from "./StoreFooter";
import { MobileNavbar } from "./MobileNavbar";
import { QuickNavBar } from "./QuickNavBar";
import { SearchDrawer } from "../mobile/SearchDrawer";
import styles from "./StoreShell.module.css";

export function StoreShell({ categories = [], headerOptions, footerOptions, children }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <div className={styles.grid}></div>
      <div className={styles.orbLeft}></div>
      <div className={styles.orbRight}></div>
      <StoreHeader categories={categories} options={headerOptions} />
      <QuickNavBar categories={categories} />
      <main className={styles.main}>{children}</main>
      <StoreFooter categories={categories} options={footerOptions} />
      <MobileNavbar onSearchOpen={() => setMobileSearchOpen(true)} />
      <SearchDrawer open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
    </div>
  );
}
