declare module "@storybook/react" {
  import type { ComponentType } from "react";
  export type StoryFn = (args?: any) => JSX.Element;
  export interface Preview {
    decorators?: any[];
    parameters?: any;
  }
  export default {} as any;
}

declare module "react/jsx-runtime" {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export function jsxDEV(
    type: any,
    props?: any,
    key?: any,
    isStaticChildren?: any,
  ): any;
  export const Fragment: any;
}
