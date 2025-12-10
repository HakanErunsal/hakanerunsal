import { badgeVariants } from "./ui/badge";

interface TagProps {
  tag: string;
  current?: boolean;
  count?: number;
}
export function Tag({ tag, current, count }: TagProps) {
  return (
    <span
      className={badgeVariants({
        variant: current ? "default" : "secondary",
        className: "no-underline rounded-md cursor-default",
      })}
    >
      {tag} {count ? `(${count})` : null}
    </span>
  );
}