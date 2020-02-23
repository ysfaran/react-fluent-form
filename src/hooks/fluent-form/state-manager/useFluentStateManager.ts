import { useCallback, useReducer, useRef } from "react";

import {
  ExtractErrorsType,
  ExtractFieldsType,
  ExtractValuesType,
  FluentFormReducer,
  FluentFormState,
  FormConfig,
  FormConfigHelper,
  UseFluentStateManager
} from "../../..";
import { fluentFormReducer } from "./reducer";

export function useFluentStateManager<Config extends FormConfig>(
  config: Config
): UseFluentStateManager<Config> {
  type Values = ExtractValuesType<Config>;
  type Fields = ExtractFieldsType<Config>;
  type Errors = ExtractErrorsType<Config>;

  const formConfigHelperRef = useRef(new FormConfigHelper(config));
  const { current: formConfigHelper } = formConfigHelperRef;

  const { _context } = config;

  const intitalStateRef = useRef<FluentFormState<Values, Errors>>({
    values: formConfigHelper.getInitialValues(),
    touched: {},
    validity: {},
    errors: {} as Errors,
    context: _context,
    submitting: false
  });

  const [state, dispatch] = useReducer<FluentFormReducer<Values, Errors>>(
    fluentFormReducer,
    intitalStateRef.current
  );

  const setContext = useCallback((context: any) => {
    dispatch({ type: "SET_CONTEXT", payload: { context } });
  }, []);

  const setInitialValuesRef = useCallback((values: Partial<Values>) => {
    intitalStateRef.current.values = {
      ...intitalStateRef.current.values,
      ...values
    };
  }, []);

  const setSubmittingResult = useCallback((errors: Errors) => {
    dispatch({
      type: "FINISHED_SUBMITTING",
      payload: { errors: errors }
    });
  }, []);

  const setTouched = useCallback(
    <K extends keyof Fields>(field: K, touched: boolean) => {
      dispatch({ type: "SET_SINGLE_TOUCHED", payload: { field, touched } });
    },
    []
  );

  const setValidationFailure = useCallback(
    <K extends keyof Values>(field: K, error: Errors[K]) => {
      dispatch({
        type: "VALIDATION_FAILURE",
        payload: { field, error: error }
      });
    },
    []
  );

  const setValidationSuccess = useCallback(
    <K extends keyof Values>(field: K) => {
      dispatch({
        type: "VALIDATION_SUCCESS",
        payload: { field }
      });
    },
    []
  );

  const setValue = useCallback(
    <K extends keyof Values>(field: K, value: Values[K], touched?: boolean) => {
      dispatch({
        type: "VALUE_CHANGE",
        payload: { field, value, touched }
      });
    },
    []
  );

  const setValues = useCallback((values: Partial<Values>) => {
    dispatch({ type: "SET_VALUES", payload: { values } });
  }, []);

  const startSubmitting = useCallback(() => {
    dispatch({ type: "SUBMITTING" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET", payload: intitalStateRef.current });
  }, []);

  return {
    formConfigHelperRef,
    state,
    setContext,
    setInitialValuesRef,
    setSubmittingResult,
    setTouched,
    setValidationFailure,
    setValidationSuccess,
    setValue,
    setValues,
    startSubmitting,
    reset
  };
}
