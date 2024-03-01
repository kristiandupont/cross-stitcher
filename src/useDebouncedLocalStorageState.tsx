import { useEffect, useState } from "react";

function useDebouncedLocalStorageState<T>(
  key: string,
  defaultValue: T,
  delay = 500
): [T, (value: T) => void] {
  // Retrieve initial value from local storage or use default
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  // Debounce logic to update local storage
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, key, delay]);

  return [value, setValue] as const;
}

export default useDebouncedLocalStorageState;
