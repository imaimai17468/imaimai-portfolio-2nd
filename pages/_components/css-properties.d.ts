import "react";

declare module "react" {
  interface CSSProperties {
    "--i"?: number;
    "--k"?: number;
    "--n"?: number;
    "--blur"?: string;
    "--mask"?: string;
  }
}
