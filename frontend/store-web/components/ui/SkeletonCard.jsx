import styles from "./SkeletonCard.module.css";

export function SkeletonCard({ className = "" }) {
  return <div className={`${styles.card} ${className}`.trim()} aria-hidden="true"></div>;
}
