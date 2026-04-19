'use client'
import { motion, useScroll, useTransform } from "framer-motion";

export default function KineticText() { // RENAME THIS
  const { scrollYProgress } = useScroll();
  const xShift = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <div className="overflow-hidden whitespace-nowrap flex py-4 select-none border-y border-black/5 bg-white">
      <motion.div 
        style={{ x: xShift }}
        className="flex whitespace-nowrap gap-16 font-black uppercase will-change-transform animate-marquee-ultra-slow"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="flex items-center gap-16">
            <span className="serif italic text-[10vw] md:text-[5vw] text-black tracking-tighter">
              COMING SOON
            </span>
            <div className="w-4 h-4 bg-green-700 rotate-45" />
            <span className="font-outline-green text-[10vw] md:text-[5vw] tracking-tighter">
              ON WEBSITE
            </span>
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </span>
        ))}
      </motion.div>

      <style jsx global>{`
        .font-outline-green {
          -webkit-text-stroke: 1px #15803d;
          color: transparent;
        }
        .animate-marquee-ultra-slow {
          animation: marquee-single 80s linear infinite;
        }
        @keyframes marquee-single {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}