"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import avatarImage from "./avatar.jpeg";

/**
 * Hero Section - プロフィール
 *
 * design-guidelines:
 * - Typography: 大きなタイトルで視覚的なインパクト
 * - Spatial Composition: 中央配置、十分な余白
 * - Motion: 控えめなパララックス効果
 *
 * UX原則:
 * - Serial Position Effect: 最初のセクションとして強い印象を残す
 * - Curiosity Gap: 下スクロールを促すアニメーション
 */
export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div className="flex flex-col items-center text-center" style={{ y, opacity }}>
        {/* アバター */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <Image
            src={avatarImage}
            alt="imaimai17468のプロフィール画像"
            width={140}
            height={140}
            className="rounded-full border-2 border-zinc-800"
            priority
          />
        </motion.div>

        {/* 名前 */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-zinc-100 tracking-tight mb-4"
        >
          imaimai17468
        </motion.h1>

        {/* 肩書き */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-zinc-400 mb-6"
        >
          Front-end Developer
        </motion.p>

        {/* 説明 */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base text-zinc-500 max-w-md mb-8"
        >
          24卒 | フロントエンド | ゆめみ(消滅) → ???
        </motion.p>

        {/* ソーシャルリンク */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-4"
        >
          <SocialLink
            href="https://x.com/imaimai17468"
            label="X (Twitter)"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="X (Twitter) icon">
                <title>X (Twitter)</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
          />
          <SocialLink
            href="https://github.com/imaimai17468"
            label="GitHub"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="GitHub icon">
                <title>GitHub</title>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            }
          />
        </motion.div>
      </motion.div>

      {/* スクロール促進アニメーション */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-zinc-500"
        >
          <span className="text-xs tracking-wider">SCROLL</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};

type SocialLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, icon }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors duration-200"
      aria-label={label}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
};
