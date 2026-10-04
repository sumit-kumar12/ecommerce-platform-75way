"use client";

import { useCallback } from "react";
import Link from "next/link";
import { StoreShell } from "../../components/layout/StoreShell";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ButtonPrimary } from "../../components/ui/ButtonPrimary";
import { ButtonSecondary } from "../../components/ui/ButtonSecondary";
import { InputField } from "../../components/ui/InputField";
import { useStoreCategories } from "../../lib/useStoreCategories";
import styles from "./page.module.css";

const PRINCIPLES = [
  {
    title: "Operational clarity",
    text: "Layouts stay structured, high-contrast, and easy to scan across storefront and admin surfaces so state changes remain obvious under pressure.",
  },
  {
    title: "Calm premium surfaces",
    text: "Glass panels, controlled gradients, and precise spacing create a premium feel without sacrificing readability or performance.",
  },
  {
    title: "Trust through evidence",
    text: "Component language avoids invented assurances. Status, alerts, and trust cues are grounded in real system behavior and verified backend controls.",
  },
  {
    title: "Scalable marketplace rhythm",
    text: "The design system is built for category growth, dense catalog browsing, and responsive admin workflows rather than one-off hero pages.",
  },
];

const COLOR_TOKENS = [
  { name: "Primary", variable: "--color-primary", hex: "#5048E5" },
  { name: "Primary Bright", variable: "--color-primary-bright", hex: "#2563EB" },
  { name: "Background Dark", variable: "--color-background-dark", hex: "#121121" },
  { name: "Background Light", variable: "--color-background-light", hex: "#F8F9FB" },
  { name: "Surface Panel", variable: "--kb-surface-panel", hex: "rgba(23, 32, 51, 0.88)" },
  { name: "Accent Neon", variable: "--color-accent-neon", hex: "#00F2FF" },
];

const TYPE_SCALE = [
  { label: "Hero / Display", token: "Space Grotesk 48-56px", preview: "Marketplace Confidence" },
  { label: "Section Heading", token: "Space Grotesk 28-32px", preview: "Category Architecture" },
  { label: "Body Copy", token: "Inter 16px", preview: "Readable, neutral text that supports long-form descriptions and operational detail." },
  { label: "Meta / Labels", token: "Inter 12-13px uppercase", preview: "Status · Filters · Category Chips" },
];

export default function BrandGuidelinesPage() {
  const { categories } = useStoreCategories();
  const scrollToSection = useCallback((id) => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  return (
    <StoreShell categories={categories}>
      <div className={styles.pageWrap}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Katabazaar design system</span>
            <h1>Brand guidelines and interface principles for the marketplace and admin stack.</h1>
            <p>
              This page documents the shared visual foundation already applied to the rebuilt storefront routes. It is
              the system reference for the current marketplace, admin, and category-management system.
            </p>
          </div>

          <GlassPanel className={styles.heroPanel} elevated>
            <span className={styles.panelEyebrow}>System baseline</span>
            <div className={styles.heroStats}>
              <button type="button" className={`${styles.heroStat} ${styles.heroStatButton}`.trim()} onClick={() => scrollToSection("type-scale")}>
                <span>Typography</span>
                <strong>Space Grotesk + Inter</strong>
              </button>
              <button type="button" className={`${styles.heroStat} ${styles.heroStatButton}`.trim()} onClick={() => scrollToSection("token-colors")}>
                <span>Spacing</span>
                <strong>8pt rhythm</strong>
              </button>
              <button type="button" className={`${styles.heroStat} ${styles.heroStatButton}`.trim()} onClick={() => scrollToSection("live-routes")}>
                <span>Surface rule</span>
                <strong>Glass + deep panel</strong>
              </button>
            </div>
          </GlassPanel>
        </section>

        <section className={styles.section}>
          <SectionHeader
            eyebrow="Foundations"
            title="Design principles"
            description="These principles govern both the public marketplace and the secure admin surfaces."
          />

          <div className={styles.principleGrid}>
            {PRINCIPLES.map((principle) => (
              <GlassPanel key={principle.title} className={styles.principleCard}>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </GlassPanel>
            ))}
          </div>
        </section>

        <section className={styles.section} id="token-colors">
          <SectionHeader
            eyebrow="Tokens"
            title="Color architecture"
            description="These values map directly to the shared store and admin token files."
          />

          <div className={styles.colorGrid}>
            {COLOR_TOKENS.map((token) => (
              <article key={token.variable} className={styles.colorCard}>
                <div
                  className={styles.colorSwatch}
                  style={{ background: token.hex.startsWith("rgba") ? "rgba(23, 32, 51, 0.88)" : token.hex }}
                ></div>
                <div className={styles.colorMeta}>
                  <strong>{token.name}</strong>
                  <span>{token.variable}</span>
                  <small>{token.hex}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="type-scale">
          <div className={styles.typeGrid}>
            <GlassPanel className={styles.typePanel} elevated>
              <SectionHeader
                eyebrow="Typography"
                title="Type scale"
                description="Display typography stays expressive while body copy remains neutral and readable."
              />

              <div className={styles.typeList}>
                {TYPE_SCALE.map((type) => (
                  <div key={type.label} className={styles.typeRow}>
                    <div>
                      <strong>{type.label}</strong>
                      <span>{type.token}</span>
                    </div>
                    <p>{type.preview}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className={styles.previewPanel}>
              <span className={styles.panelEyebrow}>Component preview</span>
              <div className={styles.previewBlock}>
                <ButtonPrimary type="button" icon="arrow_forward" className={styles.previewButton}>
                  Primary action
                </ButtonPrimary>
                <ButtonSecondary type="button" icon="verified" iconAfter={false} className={styles.previewButton}>
                  Secondary action
                </ButtonSecondary>
              </div>

              <div className={styles.previewField}>
                <InputField
                  id="design-system-email"
                  label="Input field"
                  defaultValue="ops@katabazaar.local"
                  readOnly
                  helpText="Rounded form controls with deep-surface backgrounds and visible focus states."
                />
              </div>

              <div className={styles.previewCard}>
                <span className={styles.previewTag}>Glass panel</span>
                <h3>Secure catalog module</h3>
                <p>
                  Reusable surfaces rely on low-noise gradients, soft borders, and strong content hierarchy instead of
                  heavy shadow stacks.
                </p>
              </div>
            </GlassPanel>
          </div>
        </section>

        <section className={styles.section} id="live-routes">
          <GlassPanel className={styles.linksPanel} elevated>
            <SectionHeader
              eyebrow="Apply the system"
              title="Current live routes already using the shared token layer"
              description="These routes are the reference implementation for the current marketplace, admin, and category-management system."
            />

            <div className={styles.linkGrid}>
              <Link href="/" className={styles.routeLink}>
                <span className="material-symbols-outlined">home</span>
                <div>
                  <strong>Home</strong>
                  <span>Marketplace landing page</span>
                </div>
              </Link>
              <Link href="/products" className={styles.routeLink}>
                <span className="material-symbols-outlined">storefront</span>
                <div>
                  <strong>Catalog</strong>
                  <span>Search, filters, and product discovery</span>
                </div>
              </Link>
              <Link href="/products" className={styles.routeLink}>
                <span className="material-symbols-outlined">inventory_2</span>
                <div>
                  <strong>Product detail</strong>
                  <span>Use the live catalog to open any current product.</span>
                </div>
              </Link>
              <Link href="/trust" className={styles.routeLink}>
                <span className="material-symbols-outlined">verified_user</span>
                <div>
                  <strong>Trust Center</strong>
                  <span>Runtime control overview</span>
                </div>
              </Link>
            </div>
          </GlassPanel>
        </section>
      </div>
    </StoreShell>
  );
}
