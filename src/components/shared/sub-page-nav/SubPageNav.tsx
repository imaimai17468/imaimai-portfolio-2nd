"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const SubPageNav: React.FC = () => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    const go = () => router.push("/?blocks");
    if ("startViewTransition" in document) {
      (
        document as Document & {
          startViewTransition: (cb: () => void) => void;
        }
      ).startViewTransition(go);
    } else {
      go();
    }
  }, [router]);

  return (
    <div className="px-6 pt-6">
      <button
        type="button"
        onClick={handleBack}
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:underline focus-visible:outline-hidden transition-colors"
      >
        ← Index
      </button>
    </div>
  );
};
