import { defineConfig } from "orval";

export default defineConfig({
  adoApi: {
    input: process.env.ADO_OPENAPI_INPUT ?? "http://localhost:8080/v3/api-docs",
    output: {
      mode: "tags-split",
      target: "src/lib/api/generated",
      client: "fetch",
      override: {
        mutator: {
          path: "./src/lib/api/mutator.ts",
          name: "adoFetch",
        },
      },
    },
  },
});
