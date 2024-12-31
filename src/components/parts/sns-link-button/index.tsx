import { Button } from "@/components/ui/button";
import { LinkIcon, Presentation } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import githubLogo from "./logos/github-mark-white.svg";
import noteLogo from "./logos/note.svg";
import speakerdeckLogo from "./logos/speaker-deck.png";
import xLogo from "./logos/x-logo-white.png";
import zennLogo from "./logos/zenn.svg";

type SnsType = "github" | "x" | "note" | "zenn" | "speakerdeck" | "link" | "slide";
type SnsImageType = Exclude<SnsType, "link" | "slide">;

type Props = {
  type: SnsType;
  href: string;
  alt?: string;
};

type SnsImageConfig = {
  image: StaticImageData;
  alt: string;
  width: number;
  height: number;
};

type SnsConfig = {
  [K in SnsImageType]: SnsImageConfig;
} & {
  link: {
    alt: string;
  };
  slide: {
    alt: string;
  };
};

const SNS_CONFIG: SnsConfig = {
  github: {
    image: githubLogo,
    alt: "GitHub",
    width: 20,
    height: 20,
  },
  x: {
    image: xLogo,
    alt: "X（旧Twitter）",
    width: 16,
    height: 16,
  },
  note: {
    image: noteLogo,
    alt: "note",
    width: 24,
    height: 24,
  },
  zenn: {
    image: zennLogo,
    alt: "Zenn",
    width: 20,
    height: 20,
  },
  speakerdeck: {
    image: speakerdeckLogo,
    alt: "Speaker Deck",
    width: 20,
    height: 20,
  },
  link: {
    alt: "リンク",
  },
  slide: {
    alt: "スライド",
  },
} as const;

export const SnsLinkButton: React.FC<Props> = ({ type, href, alt }) => {
  if (type === "link") {
    return (
      <Button variant="outline" size="icon" asChild>
        <Link href={href}>
          <LinkIcon />
        </Link>
      </Button>
    );
  }

  if (type === "slide") {
    return (
      <Button variant="outline" size="icon" asChild>
        <Link href={href}>
          <Presentation />
        </Link>
      </Button>
    );
  }

  const config = SNS_CONFIG[type];
  return (
    <Button variant="outline" size="icon" asChild>
      <Link href={href}>
        <Image src={config.image} alt={alt ?? config.alt} width={config.width} height={config.height} />
      </Link>
    </Button>
  );
};
