import { Scoreboard } from "@/components/Scoreboard";
import { useMatch } from "@/hooks/useMatch";
import { useEffect } from "react";
import { useParams } from "wouter";

export function Follow() {
  const { matchId } = useParams();

  const { isPending, isError, error, config, score, setScore } = useMatch(
    matchId!,
  );

  useEffect(() => {
    const eventSource = new EventSource(
      import.meta.env.VITE_SERVER_URL + "/sse/" + matchId,
    );
    eventSource.onmessage = (event) => {
      const { score } = JSON.parse(event.data);
      setScore(score);
    };
    return () => eventSource.close();
  }, [matchId]);

  return (
    <>
      <h1>Follow {matchId}</h1>
      {isError ? (
        <p>{String(error)}</p>
      ) : isPending ? (
        <p>Loading...</p>
      ) : (
        <Scoreboard config={config} score={score!} />
      )}
    </>
  );
}
