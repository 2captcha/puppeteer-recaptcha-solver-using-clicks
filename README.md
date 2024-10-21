# How to solve captcha like a reCAPTCHA V2 using Puppeteer and clicks

This project shows how to automates [reCAPTCHA bypass] with image challenges (3x3 and 4x4) using the [2Captcha] service and [Puppeteer] lib. The script programmatically interacts with reCAPTCHA, retrieves data for solving, sends it to  [2Captcha] for processing, and then clicks on the captcha using the provided solution.

![Demonstration how to solve recaptcha using clicks](<./media/bypass_recaptcha_v2.gif>)

<!-- If you are using Python, then we also have a similar example for Python + Selenium, the example is located in the repository [reCAPTCHA Solver Using 2Captcha and Selenium]. -->

## Usage

```
git clone git@github.com/2captcha/puppeteer-recaptcha-solver-using-clicks.git
cd puppeteer-recaptcha-solver-using-clicks
npm i
npm run start
```

#### Configure:
Set the `APIKEY` environment variable. You can get the `APIKEY` value in your personal [2captcha account].

`export APIKEY=your_api_key`

## How it works

In this example, the [Grid] method is used to solve the captcha. The script extracts the original captcha image and other captcha parameters. Next, using the [Grid] method, the captcha is solved. After successfully solving the captcha, a response will be received, consisting of the cell numbers that need to be clicked. Using Puppeteer, mouse clicks are performed on the specified squares of the captcha. Then, to verify the result, the "Verify" button is clicked.

Example - successful result of the captcha data extraction script execution:
```js
{
  rows: 3,
  columns: 3,
  type: 'GridTask',
  comment: 'Select all images with crosswalks Click verify once there are none left',
  body: 'iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0...'
}
```

Example - captcha solution response using the Grid method:

```
{ status: 1, data: 'click:3/6/8', id: '77704464585' }
```

The received response `click:3/6/8` means that you need to click on the captcha squares numbered 3, 6, and 8. The counting of squares starts from the top left corner. In the screenshot below, you can visually see which squares need to be clicked for the response `click:3/6/8`.


Screenshot - visually answer `click:3/6/8`:
![Visually answer](./media/grid_answer.png)

Typically, to successfully solve a captcha, you need to solve around 1-5 challenges, but in more complex cases, there may be more tasks. 

You may also get a block from reCAPTCHA, which temporarily prevents you from solving reCAPTCHA.
When you get a temporary ban of reCAPTCHA, you will see the message `Try again later. You computer or network may be sending automated queries. To protect our users, we can't process your request right now...`.
An example of a message with a ban message is shown below in the screenshot.
In this case, you will need to change your IP or wait for 5-10 minutes.

Screenshot - blocking from reCAPTCHCA:
![reCAPTCHA ddos message](./media/recaptcha_dos_message.jpg)

## Advantages of this approach
The main advantage of this approach is that you don't have to figure out how to apply the token on the page.
Using this approach, you simply click on the correct squares, and click the check button, and after that the built-in logic of checking the reCAPTCHA response works out. 

The reCAPTCHA solution can be significantly complicated, for security purposes, sites can use additional parameters such as `datas` or implement complex token verification logic.
Using this click-through approach is ideal in cases where bypassing reCAPTCHA using token is intentionally difficult.

## Minuses of this approach
This approach has its own minuses, the minuses include:
- More code = more time.
- The price and speed of the solution may not be stable. It depends on how many  challanges(images) you will need to solve.  
- Browser automation is required for the reCAPTCHA code to work successfully. This is necessary for the built-in logic of applying the reCAPTCHA token to work properly.

---


#### Planned features
- Image update handler
- Implementation of clicks on selectors instead of coordinates
- Error handling `"ERROR_CAPTCHA_UNSOLVABLE"`

#### Usefull links:

- The script used to extract the captcha parameters https://gist.github.com/kratzky/20ea5f4f142cec8f1de748b3f3f84bfc
- Article [reCAPTCHA Recognition: bypass using grid method](https://2captcha.com/blog/recaptcha-recognition-using-grid-method)

[2Captcha]: https://2captcha.com/
[2captcha account]: https://2captcha.com/enterpage
[reCAPTCHA bypass]: https://2captcha.com/p/bypass-recaptcha
[Grid]: https://2captcha.com/2captcha-api#grid
[Puppeteer]: https://pptr.dev/
[reCAPTCHA Solver Using 2Captcha and Selenium]: https://github.com/2captcha/recaptcha-solver-using-grid
