"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { LinkItem } from "@/entities/top/link-item";

const PRODUCTS: LinkItem[] = [
  {
    title: "Osampo",
    url: "https://osampo.vercel.app/",
    description: "散歩の記録と共有",
  },
  {
    title: "ツウキンプレイス",
    url: "https://tsuukin-place.com",
    description: "通勤時間から駅の家賃相場を調べるサービス",
  },
  {
    title: "Contrast Color Palette",
    url: "https://contrast-color-palette.vercel.app",
    description: "アクセシブルな色の組み合わせを提案",
  },
  {
    title: "Digital Agency Icons",
    url: "https://digital-agency-icons-docs.vercel.app",
    description: "非公式アイコンライブラリ",
  },
  {
    title: "imaimai UI",
    url: "https://imaimai-ui.vercel.app",
    description: "オリジナルUIコンポーネント集",
  },
  {
    title: "木更津高専単位カウンター",
    url: "https://credits-counter-fo-knct.vercel.app/",
    description: "高専生向けの単位計算ツール",
  },
];

/**
 * Products Section - プロダクト
 *
 * design-guidelines:
 * - Spatial Composition: グリッドレイアウトで視覚的な興味
 * - Motion: スタッガードアニメーション
 *
 * UX原則:
 * - Serial Position Effect: 最後のセクションとして印象的に
 * - Peak-End Rule: 体験の終わりを強く印象付ける
 */
export const ProductsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-5xl mx-auto w-full">
        {/* セクションタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm text-zinc-500 tracking-wider mb-2 block">02</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight">Products</h2>
          <p className="text-zinc-500 mt-4 max-w-lg">個人で開発しているプロダクト</p>
        </motion.div>

        {/* プロダクトグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.url} product={product} index={index} isInView={isInView} isLarge={index === 0} />
          ))}
        </div>

        {/* フッター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <Link href="/about" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            More about me
            <span className="ml-2">→</span>
          </Link>
          <p className="text-zinc-700 text-xs">Thanks for scrolling</p>
        </motion.div>
      </div>
    </section>
  );
};

type ProductCardProps = {
  product: LinkItem;
  index: number;
  isInView: boolean;
  isLarge?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, index, isInView, isLarge = false }) => {
  const domain = new URL(product.url).hostname.replace("www.", "");
  // icon.horse API is more reliable for Vercel apps and modern sites
  const faviconUrl = `https://icon.horse/icon/${domain}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={isLarge ? "md:col-span-2" : ""}
    >
      <Link href={product.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
        <div
          className={`
            relative overflow-hidden border border-zinc-800 hover:border-zinc-700 rounded-xl
            transition-all duration-300 hover:bg-zinc-900/50
            ${isLarge ? "p-8 md:p-12" : "p-6"}
          `}
        >
          {/* 背景グラデーション（ホバー時） */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/0 to-zinc-800/0 group-hover:from-zinc-800/20 group-hover:to-transparent transition-all duration-500" />

          <div className="relative">
            {/* ヘッダー */}
            <div className="flex items-start justify-between mb-4">
              <Image
                src={faviconUrl}
                alt={`${product.title} favicon`}
                width={isLarge ? 32 : 24}
                height={isLarge ? 32 : 24}
                className="flex-shrink-0"
                unoptimized
              />
              <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>

            {/* コンテンツ */}
            <h3
              className={`
                font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors mb-2
                ${isLarge ? "text-2xl md:text-3xl" : "text-xl"}
              `}
            >
              {product.title}
            </h3>
            <p
              className={`
                text-zinc-500
                ${isLarge ? "text-base" : "text-sm"}
              `}
            >
              {product.description}
            </p>

            {/* ドメイン表示 */}
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <span className="text-xs text-zinc-600">{domain}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
