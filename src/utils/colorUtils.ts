/**
 * Converts oklch colors in the style attributes of HTML elements to rgb.
 * This function traverses the DOM and replaces oklch color values with their rgb equivalents.
 */
export const convertOklchColors = () => {
  const elements = document.querySelectorAll('*');

  elements.forEach((element: Element) => {
    if (element instanceof HTMLElement) {
      const style = element.style;
      for (let i = 0; i < style.length; i++) {
        const propertyName = style[i];
        const propertyValue = style.getPropertyValue(propertyName);

        if (propertyValue.includes('oklch')) {
          try {
            // Create a temporary element to compute the converted color
            const tempElement = document.createElement('div');
            tempElement.style.color = propertyValue;
            document.body.appendChild(tempElement); // Attach to the DOM to compute the style

            const computedColor = window.getComputedStyle(tempElement).color;
            element.style.setProperty(propertyName, computedColor);

            document.body.removeChild(tempElement); // Remove the temporary element
          } catch (error) {
            console.error(`Failed to convert oklch color for property ${propertyName}:`, error);
          }
        }
      }
    }
  });
};
