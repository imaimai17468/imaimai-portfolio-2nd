"use client";

import { motion } from "framer-motion";

export const AboutSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-2xl w-full space-y-16"
      >
        <div>
          <h2 className="text-sm text-zinc-500 tracking-wider mb-4">ABOUT</h2>
          <div className="text-zinc-300 leading-relaxed space-y-4">
            <p>
              2001年生まれ。木更津高専、長岡技術科学大学を経て、2024年に新卒でゆめみに入社し、現在はアクセンチュアでプロダクトエンジニアとして活動しています。
            </p>
            <p>
              フロントエンド開発を中心に、大規模サイトの新規開発やリニューアルに携わる傍ら、リクルーターとして採用活動や技育プロジェクトへの企業としての参加にも取り組んでいます。
            </p>
            <p>
              技術カンファレンスでの登壇や、個人開発を通じて得た知見を積極的に発信し、エンジニアコミュニティへの貢献を大切にしています。
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">CAREER</h2>
          <div className="space-y-12">
            <CareerEntry
              period="2024.12 - "
              company="アクセンチュア株式会社"
              department="Song D&DP"
              jobTitle="Product Engineer"
              other={["技育プロジェクト", "Song LT会主催"]}
              projects={[
                "MultiAgentSaaS開発・提案",
                "社内フットサル大会アプリの開発",
                "バイクのマイページ系アプリの開発",
                "アパレル企業の社内イベント向けデジタル展示物の開発",
              ]}
              speaking={["技育祭"]}
            />
            <CareerEntry
              period="2024.04 - 2024.12"
              company="株式会社ゆめみ"
              note="会社消滅"
              jobTitle="Frontend Engineer"
              other={["リクルーター", "技育プロジェクト"]}
              projects={[
                "大型漫画掲載サイトのリニューアル",
                "HR系サービスのホームページのリニューアル",
                "求人掲載サービスの管理画面の新規機能開発",
                "飛行機の国際線予約サービスの新規開発",
              ]}
              speaking={["フロントエンドカンファレンス北海道 2024", "TSKaigi 2025"]}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm text-zinc-500 tracking-wider mb-6">EDUCATION</h2>
          <div className="space-y-8">
            <EducationEntry
              period="2022 - 2024"
              school="長岡技術科学大学"
              department="電気電子情報工学課程"
              research="睡眠時脳波の構造解析"
              club="学園祭実行委員会 情報局 (NUTMEG)"
              projects={[
                "学園祭で使われる資金管理アプリの開発",
                "サークルメンバーの育成管理アプリの開発",
                "駐車場空き情報のリアルタイム監視アプリの開発",
              ]}
              achievements={["技育展 2023 企業賞"]}
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
            <EducationEntry
              period="2017 - 2022"
              school="木更津工業高等専門学校"
              department="電子制御工学科"
              research="光学式心拍センサの精度評価"
              club="プログラミング研究同好会"
              projects={[
                "文化祭での自作ゲーム展示の開発",
                "研究室の鍵のカードキーシステムの開発",
                "学校の単位数計算サイトの開発",
              ]}
              achievements={["Paiza S", "AtCoder 緑"]}
              freelance={[{ client: "paiza Inc.", projects: ["競技プログラミング問題集の作問"] }]}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

type CareerEntryProps = {
  period: string;
  company: string;
  department?: string;
  note?: string;
  jobTitle: string;
  other?: string[];
  projects: string[];
  speaking?: string[];
};

const CareerEntry: React.FC<CareerEntryProps> = ({
  period,
  company,
  department,
  note,
  jobTitle,
  other,
  projects,
  speaking,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm text-zinc-600 font-mono">{period}</span>
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <h3 className="text-zinc-200 font-medium">{company}</h3>
            {note && <span className="text-xs text-zinc-600">({note})</span>}
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {department ? `${department} · ${jobTitle}` : jobTitle}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <DetailBlock title="Projects">
          <ul className="space-y-1">
            {projects.map((project) => (
              <li key={project} className="text-sm text-zinc-400">
                {project}
              </li>
            ))}
          </ul>
        </DetailBlock>
        {other && other.length > 0 && (
          <DetailBlock title="Other">
            <ul className="space-y-1">
              {other.map((item) => (
                <li key={item} className="text-sm text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </DetailBlock>
        )}
        {speaking && speaking.length > 0 && (
          <DetailBlock title="Speaker">
            <ul className="space-y-1">
              {speaking.map((item) => (
                <li key={item} className="text-sm text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </DetailBlock>
        )}
      </div>
    </div>
  );
};

type FreelanceItem = {
  client: string;
  projects: string[];
};

type EducationEntryProps = {
  period: string;
  school: string;
  department: string;
  research: string;
  club?: string;
  projects?: string[];
  achievements?: string[];
  freelance?: FreelanceItem[];
};

const EducationEntry: React.FC<EducationEntryProps> = ({
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
    <div className="space-y-4">
      <div>
        <span className="text-sm text-zinc-600 font-mono">{period}</span>
        <div className="mt-2">
          <h3 className="text-zinc-200 font-medium">{school}</h3>
          <p className="text-sm text-zinc-500 mt-1">{department}</p>
          <p className="text-sm text-zinc-600 mt-1">研究: {research}</p>
          {club && <p className="text-sm text-zinc-600 mt-1">{club}</p>}
        </div>
      </div>
      <div className="space-y-4">
        {projects && projects.length > 0 && (
          <DetailBlock title="Projects">
            <ul className="space-y-1">
              {projects.map((project) => (
                <li key={project} className="text-sm text-zinc-400">
                  {project}
                </li>
              ))}
            </ul>
          </DetailBlock>
        )}
        {achievements && achievements.length > 0 && (
          <DetailBlock title="Results">
            <ul className="space-y-1">
              {achievements.map((achievement) => (
                <li key={achievement} className="text-sm text-zinc-400">
                  {achievement}
                </li>
              ))}
            </ul>
          </DetailBlock>
        )}
        {freelance && freelance.length > 0 && (
          <DetailBlock title="Freelance">
            <div className="space-y-3">
              {freelance.map((item) => (
                <div key={item.client}>
                  <p className="text-sm text-zinc-500">{item.client}</p>
                  <ul className="space-y-1 mt-1">
                    {item.projects.map((project) => (
                      <li key={project} className="text-sm text-zinc-400">
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DetailBlock>
        )}
      </div>
    </div>
  );
};

const DetailBlock: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h4 className="text-xs text-zinc-600 tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
};
