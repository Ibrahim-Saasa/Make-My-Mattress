// Minimal Deno and std library shims for editor/TypeScript in a Node dev environment
// These declarations silence TypeScript errors for Deno-specific globals used by Supabase Edge Functions.

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

declare module "https://deno.land/std@0.201.0/http/server.ts" {
  export function serve(
    handler: (req: Request) => Promise<Response> | Response,
  ): void;
}

// btoa/atob may not be available in Node TS environment used by the editor
declare function btoa(input: string): string;
declare function atob(input: string): string;
