import { useCallback, useState } from "react";

export function useExpandableList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [othersFading, setOthersFading] = useState(false);
  const [othersCollapsed, setOthersCollapsed] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleToggle = useCallback(
    (index: number) => {
      if (busy) return;
      setBusy(true);

      if (openIndex === null) {
        setTargetIndex(index);
        requestAnimationFrame(() => {
          setOthersFading(true);
          setTimeout(() => {
            setOthersCollapsed(true);
            requestAnimationFrame(() => {
              setOpenIndex(index);
              setBusy(false);
            });
          }, 300);
        });
      } else {
        setOpenIndex(null);
        setTimeout(() => {
          setOthersCollapsed(false);
          requestAnimationFrame(() => {
            setOthersFading(false);
            setTimeout(() => {
              setTargetIndex(null);
              setBusy(false);
            }, 300);
          });
        }, 500);
      }
    },
    [busy, openIndex]
  );

  return {
    openIndex,
    targetIndex,
    othersFading,
    othersCollapsed,
    busy,
    handleToggle,
  };
}
