"use client";

import { motion } from "motion/react";
import { ScanFace, Sparkles } from "lucide-react";

const faces = [
  { x: "13%", y: "18%", size: 86, delay: 0.2 },
  { x: "59%", y: "12%", size: 72, delay: 0.45 },
  { x: "38%", y: "57%", size: 92, delay: 0.7 },
];

export function FaceCanvas() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, rotate: 1.5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative min-h-[24rem] overflow-hidden rounded-3xl bg-[#07141d] shadow-[0_28px_80px_-36px_rgba(0,64,99,.8)] sm:min-h-[31rem]"
      aria-label="Animated multi-face detection preview"
    >
      <div className="mesh-grid absolute inset-0 opacity-70" />
      <div className="absolute -right-14 -top-16 size-64 rounded-full bg-[#30afff]/20 blur-3xl" />
      <div className="absolute -bottom-10 left-2 size-72 rounded-full bg-[#006875]/70 blur-3xl" />

      {faces.map((face, index) => (
        <motion.div
          key={`${face.x}-${face.y}`}
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: face.delay, type: "spring", stiffness: 180, damping: 18 }}
          className="absolute rounded-3xl border border-[#92eeff]/70 bg-[#92eeff]/8"
          style={{ left: face.x, top: face.y, width: face.size, height: face.size * 1.18 }}
        >
          <span className="absolute -left-px -top-px size-3 border-l-2 border-t-2 border-[#92eeff]" />
          <span className="absolute -right-px -top-px size-3 border-r-2 border-t-2 border-[#92eeff]" />
          <span className="absolute -bottom-px -left-px size-3 border-b-2 border-l-2 border-[#92eeff]" />
          <span className="absolute -bottom-px -right-px size-3 border-b-2 border-r-2 border-[#92eeff]" />
          <div className="absolute inset-2 rounded-2xl bg-gradient-to-b from-[#92eeff]/20 to-[#006875]/30" />
          <span className="absolute -bottom-6 left-0 text-[9px] font-bold tracking-wider text-[#92eeff]">
            FACE_0{index + 1}
          </span>
        </motion.div>
      ))}

      <motion.div
        animate={{ y: [50, 375, 50] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#92eeff] to-transparent shadow-[0_0_18px_2px_rgba(146,238,255,.65)]"
      />

      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-4 text-white backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#30afff] text-[#07141d]">
            <ScanFace className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold">3 faces indexed</p>
            <p className="text-[10px] text-white/50">512 dimensions · cosine ready</p>
          </div>
        </div>
        <Sparkles className="size-5 text-[#92eeff]" />
      </div>
    </motion.div>
  );
}
