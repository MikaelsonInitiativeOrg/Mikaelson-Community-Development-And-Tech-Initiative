import type { ReactNode } from "react";
import styles from "./legal.module.css";

/** A highlighted note inside a section (the originals' coloured boxes). */
export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.note}>
      <p>{label}</p>
      <p>{children}</p>
    </div>
  );
}

/** An email address as a mailto link. */
export function Email({ address }: { address: string }) {
  return <a href={`mailto:${address}`}>{address}</a>;
}
