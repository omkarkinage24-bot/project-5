import { useEffect, useState } from 'react';
export function useLocalStorage<T>(key: string, fallback: T, validate: (value: unknown) => value is T): [T, (next: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const json = localStorage.getItem(key);
      if (json === null) return fallback;
      const parsed: unknown = JSON.parse(json);
      return validate(parsed) ? parsed : fallback;
    } catch { return fallback; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Quota/privacy mode: current session still works. */ } }, [key, value]);
  return [value, setValue];
}
