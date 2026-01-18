import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { spawn } from 'child_process';

interface CapturedElement {
  action: string;
  locatorType: string;
  locatorValue: string;
  locatorOptions?: any;
  fullLocator: string;
  fillValue?: string;
}

async function capturePage() {
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
    console.log('\n' + '='.repeat(60));
    console.log('🎬 Playwright Codegen Integration');
    console.log('='.repeat(60) + '\n');

    const url = await question('Enter page URL: ');
    const pageName = await question('Enter page name (e.g., lead-form-page): ');

    console.log('\n🚀 Starting Playwright Codegen...');
    console.log('📝 Interact with the page - all interactions will be recorded');
    console.log('⚠️  IMPORTANT: You must click/fill elements BEFORE closing!');
    console.log('⏸️  Close the Inspector window when done\n');

    // Temporary file for codegen output
    const tempCodegenFile = path.join(process.cwd(), '.temp-codegen.js');

    // Run codegen with auth state and output to file
    const codegenProcess = spawn('npx', [
      'playwright',
      'codegen',
      '--load-storage=auth/auth_state.json',
      '--target=javascript',
      `--output=${tempCodegenFile}`,
      url
    ], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });

    // Don't wait for process - let user close it manually
    codegenProcess.unref();

    console.log('✓ Codegen is now running in the background');
    console.log('\n' + '='.repeat(60));
    console.log('👉 INTERACT with the page in the browser');
    console.log('👉 CLOSE the Playwright Inspector when done');
    console.log('👉 Press ENTER here when you have closed the inspector');
    console.log('='.repeat(60) + '\n');

    await question('Press ENTER after closing inspector: ');

    console.log('\n⏳ Waiting for file to be written...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Read the generated code from file
    let codeInput = '';
    console.log(`🔍 Looking for: ${tempCodegenFile}`);
    
    if (fs.existsSync(tempCodegenFile)) {
      codeInput = fs.readFileSync(tempCodegenFile, 'utf-8');
      console.log(`✓ File found, size: ${codeInput.length} bytes`);
      console.log(`📄 First 200 chars:\n${codeInput.substring(0, 200)}\n`);
      
      if (!codeInput.trim()) {
        console.log('⚠️  File is empty - did you interact with the page?');
      }
      
      // Clean up temp file (comment out for debugging)
      // fs.unlinkSync(tempCodegenFile);
    } else {
      console.log('⚠️  Temp file not found - codegen may not have generated code.');
      console.log('💡 This happens if you close inspector without recording any interactions.');
      rl.close();
      process.exit(0);
    }
    
    if (!codeInput.trim()) {
      console.log('⚠️  No interactions recorded. Exiting...');
      rl.close();
      process.exit(0);
    }

    // Parse the generated code to extract locators
    const elements = parsePlaywrightCode(codeInput);
    
    // Deduplicate elements
    const deduped = deduplicateElements(elements);
    
    console.log(`📊 Captured ${elements.length} actions, ${deduped.length} after deduplication`);

    // Save to artifacts
    const artifactsDir = path.join(process.cwd(), 'artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }

    const output = {
      pageName,
      url,
      timestamp: new Date().toISOString(),
      capturedElements: deduped,
      rawCode: codeInput
    };

    const fileName = `${pageName}_locators.json`;
    const filePath = path.join(artifactsDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');

    console.log(`\n✅ Saved ${deduped.length} element locators to: ${filePath}`);
    console.log('\n📊 Captured elements:');
    deduped.forEach((el, i) => {
      const value = el.fillValue ? ` (value: "${el.fillValue}")` : '';
      console.log(`  ${i + 1}. ${el.action} → ${el.fullLocator}${value}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

function parsePlaywrightCode(code: string): CapturedElement[] {
  const elements: CapturedElement[] = [];
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments, empty lines, imports, and setup code
    if (trimmed.startsWith('//') || 
        !trimmed || 
        trimmed.startsWith('import') ||
        trimmed.startsWith('const ') ||
        trimmed.includes('await context.close') ||
        trimmed.includes('await browser.close') ||
        trimmed.includes('page.goto')) {
      continue;
    }
    
    // Determine action first
    let action = 'unknown';
    let fillValue: string | undefined;
    
    if (trimmed.includes('.click()')) {
      action = 'click';
    } else if (trimmed.includes('.fill(')) {
      action = 'fill';
      const fillMatch = trimmed.match(/\.fill\(['"](.*)['"\]]/);
      fillValue = fillMatch ? fillMatch[1] : undefined;
    } else if (trimmed.includes('.selectOption(')) {
      action = 'selectOption';
      const selectMatch = trimmed.match(/\.selectOption\(['"](.*)['"\]]/);
      fillValue = selectMatch ? selectMatch[1] : undefined;
    } else if (trimmed.includes('.check()')) {
      action = 'check';
    } else if (trimmed.includes('.uncheck()')) {
      action = 'uncheck';
    } else {
      continue; // Skip lines without recognized actions
    }
    
    // Match page.getByRole, page.getByLabel, page.getByText, etc.
    const getByMatch = trimmed.match(/page\.(getBy\w+)\((.*?)\)/);
    if (getByMatch) {
      const method = getByMatch[1];
      const args = getByMatch[2];
      
      const locatorType = method.replace('getBy', '').toLowerCase();
      const locatorValue = args.replace(/['"]/g, '').split(',')[0].trim();
      
      const element: CapturedElement = {
        action,
        locatorType,
        locatorValue,
        fullLocator: `page.${method}(${args})`
      };
      
      if (fillValue !== undefined) {
        element.fillValue = fillValue;
      }
      
      elements.push(element);
      continue;
    }
    
    // Match page.locator() - captures remaining elements
    const locatorMatch = trimmed.match(/page\.locator\((.*?)\)/);
    if (locatorMatch) {
      const selector = locatorMatch[1];
      
      const element: CapturedElement = {
        action,
        locatorType: 'locator',
        locatorValue: selector.replace(/['"]/g, '').trim(),
        fullLocator: `page.locator(${selector})`
      };
      
      if (fillValue !== undefined) {
        element.fillValue = fillValue;
      }
      
      elements.push(element);
    }
  }

  return elements;
}

function deduplicateElements(elements: CapturedElement[]): CapturedElement[] {
  const deduped: CapturedElement[] = [];
  
  for (let i = 0; i < elements.length; i++) {
    const current = elements[i];
    const next = elements[i + 1];
    
    // Skip redundant click before fill on same element
    if (current.action === 'click' && 
        next && 
        next.action === 'fill' && 
        current.fullLocator === next.fullLocator) {
      continue; // Skip this click, keep the fill
    }
    
    // Skip consecutive duplicate actions on same element
    if (next && 
        current.action === next.action && 
        current.fullLocator === next.fullLocator &&
        current.fillValue === next.fillValue) {
      continue; // Skip duplicate
    }
    
    deduped.push(current);
  }
  
  return deduped;
}

capturePage();
