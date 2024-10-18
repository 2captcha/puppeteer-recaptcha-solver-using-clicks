/**
 * Initializes a custom function within the captcha iframe to extract parameters.
 *
 * This function injects a [script](https://gist.github.com/kratzky/20ea5f4f142cec8f1de748b3f3f84bfc) that extracts the required parameters from the captcha page.
 * It creates a canvas to work with captcha images, extracts image tiles, and provides metadata like
 * rows, columns, and a base64-encoded image of the current captcha state.
 *
 * @async
 * @function initCaptchaParamsExtractor
 * @param {Object} frame - A puppeteer frame representing the reCAPTCHA iframe.
 * @returns {Promise<void>} This function doesn't return a value itself but adds a function (`getRecaptchaParams`)
 *                          into the frame context to extract captcha parameters.
 * @throws Will reject the promise if reCAPTCHA elements cannot be found on the page.
 */
const initCaptchaParamsExtractor = async function (frame) {
  // We inject a script that extracts the parameter found on the captcha page
  // The source code of the script is located here https://gist.github.com/kratzky/20ea5f4f142cec8f1de748b3f3f84bfc
  await frame.evaluate(() => {
    window.getRecaptchaParams = () => {
      return new Promise((resolve, reject) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let comment = document
          .querySelector(".rc-imageselect-desc-wrapper")
          .innerText.replaceAll("\n", " ");

        let img4x4 = document.querySelector("img.rc-image-tile-44");
        if (!img4x4) {
          let table3x3 = document.querySelector(
            "table.rc-imageselect-table-33 > tbody"
          );
          if (!table3x3) {
            reject("Can not find reCAPTCHA elements");
          }

          initial3x3img = table3x3.querySelector("img.rc-image-tile-33");

          canvas.width = initial3x3img.naturalWidth;
          canvas.height = initial3x3img.naturalHeight;
          ctx.drawImage(initial3x3img, 0, 0);

          let updatedTiles = document.querySelectorAll("img.rc-image-tile-11");

          if (updatedTiles.length > 0) {
            const pos = [
              { x: 0, y: 0 },
              { x: ctx.canvas.width / 3, y: 0 },
              { x: (ctx.canvas.width / 3) * 2, y: 0 },
              { x: 0, y: ctx.canvas.height / 3 },
              { x: ctx.canvas.width / 3, y: ctx.canvas.height / 3 },
              { x: (ctx.canvas.width / 3) * 2, y: ctx.canvas.height / 3 },
              { x: 0, y: (ctx.canvas.height / 3) * 2 },
              { x: ctx.canvas.width / 3, y: (ctx.canvas.height / 3) * 2 },
              { x: (ctx.canvas.width / 3) * 2, y: (ctx.canvas.height / 3) * 2 },
            ];
            updatedTiles.forEach((t) => {
              const ind =
                t.parentElement.parentElement.parentElement.tabIndex - 3;
              ctx.drawImage(t, pos[ind - 1].x, pos[ind - 1].y);
            });
          }
          resolve({
            rows: 3,
            columns: 3,
            type: "GridTask",
            comment,
            body: canvas
              .toDataURL()
              .replace(/^data:image\/?[A-z]*;base64,/, ""),
          });
        } else {
          canvas.width = img4x4.naturalWidth;
          canvas.height = img4x4.naturalHeight;
          ctx.drawImage(img4x4, 0, 0);
          resolve({
            rows: 4,
            columns: 4,
            comment,
            body: canvas
              .toDataURL()
              .replace(/^data:image\/?[A-z]*;base64,/, ""),
            type: "GridTask",
          });
        }
      });
    };
  });
};

module.exports = { initCaptchaParamsExtractor };
