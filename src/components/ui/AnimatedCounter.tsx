"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * value;
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <motion.span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </motion.span>
  );
}
