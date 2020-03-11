import { useCallback, useMemo } from "react";

import { FormConfig } from "../../form-config/FormConfig";
import {
  ExtractFieldsType,
  ExtractValuesType,
  MappedFields,
  UseFluentForm,
  UseFluentStateManager
} from "../../types";
import { useHandleSubmit } from "../helper/useHandleSubmit";

export function useFluentFormBase<Config extends FormConfig>(
  config: Config,
  fluentStateManager: UseFluentStateManager<Config>
): UseFluentForm<Config> {
  type Values = ExtractValuesType<Config>;
  type Fields = ExtractFieldsType<Config>;

  const {
    formConfigHelperRef: { current: formConfigHelper },
    state,
    setContext: setContextState,
    setInitialValuesRef,
    setSubmittingResult,
    setTouched,
    setValidationFailure,
    setValidationSuccess,
    setValue,
    setValues,
    startSubmitting,
    reset
  } = fluentStateManager;

  const { _validateOnContextChange } = config;

  const validateAllFields = useCallback(
    (context = state.context) => {
      const errors = formConfigHelper.getValidationResultForAllFields(
        state.values,
        context
      );
      setSubmittingResult(errors);
      return errors;
    },
    [formConfigHelper, setSubmittingResult, state.values, state.context]
  );

  const setContext = useCallback(
    (context: any) => {
      setContextState(context);
      if (_validateOnContextChange) {
        validateAllFields(context);
      }
    },
    [setContextState, validateAllFields, _validateOnContextChange]
  );

  const validateField = useCallback(
    <K extends keyof Values>(field: K, value: Values[K]) => {
      const error = formConfigHelper.getValidationResultForField(
        field,
        value,
        state.values,
        state.context
      );
      if (error !== undefined) {
        setValidationFailure(field, error);
      } else {
        setValidationSuccess(field);
      }
    },
    [
      formConfigHelper,
      state.values,
      state.context,
      setValidationFailure,
      setValidationSuccess
    ]
  );

  const handleChange = useCallback(
    <K extends keyof Values>(field: K, value: Values[K]) => {
      const triggerValidation = formConfigHelper.shouldValidateOnChange(
        field,
        state.touched[field]
      );

      setValue(field, value, triggerValidation || undefined);

      if (triggerValidation) {
        validateField(field, value);
      }
    },
    [formConfigHelper, setValue, state.touched, validateField]
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

  const valid = useMemo(
    () => Object.values(state.validity).every(validityValue => validityValue),
    [state.validity]
  );

  const handleSubmit = useHandleSubmit({
    submitting: state.submitting,
    valid,
    startSubmitting,
    submitAction: validateAllFields
  });

  const mappedFields = useMemo((): MappedFields<Fields> => {
    return formConfigHelper.getMappedFields(
      state.values,
      handleTouched,
      handleChange
    );
  }, [formConfigHelper, state.values, handleTouched, handleChange]);

  return {
    ...state,
    fields: mappedFields,
    setValues,
    setInitialValues: setInitialValuesRef,
    setContext,
    handleSubmit,
    reset
  };
}
