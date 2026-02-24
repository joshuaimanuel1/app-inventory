interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`p-6 rounded-xl border border-gray-800 bg-gray-900 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300 ${className || ""}`}
    >
      {children}
    </div>
  );
}
