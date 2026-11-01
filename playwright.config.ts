import { defineConfig } from "@playwright/test";

// Porta própria, para não disputar com um `npm run dev` aberto. BASE_URL aponta os testes para outro servidor.
const PORT = 5199;

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: process.env.BASE_URL ?? `http://localhost:${PORT}`,
    channel: "chrome",
    // Os defeitos da galeria só aparecem com as animações ligadas, mesmo que o sistema peça movimento reduzido.
    contextOptions: { reducedMotion: "no-preference" },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
      },
});
