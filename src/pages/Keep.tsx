import { useParams } from "wouter";
import { changeServerSide, setPointWon } from "@/lib/score";
import { Button } from "@/components/ui/button";
import { Scoreboard } from "@/components/Scoreboard";
import { useMatch } from "@/hooks/useMatch";
import { updateScore } from "@/client";
import { Score } from "@/lib/types";
import { ExternalLink, Share } from "lucide-react";

export function Keep() {
  const { matchId } = useParams();

  const { isPending, isError, error, config, score, setScore } = useMatch(
    matchId!,
  );

  async function setAndUpdateScore(score: Score) {
    setScore(score);
    await updateScore(matchId!, score);
  }

  async function handlePointWon(player: string) {
    const newScore = setPointWon(config!, score!, player);
    await setAndUpdateScore(newScore);
  }

  async function handleServerSideChange() {
    const newScore = changeServerSide(score!);
    await setAndUpdateScore(newScore);
  }

  const ActionBar = () => (
    <div className="flex flex-row items-center gap-2">
      <Button
        className="flex items-center gap-2"
        variant="secondary"
        onClick={() =>
          navigator.share({
            url: window.location.href.replace(/keep/, "follow"),
          })
        }
      >
        <Share />
        Share live score URL
      </Button>
      <Button
        className="flex items-center gap-2"
        variant="secondary"
        onClick={() =>
          navigator.share({
            text: matchId!,
          })
        }
      >
        <Share />
        Share live score code
      </Button>
      <a href={`/follow/${matchId}`} target="_blank">
        <Button className="flex items-center gap-2">
          <ExternalLink />
          Open live score in another tab
        </Button>
      </a>
    </div>
  );

  return (
    <>
      {isError ? (
        <p>{String(error)}</p>
      ) : isPending ? (
        <p>Loading...</p>
      ) : (
        <>
          <ActionBar />
          <Scoreboard
            config={config}
            score={score!}
            changeServerSide={handleServerSideChange}
            pointWon={handlePointWon}
          />
        </>
      )}
    </>
  );
}
