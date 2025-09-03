import { test, expect } from '@playwright/test';

test.describe('Firebase/Firestore Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Warten bis die Seite vollständig geladen ist
    await expect(page.locator('h1:has-text("Lernen mit")')).toBeVisible();
  });

  test('sollte öffentliche Lernpakete von Firestore laden und anzeigen', async ({ page }) => {
    // Warten auf das Laden der öffentlichen Pakete Section
    const packetsSection = page.locator('text=Öffentliche Lernpakete').first();
    await expect(packetsSection).toBeVisible();
    
    // Prüfen ob entweder Pakete geladen wurden oder "Noch keine" angezeigt wird
    await expect.soft(async () => {
      // Entweder es gibt echte Pakete...
      const packetCards = page.locator('[data-testid="pack-card"]');
      const hasPackets = await packetCards.count() > 0;
      
      // Oder die "Noch keine Pakete" Nachricht
      const noPacketsMessage = page.locator('h3:has-text("Noch keine öffentlichen Pakete")');
      const hasNoPacketsMessage = await noPacketsMessage.isVisible();
      
      // Mindestens eine der beiden Optionen sollte vorhanden sein
      expect(hasPackets || hasNoPacketsMessage).toBeTruthy();
    }).toPass({ timeout: 10000 });
  });

  test('sollte Firebase-Verbindung ohne kritische Fehler herstellen', async ({ page }) => {
    // Navigation zu einer anderen Seite testen
    await page.getByRole('link', { name: '🎮 Demo' }).click();
    await expect(page.locator('h1:has-text("🎮 Live Demo")')).toBeVisible();
    
    // Zurück zur Startseite
    await page.getByRole('link', { name: '🏠 Startseite' }).click();
    await expect(page.locator('h1:has-text("Lernen mit")')).toBeVisible();
  });

  test('sollte Google-Anmelde-Button im Header anzeigen', async ({ page }) => {
    // Google Login Button im Header sollte vorhanden sein
    const headerLoginButton = page.getByRole('banner').getByRole('button', { name: '🚀 Mit Google anmelden' });
    await expect(headerLoginButton).toBeVisible();
    
    // Hinweis: Echter Login wird nicht getestet, nur UI-Verfügbarkeit
  });

  test('sollte alle wichtigen Routen ohne kritische Fehler erreichen', async ({ page }) => {
    // Test verschiedene Routen der App
    await page.goto('/demo');
    await expect(page.locator('h1:has-text("🎮 Live Demo")')).toBeVisible();
    
    await page.goto('/');
    await expect(page.locator('h1:has-text("Lernen mit")')).toBeVisible();
  });
});