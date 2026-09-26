// Zod schemas for the DORC API and the types inferred from them.
//
// This package ships TypeScript source; nothing builds it. Vite compiles it into
// the client, and the server loads it through Node's built-in type stripping
// (Node >= 22.18), whose `require()` can load an ES module. Two rules follow:
//   - Relative imports end in `.ts`. Node doesn't rewrite `.js` to `.ts`.
//   - Only erasable TypeScript: no enums, namespaces or parameter properties,
//     and type-only imports say `import type`. tsconfig enforces both.

export * from "./common.ts";
export * from "./auth.ts";
export * from "./quests.ts";
export * from "./catalog.ts";
export * from "./admin.ts";
