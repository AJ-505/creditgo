import "nativewind";
import type { Config } from "tailwindcss";

declare module "nativewind" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface NativeWindComponents {}
}

declare module "tailwindcss" {
  export interface ThemeConfig {
    fontFamily?: {
      sans?: string[];
      default?: string[];
    };
  }
}
