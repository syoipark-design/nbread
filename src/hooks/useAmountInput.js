import { useState, useCallback } from 'react';

export function useAmountInput(min = 2, max = 1_000_000) {
  const [digits, setDigits] = useState([]);

  const rawValue = digits.length === 0 ? 0 : parseInt(digits.join(''), 10);

  const appendDigit = useCallback((d) => {
    setDigits(prev => {
      if (d === '0' && prev.length === 0) return prev;
      const next = [...prev, d];
      if (parseInt(next.join(''), 10) > max) return prev;
      return next;
    });
  }, [max]);

  const deleteDigit = useCallback(() => {
    setDigits(prev => prev.slice(0, -1));
  }, []);

  const reset = useCallback(() => setDigits([]), []);

  const setRawValue = useCallback((value) => {
    const clamped = Math.min(Math.floor(value), max);
    if (!clamped || clamped <= 0) { setDigits([]); return; }
    setDigits(String(clamped).split(''));
  }, [max]);

  const formattedAmount = rawValue === 0 ? '' : rawValue.toLocaleString('ko-KR');
  const isEmpty = digits.length === 0;
  const isValid = !isEmpty && rawValue >= min && rawValue <= max;

  return { rawValue, formattedAmount, isEmpty, isValid, appendDigit, deleteDigit, reset, setRawValue };
}
