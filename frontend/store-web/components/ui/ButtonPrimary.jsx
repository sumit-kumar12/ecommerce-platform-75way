import styles from "./ButtonPrimary.module.css";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export function ButtonPrimary({ children, className = "", icon, iconAfter = true, href, ...props }) {
  const Element = href ? "a" : "button";
  const elementProps = href ? props : { type: "button", ...props };
  return (
    <Element href={href} className={joinClasses(styles.button, className)} {...elementProps}>
      {!iconAfter && icon ? <span className="material-symbols-outlined">{icon}</span> : null}
      <span>{children}</span>
      {iconAfter && icon ? <span className="material-symbols-outlined">{icon}</span> : null}
    </Element>
  );
}
