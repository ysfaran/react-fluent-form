import { useCallback, useMemo, useReducer, useRef } from "react";

import { FormConfig } from "./form-config/FormConfig";
import { FormConfigHelper } from "./form-config/FormConfigHelper";
import { useEffectIgnoreFirst } from "./misc/useEffectIgnoreFirst";
import { fluentFormReducer } from "./reducer";
import {
  ExtractErrorsType,
  ExtractFieldsType,
  ExtractValuesType,
  FluentFormReducer,
  FluentFormReturnType,
  FluentFormState,
  HandleSubmitOptions,
  MappedFields
} from "./types";

export const useFluentForm = <Config extends FormConfig>(
  config: Config
): FluentFormReturnType<Config> => {
  type Values = ExtractValuesType<Config>;
  type Fields = ExtractFieldsType<Config>;
  type Errors = ExtractErrorsType<Config>;

  const { _fields, _validator, _context, _validateOnContextChange } = config;

  const { current: formConfigHelper } = useRef(new FormConfigHelper(config));

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

  const setTouched = useCallback(
    <K extends keyof Fields>(field: K, touched: boolean) => {
      dispatch({ type: "SET_SINGLE_TOUCHED", payload: { field, touched } });
    },
    []
  );

  const setValues = useCallback((values: Partial<Fields>) => {
    dispatch({ type: "SET_VALUES", payload: { values } });
  }, []);

  const validateAllFields = useCallback(
    (context = state.context) => {
      if (_validator) {
        const errors = _validator.validateAllFields(state.values, context);
        dispatch({
          type: "FINISHED_SUBMITTING",
          payload: { errors: errors as Errors }
        });
      } else {
        dispatch({
          type: "FINISHED_SUBMITTING",
          payload: { errors: {} as Errors }
        });
      }
    },
    [state.values, state.context, _validator]
  );

  const setContext = useCallback(
    (context: any) => {
      dispatch({ type: "SET_CONTEXT", payload: { context } });
      if (_validateOnContextChange) {
        validateAllFields(context);
      }
    },
    [validateAllFields, _validateOnContextChange]
  );

  const validateField = useCallback(
    <K extends keyof Values>(field: K, value: Values[K]) => {
      if (!_validator) return;

      const error = _validator.validateField(
        field,
        {
          ...state.values,
          [field]: value
        },
        state.context
      );

      if (error !== undefined) {
        dispatch({
          type: "VALIDATION_FAILURE",
          payload: { field, error: error }
        });
      } else {
        dispatch({ type: "VALIDATION_SUCCESS", payload: { field } });
      }
    },
    [state.values, state.context, _validator]
  );

  const setInitialValues = useCallback((values: Values) => {
    intitalStateRef.current = { ...intitalStateRef.current, values };
  }, []);

  const handleChange = useCallback(
    <K extends keyof Values>(field: K, value: Values[K]) => {
      const triggerValidation = formConfigHelper.shouldValidateOnChange(
        field,
        state.touched[field]
      );

      dispatch({
        type: "VALUE_CHANGE",
        payload: { field, value, touched: triggerValidation || undefined }
      });

      if (triggerValidation) {
        validateField(field, value);
      }
    },
    [formConfigHelper, state.touched, validateField]
  );

  const handleTouched = useCallback(
    <K extends keyof Values>(field: K, value: boolean) => {
      if (state.touched[field] !== value) {
        setTouched(field, value);
      }

      const touchedNow = !state.touched[field];

      if (formConfigHelper.shouldValidateOnBlur(field, touchedNow)) {
        validateField(field, state.values[field]);
      }
    },
    [formConfigHelper, setTouched, state.touched, state.values, validateField]
  );

  const mappedFields = useMemo((): MappedFields<Fields> => {
    return (Object.keys(_fields) as Array<keyof Fields>).reduce(
      <K extends keyof Fields>(
        mappedObj: MappedFields<Fields>,
        key: K
      ): MappedFields<Fields> => {
        const setValueForField = (value: Values[K]) => {
          handleChange(key, value);
        };

        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        const setTouchedForField = (value: boolean = true) => {
          handleTouched(key, value);
        };
        return {
          ...mappedObj,
          [key]: _fields[key].mapToComponentProps({
            value: state.values[key],
            setValue: setValueForField,
            setTouched: setTouchedForField
          })
        };
      },
      {} as MappedFields<Fields>
    );
  }, [_fields, handleTouched, handleChange, state.values]);

  /* istanbul ignore next */
  const submitSuccessCallbackRef = useRef<Function>(() => undefined);
  /* istanbul ignore next */
  const submitFailureCallback = useRef<Function>(() => undefined);
  // this variable is needed (beside state.submitting) because state updates are async
  const submittingRef = useRef(false);

  useEffectIgnoreFirst(() => {
    if (state.submitting) {
      validateAllFields();
    } else {
      const failed = Object.values(state.errors).some(
        error => error !== undefined
      );

      const { current: success } = submitSuccessCallbackRef;
      const { current: failure } = submitFailureCallback;

      // calling the callbacks here will guarantee that state was updated
      failed ? failure() : success();
      submittingRef.current = false;
    }
    // eslint-disable-next-line
  }, [state.submitting]);

  const handleSubmit = useCallback(
    (
      success: Function = () => undefined,
      failure: Function = () => undefined,
      options: HandleSubmitOptions = {}
    ) => {
      submitSuccessCallbackRef.current = success;
      submitFailureCallback.current = failure;

      return (e?: any) => {
        const { preventDefault = true, stopPropagation = true } = options;

        if (typeof e === "object") {
          if (preventDefault && typeof e.preventDefault === "function") {
            e.preventDefault();
          }
          if (stopPropagation && typeof e.stopPropagation === "function") {
            e.stopPropagation();
          }
        }

        if (!submittingRef.current) {
          submittingRef.current = true;
          dispatch({ type: "SUBMITTING" });
        }
      };
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET", payload: intitalStateRef.current });
  }, []);

  return {
    ...state,
    fields: mappedFields,
    setValues,
    setInitialValues,
    setContext,
    handleSubmit,
    reset
  };
};
