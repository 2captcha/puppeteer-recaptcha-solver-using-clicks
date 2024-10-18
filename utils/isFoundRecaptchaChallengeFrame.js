/**
 * Checks for the presence of a reCAPTCHA challenge frame on the page.
 *
 * @async
 * @function isFoundRecaptchaChallengeFrame
 * @param {object} page - The page instance (e.g., Puppeteer Page object) where the reCAPTCHA frame will be searched.
 * @returns {Promise<boolean>} Returns `true` if the reCAPTCHA frame is found, otherwise returns `false`.
 * 
 * @example
 * const { isFoundRecaptchaChallengeFrame } = require('./yourFilePath');
 *
 * (async () => {
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *
 *   const isRecaptchaChallengePresent = await isFoundRecaptchaChallengeFrame(page);
 *   if (isRecaptchaChallengePresent) {
 *     console.log('reCAPTCHA Challenge frame found on the page.');
 *   } else {
 *     console.log('No reCAPTCHA Challenge frame found on the page.');
 *   }
 * })();
 */
async function isFoundRecaptchaChallengeFrame(page) {
  try {
    // Wait for the reCAPTCHA iframe to appear
    const frameHandle = await page.waitForSelector('iframe[src*="https://www.google.com/recaptcha/api2/bframe"]', { timeout: 5000 });
    
    if (!frameHandle) {
      return false; // Frame not found
    }

    const frame = await frameHandle.contentFrame();

    if (!frame) {
      return false; // Unable to get the content frame
    }

    // Check for the presence of the DOS message
    const isFoundDosMessage = await frame.evaluate(() => {
      const dosMessageElement = document.querySelector('.rc-doscaptcha-header');
      return dosMessageElement ? true : false;
    });

    if (isFoundDosMessage) {
      console.log("Error message: 'Try again later. Your computer or network may be sending automated queries. To protect our users, we can't process your request right now. For more details visit'");
      console.log("To get the captcha, you need to change your IP address");
      return false;
    }

    // If no DOS message, return true indicating the frame is found
    return true;
  } catch (error) {
    console.error('An error occurred while searching for the reCAPTCHA frame:', error);
    return false;
  }
}

module.exports = { isFoundRecaptchaChallengeFrame };