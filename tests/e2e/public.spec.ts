import { expect, test } from "@playwright/test";

test("hero e RSVP funcionam no mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Alex/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Confirmar minha presença/i })).toBeVisible();
  await page.getByRole("button", { name: /Confirmar minha presença/i }).first().click();
  await expect(page.getByRole("heading", { name: /Só falta você confirmar/i })).toBeVisible();
  await page.getByRole("button", { name: /Sim, estarei presente/i }).click();
  await page.getByLabel(/^Nome$/i).fill("Alex");
  await page.getByLabel(/Sobrenome/i).fill("Rodrigues");
  await page.getByText(/Autorizo o uso do meu nome/).click();
  await page.getByRole("button", { name: /Enviar minha resposta/i }).click();
  await expect(page.getByText(/setup|Recebemos|Não foi possível|banco/i)).toBeVisible();
});

test("conteúdo permanece visível com reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByText("Nossa história fica ainda mais bonita com você.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Como chegar/i })).toBeVisible();
});
