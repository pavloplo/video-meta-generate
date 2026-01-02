import { cn } from "@/lib/utils";

export interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "small";
  className?: string;
  children?: React.ReactNode;
}

const typographyVariants = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  small: "text-sm font-medium leading-none",
};

export const Typography = ({
  variant = "p",
  className,
  children,
  ...props
}: TypographyProps) => {
  const baseProps = {
    className: cn(typographyVariants[variant], className),
    ...props
  };

  switch (variant) {
    case "h1":
      return <h1 {...baseProps}>{children}</h1>;
    case "h2":
      return <h2 {...baseProps}>{children}</h2>;
    case "h3":
      return <h3 {...baseProps}>{children}</h3>;
    case "h4":
      return <h4 {...baseProps}>{children}</h4>;
    case "blockquote":
      return <blockquote {...baseProps}>{children}</blockquote>;
    case "small":
      return <small {...baseProps}>{children}</small>;
    default:
      return <p {...baseProps}>{children}</p>;
  }
};
