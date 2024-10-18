const {getRandomNumber} = require("./getRandomNumber")
const { showClickInfo } = require('./showClickInfo'); 

/**
 * Clicks the reCAPTCHA verify button on the page.
 *
 * This function calculates the coordinates of the "Verify" button within the reCAPTCHA iframe
 * and performs a mouse click at the specified location. If `highlightClicks` is set to true,
 * it also visually highlights the click on the page.
 *
 * @param {Object} page - The Puppeteer page object containing the reCAPTCHA iframe.
 * @param {boolean} [highlightClicks=false] - Determines whether clicks should be visually highlighted on the page.
 */
const clickRecaptchaVerifyButton = async  (page, highlightClicks = false) => {
let w = 340 // the distance from the left border of the frame to the approximate location of the button click
let h = 540 // the distance from the upper border of the frame to the approximate location of the button click

  const element = await page.$('iframe[src*="https://www.google.com/recaptcha/api2/bframe"]'); 
  const boundingBox = await element.boundingBox();
  
  let x = boundingBox.x + w + getRandomNumber(1,35)
  let y = boundingBox.y + h + getRandomNumber(1,5)
  
  console.log(`Click on coordinates x:${x},y:${y}`)
  console.log('Click Verify/Skip')

  // Click on the specified coordinates
  await page.mouse.click(x, y);

    // Visualization of clicks when highlightClicks mode is enabled
  if (highlightClicks) {
    let clickCoordinatesToShow = { x: x, y: y };

    // Passing the showClickInfo function and coordinates
    await page.evaluate(({ click, showClickInfoFunc }) => {
      // Restoring the function via eval
      eval(showClickInfoFunc);

      // Calling the showClickInfo function with the passed coordinates
      showClickInfo(click.x, click.y, );
    }, {
      click: clickCoordinatesToShow,
      showClickInfoFunc: showClickInfo.toString() // Passing the function as a string
    });
  }
};

module.exports = { clickRecaptchaVerifyButton };
