import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { SnsLinkButton } from "../sns-link-button";

const MenuList = () => {
  return (
    <ul className="flex flex-col gap-4 text-lg">
      <li className="border-b border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 transition-all duration-300 px-2">
        <Link href="/">
          <p className="font-black">TOP</p>
        </Link>
      </li>
      <li className="border-b border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 transition-all duration-300 px-2">
        <Link href="/about">
          <p className="font-black">ABOUT</p>
        </Link>
      </li>
      <li className="border-b border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 transition-all duration-300 px-2">
        <Link href="/works">
          <p className="font-black">WORKS</p>
        </Link>
      </li>
      <li className="border-b border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 transition-all duration-300 px-2">
        <Link href="/backbone">
          <p className="font-black">BACKBONE</p>
        </Link>
      </li>
    </ul>
  );
};

export const Menu: React.FC = () => {
  return (
    <div className="hidden sm:block">
      <div className="fixed bottom-8 left-8">
        <MenuList />
      </div>
    </div>
  );
};

export const SpMenu: React.FC = () => {
  return (
    <div className="block sm:hidden">
      <Sheet>
        <SheetTrigger
          className="z-50 fixed top-4 right-4 bg-zinc-900 p-2 rounded-lg border border-zinc-800"
          aria-label="Menu"
        >
          <MenuIcon className="h-6 w-6 text-zinc-100" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[240px] bg-zinc-900 text-zinc-00 pt-12 flex flex-col gap-4">
          <MenuList />
          <SnsLinkButton href="https://github.com/imaimai17468/imaimai-portfolio-2nd" type="github" />
        </SheetContent>
      </Sheet>
    </div>
  );
};
