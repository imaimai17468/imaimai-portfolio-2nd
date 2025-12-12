import { Suspense } from "react";
import { Works } from "@/components/feature/works";

export default function Home() {
  return (
    <Suspense>
      <Works />
    </Suspense>
  );
}
