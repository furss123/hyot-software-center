import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const BASE = 'http://localhost:3000'
const ROUTES = [
  '/ko',
  '/ko/software',
  '/ko/software/bidanwin',
  '/ko/software/hyoviewer',
  '/ko/feedback',
  '/ko/changelog',
  '/ko/software/bidanwin/feedback',
]

async function main(): Promise<void> {
  const browser = await chromium.launch()
  let failed = false

  for (const route of ROUTES) {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(`${BASE}${route}`)
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    const critical = axe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    ).length
    if (critical > 0) {
      failed = true
      process.stderr.write(`❌ ${route}: ${critical} critical/serious violations\n`)
      axe.violations
        .filter((v) => v.impact === 'critical' || v.impact === 'serious')
        .forEach((v) => process.stderr.write(`   - ${v.id}: ${v.description}\n`))
    } else {
      process.stdout.write(
        `✅ ${route}: 0 critical violations (${axe.violations.length} total)\n`,
      )
    }
    await context.close()
  }

  await browser.close()
  if (failed) process.exit(1)
}

main().catch((e) => {
  process.stderr.write(`${String(e)}\n`)
  process.exit(1)
})
