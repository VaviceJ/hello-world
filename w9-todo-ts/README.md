# W9 Todo TypeScript

Week 9 migration of the Week 8 Todo page to strict TypeScript, with Vitest unit tests.

```sh
npm install
npm run typecheck
npm run test
npm run build
npm run dev
```

The app keeps the `w8-todos` localStorage key so valid Week 8 data can be loaded. Stored JSON is treated as untrusted input and filtered through a runtime type guard.
