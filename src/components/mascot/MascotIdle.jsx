import { motion } from "framer-motion";
import mascot from "../assets/mascot.png"; // your image

export default function MascotIdle() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-[180px] md:w-[220px]"
    >
      <img src={mascot} alt="Kickit mascot" />
    </motion.div>
  );
}