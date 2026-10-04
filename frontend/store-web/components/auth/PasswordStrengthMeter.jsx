import { assessPasswordStrength } from "../../lib/auth";
import styles from "./PasswordStrengthMeter.module.css";

const toneClassMap = {
  idle: styles.idle,
  weak: styles.weak,
  fair: styles.fair,
  strong: styles.strong,
  excellent: styles.excellent,
};

export function PasswordStrengthMeter({ password }) {
  const result = assessPasswordStrength(password);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Password strength</span>
        <span className={`${styles.value} ${toneClassMap[result.tone]}`}>{result.label}</span>
      </div>

      <div className={styles.progressTrack}>
        <div className={`${styles.progressFill} ${toneClassMap[result.tone]}`}></div>
      </div>

      <ul className={styles.checks}>
        {result.checks.map((check) => (
          <li key={check.id} className={check.satisfied ? styles.checkOk : styles.checkPending}>
            <span className="material-symbols-outlined">{check.satisfied ? "check_circle" : "radio_button_unchecked"}</span>
            <span>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
