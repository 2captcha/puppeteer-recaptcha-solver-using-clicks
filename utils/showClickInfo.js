/**
 * Creates a blue circle of 2x2 pixels with a 5px red round border at the specified coordinates,
 * displays the coordinates nearby with a semi-transparent gray background and the click number.
 *
 * @param {number} x - X-axis coordinate.
 * @param {number} y - Y-axis coordinate.
 */
function showClickInfo(x, y) {
  // Create a new div element (blue circle with red border)
  const marker = document.createElement('div');
  
  // Set styles for the circle
  marker.style.width = '2px';
  marker.style.height = '2px';
  marker.style.backgroundColor = 'blue'; // Blue color of the element
  marker.style.position = 'absolute';
  marker.style.left = `${x}px`; // Positioning along the X-axis
  marker.style.top = `${y}px`;  // Positioning along the Y-axis
  marker.style.border = '5px solid red'; // 5px red border
  marker.style.borderRadius = '50%'; // Round corners to create a circular shape
  marker.style.zIndex = '2000000001'; // High z-index to overlay frames (since captcha elements might be above others)
  marker.dataset.x = x; // Store X coordinate in data attribute
  marker.dataset.y = y; // Store Y coordinate in data attribute

  // Add the circle to the page
  document.body.appendChild(marker);
}

module.exports = { showClickInfo };