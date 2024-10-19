import { useState } from "react";
import { motion } from "framer-motion";
import { StartCard } from "@/components/FollowCard";
import { FollowCard } from "@/components/StartCard";

const CARDS = ["start", "follow"] as const;
type CardType = (typeof CARDS)[number];

export function Home() {
  const [hoveredCard, setHoveredCard] = useState(false);

  const cardVariants = {
    default: (cardType: CardType) => ({
      rotate: cardType === "start" ? -5 : 5,
      x: cardType === "start" ? 30 : -30,
      zIndex: 1,
    }),
    hover: (cardType: CardType) => ({
      rotate: 0,
      x: cardType === "start" ? -10 : 10,
      zIndex: 2,
    }),
  };

  return (
    <section className="grow h-full flex flex-col justify-center items-center">
      <h1 className="text-center text-4xl font-bold text-green-800 mb-8">
        Welcome to STREash
      </h1>
      <p className="text-center text-xl text-green-700 mb-12">
        STREAM Squash scores in real-time!
      </p>

      <div className="hidden sm:flex justify-center items-center">
        <motion.div
          className="flex space-x-4"
          initial="default"
          animate={hoveredCard ? "hover" : "default"}
          onHoverStart={() => setHoveredCard(true)}
          onHoverEnd={() => setHoveredCard(false)}
        >
          {CARDS.map((cardType) => (
            <motion.div
              key={cardType}
              custom={cardType}
              variants={cardVariants}
            >
              {cardType === "start" ? <StartCard /> : <FollowCard />}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex sm:hidden justify-center items-center flex-col gap-4">
        <StartCard />
        <FollowCard />
      </div>
    </section>
  );
}
