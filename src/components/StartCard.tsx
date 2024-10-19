import { useState } from "react";
import { useLocation } from "wouter";
import { ChoiceCard } from "./ChoiceCard";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function FollowCard() {
  const [_, navigate] = useLocation();
  const [matchCode, setMatchCode] = useState("");
  return (
    <ChoiceCard>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-blue-600">
          Follow a Match
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-24 h-24 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <Input
          type="text"
          pattern="[A-Z]{6}"
          placeholder="Enter match code"
          value={matchCode}
          onChange={(e) => setMatchCode(e.target.value)}
          className="max-w-xs"
        />
        <Button
          className="w-full max-w-xs"
          disabled={matchCode.length !== 6}
          onClick={() => navigate(`/follow/${matchCode}`)}
        >
          Follow Match
        </Button>
      </CardContent>
    </ChoiceCard>
  );
}
