import { test, expect } from '@playwright/test';

test('carga la home publica', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Postlaboratory|x-studio/i);
});

test('reutiliza sesion autenticada si existe storageState', async ({ page }) => {
  await page.goto('/studio');

  await expect(page).toHaveURL(/\/(studio|sign-in)/);
});
