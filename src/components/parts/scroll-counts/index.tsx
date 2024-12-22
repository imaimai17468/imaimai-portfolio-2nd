"use client";

import { Mouse } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

export const ScrollCounts: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const totalDocScrollLength = docHeight - windowHeight;
    const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100);

    setScrollPercentage(scrollPosition);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="flex items-center gap-2 fixed top-4 right-4">
      <Mouse className="w-4 h-4 text-zinc-500 animate-bounce" />
      <p className="text-zinc-500">{scrollPercentage} / 100</p>
    </div>
  );
};
