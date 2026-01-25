"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import avatarImage from "../top/hero-section/avatar.jpeg";

/**
 * About Page - シンプルな自己紹介
 *
 * design-guidelines:
 * - Typography: 読みやすいテキスト階層
 * - Spatial Composition: 十分な余白、中央寄せ
 * - 装飾を削ぎ落としてコンテンツに集中
 *
 * UX原則:
 * - Recognition over recall: 必要な情報だけを明確に表示
 * - Progressive disclosure: スクロールで詳細が現れる
 */
export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-24">
        {/* プロフィールヘッダー */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-6 mb-8">
            <Image
              src={avatarImage}
              alt="imaimai17468のプロフィール画像"
              width={80}
              height={80}
              className="rounded-full border border-zinc-800"
              priority
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">imaimai17468</h1>
              <p className="text-zinc-500">Front-end Developer</p>
            </div>
          </div>
        </motion.section>

        {/* 自己紹介 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-4">ABOUT</h2>
          <p className="text-zinc-300 leading-relaxed">
            2001年生まれ。木更津高専、長岡技術科学大学を経て、2024年に新卒でゆめみに入社。
            フロントエンドエンジニアとして、Webアプリケーションの開発に従事していました。
          </p>
        </motion.section>

        {/* 職歴 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">CAREER</h2>
          <div className="space-y-6">
            <CareerItem
              period="2024.04 - 2024.12"
              title="株式会社ゆめみ"
              description="フロントエンドエンジニア / リクルーター / 技育プロジェクト担当"
              note="会社消滅"
            />
          </div>
        </motion.section>

        {/* 学歴 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">EDUCATION</h2>
          <div className="space-y-6">
            <EducationItem
              period="2022 - 2024"
              title="長岡技術科学大学"
              department="電気電子情報工学課程"
              research="睡眠時脳波の構造解析"
            />
            <EducationItem
              period="2017 - 2022"
              title="木更津工業高等専門学校"
              department="電子制御工学科"
              research="光学式心拍センサの精度評価"
            />
          </div>
        </motion.section>

        {/* スキル・興味 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">SKILLS & INTERESTS</h2>
          <div className="flex flex-wrap gap-2">
            {["フロントエンド開発", "UI/UX デザイン", "React/Next.js", "TypeScript"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm text-zinc-400 border border-zinc-800 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* リンク */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">LINKS</h2>
          <div className="space-y-3">
            <LinkItem href="https://github.com/imaimai17468" label="GitHub" />
            <LinkItem href="https://x.com/imaimai17468" label="X (Twitter)" />
            <LinkItem href="https://zenn.dev/imaimai17468" label="Zenn" />
            <LinkItem href="https://note.com/imaimai17468" label="note" />
            <LinkItem href="https://speakerdeck.com/imaimai17468" label="Speaker Deck" />
          </div>
        </motion.section>
      </main>
    </div>
  );
};

type CareerItemProps = {
  period: string;
  title: string;
  description: string;
  note?: string;
};

const CareerItem: React.FC<CareerItemProps> = ({ period, title, description, note }) => {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4">
      <span className="text-sm text-zinc-600 font-mono">{period}</span>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-200 font-medium">{title}</h3>
          {note && <span className="text-xs text-zinc-600">({note})</span>}
        </div>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

type EducationItemProps = {
  period: string;
  title: string;
  department: string;
  research: string;
};

const EducationItem: React.FC<EducationItemProps> = ({ period, title, department, research }) => {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4">
      <span className="text-sm text-zinc-600 font-mono">{period}</span>
      <div>
        <h3 className="text-zinc-200 font-medium">{title}</h3>
        <p className="text-sm text-zinc-500 mt-1">{department}</p>
        <p className="text-sm text-zinc-600 mt-1">研究: {research}</p>
      </div>
    </div>
  );
};

type LinkItemProps = {
  href: string;
  label: string;
};

const LinkItem: React.FC<LinkItemProps> = ({ href, label }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-zinc-400 hover:text-zinc-200 transition-colors"
    >
      {label}
      <span className="text-zinc-600 ml-2">→</span>
    </Link>
  );
};
