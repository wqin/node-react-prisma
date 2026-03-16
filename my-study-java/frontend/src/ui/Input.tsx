import React from "react";
import styles from "./Input.module.css";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...rest }, ref) => {
    const cls = [styles.input, className].filter(Boolean).join(" ");
    return <input ref={ref} className={cls} {...rest} />;
  },
);

Input.displayName = "Input";

export default Input;
