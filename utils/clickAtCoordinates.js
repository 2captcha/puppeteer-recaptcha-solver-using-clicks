const { showClickInfo } = require('./showClickInfo');
const { getRandomNumber } = require('./getRandomNumber')

/**
 * Performs clicks on the reCAPTCHA on the page.
 *
 * This function calculates the coordinates needed to click the required square in the reCAPTCHA challenge.
 * After calculating the coordinates, it performs a mouse click on the specified coordinates.
 *
 * @param {Object} page - The page containing the reCAPTCHA iframe.
 * @param {string} recaptchaSize - The size of the reCAPTCHA grid. Can be '3x3' or '4x4'.
 * @param {number} number - The number of the square to click, starting from the top-left square.
 * @param {boolean} [highlightClicks=false] - Determines whether clicks should be visually highlighted on the page.
 */
const clickAtCoordinates = async (page, recaptchaSize=3, number=1, highlightClicks=false) => {

  const element = await page.$('iframe[src*="https://www.google.com/recaptcha/api2/bframe"]'); // iframe containing the recaptcha task
  const boundingBox = await element.boundingBox(); // calculating the coordinates of the frame

  // x - horizontal distance from the starting point of the browser
  // y - vertical distance from the starting point of the browser
  let x = boundingBox.x
  let y = boundingBox.y

  if(recaptchaSize===3){
    switch(number){
      case 1:
        x = x + 60
        y = y + 120 + 65
        break; 
      case 2:
        x = x + 60 + 130
        y = y + 120 + 65
        break;
      case 3:
        x = x + 60 + 130 + 130
        y = y + 120 + 65
        break;
      case 4:
        x = x + 60
        y = y + 120 + 130 + 65
        break;
      case 5:
        x = x + 60 + 130
        y = y + 120 + 130 + 65
        break;
      case 6:
        x = x + 60 + 130 + 130
        y = y + 120 + 130 + 65
        break;
      case 7:
        x = x + 60
        y = y + 120 + 130 + 130 + 65
        break;
      case 8:
        x = x + 60 + 130
        y = y + 120 + 130 + 130 + 65
        break;
      case 9:
        x = x + 60 + 130 + 130
        y = y + 120 + 130 + 130 + 65
        break;
    }
  }

  if(recaptchaSize===4){
    let heigthTop = 130
    let width = 95
    switch(number){
      case 1:
        x = x + 45
        y = y + 45 + heigthTop
        break; 
      case 2:
        x = x + 45 + width
        y = y + 45 + heigthTop
        break;
      case 3:
        x = x + 45 + width*2
        y = y + 45 + heigthTop
        break;
      case 4:
        x = x + 45 + width*3
        y = y + 45 + heigthTop
        break;


      case 5:
        x = x + 45
        y = y + 45 + heigthTop + width
        break;
      case 6:
        x = x + 45 + width
        y = y + 45 + heigthTop + width
        break;
      case 7:
        x = x + 45 + width*2
        y = y + 45 + heigthTop + width 
        break;
      case 8:
        x = x + 45 + width*3
        y = y + 45 + heigthTop + width
        break;


      case 9:
        x = x + 45
        y = y + 45 + heigthTop + width*2
        break;
      case 10:
        x = x + 45 + width
        y = y + 45 + heigthTop + width*2
        break;
      case 11:
        x = x + 45 + width*2
        y = y + 45 + heigthTop + width*2
        break;
      case 12:
        x = x + 45 + width*3
        y = y + 45 + heigthTop + width*2
        break;


      case 13:
        x = x + 45
        y = y + 45 + heigthTop + width*3
        break;
      case 14:
        x = x + 45 + width
        y = y + 45 + heigthTop + width*3
        break;
      case 15:
        x = x + 45 + width*2
        y = y + 45 + heigthTop + width*3
        break;
      case 16:
        x = x + 45 + width*3
        y = y + 45 + heigthTop + width*3
        break;
    }
  }

  // We get the coordinates of the center of the element
  // const x = boundingBox.x + boundingBox.width / 2;
  // const y = boundingBox.y + boundingBox.height / 2;

  // Adding randomness to coordinates
  x = x + getRandomNumber(1,5)
  y = y + getRandomNumber(1,5)
  console.log(`Click on coordinates x:${x },y:${y}`)
  await page.mouse.click(x , y);


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
}

module.exports = { clickAtCoordinates };