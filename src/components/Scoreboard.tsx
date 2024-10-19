import { isMatchWon } from "@/lib/score";
import { MatchConfig, Score } from "@/lib/types";

export function Scoreboard({
  config,
  score,
  changeServerSide,
  pointWon,
}: {
  config: MatchConfig;
  score: Score;
  changeServerSide?: () => void;
  pointWon?: (player: string) => void;
}) {
  const [player1, player2] = config.players;
  const currentSet = score.sets[score.sets.length - 1];
  const currentPoint = currentSet.points[currentSet.points.length - 1];

  const { won: isOver, wonBy: winner } = isMatchWon(config, score);

  const finishedSets = isOver ? score.sets : score.sets.slice(0, -1);
  return (
    <table className="table-auto text-white font-semibold text-2xl">
      <tbody>
        {[player1, player2].map((player, playerIdx) => (
          <tr
            key={player}
            className={`${playerIdx === 0 ? "border-b border-b-sky-900/30" : ""}`}
          >
            <td
              className={`italic font-normal bg-sky-800 w-7 text-center ${!isOver && changeServerSide ? "cursor-pointer" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                !isOver && changeServerSide?.();
              }}
            >
              {isOver
                ? winner === playerIdx
                  ? "W"
                  : ""
                : currentPoint.server === playerIdx
                  ? currentPoint.serveSide
                  : ""}
            </td>
            <td
              className={`px-2 font-semibold uppercase bg-sky-800 ${!isOver && pointWon ? "cursor-pointer" : ""} ${isOver && winner !== playerIdx ? "text-sky-300" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                !isOver && pointWon?.(player);
              }}
            >
              {player}
            </td>
            {finishedSets.map((set, setIdx) => (
              <td
                key={setIdx}
                className={`min-w-7 text-center bg-sky-800 ${
                  set.winner === playerIdx ? "text-white" : "text-sky-300"
                }`}
              >
                {set.points[set.points.length - 1].score[playerIdx]}
              </td>
            ))}
            {!isOver && (
              <td className="min-w-7 text-center bg-sky-300 text-sky-900">
                {currentPoint.score[playerIdx]}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
