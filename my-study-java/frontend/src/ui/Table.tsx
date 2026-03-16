import React from "react";
import cardStyles from "./Card.module.css";
import styles from "./Table.module.css";

export default function Table<T>({
  columns,
  data,
}: {
  columns: { key: string; title: string }[];
  data: T[];
}) {
  return (
    <div className={cardStyles.card}>
      <table
        style={{ width: "100%", borderCollapse: "collapse" }}
        className={styles.tableWrap}
      >
        <thead className={styles.thead}>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={styles.cell}
                style={{ color: "var(--muted)" }}
              >
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx) => (
            <tr key={idx} className={styles.row}>
              {columns.map((c) => (
                <td key={c.key} className={styles.cell}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
