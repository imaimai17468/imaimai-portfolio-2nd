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
            roles={["フロントエンドエンジニア", "リクルーター", "技育プロジェクト担当"]}
            projects={[
              "大型漫画掲載サイトのリニューアル",
              "HR系サービスのホームページのリニューアル",
              "求人掲載サービスの管理画面の新規機能開発",
              "飛行機の国際線予約サービスの新規開発",
            ]}
            sponsorships={["技育CAMPハッカソン", "技育CAMPキャラバン", "技育展"]}
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

type CareerSectionProps = {
  period: string;
  company: string;
  note?: string;
  roles: string[];
  projects: string[];
  sponsorships?: string[];
  speaking?: string[];
};

const CareerSection: React.FC<CareerSectionProps> = ({
  period,
  company,
  note,
  roles,
  projects,
  sponsorships,
  speaking,
}) => {
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
        {/* 役職 */}
        <SubSection title="Roles">
          <ul className="space-y-1">
            {roles.map((role) => (
              <li key={role} className="text-sm text-zinc-400">
                {role}
              </li>
            ))}
          </ul>
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

        {/* イベントスポンサー */}
        {sponsorships && sponsorships.length > 0 && (
          <SubSection title="Event Sponsor">
            <ul className="space-y-1">
              {sponsorships.map((event) => (
                <li key={event} className="text-sm text-zinc-400">
                  {event}
                </li>
              ))}
            </ul>
          </SubSection>
        )}

        {/* 登壇 */}
        {speaking && speaking.length > 0 && (
          <SubSection title="Speaker">
            <ul className="space-y-1">
              {speaking.map((event) => (
                <li key={event} className="text-sm text-zinc-400">
                  {event}
                </li>
              ))}
            </ul>
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

        {/* 実績 */}
        {achievements && achievements.length > 0 && (
          <SubSection title="Results">
            <ul className="space-y-1">
              {achievements.map((achievement) => (
                <li key={achievement} className="text-sm text-zinc-400">
                  {achievement}
                </li>
              ))}
            </ul>
          </SubSection>
        )}

        {/* 業務委託 */}
        {freelance && freelance.length > 0 && (
          <SubSection title="Freelance">
            <div className="space-y-3">
              {freelance.map((item) => (
                <div key={item.client}>
                  <p className="text-sm text-zinc-500 mb-1">{item.client}</p>
                  <ul className="space-y-1 ml-3">
                    {item.projects.map((project) => (
                      <li key={project} className="text-sm text-zinc-400">
                        {project}
                      </li>
                    ))}
                  </ul>
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
