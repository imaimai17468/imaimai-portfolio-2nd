import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LinkCardProps = {
  title: string;
  url: string;
  description?: string;
};

/**
 * リンクカードコンポーネント
 * 外部リンクをカード形式で表示
 */
export const LinkCard: React.FC<LinkCardProps> = ({ title, url, description }) => {
  // URLからドメインを抽出して表示
  const domain = new URL(url).hostname.replace("www.", "");
  // Google Favicon APIを使用してfaviconを取得
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className="group">
      <Card className="h-full transition-all hover:scale-105 hover:shadow-lg cursor-pointer border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Image
                src={faviconUrl}
                alt={`${title} favicon`}
                width={20}
                height={20}
                className="flex-shrink-0"
                unoptimized
              />
              <CardTitle className="text-lg group-hover:text-blue-400 transition-colors line-clamp-2">
                {title}
              </CardTitle>
            </div>
            <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-blue-400 transition-colors" />
          </div>
          <CardDescription className="text-xs truncate">{domain}</CardDescription>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
};
