import styles from "./ButtonPrimary.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function ButtonPrimary({ children, className = "", icon, iconAfter = true, ...props }) {
  return (
    <button className={joinClasses(styles.button, className)} {...props}>
      {!iconAfter && icon ? <span className="material-symbols-outlined">{icon}</span> : null}
      <span>{children}</span>
      {iconAfter && icon ? <span className="material-symbols-outlined">{icon}</span> : null}
    </button>
  );
}
