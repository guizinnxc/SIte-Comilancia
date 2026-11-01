import { readdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { galleryPhotos, images } from "../src/content/images";

const lightbox = (page: Page) => page.locator('[role="dialog"][aria-label="Visualização da fotografia"]');
const activeLink = (page: Page) => page.locator('nav[aria-label="Principal"] a[aria-current="true"]');
const filterButton = (page: Page, label: string) => page.locator('#galeria [role="group"] button', { hasText: label });
const tile = (page: Page, photoId: string) => page.locator(`[data-reveal-id="${photoId}"] button`);
const scrollToSection = (page: Page, id: string) =>
  page.evaluate((target) => document.getElementById(target)?.scrollIntoView({ behavior: "instant" }), id);

async function openSite(page: Page, hash = "") {
  await page.goto(`/${hash}`);
  await page.waitForSelector("#contato");
}

async function openGallery(page: Page) {
  await openSite(page);
  await scrollToSection(page, "galeria");
  await expect(page.locator("#galeria ul > li").first()).toBeVisible();
  // Tempo da revelação das fotos que entraram na tela.
  await page.waitForTimeout(900);
}

/* Aciona o filtro na própria página e mede a foto a cada quadro, desde o primeiro instante da troca. */
function sampleFilter(page: Page, label: string, photoId: string) {
  return page.evaluate(
    async ({ label, photoId }) => {
      const button = [...document.querySelectorAll<HTMLElement>('#galeria [role="group"] button')].find(
        (item) => item.textContent === label,
      );
      const wrapper = document.querySelector(`[data-reveal-id="${photoId}"]`) as HTMLElement;
      const item = wrapper.closest("li") as HTMLElement;
      const startTop = wrapper.getBoundingClientRect().top;
      const startHeight = document.documentElement.scrollHeight;
      const frames: { top: number; height: number; scale: number; covered: boolean }[] = [];

      const start = performance.now();
      button?.click();
      await new Promise<void>((resolve) => {
        const measure = () => {
          if (performance.now() - start > 800 || !item.isConnected) return resolve();
          const box = wrapper.getBoundingClientRect();
          const style = getComputedStyle(item);
          const matrix = style.transform.match(/matrix\(([^)]+)\)/)?.[1]?.split(",").map(Number) ?? [1, 0, 0, 1];
          // A foto que sai ignora o ponteiro: liga a captura só para saber quem está por cima neste quadro.
          item.style.setProperty("pointer-events", "auto", "important");
          const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
          item.style.removeProperty("pointer-events");
          frames.push({
            top: box.top,
            height: document.documentElement.scrollHeight,
            scale: Math.max(Math.abs((matrix[0] ?? 1) - 1), Math.abs((matrix[3] ?? 1) - 1)),
            covered: Number(style.opacity) > 0.15 && top?.closest("#avaliacoes") != null,
          });
          requestAnimationFrame(measure);
        };
        requestAnimationFrame(measure);
      });
      return { startTop, startHeight, frames };
    },
    { label, photoId },
  );
}

/* Células vazias do mosaico, calculadas pela posição real de cada foto na grade. */
function emptyCells(page: Page) {
  return page.evaluate(() => {
    const list = document.querySelector("#galeria ul") as HTMLElement;
    const style = getComputedStyle(list);
    const columns = style.gridTemplateColumns.split(" ").length;
    const gap = parseFloat(style.rowGap);
    const rowHeight = parseFloat(style.gridAutoRows);
    const box = list.getBoundingClientRect();
    const columnWidth = (box.width - gap * (columns - 1)) / columns;

    const used = new Set<string>();
    let rows = 0;
    for (const item of list.children) {
      const rect = item.getBoundingClientRect();
      const left = Math.round((rect.left - box.left) / (columnWidth + gap));
      const top = Math.round((rect.top - box.top) / (rowHeight + gap));
      const spanX = Math.round((rect.width + gap) / (columnWidth + gap));
      const spanY = Math.round((rect.height + gap) / (rowHeight + gap));
      for (let x = left; x < left + spanX; x++) for (let y = top; y < top + spanY; y++) used.add(`${x}:${y}`);
      rows = Math.max(rows, top + spanY);
    }
    return rows * columns - used.size;
  });
}

test.describe("galeria", () => {
  test("foto que sai fica no lugar e não estica a página", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openGallery(page);

    const { startTop, startHeight, frames } = await sampleFilter(page, "Sobremesas", "sushi-sake");
    expect(frames.length).toBeGreaterThan(5);
    for (const frame of frames) {
      expect(Math.abs(frame.top - startTop)).toBeLessThan(40);
      expect(frame.height).toBeLessThanOrEqual(startHeight + 1);
    }
  });

  test("foto que sai termina o fade por cima da seção seguinte", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1500 });
    await openGallery(page);

    const { frames } = await sampleFilter(page, "Sobremesas", "ovos-quiche-linguica");
    expect(frames.filter((frame) => frame.covered)).toHaveLength(0);
  });

  test("foto que muda de tamanho não deforma", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openGallery(page);

    const { frames } = await sampleFilter(page, "Buffet", "couve-linguica-carne");
    expect(Math.max(...frames.map((frame) => frame.scale))).toBeLessThan(0.02);
  });

  test("foto em saída não abre outra fotografia", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openGallery(page);

    const pointerEvents = await page.evaluate(async () => {
      const filter = [...document.querySelectorAll<HTMLElement>('#galeria [role="group"] button')].find(
        (item) => item.textContent === "Buffet",
      );
      const photo = document.querySelector<HTMLElement>('[data-reveal-id="sushi-sake"] button');
      filter?.click();
      await new Promise((resolve) => setTimeout(resolve, 120));
      const value = getComputedStyle(photo?.closest("li") as HTMLElement).pointerEvents;
      photo?.click();
      return value;
    });

    expect(pointerEvents).toBe("none");
    await page.waitForTimeout(800);
    await expect(lightbox(page)).toHaveCount(0);
  });

  test("voltar o filtro durante a saída restaura a foto", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openGallery(page);

    await filterButton(page, "Buffet").click();
    await filterButton(page, "Todos").click();
    await expect(page.locator("#galeria ul > li")).toHaveCount(galleryPhotos.length);
    await page.waitForTimeout(900);

    await tile(page, "sushi-sake").click();
    await expect(lightbox(page).locator("figcaption")).toContainText("Japonesa");
  });

  for (const width of [375, 1280]) {
    test(`mosaico sem células vazias em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openGallery(page);
      expect(await emptyCells(page)).toBe(0);

      await filterButton(page, "Buffet").click();
      await page.waitForTimeout(1000);
      expect(await emptyCells(page)).toBe(0);
    });
  }
});

test.describe("movimento reduzido", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("mostra a capa no lugar do vídeo e troca o filtro sem animar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openGallery(page);
    await expect(page.locator("#inicio video")).toHaveCount(0);

    const { frames } = await sampleFilter(page, "Buffet", "couve-linguica-carne");
    expect(Math.max(...frames.map((frame) => frame.scale))).toBe(0);
  });
});

test.describe("lightbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openGallery(page);
    await tile(page, "sushi-sake").click();
    await expect(lightbox(page)).toBeVisible();
    await page.waitForTimeout(600);
  });

  test("seta durante o fechamento não reabre", async ({ page }) => {
    await page.keyboard.press("Escape");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1000);
    await expect(lightbox(page)).toHaveCount(0);
  });

  test("Tab não sai do diálogo", async ({ page }) => {
    for (const key of ["Tab", "Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab"]) {
      await page.keyboard.press(key);
      expect(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') != null)).toBe(true);
    }
  });

  test("Tab volta ao diálogo depois de um clique na legenda", async ({ page }) => {
    await lightbox(page).locator("figcaption").click();
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') != null)).toBe(true);
  });

  test("Esc fecha e devolve o foco à foto", async ({ page }) => {
    await page.keyboard.press("Escape");
    await expect(lightbox(page)).toHaveCount(0);
    await expect(tile(page, "sushi-sake")).toBeFocused();
  });
});

test.describe("navegação", () => {
  for (const hash of ["#galeria", "#avaliacoes", "#contato"]) {
    test(`link direto para ${hash} chega à seção, mesmo com fontes atrasadas`, async ({ page }) => {
      await page.route(/fonts\.(googleapis|gstatic)\.com/, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.continue();
      });
      await page.setViewportSize({ width: 375, height: 812 });
      await openSite(page, hash);
      await page.evaluate(() => document.fonts.ready);

      await expect
        .poll(() => page.evaluate((id) => document.querySelector(id)?.getBoundingClientRect().top, hash))
        .toBeCloseTo(96, -1);
      await expect(activeLink(page)).toHaveAttribute("href", hash);
    });
  }

  test("destaque acompanha a rolagem logo depois de clicar em Início", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openSite(page);
    await scrollToSection(page, "avaliacoes");
    await page.locator('nav[aria-label="Principal"] a[href="#inicio"]').click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await scrollToSection(page, "gastronomia");
    await expect(activeLink(page)).toHaveAttribute("href", "#gastronomia", { timeout: 1000 });
  });

  test("destaque volta à seção real quando a rolagem do clique não chega ao destino", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openSite(page);
    await page.evaluate(() =>
      document.addEventListener("click", (event) => event.preventDefault(), { capture: true }),
    );
    await page.locator('nav[aria-label="Principal"] a[href="#contato"]').click();
    await expect(activeLink(page)).toHaveAttribute("href", "#contato");
    await expect(activeLink(page)).toHaveAttribute("href", "#inicio", { timeout: 4000 });
  });
});

test.describe("menu mobile", () => {
  const toggle = (page: Page) => page.locator('button[aria-controls="menu-mobile"]');

  test("fecha e destrava a página ao chegar à largura de desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openSite(page);
    await toggle(page).click();
    await expect(page.locator("#menu-mobile")).toBeVisible();

    await page.setViewportSize({ width: 1366, height: 768 });
    await expect(page.locator("#menu-mobile")).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("Tab volta ao menu depois de um clique no fundo do painel", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openSite(page);
    await toggle(page).click();
    await page.waitForTimeout(800);

    const spot = await page.evaluate(() => {
      const link = document.querySelector("#menu-mobile a")?.getBoundingClientRect();
      const header = document.querySelector("header")?.getBoundingClientRect();
      return { x: innerWidth / 2, y: ((header?.bottom ?? 0) + (link?.top ?? 0)) / 2 };
    });
    await page.mouse.click(spot.x, spot.y);
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest("#menu-mobile, header") != null)).toBe(true);
  });
});

test.describe("layout", () => {
  const footerBoxes = (page: Page) =>
    page.locator("footer > div").first().evaluate((grid) =>
      [...grid.children].map((column) => {
        const box = column.getBoundingClientRect();
        return { top: Math.round(box.top), left: Math.round(box.left) };
      }),
    );

  for (const width of [1024, 1440]) {
    test(`rodapé com as quatro colunas na mesma linha em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openSite(page);
      expect(new Set((await footerBoxes(page)).map((box) => box.top)).size).toBe(1);
    });
  }

  test("rodapé em duas linhas alinhadas no tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openSite(page);
    const [logo, navigation, location, contact] = await footerBoxes(page);
    expect(logo?.top).toBe(navigation?.top);
    expect(location?.top).toBe(contact?.top);
    expect(logo?.left).toBe(location?.left);
    expect(navigation?.left).toBe(contact?.left);
  });

  test("indicador de rolagem não encosta no texto do Hero em celular baixo", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 640 });
    await openSite(page);
    await page.waitForTimeout(2500);
    const { textBottom, lineTop } = await page.evaluate(() => {
      const paragraphs = document.querySelectorAll("#inicio .max-w-5xl p");
      return {
        textBottom: paragraphs[paragraphs.length - 1]?.getBoundingClientRect().bottom ?? 0,
        lineTop: document.querySelector("#inicio [aria-hidden='true'] > span")?.getBoundingClientRect().top ?? 0,
      };
    });
    expect(lineTop).toBeGreaterThanOrEqual(textBottom);
  });

  test("botão outline responde ao hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openSite(page);
    await page.waitForTimeout(1800);
    const button = page.locator('#inicio a[href="#contato"]');
    const background = () => button.evaluate((element) => getComputedStyle(element).backgroundColor);
    const before = await background();
    await button.hover();
    await expect.poll(background).not.toBe(before);
  });

  test("informações de contato formam uma lista de definição válida", async ({ page }) => {
    await openSite(page);
    await expect(page.locator("#contato dl > div > dt")).toHaveCount(3);
    await expect(page.locator("#contato dl > div > dd")).toHaveCount(3);
    await expect(page.locator("#contato dl > div > :not(dt, dd)")).toHaveCount(0);
  });
});

test("console sem avisos nem erros do site", async ({ page, baseURL }) => {
  const messages: string[] = [];
  page.on("pageerror", (error) => messages.push(error.message));
  page.on("console", (message) => {
    const fromSite = message.location().url.startsWith(baseURL ?? "");
    if (fromSite && ["warning", "error"].includes(message.type())) messages.push(message.text());
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await openGallery(page);
  await filterButton(page, "Buffet").click();
  await page.waitForTimeout(800);
  await tile(page, "couve-linguica-carne").click();
  await expect(lightbox(page)).toBeVisible();

  expect(messages).toEqual([]);
});

test.describe("arquivos publicados", () => {
  test("notas internas não ficam em public/", () => {
    const files = readdirSync("public", { recursive: true }).map(String);
    expect(files.filter((file) => file.endsWith(".md"))).toEqual([]);
  });

  test("cada fotografia aparece uma única vez e existe no servidor", async ({ request }) => {
    const sources = [...Object.values(images), ...galleryPhotos].map((photo) => photo.src);
    expect(new Set(sources).size).toBe(sources.length);

    for (const source of sources) {
      const response = await request.get(source);
      expect(response.headers()["content-type"], source).toContain("image/");
    }
  });

  test("imagem de compartilhamento existe", async ({ request }) => {
    const response = await request.get("/images/og-cover.jpg");
    expect(response.headers()["content-type"]).toContain("image/");
  });
});
