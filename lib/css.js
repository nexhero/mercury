function applyCssFromString(cssString) {
  // Create a <style> element
  const style = document.createElement('style');

  // Set the CSS content to the provided string
  style.textContent = cssString;

  // Append the <style> element to the <head> of the document
  document.head.appendChild(style);
}


export default applyCssFromString
