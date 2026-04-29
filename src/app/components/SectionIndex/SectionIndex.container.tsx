"use client";

import { useState, useEffect } from "react";
import { SectionIndex } from "./SectionIndex";

const SECTIONS = [
  { id: "01-hero", label: "01 ─ hero" },
  { id: "02-activities", label: "02 ─ activities" },
  { id: "03-products", label: "03 ─ products" },
  { id: "04-career", label: "04 ─ career" },
  { id: "05-education", label: "05 ─ education" },
  { id: "06-skills", label: "06 ─ skills" },
];

export const SectionIndexContainer = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return <SectionIndex sections={SECTIONS} activeId={activeId} />;
};
