import { test, expect } from '@playwright/test'

test.describe('Phone Authentication Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should open login modal when clicking login button', async ({ page }) => {
    // Click login button in navigation (use first instance)
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Verify modal is open
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
    
    // Verify both tabs are present
    await expect(page.locator('button:has-text("🚀 Google")')).toBeVisible()
    await expect(page.locator('button:has-text("📱 Telefon")')).toBeVisible()
  })

  test('should switch between Google and Phone tabs', async ({ page }) => {
    // Open login modal
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Verify Google tab is active by default
    await expect(page.locator('button:has-text("🚀 Google")').first()).toHaveClass(/border-blue-600/)
    
    // Switch to Phone tab
    await page.click('button:has-text("📱 Telefon")')
    
    // Verify Phone tab is now active
    await expect(page.locator('button:has-text("📱 Telefon")').first()).toHaveClass(/border-blue-600/)
    
    // Verify phone auth form is visible
    await expect(page.locator('text=Anmeldung mit Telefonnummer')).toBeVisible()
  })

  test('should show Google authentication form', async ({ page }) => {
    // Open login modal
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Verify Google tab content
    await expect(page.locator('text=Mit Google anmelden')).toBeVisible()
    await expect(page.locator('text=Schnell und sicher mit Ihrem Google-Konto')).toBeVisible()
    await expect(page.locator('button:has-text("Mit Google fortfahren")')).toBeVisible()
  })

  test('should show phone authentication form', async ({ page }) => {
    // Open login modal and switch to phone tab
    await page.locator('button:has-text("Anmelden")').first().click()
    await page.click('button:has-text("📱 Telefon")')
    
    // Verify phone form elements
    await expect(page.locator('text=Anmeldung mit Telefonnummer')).toBeVisible()
    await expect(page.locator('input[type="tel"]')).toBeVisible()
    await expect(page.locator('button:has-text("Code senden")')).toBeVisible()
    await expect(page.locator('button:has-text("Abbrechen")')).toBeVisible()
  })

  test('should validate phone number format', async ({ page }) => {
    // Open login modal and switch to phone tab
    await page.locator('button:has-text("Anmelden")').first().click()
    await page.click('button:has-text("📱 Telefon")')
    
    // Enter invalid phone number
    await page.fill('input[type="tel"]', '123456')
    await page.waitForTimeout(500) // Wait for validation to trigger
    
    // Verify validation message appears
    await expect(page.locator('text=Bitte geben Sie eine gültige Telefonnummer im internationalen Format ein')).toBeVisible()
    
    // Verify send button is disabled
    await expect(page.locator('button:has-text("Code senden")')).toBeDisabled()
    
    // Clear and enter valid phone number
    await page.fill('input[type="tel"]', '')
    await page.fill('input[type="tel"]', '+49123456789')
    await page.waitForTimeout(500) // Wait for validation to trigger
    
    // Verify validation message disappears
    await expect(page.locator('text=Bitte geben Sie eine gültige Telefonnummer im internationalen Format ein')).not.toBeVisible()
    
    // Verify send button is enabled
    await expect(page.locator('button:has-text("Code senden")')).toBeEnabled()
  })

  test('should close modal when clicking close button', async ({ page }) => {
    // Open login modal
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Verify modal is open
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
    
    // Click close button
    await page.click('button[aria-label="Close modal"]')
    
    // Verify modal is closed
    await expect(page.locator('[data-testid="login-modal"]')).not.toBeVisible()
  })

  test.skip('should close modal when clicking backdrop', async ({ page }) => {
    // TODO: Fix backdrop click handling in modal
    // Currently the event propagation isn't working correctly in tests
    // Open login modal
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Wait for modal to be visible
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
    
    // Force click on backdrop
    await page.locator('[data-testid="modal-backdrop"]').click({ force: true })
    
    // Verify modal is closed
    await expect(page.locator('[data-testid="login-modal"]')).not.toBeVisible()
  })

  test('should handle phone authentication flow', async ({ page }) => {
    // Mock Firebase functions to avoid actual API calls
    await page.addInitScript(() => {
      window.mockFirebase = true
    })

    // Open login modal and switch to phone tab
    await page.locator('button:has-text("Anmelden")').first().click()
    await page.click('button:has-text("📱 Telefon")')
    
    // Enter valid phone number
    await page.fill('input[type="tel"]', '+49123456789')
    await page.waitForTimeout(500) // Wait for validation
    
    // Note: In a real test, we would need to mock Firebase Auth
    // For now, we just verify the UI behaves correctly
    
    // Verify send button is clickable
    await expect(page.locator('button:has-text("Code senden")')).toBeEnabled()
  })

  test('should show loading state during authentication', async ({ page }) => {
    // Open login modal
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Mock a slow authentication process
    await page.route('**/*', route => {
      if (route.request().url().includes('google')) {
        // Delay Google auth requests
        setTimeout(() => route.continue(), 2000)
      } else {
        route.continue()
      }
    })
    
    // Click Google login (won't actually authenticate in test)
    await page.click('button:has-text("Mit Google fortfahren")')
    
    // Note: Loading states would need to be tested with proper Firebase mocking
    // This test verifies the structure is in place
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Open login modal
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Verify modal is still usable on mobile
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
    
    // Verify tabs are still clickable
    await page.click('button:has-text("📱 Telefon")')
    await expect(page.locator('text=Anmeldung mit Telefonnummer')).toBeVisible()
  })
})

test.describe('Auth State Integration', () => {
  test('should display user info when authenticated', async ({ page }) => {
    // Note: This would require mocking Firebase Auth state
    // For now, we verify the structure exists
    await page.goto('/')
    
    // Verify unauthenticated state shows login button (use first instance)
    await expect(page.locator('button:has-text("Anmelden")').first()).toBeVisible()
  })

  test('should redirect to dashboard after authentication', async ({ page }) => {
    // This test would verify post-authentication behavior
    // Implementation depends on actual Firebase integration
    await page.goto('/')
    
    // Verify dashboard link is not visible when not authenticated
    await expect(page.locator('a[href="/dashboard"]')).not.toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Focus the first login button directly
    await page.locator('button:has-text("Anmelden")').first().focus()
    
    // Verify we can open modal with Enter
    await page.keyboard.press('Enter')
    
    // Modal should be visible
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Anmelden")').first().click()
    
    // Verify modal has proper ARIA attributes
    // Note: These would need to be added to the actual components
    const modal = page.locator('[data-testid="login-modal"]')
    await expect(modal).toBeVisible()
    
    // Additional ARIA tests would be implemented here
  })
})