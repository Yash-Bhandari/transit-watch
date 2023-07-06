import clsx from "clsx";
import React from "react";
import styles from "./Button.module.css";
import { Loading } from "./Loading";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fill" | "outline";
  color?: "primary" | "secondary";
  text?: string;
  className?: string;
  loading?: boolean;
}
export const Button = (props: ButtonProps) => {
  const variant = props.variant || "fill";
  const color = props.color || "primary";
  const loading = props.loading || false;
  return (
    <button
      {...props}
      className={clsx(
        styles.button,
        "py-2 px-4 rounded font-semibold m-2 disabled:bg-gray-500",
        variant === "fill" ? styles.fill : styles.outline,
        color === "primary" ? styles.primary : styles.secondary,
        props.className
      )}
    >
      {loading ? <Loading /> : props.text}
    </button>
  );
};
