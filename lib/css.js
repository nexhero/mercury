function applyCssFromString(cssString) {
  // Create a <style> element
  const style = document.createElement('style');

  // Set the CSS content to the provided string
  style.textContent = cssString;

  // Append the <style> element to the <head> of the document
  document.head.appendChild(style);
}
export function loadCSS(filename) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';  // Ensure it's set as a stylesheet
  link.type = 'text/css';   // Correct MIME type for CSS
  link.href = filename;

  link.onload = () => console.log(`${filename} loaded successfully.`);
  link.onerror = () => console.error(`Failed to load ${filename}.`);

  document.head.appendChild(link);
}


export default applyCssFromString
