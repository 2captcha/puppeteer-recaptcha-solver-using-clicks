/**
 * Checks if the reCAPTCHA has been successfully passed on the page.
 *
 * This function iterates through the frames of the page to determine if reCAPTCHA
 * has been successfully completed by looking for the presence of the element with 'recaptcha-checkbox-checked' class.
 *
 * @param {Object} page - The Puppeteer page object containing the reCAPTCHA.
 * @returns {Promise<boolean>} - A promise that resolves to true if reCAPTCHA is passed, otherwise false.
 */
async function isRecaptchaPassed(page) {
    // Select iframe that contains reCAPTCHA
    const frames = await page.frames();
    
    for (let frame of frames) {
        // Check for the presence of an element with the 'recaptcha-checkbox-checked' class
        // The presence of this element means that the captcha has been successfully completed
        const isChecked = await frame.$('.recaptcha-checkbox-checked') !== null;
        
        if (isChecked) {
            return true; 
        }
    }
    
    return false;
}


module.exports = { isRecaptchaPassed };



