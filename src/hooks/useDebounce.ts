import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook that returns a debounced version of a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that provides debounced validation for form inputs
 * @param validateFn The validation function
 * @param delay The debounce delay in milliseconds (default: 300ms)
 */
export function useDebouncedValidation<T>(
  validateFn: (value: T) => { isValid: boolean; error: string | null },
  delay: number = 300
) {
  const [value, setValue] = useState<T | null>(null);
  const [result, setResult] = useState<{ isValid: boolean; error: string | null }>({
    isValid: false,
    error: null,
  });
  const [isValidating, setIsValidating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validate = useCallback(
    (newValue: T) => {
      setValue(newValue);
      setIsValidating(true);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced validation
      timeoutRef.current = setTimeout(() => {
        const validationResult = validateFn(newValue);
        setResult(validationResult);
        setIsValidating(false);
      }, delay);
    },
    [validateFn, delay]
  );

  // Immediate validation (for submit actions)
  const validateImmediate = useCallback(
    (newValue: T) => {
      // Clear any pending debounced validation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const validationResult = validateFn(newValue);
      setResult(validationResult);
      setIsValidating(false);
      return validationResult;
    },
    [validateFn]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    validate,
    validateImmediate,
    result,
    isValidating,
  };
}
