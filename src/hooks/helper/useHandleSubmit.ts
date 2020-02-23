import { useCallback, useRef } from "react";

import { HandleSubmit, HandleSubmitOptions, UseHandleSubmitArgs } from "../..";
import { useEffectIgnoreFirst } from "./useEffectIgnoreFirst";

export const useHandleSubmit = ({
  submitting,
  valid,
  startSubmitting,
  submitAction
}: UseHandleSubmitArgs) => {
  /* istanbul ignore next */
  const submitSuccessCallbackRef = useRef<Function>(() => undefined);
  /* istanbul ignore next */
  const submitFailureCallback = useRef<Function>(() => undefined);
  // this variable is needed (beside state.submitting) because state updates are async
  const submittingRef = useRef(false);

  useEffectIgnoreFirst(() => {
    if (submitting) {
      submitAction();
    } else {
      const { current: success } = submitSuccessCallbackRef;
      const { current: failure } = submitFailureCallback;

      // calling the callbacks here will guarantee that state was updated
      valid ? success() : failure();
      submittingRef.current = false;
    }
    // eslint-disable-next-line
  }, [submitting]);

  const handleSubmit: HandleSubmit = useCallback(
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
          startSubmitting();
        }
      };
    },
    [startSubmitting]
  );

  return handleSubmit;
};
