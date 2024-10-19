import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { MatchConfig } from "@/lib/types";
import { start } from "@/client";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";

export function Start() {
  const [_, navigate] = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [matchConfig, setMatchConfig] = useState<MatchConfig>({
    players: ["", ""],
    toss: 0,
    umpire: "",
    format: {
      nbSets: 5,
      pointsPerSet: 11,
      finish: "twoDifference",
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = await start(matchConfig);
    navigate(`/keep/${id}`);
  };

  const getFormatSummary = () => {
    const { nbSets, pointsPerSet, finish } = matchConfig.format;
    const sets = nbSets > 1 ? "sets" : "set";
    const finishTypeText = {
      twoDifference: "(diff 2)",
      oneDifference: "(diff 1)",
      time: "(timed)",
      noEnd: "(no end)",
    }[finish];
    return `Best of ${nbSets} ${sets} of ${pointsPerSet} points ${finishTypeText}`;
  };

  return (
    <section className="grow h-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="player1" className="text-green-600">
              Player 1 Name
            </Label>
            <Input
              id="player1"
              placeholder="Enter Player 1 name"
              required
              className="border-green-600 focus:ring-green-600"
              value={matchConfig.players[0]}
              onChange={(e) =>
                setMatchConfig({
                  ...matchConfig,
                  players: [e.target.value, matchConfig.players[1]],
                })
              }
            />
            <div className="flex gap-2 items-center">
              <Switch
                className="data-[state=checked]:bg-green-600"
                id="toss1"
                checked={matchConfig.toss === 0}
                onCheckedChange={() =>
                  setMatchConfig({ ...matchConfig, toss: 0 })
                }
              />
              <Label htmlFor="toss1" className="text-green-600">
                Has first serve
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="player2" className="text-blue-600">
              Player 2 Name
            </Label>
            <Input
              id="player2"
              placeholder="Enter Player 2 name"
              required
              className="border-blue-600 focus:ring-blue-600"
              value={matchConfig.players[1]}
              onChange={(e) =>
                setMatchConfig({
                  ...matchConfig,
                  players: [matchConfig.players[0], e.target.value],
                })
              }
            />
            <div className="flex gap-2 items-center">
              <Switch
                className="data-[state=checked]:bg-blue-600"
                id="toss2"
                checked={matchConfig.toss === 1}
                onCheckedChange={() =>
                  setMatchConfig({ ...matchConfig, toss: 1 })
                }
              />
              <Label htmlFor="toss2" className="text-blue-600">
                Has first serve
              </Label>
            </div>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Label htmlFor="umpire">Umpire Name</Label>
          <Input
            id="umpire"
            placeholder="Enter Umpire name"
            value={matchConfig.umpire}
            onChange={(e) =>
              setMatchConfig({ ...matchConfig, umpire: e.target.value })
            }
          />
        </div>

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="border rounded-md p-2 mt-4"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-2">
              <span>
                Match Format:{" "}
                {!isOpen && (
                  <span className="text-sm font-normal">
                    {getFormatSummary()}
                  </span>
                )}
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfSets">Number of Sets</Label>
                <Select
                  value={"" + matchConfig.format.nbSets}
                  onValueChange={(nbSets) =>
                    setMatchConfig({
                      ...matchConfig,
                      format: {
                        ...matchConfig.format,
                        nbSets: parseInt(nbSets) as 1 | 3 | 5,
                      },
                    })
                  }
                >
                  <SelectTrigger id="numberOfSets">
                    <SelectValue placeholder="Select number of sets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Best of 1</SelectItem>
                    <SelectItem value="3">Best of 3</SelectItem>
                    <SelectItem value="5">Best of 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointsPerSet">Points per Set</Label>
                <Input
                  id="pointsPerSet"
                  type="number"
                  min="1"
                  max="99"
                  value={matchConfig.format.pointsPerSet}
                  onChange={(e) =>
                    setMatchConfig({
                      ...matchConfig,
                      format: {
                        ...matchConfig.format,
                        pointsPerSet: parseInt(e.target.value),
                      },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="finishType">How to Finish the Set</Label>
              <Select
                value={matchConfig.format.finish}
                onValueChange={(value) =>
                  setMatchConfig({
                    ...matchConfig,
                    format: {
                      ...matchConfig.format,
                      finish: value as
                        | "twoDifference"
                        | "oneDifference"
                        | "time"
                        | "noEnd",
                    },
                  })
                }
              >
                <SelectTrigger id="finishType">
                  <SelectValue placeholder="Select how to finish the set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twoDifference">
                    2 points difference
                  </SelectItem>
                  <SelectItem value="oneDifference">
                    1 point difference
                  </SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="noEnd">No end</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          type="submit"
          className="w-full"
          disabled={
            matchConfig.players.some((p) => p.length === 0) ||
            matchConfig.players[0] === matchConfig.players[1]
          }
        >
          Start Match
        </Button>
      </form>
    </section>
  );
}
