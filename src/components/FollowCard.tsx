import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ChoiceCard } from "./ChoiceCard";

export function StartCard() {
  return (
    <Link href="/start">
      <ChoiceCard>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-600">
            Start a New Match
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-24 h-24 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </CardContent>
      </ChoiceCard>
    </Link>
  );
}
