import { getConfigAndScore } from "@/client";
import type { MatchConfig, Score } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useMatch(id: string) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["match", id],
    queryFn: async () => getConfigAndScore(id),
  });

  const [score, setScore] = useState<Score>();
  useEffect(() => {
    if (!isError && !isPending) {
      setScore(data.score);
    }
  }, [data, isError, isPending]);

  return {
    isPending: isPending || score === undefined,
    isError,
    error,
    config: data?.config as MatchConfig,
    score,
    setScore,
  };
}
