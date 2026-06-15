---
name: Orval query-options require queryKey
description: Generated React Query hooks in this repo reject a bare { query: { enabled } } options object.
---

The Orval-generated hooks (`useGetProjects`, `useGetDecisions`, etc. from `@workspace/api-client-react`) type their second options arg as `UseQueryOptions` with `queryKey` **required**. Passing `{ query: { enabled: !!x } }` fails typecheck (TS2741: `queryKey` missing).

**Why:** the codegen config emits a non-partial options type, so you cannot supply only `enabled`.

**How to apply:** don't gate these hooks with `enabled`. Call them unconditionally and guard on the returned `data` instead. Fetching a full list early (e.g. all projects/decisions) is cheap and harmless here. If you truly need `enabled`, you must also pass the matching `queryKey`.
