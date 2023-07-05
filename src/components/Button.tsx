import clsx from "clsx";
import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fill" | "outline";
  color?: "primary" | "secondary";
  text?: string;
  className?: string;
}
export const Button = (props: ButtonProps) => {
  const variant = props.variant || "fill";
  const color = props.color || "primary";
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
      {props.text}
    </button>
  );
};
