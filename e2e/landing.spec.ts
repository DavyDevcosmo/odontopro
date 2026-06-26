import { expect, test } from "@playwright/test"

test.describe("Landing page", () => {
  test("shows PsicoPro branding and professionals section", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("link", { name: /PsicoPro/i }).first()).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /Encontre os melhores profissionais/i }),
    ).toBeVisible()
    await expect(page.locator("#Profissionais")).toBeVisible()
  })

  test("redirects unauthenticated users from dashboard to home", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/")
  })
})
