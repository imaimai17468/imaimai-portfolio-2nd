type CareerSpeakerProps = {
  talks: readonly string[];
};

export const CareerSpeaker = ({ talks }: CareerSpeakerProps) => (
  <div className="mt-3">
    <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">
      Speaker
    </p>
    <ul className="flex flex-col gap-1">
      {talks.map((talk) => (
        <li key={talk} className="text-muted-foreground text-sm">
          <span className="text-accent-soft mr-2">{"~"}</span>
          {talk}
        </li>
      ))}
    </ul>
  </div>
);
