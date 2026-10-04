"use client";

import { useId, useState } from "react";
import styles from "./PasswordField.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function PasswordField({
  label,
  value,
  onChange,
  error,
  helpText,
  placeholder,
  autoComplete,
  icon = "lock",
  className = "",
  name,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const fallbackId = useId();
  const inputId = name ?? fallbackId;

  return (
    <label className={joinClasses(styles.field, className)} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={joinClasses(styles.control, error ? styles.controlError : "")}>
        <span className={joinClasses("material-symbols-outlined", styles.icon)}>{icon}</span>
        <input
          id={inputId}
          name={name}
          className={styles.input}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...props}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <span className="material-symbols-outlined">{visible ? "visibility_off" : "visibility"}</span>
        </button>
      </span>
      {error ? <span className={styles.error}>{error}</span> : helpText ? <span className={styles.help}>{helpText}</span> : null}
    </label>
  );
}
