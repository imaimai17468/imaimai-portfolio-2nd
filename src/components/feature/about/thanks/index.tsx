import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Thanks: React.FC = () => {
  return (
    <div className="max-w-5xl min-h-screen font-light flex flex-col justify-center mx-auto gap-8">
      <div className="flex flex-col">
        <h1 className="text-4xl font-black">Thanks</h1>
        <h2>お世話になった人々 - 団体</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>NUTMEG</CardTitle>
            <CardDescription>学園祭実行委員会 情報局</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="icon">
              <Link href="https://blog.nutmeg.cloud/">
                <LinkIcon />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="https://twitter.com/nutfes_nutmeg">
                <Image src="/images/x-logo-white.png" alt="NUTMEGのX（旧Twitter）" width={16} height={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>プロ研</CardTitle>
            <CardDescription>木更津高専 プログラミング研究同好会</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="https://x.com/NITKiC_pro">
                <Image src="/images/x-logo-white.png" alt="プロ研のX（旧Twitter）" width={16} height={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>POSTGET</CardTitle>
            <CardDescription>23-24卒エンジニアグループ</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="icon">
              <Link href="https://post-get.joshi-engineer.com/">
                <LinkIcon />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="https://twitter.com/postGetAnpan">
                <Image src="/images/x-logo-white.png" alt="POSTGETのX（旧Twitter）" width={16} height={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TechUni</CardTitle>
            <CardDescription>関西学院大学発のIT系学生団体</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="icon">
              <Link href="https://techuni.org/">
                <LinkIcon />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="https://twitter.com/TechUni1026">
                <Image src="/images/x-logo-white.png" alt="TechUniのX（旧Twitter）" width={16} height={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>NID.kt</CardTitle>
            <CardDescription>Androidコミュニティ</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="icon">
              <Link href="https://www.nidkt.org/">
                <LinkIcon />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>サポーターズ</CardTitle>
            <CardDescription>技育系イベントを開催</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="icon">
              <Link href="https://talent.supporterz.jp/">
                <LinkIcon />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
