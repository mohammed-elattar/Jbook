import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
import { produce } from "immer";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.MOVE_CELL:
        const { id: cellId, direction } = action.payload;
        const index = state.order.findIndex((id) => cellId === id);
        const targetIndex = "up" === direction ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length) return state;

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = cellId;

        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;
      case ActionType.INSERT_CELL_BEFORE:
        const cell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: "",
        };
        state.data[cell.id] = cell;
        const foundIndex = state.order.findIndex(
          (cellId) => cellId === action.payload.type
        );

        if (-1 === foundIndex) {
          state.order.push(cell.id);
        } else {
          state.order.splice(foundIndex, 0, cell.id);
        }

        return state;
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((cellId) => cellId !== action.payload);
        return state;
      default:
        return state;
    }
  }
);

const randomId = (): string => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;
