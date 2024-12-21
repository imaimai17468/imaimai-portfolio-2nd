import { MovieModal } from "@/components/feature/backbone/movie-modal";

export const Backbone: React.FC = () => {
  return (
    <div className="flex flex-col gap-28 items-center justify-center h-screen">
      <h1 className="text-9xl font-nakamori">
        <span className="transform scale-150 translate-y-2 translate-x-4 inline-block">筆</span>
        <span className="transform scale-140 translate-y-8 translate-x-8 inline-block">先</span>
        <span className="transform scale-100 translate-y-8 translate-x-4 inline-block">の</span>
        <span className="transform scale-150 translate-y-6 translate-x-4 inline-block">黒</span>
        <span className="transform scale-170 translate-y-8 translate-x-4 inline-block">は</span>
        <br />
        <span className="transform scale-150 translate-y-16 translate-x-16 inline-block">乾</span>
        <span className="transform scale-140 translate-y-20 translate-x-20 inline-block">か</span>
        <span className="transform scale-160 translate-y-20 translate-x-16 inline-block">す</span>
        <span className="transform scale-125 translate-y-16 translate-x-16 inline-block">な</span>
      </h1>
      <MovieModal description="Respect" src="https://www.youtube.com/embed/62_EvhRoj2g?si=1bOmyya8zY_fb9q6" />
    </div>
  );
};
