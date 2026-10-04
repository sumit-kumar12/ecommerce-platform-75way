import styles from "./InputField.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function InputField({
  label,
  helpText,
  error,
  className = "",
  inputClassName = "",
  multiline = false,
  icon,
  id,
  ...props
}) {
  const Element = multiline ? "textarea" : "input";

  return (
    <label className={joinClasses(styles.field, className)} htmlFor={id}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={joinClasses(styles.control, error ? styles.controlError : "")}>
        {icon ? <span className={joinClasses("material-symbols-outlined", styles.icon)}>{icon}</span> : null}
        <Element
          className={joinClasses(styles.input, multiline ? styles.textarea : "", inputClassName)}
          id={id}
          {...props}
        />
      </span>
      {error ? <span className={styles.error}>{error}</span> : helpText ? <span className={styles.help}>{helpText}</span> : null}
    </label>
  );
}
