import { useCallback, useMemo } from "react";

import { FormArrayConfig } from "../../form-config/FormArrayConfig";
import {
  ExtractErrorsType,
  ExtractFieldsType,
  ExtractValuesType,
  FormKey,
  UseFluentArrayStateManager,
  UseFluentStateManager
} from "../../types";

export function useStateManagerMapper<Config extends FormArrayConfig>(
  key: FormKey,
  arrayStateManager: UseFluentArrayStateManager<Config>
): UseFluentStateManager<Config> {
  const {
    formArray,
    formConfigHelperRef,
    setContext: setContextWithKey,
    setInitialValuesRef: setInitialValuesRefWithKey,
    setSubmittingResult: setSubmittingResultWithKey,
    setTouched: setTouchedWithKey,
    setValidationFailure: setValidationFailureWithKey,
    setValidationSuccess: setValidationSuccessWithKey,
    setValue: setValueWithKey,
    setValues: setValuesWithKey,
    startSubmitting: startSubmittingWithKey,
    reset: resetWithKey
  } = arrayStateManager;

  const state = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => formArray.find(formItem => formItem.key === key)!,
    [key, formArray]
  );

  const setContext = useCallback(
    (context: any) => setContextWithKey(key, context),
    [key, setContextWithKey]
  );

  const setInitialValuesRef = useCallback(
    (values: Partial<ExtractValuesType<Config>>) =>
      setInitialValuesRefWithKey(key, values),
    [key, setInitialValuesRefWithKey]
  );

  const setSubmittingResult = useCallback(
    (errors: ExtractErrorsType<Config>) =>
      setSubmittingResultWithKey(key, errors),
    [key, setSubmittingResultWithKey]
  );

  const setTouched = useCallback(
    <K extends keyof ExtractFieldsType<Config>>(field: K, touched: boolean) =>
      setTouchedWithKey(key, field, touched),
    [key, setTouchedWithKey]
  );

  const setValidationFailure = useCallback(
    <K extends keyof ExtractValuesType<Config>>(
      field: K,
      error: ExtractErrorsType<Config>
    ) => setValidationFailureWithKey(key, field, error),
    [key, setValidationFailureWithKey]
  );

  const setValidationSuccess = useCallback(
    <K extends keyof ExtractValuesType<Config>>(field: K) =>
      setValidationSuccessWithKey(key, field),
    [key, setValidationSuccessWithKey]
  );

  const setValue = useCallback(
    <K extends keyof ExtractValuesType<Config>>(
      field: K,
      value: ExtractValuesType<Config>[K],
      touched?: boolean
    ) => setValueWithKey(key, field, value, touched),
    [key, setValueWithKey]
  );

  const setValues = useCallback(
    (values: Partial<ExtractValuesType<Config>>) =>
      setValuesWithKey(key, values),
    [key, setValuesWithKey]
  );

  const startSubmitting = useCallback(() => startSubmittingWithKey(key), [
    key,
    startSubmittingWithKey
  ]);

  const reset = useCallback(() => resetWithKey(key), [key, resetWithKey]);

  const fluentStateManager: UseFluentStateManager<Config> = useMemo(
    () => ({
      formConfigHelperRef,
      state,
      setContext,
      setInitialValuesRef,
      setSubmittingResult,
      setTouched: setTouched,
      setValidationFailure,
      setValidationSuccess,
      setValue,
      setValues,
      startSubmitting,
      reset
    }),
    [
      formConfigHelperRef,
      reset,
      setContext,
      setInitialValuesRef,
      setSubmittingResult,
      setTouched,
      setValidationFailure,
      setValidationSuccess,
      setValue,
      setValues,
      startSubmitting,
      state
    ]
  );

  return fluentStateManager;
}
