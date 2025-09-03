import { test, expect } from '@playwright/test';

/**
 * E2E Test: JSON-Upload-Validierung und Demo-Funktionalität
 * 
 * Testet die vollständige Demo-Seite für Lernpakete mit:
 * - Schema-Validierung und Anzeige von Lernpaketen
 * - Navigation zwischen verschiedenen Demo-Paketen
 * - Korrekte Darstellung verschiedener Fragetypen
 * - Funktionsfähigkeit der interaktiven Quiz-Funktion
 */

test.describe('Demo Lernpaket Validierung', () => {
  test.beforeEach(async ({ page }) => {
    // Navigationss zur Demo-Seite
    await page.goto('/demo');
    
    // Warten bis die Demo-Seite vollständig geladen ist
    await expect(page.locator('h1:has-text("🎮 Live Demo")')).toBeVisible();
    await expect(page.getByText('Wähle ein Demo-Lernpaket')).toBeVisible();
  });

  test('sollte Demo-Seite mit verfügbaren Lernpaketen anzeigen', async ({ page }) => {
    // Überprüfung der Grundelemente der Demo-Seite
    await expect(page.locator('h1:has-text("🎮 Live Demo")')).toBeVisible();
    await expect(page.getByText('Erlebe die glassmorphe smallbyte Platform mit echten Lernpaketen')).toBeVisible();
    
    // Tab-Navigation überprüfen
    await expect(page.getByRole('button', { name: '🎯 Lernpakete Demo' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🚀 Features' })).toBeVisible();
    
    // Verfügbare Demo-Pakete überprüfen
    await expect(page.locator('h3:has-text("React Fundamentals")')).toBeVisible();
    await expect(page.locator('h3:has-text("Python Basics")')).toBeVisible();
    await expect(page.getByText('3 Fragen')).toBeVisible(); // React Paket
    await expect(page.getByText('2 Fragen')).toBeVisible(); // Python Paket
  });

  test('sollte React Fundamentals Lernpaket korrekt laden und validieren', async ({ page }) => {
    // React Fundamentals Paket laden - verwende spezifischeren Locator
    await expect(page.getByText('React Fundamentals')).toBeVisible();
    
    // React Paket "Laden" Button klicken
    await page.getByRole('button', { name: 'Laden' }).first().click();
    
    // Überprüfung dass das Paket geladen wurde
    await expect(page.getByRole('button', { name: '✅ Geladen' }).first()).toBeVisible();
    await expect(page.locator('h2:has-text("📋 Paket-Vorschau")')).toBeVisible();
    
    // Schema-Validierung: Titel und Beschreibung
    await expect(page.locator('h3:has-text("React Fundamentals - Grundlagen für Einsteiger")')).toBeVisible();
    await expect(page.getByText('Umfassendes Lernpaket zu React.js Grundlagen')).toBeVisible();
    
    // Tags überprüfen (spezifischer)
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'React' }).first()).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'JavaScript' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Frontend' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Components' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Hooks' })).toBeVisible();
    
    // Fragen-Struktur überprüfen
    await expect(page.getByText('3 Fragen/Aufgaben:')).toBeVisible();
    
    // Single Choice Frage validieren
    await expect(page.getByText('#1')).toBeVisible();
    await expect(page.getByText('Single Choice')).toBeVisible();
    await expect(page.getByText('Was ist React.js?')).toBeVisible();
    
    // Korrekte und falsche Antworten überprüfen
    await expect(page.getByText('✅ Eine JavaScript-Bibliothek zum Erstellen von Benutzeroberflächen')).toBeVisible();
    await expect(page.getByText('🔘 Ein CSS-Framework für responsive Designs')).toBeVisible();
    await expect(page.getByText('🔘 Eine Backend-Technologie für APIs')).toBeVisible();
    await expect(page.getByText('🔘 Ein Datenbank-Management-System')).toBeVisible();
    
    // Multiple Choice Frage validieren
    await expect(page.getByText('#2')).toBeVisible();
    await expect(page.getByText('Multiple Choice')).toBeVisible();
    await expect(page.getByText('Welche der folgenden sind React Hooks?')).toBeVisible();
    await expect(page.getByText('✅ useState')).toBeVisible();
    await expect(page.getByText('✅ useEffect')).toBeVisible();
    await expect(page.getByText('🔘 componentDidMount')).toBeVisible();
    await expect(page.getByText('✅ useContext')).toBeVisible();
    
    // Text Input Frage validieren
    await expect(page.getByText('#3')).toBeVisible();
    await expect(page.getByText('Text Input')).toBeVisible();
    await expect(page.getByText('Erklären Sie den Unterschied zwischen Props und State in React.')).toBeVisible();
    
    // Erklärungen überprüfen
    await expect(page.getByText('Erklärung:').first()).toBeVisible();
    await expect(page.getByText('React revolutionierte die Frontend-Entwicklung')).toBeVisible();
    
    // Action Buttons überprüfen
    await expect(page.getByRole('button', { name: '🎯 Interaktives Quiz starten' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📊 Zu Dashboard hinzufügen' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🔄 Anderes Paket wählen' })).toBeVisible();
  });

  test('sollte Python Basics Lernpaket korrekt laden und validieren', async ({ page }) => {
    // Python Basics Paket laden
    await expect(page.getByText('Python Basics')).toBeVisible();
    
    // Python "Laden" Button klicken (der zweite Laden Button)
    await page.getByRole('button', { name: 'Laden' }).nth(1).click();
    
    // Überprüfung dass das Paket geladen wurde
    await expect(page.getByRole('button', { name: '✅ Geladen' }).first()).toBeVisible();
    
    // Schema-Validierung für Python Paket
    await expect(page.locator('h3:has-text("Python Basics - Programmieren lernen")')).toBeVisible();
    await expect(page.getByText('Grundlegendes Lernpaket für Python-Einsteiger')).toBeVisible();
    
    // Python-spezifische Tags
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Python' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Programming' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Basics' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'OOP' })).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r').filter({ hasText: 'Data Types' })).toBeVisible();
    
    // Richtige Anzahl von Fragen
    await expect(page.getByText('2 Fragen/Aufgaben:')).toBeVisible();
    
    // Multiple Choice Frage zu Python Datentypen
    await expect(page.getByText('✅ int (Integer)')).toBeVisible();
    await expect(page.getByText('🔘 string (String)')).toBeVisible();
    await expect(page.getByText('✅ list (Liste)')).toBeVisible();
    await expect(page.getByText('✅ dict (Dictionary)')).toBeVisible();
    
    // Single Choice Frage zu Python Funktionen
    await expect(page.getByText('✅ def function_name():')).toBeVisible();
    await expect(page.getByText('🔘 function function_name() {}')).toBeVisible();
    await expect(page.getByText('🔘 create function_name()')).toBeVisible();
  });

  test('sollte zwischen verschiedenen Demo-Paketen wechseln können', async ({ page }) => {
    // Erst React laden
    await page.getByRole('button', { name: 'Laden', exact: true }).first().click();
    await expect(page.locator('h3:has-text("React Fundamentals - Grundlagen für Einsteiger")')).toBeVisible();
    
    // Dann Python laden (der einzige verbleibende "Laden" Button)
    await page.getByRole('button', { name: 'Laden', exact: true }).click();
    await expect(page.locator('h3:has-text("Python Basics - Programmieren lernen")')).toBeVisible();
    
    // Zurück zu React (der einzige verbleibende "Laden" Button)
    await page.getByRole('button', { name: 'Laden', exact: true }).click();
    await expect(page.locator('h3:has-text("React Fundamentals - Grundlagen für Einsteiger")')).toBeVisible();
  });

  test('sollte interaktives Quiz korrekt starten und funktionieren', async ({ page }) => {
    // React Paket laden
    await page.getByRole('button', { name: 'Laden' }).first().click();
    
    // Swipe Quiz Tab sollte erscheinen
    await expect(page.getByRole('button', { name: '🎮 Swipe Quiz' })).toBeVisible();
    
    // Interaktives Quiz starten
    await page.getByRole('button', { name: '🎯 Interaktives Quiz starten' }).click();
    
    // Quiz Interface überprüfen
    await expect(page.locator('h2:has-text("🎮 Swipe Quiz")')).toBeVisible();
    await expect(page.getByText('Swipe nach rechts für richtige, nach links für falsche Antworten')).toBeVisible();
    
    // Fortschrittsanzeige
    await expect(page.getByText('🎯 Fortschritt')).toBeVisible();
    await expect(page.getByText('1 / 3')).toBeVisible();
    
    // Erste Frage im Quiz
    await expect(page.getByText('Frage 1 von 3')).toBeVisible();
    await expect(page.getByText('🎯 Single')).toBeVisible();
    await expect(page.locator('h2:has-text("Was ist React.js?")')).toBeVisible();
    
    // Quiz-Optionen überprüfen
    await expect(page.getByRole('button', { name: 'Eine JavaScript-Bibliothek' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ein CSS-Framework' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eine Backend-Technologie' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ein Datenbank-Management-System' })).toBeVisible();
    
    // Anweisungen überprüfen
    await expect(page.getByText('⚡ Wähle eine Antwort - automatisches Swiping')).toBeVisible();
    await expect(page.getByText('💡')).toBeVisible();
    await expect(page.getByText('So funktioniert\'s:')).toBeVisible();
    
    // Antwort auswählen und automatisches Swiping testen
    await page.getByRole('button', { name: 'Eine JavaScript-Bibliothek' }).click();
    
    // Buttons sollten nach Auswahl deaktiviert werden
    await expect(page.getByRole('button', { name: 'Eine JavaScript-Bibliothek' })).toBeDisabled();
  });

  test('sollte Tab-Navigation zwischen Demo, Features und Quiz funktionieren', async ({ page }) => {
    // Standardmäßig ist "Lernpakete Demo" aktiv
    const demoTab = page.getByRole('button', { name: '🎯 Lernpakete Demo' });
    const featuresTab = page.getByRole('button', { name: '🚀 Features' });
    
    // Features Tab anklicken
    await featuresTab.click();
    // Warten auf Features-Inhalt (falls implementiert)
    
    // Zurück zu Demo Tab
    await demoTab.click();
    await expect(page.getByText('Wähle ein Demo-Lernpaket')).toBeVisible();
    
    // Ein Paket laden, damit Quiz Tab erscheint
    await page.getByRole('button', { name: 'Laden' }).first().click();
    
    // Quiz Tab sollte erscheinen
    const quizTab = page.getByRole('button', { name: '🎮 Swipe Quiz' });
    await expect(quizTab).toBeVisible();
    
    // Quiz Tab anklicken
    await quizTab.click();
    await expect(page.locator('h2:has-text("🎮 Swipe Quiz")')).toBeVisible();
  });
});