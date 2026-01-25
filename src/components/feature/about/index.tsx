"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import avatarImage from "../top/hero-section/avatar.jpeg";

/**
 * About Page - 詳細な経歴情報を含む自己紹介
 *
 * design-guidelines:
 * - Typography: 読みやすいテキスト階層（見出し → サブセクション → 詳細）
 * - Spatial Composition: 十分な余白、グルーピングによる視覚的整理
 * - Progressive disclosure: セクション内でサブセクションに分割
 *
 * UX原則:
 * - Recognition over recall: 情報をカテゴリ別に整理
 * - Gestalt grouping: 関連情報を近接配置
 * - Cognitive load: 情報を小さなチャンクに分割
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

        {/* 職歴 - ゆめみ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">CAREER</h2>

          <CareerSection
            period="2024.04 - 2024.12"
            company="株式会社ゆめみ"
            note="会社消滅"
            roles={["フロントエンドエンジニア", "リクルーター", "技育Project担当"]}
            projects={[
              "大型漫画掲載サイトのリニューアル",
              "HR系サービスのホームページのリニューアル",
              "求人掲載サービスの管理画面の新規機能開発",
              "飛行機の国際線予約サービスの新規開発",
            ]}
            speaking={["フロントエンドカンファレンス北海道 2024", "TSKaigi 2025", "他多数"]}
          />
        </motion.section>

        {/* 学歴 - 長岡技術科学大学 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">EDUCATION</h2>

          <EducationSection
            period="2022 - 2024"
            school="長岡技術科学大学"
            department="電気電子情報工学課程"
            research="睡眠時脳波の構造解析"
            club="学園祭実行委員会 情報局 (NUTMEG)"
            projects={[
              "学園祭で使われる資金の管理アプリ",
              "サークルメンバーの育成管理アプリ",
              "駐車場空き情報のリアルタイム監視アプリ",
            ]}
            achievements={["第一回技育博にNUTMEGの代表として参加", "技育展 2023 企業賞"]}
            freelance={[
              {
                client: "スタートアップA社",
                projects: ["修理の受注/発注ができるLINEアプリの開発"],
              },
              {
                client: "スタートアップB社",
                projects: [
                  "建築関係のマッチングプラットフォームの開発",
                  "学会の抄録冊子の自動作成サービス",
                  "履歴書の自動PDF化・管理サービス",
                ],
              },
            ]}
          />

          <div className="mt-8" />

          <EducationSection
            period="2017 - 2022"
            school="木更津工業高等専門学校"
            department="電子制御工学科"
            research="光学式心拍センサの精度評価"
            club="プログラミング研究同好会"
            projects={["文化祭での自作ゲーム展示", "研究室の鍵のカードキーシステム化", "学校の単位数計算サイト"]}
            achievements={["Paiza S", "AtCoder 緑"]}
            freelance={[
              {
                client: "paiza Inc.",
                projects: ["競技プログラミング問題集の作問"],
              },
            ]}
          />
        </motion.section>

        {/* スキル・リンク */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-zinc-800 pt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* スキル */}
            <div>
              <h2 className="text-sm text-zinc-500 tracking-wider mb-4">SKILLS & INTERESTS</h2>
              <div className="flex flex-wrap gap-2">
                {["フロントエンド開発", "UI/UX デザイン", "React/Next.js", "TypeScript"].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm text-zinc-400 border border-zinc-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* リンク */}
            <div>
              <h2 className="text-sm text-zinc-500 tracking-wider mb-4">LINKS</h2>
              <div className="space-y-2">
                <LinkItem href="https://github.com/imaimai17468" label="GitHub" />
                <LinkItem href="https://x.com/imaimai17468" label="X (Twitter)" />
                <LinkItem href="https://zenn.dev/imaimai17468" label="Zenn" />
                <LinkItem href="https://note.com/imaimai17468" label="note" />
                <LinkItem href="https://speakerdeck.com/imaimai17468" label="Speaker Deck" />
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

type CareerSectionProps = {
  period: string;
  company: string;
  note?: string;
  roles: string[];
  projects: string[];
  speaking?: string[];
};

const CareerSection: React.FC<CareerSectionProps> = ({ period, company, note, roles, projects, speaking }) => {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <span className="text-sm text-zinc-600 font-mono">{period}</span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-zinc-200 font-medium">{company}</h3>
            {note && <span className="text-xs text-zinc-600">({note})</span>}
          </div>
        </div>
      </div>

      {/* サブセクション */}
      <div className="ml-[136px] space-y-5">
        {/* 役職 - タグ形式 */}
        <SubSection title="Roles">
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span key={role} className="px-2 py-1 text-xs text-zinc-400 border border-zinc-800 rounded">
                {role}
              </span>
            ))}
          </div>
        </SubSection>

        {/* プロジェクト */}
        <SubSection title="Projects">
          <ul className="space-y-1">
            {projects.map((project) => (
              <li key={project} className="text-sm text-zinc-400">
                {project}
              </li>
            ))}
          </ul>
        </SubSection>

        {/* 登壇 - インライン形式 */}
        {speaking && speaking.length > 0 && (
          <SubSection title="Speaker">
            <p className="text-sm text-zinc-400">{speaking.join("、")}</p>
          </SubSection>
        )}
      </div>
    </div>
  );
};

type FreelanceItem = {
  client: string;
  projects: string[];
};

type EducationSectionProps = {
  period: string;
  school: string;
  department: string;
  research: string;
  club?: string;
  projects?: string[];
  achievements?: string[];
  freelance?: FreelanceItem[];
};

const EducationSection: React.FC<EducationSectionProps> = ({
  period,
  school,
  department,
  research,
  club,
  projects,
  achievements,
  freelance,
}) => {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <span className="text-sm text-zinc-600 font-mono">{period}</span>
        <div>
          <h3 className="text-zinc-200 font-medium">{school}</h3>
          <p className="text-sm text-zinc-500 mt-1">{department}</p>
          <p className="text-sm text-zinc-600 mt-1">研究: {research}</p>
          {club && <p className="text-sm text-zinc-600 mt-1">{club}</p>}
        </div>
      </div>

      {/* サブセクション */}
      <div className="ml-[136px] space-y-5">
        {/* プロジェクト */}
        {projects && projects.length > 0 && (
          <SubSection title="Projects">
            <ul className="space-y-1">
              {projects.map((project) => (
                <li key={project} className="text-sm text-zinc-400">
                  {project}
                </li>
              ))}
            </ul>
          </SubSection>
        )}

        {/* 実績 - タグ形式 */}
        {achievements && achievements.length > 0 && (
          <SubSection title="Results">
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <span key={achievement} className="px-2 py-1 text-xs text-zinc-400 border border-zinc-800 rounded">
                  {achievement}
                </span>
              ))}
            </div>
          </SubSection>
        )}

        {/* 業務委託 */}
        {freelance && freelance.length > 0 && (
          <SubSection title="Freelance">
            <div className="space-y-2">
              {freelance.map((item) => (
                <div key={item.client} className="text-sm">
                  <span className="text-zinc-500">{item.client}</span>
                  <span className="text-zinc-600 mx-2">·</span>
                  <span className="text-zinc-400">{item.projects.join("、")}</span>
                </div>
              ))}
            </div>
          </SubSection>
        )}
      </div>
    </div>
  );
};

type SubSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h4 className="text-xs text-zinc-600 tracking-wider mb-2">{title}</h4>
      {children}
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
