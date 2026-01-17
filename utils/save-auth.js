// save-auth-simple.js
const { chromium } = require('playwright');

async function saveAuth() {
  try {
    console.log('🚀 Starting authentication capture process...');
    console.log('📦 Launching browser...');
    
    const browser = await chromium.launch({ 
      headless: false,
      timeout: 60000
    });
    
    console.log('✅ Browser launched successfully');
    console.log('🌐 Creating browser context...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('✅ New page created');
    console.log('🔗 Navigating to Salesforce login page...');
    
    await page.goto('https://computing-ability-8321.lightning.force.com', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    console.log('✅ Page loaded successfully');
    console.log('\n' + '='.repeat(60));
    console.log('👤 Please log in to Salesforce and complete any 2FA if required.');
    console.log('⏸️  After you see your Salesforce home page, press ENTER here.');
    console.log('='.repeat(60) + '\n');

    // Wait for user to press Enter
    await new Promise((resolve) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve();
      });
    });

    console.log('💾 Saving authentication session...');
    const storagePath = 'auth_state.json';
    await context.storageState({ path: storagePath });
    console.log(`✅ Auth session saved to ${storagePath}`);

    await browser.close();
    console.log('✅ Browser closed. Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error occurred:', error);
    process.exit(1);
  }
}

saveAuth();
