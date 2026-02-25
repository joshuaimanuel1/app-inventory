import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        `
        rounded-xl border
        border-border
        bg-card
        text-card-foreground

        shadow-sm
        transition-all duration-200

        hover:border-primary/40
        hover:shadow-md
        hover:-translate-y-px

        p-6
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}
