/**
 * Check if the value is an instance of the class
 * @param value  The value to check
 * @param Class  The class to check
 * @returns True if the value is an instance of the class
 */
export function isInstanceof<T>(
  value: unknown,
  Class: abstract new (...args: unknown[]) => T
): value is T {
  return value instanceof Class;
}

/**
 * Check if the object has the property
 * @param obj target object
 * @param propName asserted property
 * @returns True if the object has the property
 */
export function hasProperty<T, K extends keyof T>(
  obj: T,
  propName: K
): obj is T & Record<K, NonNullable<T[K]>> {
  return obj[propName] !== null && obj[propName] !== undefined;
}
