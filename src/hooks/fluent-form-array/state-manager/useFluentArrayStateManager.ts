import { useCallback, useMemo, useReducer, useRef } from "react";

import { FormArrayConfig } from "../../../form-config/FormArrayConfig";
import { FormArrayConfigHelper } from "../../../form-config/FormArrayConfigHelper";
import { FormConfigHelper } from "../../../form-config/FormConfigHelper";
import {
  AddFormArgs,
  ExtractErrorsType,
  ExtractFieldsType,
  ExtractValuesType,
  FluentFormArrayReducer,
  FluentFormInitialStates,
  FluentFormState,
  FormArrayError,
  FormKey,
  UseFluentArrayStateManager
} from "../../../types";
import { fluentFormArrayReducer } from "./reducer";

export function useFluentArrayStateManager<Config extends FormArrayConfig>(
  config: Config
): UseFluentArrayStateManager<Config> {
  type Values = ExtractValuesType<Config>;
  type Fields = ExtractFieldsType<Config>;
  type Errors = ExtractErrorsType<Config>;

  const formArrayConfigHelperRef = useRef(new FormArrayConfigHelper(config));
  const { current: formArrayConfigHelper } = formArrayConfigHelperRef;

  const [state, dispatch] = useReducer<FluentFormArrayReducer<Values, Errors>>(
    fluentFormArrayReducer,
    {
      submitting: false,
      formArray: formArrayConfigHelper.getInitialArrayValues()
    }
  );
  const sortPositionCountRef = useRef(0);

  const formConfigHelperRef = useRef(new FormConfigHelper(config));
  const { current: formConfigHelper } = formConfigHelperRef;

  const { _context, _generateKey } = config;

  const initalStateRefs = useRef<FluentFormInitialStates<Config>>({});

  const uniqueKeyCounter = useRef(0);

  const getUniqueKey = useCallback(() => {
    while (true) {
      if (!state.formArray.hasOwnProperty(uniqueKeyCounter.current)) {
        return uniqueKeyCounter.current++;
      }
      uniqueKeyCounter.current++;
    }
  }, [state.formArray]);

  const addForm = useCallback(
    ({ initialValues, key }: AddFormArgs<Values> = {}) => {
      const initialState: FluentFormState<Values, Errors> = {
        values: { ...formConfigHelper.getInitialValues(), ...initialValues },
        touched: {},
        validity: {},
        errors: {} as Errors,
        context: _context,
        submitting: false
      };

      key =
        key ||
        (initialValues && _generateKey && _generateKey(initialValues)) ||
        getUniqueKey();

      initalStateRefs.current[key] = initialState;

      dispatch({
        type: "ADD_FORM",
        payload: {
          key,
          sortPosition: sortPositionCountRef.current++,
          initialState
        }
      });
    },
    [_context, _generateKey, formConfigHelper, getUniqueKey]
  );

  const removeForm = useCallback((key: FormKey) => {
    delete initalStateRefs.current[key];
    dispatch({
      type: "REMOVE_FORM",
      payload: { key }
    });
  }, []);

  const startSubmittingArray = useCallback(() => {
    dispatch({ type: "SUBMITTING_ARRAY" });
  }, []);

  const setSubmittingResultForArray = useCallback(
    (formArrayErrors: FormArrayError<Errors>) => {
      dispatch({
        type: "FINISHED_SUBMITTING_ARRAY",
        payload: { formArrayErrors }
      });
    },
    []
  );

  const setContext = useCallback((key: FormKey, context: any) => {
    dispatch({ type: "SET_CONTEXT", payload: { key, context } });
  }, []);

  const setInitialValuesRef = useCallback(
    (key: FormKey, values: Partial<Values>) => {
      initalStateRefs.current[key].values = {
        ...initalStateRefs.current[key].values,
        ...values
      };
    },
    []
  );

  const setSubmittingResult = useCallback((key: FormKey, errors: Errors) => {
    dispatch({
      type: "FINISHED_SUBMITTING",
      payload: { key, errors: errors }
    });
  }, []);

  const setTouched = useCallback(
    <K extends keyof Fields>(key: FormKey, field: K, touched: boolean) => {
      dispatch({
        type: "SET_SINGLE_TOUCHED",
        payload: { key, field, touched }
      });
    },
    []
  );

  const setValidationFailure = useCallback(
    <K extends keyof Values>(key: FormKey, field: K, error: Errors[K]) => {
      dispatch({
        type: "VALIDATION_FAILURE",
        payload: { key, field, error: error }
      });
    },
    []
  );

  const setValidationSuccess = useCallback(
    <K extends keyof Values>(key: FormKey, field: K) => {
      dispatch({
        type: "VALIDATION_SUCCESS",
        payload: { key, field }
      });
    },
    []
  );

  const setValue = useCallback(
    <K extends keyof Values>(
      key: FormKey,
      field: K,
      value: Values[K],
      touched?: boolean
    ) => {
      dispatch({
        type: "VALUE_CHANGE",
        payload: { key, field, value, touched }
      });
    },
    []
  );

  const setValues = useCallback((key: FormKey, values: Partial<Values>) => {
    dispatch({ type: "SET_VALUES", payload: { key, values } });
  }, []);

  const startSubmitting = useCallback((key: FormKey) => {
    dispatch({ type: "SUBMITTING", payload: { key } });
  }, []);

  const reset = useCallback(
    (key: FormKey) => {
      dispatch({
        type: "RESET",
        payload: { ...state.formArray[key], ...initalStateRefs.current[key] }
      });
    },
    [state.formArray]
  );

  const formsAsArrays = useMemo(
    () =>
      Object.values(state.formArray).sort(
        (a, b) => a.sortPosition - b.sortPosition
      ),
    [state.formArray]
  );

  return {
    submitting: state.submitting,
    formArray: formsAsArrays,
    formConfigHelperRef,
    formArrayConfigHelperRef,
    startSubmittingArray,
    setSubmittingResultForArray,
    initalStateRefs,
    setContext,
    setInitialValuesRef,
    setSubmittingResult,
    setTouched,
    setValidationFailure,
    setValidationSuccess,
    setValue,
    setValues,
    startSubmitting,
    reset,
    addForm,
    removeForm
  };
}
