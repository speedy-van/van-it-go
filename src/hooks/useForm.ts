'use client';

import { useCallback, useState } from 'react';

interface UseFormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
}: {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
}) {
  const [state, setState] = useState<UseFormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: type === 'number' ? Number(value) : value,
        },
        touched: {
          ...prev.touched,
          [name]: true,
        },
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isSubmitting: true }));
      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error(error);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.values, onSubmit]
  );

  return {
    ...state,
    handleChange,
    handleSubmit,
    setFieldValue: (name: keyof T, value: T[keyof T]) => {
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
      }));
    },
  };
}
