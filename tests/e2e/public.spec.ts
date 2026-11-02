import { unlink } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

test.beforeEach(async () => {
  await unlink(path.join(process.cwd(), ".data", "rsvps.json")).catch(() => undefined);
});

test("hero e RSVP funcionam no mobile após o envelope", async ({ page }) => {
  await page.goto("/");
  const windowButton = page.getByRole("button", { name: /janela/i });
  if (await windowButton.isVisible()) await windowButton.click();
  await expect(page.getByRole("heading", { name: /Alex/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Confirmar minha presença/i })).toBeVisible();
  await page.getByRole("button", { name: /Confirmar minha presença/i }).first().click();
  await expect(page.getByRole("heading", { name: /Confirma sua presença/i })).toBeVisible();
  await page.getByRole("button", { name: /Sim, estarei presente/i }).click();
  await page.getByLabel(/nome completo/i).fill("Tânia Rodrigues");
  await page.getByRole("button", { name: /Não, vou sozinho/i }).click();
  await page.getByText(/Autorizo o uso do meu nome/).click();
  await page.getByRole("button", { name: /Enviar minha resposta/i }).click();
  await expect(page.getByRole("heading", { name: /Sua resposta está em nossas mãos/i })).toBeVisible();
  await expect(page.getByText(/cinco segundos/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sua resposta chegou/i })).toBeVisible({
    timeout: 8000,
  });
  await expect(page.getByRole("link", { name: /Voltar ao convite/i })).toBeVisible({
    timeout: 8000,
  });
  await expect(page.getByRole("link", { name: /Google/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Outlook/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Apple/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Outras/i })).toBeVisible();
  await expect(page).toHaveURL(/confirmando/);
});

test("conteúdo permanece visível com reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByText("Mais do que um casamento, um encontro.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Como chegar/i })).toBeVisible();
});

test("rejeita nome fora da lista e confirmação repetida", async ({ page }) => {
  await page.goto("/#confirmar");
  await page.getByRole("button", { name: /Sim, estarei presente/i }).click();
  await page.getByLabel(/nome completo/i).fill("Pessoa Inventada");
  await page.getByText(/Autorizo o uso do meu nome/).click();
  await page.getByRole("button", { name: /Enviar minha resposta/i }).click();
  await expect(page.getByText(/Não encontramos esse nome na lista/i)).toBeVisible();

  await page.getByLabel(/nome completo/i).fill("Heloísa Noleto");
  await page.getByRole("button", { name: /Enviar minha resposta/i }).click();
  await expect(page.getByText(/Essa presença já foi respondida/i)).toBeVisible();
});

test("página de obrigado existe sem expor dados na URL", async ({ page }) => {
  await page.goto("/obrigado");
  await expect(page.getByRole("heading")).toBeVisible();
  await expect(page.getByRole("link", { name: /Voltar ao convite/i })).toBeVisible();
});
