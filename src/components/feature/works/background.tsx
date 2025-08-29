import dynamic from "next/dynamic";

const Hyperspeed = dynamic(() => import("@/blocks/Backgrounds/Hyperspeed/Hyperspeed"), {
  ssr: false,
});

export const Background = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <Hyperspeed
        effectOptions={{
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0x333333,
            brokenLines: 0x444444,
            leftCars: [0x4f46e5, 0x7c3aed, 0x06b6d4],
            rightCars: [0xf97316, 0xef4444, 0x10b981],
            sticks: 0x06b6d4,
          },
        }}
      />
    </div>
  );
};
