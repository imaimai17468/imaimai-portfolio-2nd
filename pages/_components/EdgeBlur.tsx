import "./edge-blur.css";

type Edge = "top" | "bottom";

const LAYER_COUNT = 8;
const STRONGEST_BLUR_PX: Record<Edge, number> = { top: 20, bottom: 8 };

// Layer `layer`, counted from the edge, blurs by the edge's strongest blur
// halved `layer` times, and shows only over its eighth of the band and the
// eighths on either side, where it fades in and out. Stacked, the blur grows
// smoothly toward the edge instead of stepping.
export function describeBlurLayer(edge: Edge, layer: number) {
  const eighth = (step: number) => `${step * 12.5}%`;
  return {
    blur: `blur(${STRONGEST_BLUR_PX[edge] / 2 ** layer}px)`,
    mask: `linear-gradient(${edge === "top" ? "to bottom" : "to top"}, transparent ${eighth(layer - 2)}, #000 ${eighth(layer - 1)}, #000 ${eighth(layer)}, transparent ${eighth(layer + 1)})`,
  };
}

// A band along one edge of the screen that blurs what passes under it,
// strongest at the edge and gone at its inner side, under a tint of the
// surface it sits on.
export function EdgeBlur({ edge }: { edge: Edge }) {
  return (
    <div className="edge-blur" data-edge={edge} aria-hidden="true">
      {Array.from({ length: LAYER_COUNT }, (_, layer) => {
        const { blur, mask } = describeBlurLayer(edge, layer);
        return <span key={layer} className="edge-blur-layer" style={{ "--blur": blur, "--mask": mask }} />;
      })}
      <span className="edge-blur-tint" />
    </div>
  );
}
