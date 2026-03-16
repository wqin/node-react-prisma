import React from "react";
import styles from "./Select.module.css";

type Option = { value: string; label: string };

export default function Select({
  value,
  onChange,
  options = [],
  className = "",
}: {
  value?: string;
  onChange?: (v: string) => void;
  options?: Option[];
  className?: string;
}) {
  return (
    <select
      className={[styles.select, className].filter(Boolean).join(" ")}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
