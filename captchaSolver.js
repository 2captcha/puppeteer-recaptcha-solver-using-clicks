const { getCaptchaParams } = require("./utils/getCaptchaParams");
const { clickAtCoordinates } = require('./utils/clickAtCoordinates');
const { clickRecaptchaVerifyButton } = require("./utils/clickRecaptchaVerifyButton");
const { isRecaptchaPassed } = require('./utils/isRecaptchaPassed');
const { initCaptchaParamsExtractor } = require('./utils/initCaptchaParamsExtractor')
const TwoCaptcha = require("@2captcha/captcha-solver");
const apikey = process.env.APIKEY; // Get the API key for the 2Captcha service from environment variables. You can set the `APIKEY` variable manually in this line.
const solver = new TwoCaptcha.Solver(apikey, 500);
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

// The basic logic of the captcha solution
const captchaSolver = async function (page) {
  // Set the value to `true` for visualization of clicks 
  const highlightClicks = false

  const frameHandle = await page.waitForSelector(
    'iframe[src*="https://www.google.com/recaptcha/api2/bframe"]'
  );
  let frame = await frameHandle.contentFrame();

  // Initialize the captcha parameter extraction function in the frame
  await initCaptchaParamsExtractor(frame)

  let isCaptchaNotSolved = true

  // The captcha solution cycle
  while(isCaptchaNotSolved){
    const captchaParams = await getCaptchaParams(frame);

    console.log(`Successfully fetched captcha parameters. recaptcha size is ${captchaParams.columns}*${captchaParams.rows}`);

    // Getting a captcha solution
    const answer = await solver.grid({
      body: captchaParams.body,
      textinstructions: captchaParams.comment,
      cols: captchaParams.columns,
      rows: captchaParams.rows,
      canSkip: 1,
      "img_type": "recaptcha", // TODO: add param to lib
    });

    const isCapthcaSolved = answer.status === 1;
    if (isCapthcaSolved) {
      console.log(`The answer for captcha ${answer.id} was received successfully`);
      console.log(answer);
      if(answer.data === 'No_matching_images'){
        // 'No_matching_images' - The captcha image does not contain images that meet the requirements. This means that the captcha has been solved.
        await sleep(1213)
        await clickRecaptchaVerifyButton(page)
      } 
    } else {
      // TODO:  when you get "ERROR_CAPTCHA_UNSOLVABLE" you can try to solve captcha again
      return false
    }

    // Parse the answer
    let clicks = answer.data.replace("click:", ""); // removing the "click:" line from the response
    clicks = clicks.split("/"); // '1/2/3/5/6/7' => ['1', '2', '3', '5', '6', '7']
    clicks = clicks.map(el => Number(el)) // String => Number

    console.log("Clicks:", clicks);

    const captchaSize = captchaParams.columns

    // Making clicks
    let timeToSleep = 100 // ms
    clicks.forEach(async (el, id) => {
      await sleep(timeToSleep * id); // delay (number of seconds of delay for each click)
      await clickAtCoordinates(page, captchaSize, el, highlightClicks);
    })
  
    await sleep(timeToSleep * (clicks.length + 1) + 2202) 
    await clickRecaptchaVerifyButton(page, highlightClicks)

    await sleep(3000);
    const isCaptchaSolved = await isRecaptchaPassed(page)
    isCaptchaNotSolved = !isCaptchaSolved
  }
  
  return true
};

module.exports = { captchaSolver };