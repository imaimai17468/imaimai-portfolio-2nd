import { MovieModal } from "@/components/feature/backbone/movie-modal";

export const Motto: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-nakamori">
        筆先の黒は
        <br />
        乾かすな
      </h1>
      <MovieModal description="Respect" src="https://www.youtube.com/embed/62_EvhRoj2g?si=1bOmyya8zY_fb9q6" />
    </div>
  );
};
