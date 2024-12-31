import { Works } from "@/components/feature/works";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <Works />
    </Suspense>
  );
}
