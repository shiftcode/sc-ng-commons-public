export function isInputElement(element: HTMLElement): element is HTMLInputElement {
  return element.nodeName.toLowerCase() === 'input'
}
