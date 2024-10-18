/**
 * Function to check for the presence of a reCAPTCHA badge on the page.
 *
 * @async
 * @function isFoundReCaptchaBadge
 * @param {object} page - The page object (e.g., in Puppeteer) where the element will be searched.
 * @returns {Promise<boolean>} Returns a promise with a boolean value:
 * true if the reCAPTCHA badge is found, or false if not.
 *
 * @example
 * const isBadgePresent = await isFoundReCaptchaBadge(page);
 * console.log(isBadgePresent); // true or false
 */
async function isFoundReCaptchaBadge(page) {
  // Perform a search for the reCAPTCHA badge on the provided page
  const recaptchaBadge = await page.evaluate(() => {
    const badge = document.querySelector('iframe[src*="https://www.google.com/recaptcha/api2"]');
    return badge ? true : false;
  });

  return recaptchaBadge;
}

module.exports = { isFoundReCaptchaBadge };