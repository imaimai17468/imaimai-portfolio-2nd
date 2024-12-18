import { MovieModal } from "./movie-modal";

export const Top: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-fit">
          <h1 className="text-6xl font-raleway font-black">CREATOR's HIGH</h1>
          <p className="text-end">－ 開発でキマろう</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <p className="text-9xl font-nakamori">
          筆先の黒は
          <br />
          乾かすな
        </p>
        <MovieModal description="Respect" src="https://www.youtube.com/embed/62_EvhRoj2g?si=1bOmyya8zY_fb9q6" />
      </div>
    </div>
  );
};
