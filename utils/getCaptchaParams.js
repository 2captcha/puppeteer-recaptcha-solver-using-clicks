/**
 * Retrieves captcha parameters from the specified iframe.
 *
 *
 * The captcha parameters are retrieved by executing the previously defined function `window.getRecaptchaParams()` within the frame containing the captcha challenge.
 *
 * @param {Object} frame - The Puppeteer frame object containing the captcha.
 * @returns {Promise<Object>} - A promise that resolves to the captcha parameters.
 *
 * @example
 * {
 *   rows: 4,
 *   columns: 4,
 *   comment: 'Select all squares with buses If there are none, click skip',
 *   body: 'iVBORw0KGgoAAAANSUhEUgAzZGmJyeEUsQi4RQn6x0L6XnFGB944AEcOXZU1...',
 *   type: 'GridTask'
 * }
 */

// initCaptchaParamsExtractor
async function getCaptchaParams(frame) {
  // Get captcha parameters
  const result = await frame.evaluate(() => {
    return window.getRecaptchaParams();
  });
  console.log(result);
  return result;
}

module.exports = { getCaptchaParams };
