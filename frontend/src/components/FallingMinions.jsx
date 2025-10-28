import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const minionImgs = [
  "https://pngimg.com/d/minions_PNG67.png",
  "https://www.pngplay.com/wp-content/uploads/2/Bob-Minion-Transparent-Free-PNG.png",
  "https://www.clipartmax.com/png/middle/231-2315555_minion-clipart-transparent-background-minions-png.png",
  "https://tse1.mm.bing.net/th/id/OIP.E9OTLSeD9TBvDS352lWi_AHaFB?pid=Api&P=0&h=180",
];

const FallingMinions = ({ count = 25 }) => {
  const [minions, setMinions] = useState([]);

  useEffect(() => {
    // generate random minion positions
    const newMinions = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // random horizontal %
      delay: Math.random() * 0.5,
      size: 60 + Math.random() * 80, // random size
      img: minionImgs[Math.floor(Math.random() * minionImgs.length)],
    }));
    setMinions(newMinions);
  }, [count]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {minions.map((m) => (
        <motion.img
          key={m.id}
          src={m.img}
          alt="falling minion"
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: "110vh", opacity: 1, rotate: 360 }}
          transition={{
            duration: 2 + Math.random() * 1,
            delay: m.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            left: `${m.left}%`,
            width: `${m.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default FallingMinions;
