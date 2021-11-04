import { ActionType } from "../action-types";
import { Action } from "../actions";
import { produce } from "immer";

interface BundlesState {
  [key: string]: {
    loading: boolean;
    code: string;
    error: string;
  };
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        state[action.payload.cellId] = { loading: true, code: "", error: "" };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        const {
          cellId,
          bundle: { code, error },
        } = action.payload;
        state[cellId] = { loading: false, code, error };
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
