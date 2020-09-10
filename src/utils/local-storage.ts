export function localStorageSet<T>(
  key: string,
  value: PrimitiveType | (T & Record<string, unknown>),
) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localStorageGet<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  try {
    return JSON.parse(item ?? 'null');
  } catch (error) {
    return null;
  }
}

export function sessionStorageSet<T>(
  key: string,
  value: PrimitiveType | (T & Record<string, unknown>),
) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function sessionStorageGet<T>(key: string): T | null {
  const item = sessionStorage.getItem(key);
  try {
    return JSON.parse(item ?? 'null');
  } catch (error) {
    return null;
  }
}
