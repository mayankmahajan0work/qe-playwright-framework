import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface PageSnapshot {
  pageName: string;
  url: string;
  timestamp: string;
  pageTitle: string;
  htmlContent: string;
  interactiveElements: any[];
}

async function capturePage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: 'auth/auth_state.json'
  });
  const page = await context.newPage();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    while (true) {
      console.log('\n' + '='.repeat(60));
      
      const url = await question('Enter page URL (or "quit" to exit): ');
      
      if (url.toLowerCase() === 'quit') {
        console.log('👋 Exiting...');
        break;
      }

      const pageName = await question('Enter page name (e.g., lead-list-page): ');

      console.log(`\n🌐 Navigating to: ${url}`);
      await page.goto(url, { timeout: 60000 });
      
      console.log('⏳ Waiting for page to stabilize...');
      await page.waitForTimeout(3000);

      console.log('📸 Capturing page snapshot...');
      
      // Get page info
      const pageTitle = await page.title();
      const htmlContent = await page.content();
      
      // Extract all interactive elements
      const interactiveElements = await page.evaluate(() => {
        const elements: any[] = [];
        
        document.querySelectorAll('button, input, select, textarea, a[href], [role="button"], [role="textbox"], [role="combobox"]').forEach((el: any) => {
          elements.push({
            role: el.getAttribute('role') || el.tagName.toLowerCase(),
            name: el.textContent?.trim() || el.getAttribute('aria-label') || el.getAttribute('name') || '',
            tagName: el.tagName.toLowerCase(),
            type: el.getAttribute('type') || '',
            id: el.id || '',
            ariaLabel: el.getAttribute('aria-label') || '',
            placeholder: el.getAttribute('placeholder') || ''
          });
        });
        
        return elements;
      });

      const snapshot: PageSnapshot = {
        pageName,
        url,
        timestamp: new Date().toISOString(),
        pageTitle,
        htmlContent,
        interactiveElements
      };

      // Save to artifacts folder
      const artifactsDir = path.join(process.cwd(), 'artifacts');
      if (!fs.existsSync(artifactsDir)) {
        fs.mkdirSync(artifactsDir, { recursive: true });
      }

      const fileName = `${pageName}.json`;
      const filePath = path.join(artifactsDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');

      console.log(`✅ Saved: ${filePath}`);
      console.log(`📊 Captured ${interactiveElements.length} interactive elements`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await browser.close();
    process.exit(0);
  }
}

capturePage();
