interface CardProps {
  children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900 hover:border-blue-500 transition-all">
      {children}
    </div>
  );
}
5;
