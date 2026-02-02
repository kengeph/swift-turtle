# End-to-End (E2E) Testing with Playwright

This directory contains E2E tests that test the full user flow of the Couple's Challenge app in a real browser environment.

## Why Playwright over Selenium?

- **Faster**: Playwright is significantly faster than Selenium
- **Modern**: Built for modern web apps with better React support
- **Auto-waiting**: Automatically waits for elements to be ready
- **Better debugging**: Built-in trace viewer and UI mode
- **Multi-browser**: Tests Chrome, Firefox, Safari, and mobile viewports

## Running Tests

### Run all E2E tests (against local dev server)
```bash
npm run test:e2e
```
This will:
1. Start the dev server automatically
2. Run tests in Chromium, Firefox, and Safari
3. Test mobile viewports
4. Generate an HTML report

### Run tests with UI mode (visual debugging)
```bash
npm run test:e2e:ui
```
Opens a visual interface where you can:
- See tests running in real-time
- Step through tests
- Inspect the page at each step

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```
Runs tests with visible browser windows (useful for debugging).

### Run tests in debug mode
```bash
npm run test:e2e:debug
```
Opens Playwright Inspector for step-by-step debugging.

### Run tests against production
```bash
PLAYWRIGHT_TEST_BASE_URL=https://swift-turtle.com npm run test:e2e -- e2e/production.spec.js
```

### Run all tests (unit + E2E)
```bash
npm run test:all
```

## Test Files

- **`app.spec.js`**: Main E2E tests for the app functionality
- **`production.spec.js`**: Tests specifically for production site verification

## What's Tested

The E2E tests cover:
- ✅ Intro screen rendering
- ✅ Game start flow
- ✅ Score display
- ✅ Game progression
- ✅ Winner selection
- ✅ Back button functionality
- ✅ Gram Master challenge (3 rounds)
- ✅ Transition page between halves
- ✅ Final results page
- ✅ Mobile responsiveness
- ✅ Production site verification

## Configuration

Tests are configured in `playwright.config.js`:
- **Base URL**: `http://localhost:5173` (dev server) or set via `PLAYWRIGHT_TEST_BASE_URL`
- **Browsers**: Chromium, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Taken on failure
- **Traces**: Collected on retry

## CI/CD Integration

To run E2E tests in CI/CD, add to your workflow:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
```

Or test against production:
```yaml
- name: Test production
  run: |
    PLAYWRIGHT_TEST_BASE_URL=https://swift-turtle.com npm run test:e2e -- e2e/production.spec.js
```

## Tips

1. **Use UI mode** for debugging: `npm run test:e2e:ui`
2. **Use headed mode** to see what's happening: `npm run test:e2e:headed`
3. **Check HTML report** after tests: Opens automatically or check `playwright-report/`
4. **View traces** for failed tests: Check `test-results/` folder

## Troubleshooting

**Tests fail with "browser not found"**
```bash
npx playwright install
```

**Tests timeout**
- Increase timeout in `playwright.config.js`
- Check that dev server is starting correctly

**Tests fail on CI**
- Make sure browsers are installed: `npx playwright install --with-deps`
- Check CI has enough resources allocated
