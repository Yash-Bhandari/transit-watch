import clsx from "clsx";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  text?: string;
  className?: string;
}
export const Button = (props: ButtonProps) => {
  const variant = props.variant || "primary";
  return (
    <button
      {...props}
      className={clsx(
        "py-2 px-4 rounded font-semibold m-2 disabled:bg-gray-500",
        variant === "primary" &&
          "bg-blue-500 hover:bg-blue-500 text-white ",

        variant === "secondary" && // outline button
          "bg-transparent hover:bg-blue-500 text-blue-500 border border-blue-500 hover:border-transparent hover:text-white",
        props.className
      )}
    >
      {props.text}
    </button>
  );
};
