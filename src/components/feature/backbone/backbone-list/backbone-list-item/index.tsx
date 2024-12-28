export type BackboneListItemProps = {
  title: string;
  description: string;
  youtubeUrl?: string;
  contents?: React.ReactNode;
};

export const BackboneListItem: React.FC<BackboneListItemProps> = ({ title, description, youtubeUrl, contents }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-12 flex items-end">
        <p>{title}</p>
      </div>
      {youtubeUrl && (
        <iframe
          src={youtubeUrl}
          className="w-full h-[200px] rounded-lg"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
      {contents}
      <p className="font-cinecaption text-sm">"{description}"</p>
    </div>
  );
};
