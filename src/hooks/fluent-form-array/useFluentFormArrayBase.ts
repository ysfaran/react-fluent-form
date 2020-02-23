import { useCallback, useMemo } from "react";

import { FormArrayConfig } from "../../form-config/FormArrayConfig";
import {
  ExtractErrorsType,
  FormArrayError,
  FormKey,
  UseFluentArrayStateManager,
  UseFluentFormArray
} from "../../types";
import { useHandleSubmit } from "../helper/useHandleSubmit";

export function useFluentFormArrayBase<Config extends FormArrayConfig>(
  config: Config,
  stateManager: UseFluentArrayStateManager<Config>
): UseFluentFormArray<Config> {
  type Errors = ExtractErrorsType<Config>;

  const {
    formArray,
    submitting,
    startSubmittingArray,
    formConfigHelperRef,
    setSubmittingResultForArray
  } = stateManager;

  const validateAllForms = useCallback(() => {
    const formArrayErrors: FormArrayError<Errors> = {};

    for (const formItem of formArray) {
      formArrayErrors[
        formItem.key
      ] = formConfigHelperRef.current.getValidationResultForAllFields(
        formItem.values,
        formItem.context
      );
    }
    setSubmittingResultForArray(formArrayErrors);
  }, [formConfigHelperRef, formArray, setSubmittingResultForArray]);

  const valid = useMemo(
    () =>
      formArray.every(form =>
        Object.values(form.validity).every(validityValue => validityValue)
      ),
    [formArray]
  );

  const handleSubmit = useHandleSubmit({
    valid,
    submitting,
    startSubmitting: startSubmittingArray,
    submitAction: validateAllForms
  });

  const mappedFormArray = useMemo(
    () =>
      stateManager.formArray.map(form => ({
        key: form.key,
        stateManager,
        config
      })),
    [stateManager, config]
  );

  const getFormStateByKey = useCallback(
    (key: FormKey) => formArray.find(formItem => formItem.key === key),
    [formArray]
  );

  return {
    formArray: mappedFormArray,
    formStates: formArray,
    submitting,
    addForm: stateManager.addForm,
    removeForm: stateManager.removeForm,
    getFormStateByKey,
    handleSubmit
  };
}
