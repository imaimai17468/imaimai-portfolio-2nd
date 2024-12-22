import Link from "next/link";

export const Menu: React.FC = () => {
  return (
    <ul className="flex flex-col gap-4 justify-center absolute bottom-8 left-8 text-lg">
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
