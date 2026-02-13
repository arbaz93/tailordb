/**
 * Checks if an element or any of its children has a given property
 * @param {HTMLElement} element - The HTML element to check
 * @param {string} property - The property to look for
 * @returns {boolean} - True if element or any child has the property
 */

import React from 'react';
import type { ReactElement, ReactNode } from 'react';

/**
 * Recursively checks if a JSX element or its children has a specific tag name (like 'path', 'circle')
 */
function hasSvgChild(
  element: ReactElement<{ children?: ReactNode }, any>,
  type: string
): boolean {
  if (!React.isValidElement(element)) return false;
  // Check if the element itself matches the type
  if (typeof element.type === 'string' && element.type === type) return true;

  // Get children safely
  const children = element.props.children;
  if (!children) return false;

  // Normalize children to an array
  const childrenArray = Array.isArray(children) ? children : [children];

  // Recursively check children
  return childrenArray.some(
    (child) => React.isValidElement(child) && hasSvgChild(child as ReactElement<{ children?: ReactNode }, any>, type)
  );
}

/**
* Check if value type is Array
*/
function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}
/**
* Check if value type is Object
*/
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function goToTop() {
  if(window) {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // remove for instant jump
    });
  }
}
export { hasSvgChild, isArray, isPlainObject, goToTop };