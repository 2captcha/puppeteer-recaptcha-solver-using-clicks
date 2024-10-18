const puppeteer = require('puppeteer');
const { isFoundReCaptchaBadge } = require('./utils/isFoundReCaptchaBadge'); 
const { isFoundRecaptchaChallengeFrame } = require('./utils/isFoundRecaptchaChallengeFrame');
const { captchaSolver } = require('./captchaSolver')
const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

;(async () => {
  const launchOptions = {
    headless: false, 
    defaultViewport: null, // Setting full page visibility
    args: [
      // '--start-maximized', // Open the browser in full-screen mode
      '--lang=en-US', // Installing the English language
    ], 
  }
  // Launching the browser
  const browser = await puppeteer.launch(launchOptions);
  
  // Opening a new tab
  const pages = await browser.pages();
  const page = pages[0];


  // Setting the preferred language for pages
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });
  await sleep(10000);
  // Go to the page containing the captcha
  await page.goto('https://2captcha.com/demo/recaptcha-v2');

  await page.waitForSelector('iframe[title="reCAPTCHA"]', { timeout: 30000 });
  await sleep(5000);

  // Search for reCAPTCHA Badge on the page
  const isFoundReCaptcha = await isFoundReCaptchaBadge(page);

  // Checking whether the recaptcha is found on the page, if not, then we generate an error message
  if(isFoundReCaptcha) { 
    console.log(`reCAPTCHA Badge is found.`);
  } else {
    throw new Error('Error reCAPTCHA Badge not found! ');
  }

  // Getting a frame based on the content in the URL
  const recaptchaBadgeFrame = page.frames().find(frame => frame.url().includes('https://www.google.com/recaptcha/api2'));

  if (recaptchaBadgeFrame) {
    // Click on the button inside the frame (recaptcha checkbox)
    await recaptchaBadgeFrame.click('span.recaptcha-checkbox-unchecked'); 
    
    await sleep(5000); 

    // We check for the presence of a frame with a captcha task
    const isRecaptchaChallengeShow = await isFoundRecaptchaChallengeFrame(page);
    
    if(isRecaptchaChallengeShow) {
      console.log('reCAPTCHA iframe found!')
      // Solve captcha
      const isCaptchaSolved = await captchaSolver(page)

      if(isCaptchaSolved) {
        console.log('✅ The captcha has been successfully passed.')
      } else {
        console.log("ERROR_CAPTCHA_UNSOLVABLE");
        // Solve the captcha again
      }

    } else {
      console.log('The captcha frame was NOT FOUND')
      sleep(5000)
      browser.close()
    }

  } else {
    console.log('reCAPTCHA badge not found!');
  }

  // Click on button to check rerult
  await page.click('[data-action="demo_action"]')
  await sleep(5000)
  await browser.close();
})();