import { Card } from "@/components/ui/card";

export function ChoiceCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-72 sm:h-96 cursor-pointer hover:shadow-lg transition-shadow duration-300">
      {children}
    </Card>
  );
}
