import { fluentFormArrayReducer } from "../src/hooks/fluent-form-array/state-manager/reducer";

describe("useFluentFormItem", () => {
  // for 100% coverage
  it("reducer returns current state when action type doesn't match any", () => {
    const currentState = { a: "just anything" } as any;
    const updatedState = fluentFormArrayReducer<any, any, any>(currentState, {
      type: "NOT_EXISTING_TYPE"
    } as any);

    expect(currentState).toBe(updatedState);
  });
});
