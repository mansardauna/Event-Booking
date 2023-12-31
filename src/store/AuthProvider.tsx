import React, { createContext, ReactNode, useContext, useReducer } from "react";

interface Product {
  _id: number;
  img: string;
  name: string;
  price: number;
  quantity: number;
  calculatedPrice: number;
}

interface Booking {
  _id: number;
  startDate: any;
  endDate: any;
  username: string;
  event: string;
  name: string;
  price: number;
  TotalPrice: number;
  phoneNumber: string;
}

interface CanceledBooking {
  _id: number;
  startDate: any;
  endDate: any;
  username: string;
  event: string;
  name: string;
  price: number;
  TotalPrice: number;
  phoneNumber: string;
}

interface OrebiState {
  products: Product[];
  watchlist: Product[];
  orders: Product[];
  orderHistory: Booking[];
  canceledBookings: CanceledBooking[];
}

type StoreAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "INCREASE_QUANTITY"; payload: { _id: number } }
  | { type: "DECREASE_QUANTITY"; payload: { _id: number } }
  | { type: "DELETE_ITEM"; payload: number }
  | { type: "RESET_CART" }
  | { type: "ADD_TO_WATCHLIST"; payload: Product }
  | { type: "REMOVE_FROM_WATCHLIST"; payload: number }
  | { type: "ADD_ORDER"; payload: Product }
  | { type: "REMOVE_ORDER"; payload: number }
  | { type: "INCREASE_ORDER_QUANTITY"; payload: { _id: number } }
  | { type: "DECREASE_ORDER_QUANTITY"; payload: { _id: number } }
  | { type: "DELETE_ORDER"; payload: number }
  | { type: "RESET_ORDERS" }
  | { type: "ADD_TO_ORDER_HISTORY"; payload: Booking }
  | { type: "REMOVE_ORDER_HISTORY"; payload: number }
  | { type: "ADD_CANCELED_BOOKING"; payload: CanceledBooking }
  | { type: "REMOVE_CANCELED_BOOKING"; payload: number }
  | { type: "RESET_CANCELED_BOOKINGS" }
  | { type: "PAYMENT_SUCCESS"; payload: any }
  | { type: "SET_USER_DATA"; payload: any };

const initialState: OrebiState = {
  products: [],
  watchlist: [],
  orders: [],
  orderHistory: [],
  canceledBookings: [],
};

const StoreContext = createContext<{
  state: OrebiState;
  dispatch: React.Dispatch<StoreAction>;
} | undefined>(undefined);

export const ActionTypes = {
  ADD_TO_CART: "ADD_TO_CART",
  INCREASE_QUANTITY: "INCREASE_QUANTITY",
  DECREASE_QUANTITY: "DECREASE_QUANTITY",
  DELETE_ITEM: "DELETE_ITEM",
  RESET_CART: "RESET_CART",
  ADD_TO_WATCHLIST: "ADD_TO_WATCHLIST",
  REMOVE_FROM_WATCHLIST: "REMOVE_FROM_WATCHLIST",
  ADD_ORDER: "ADD_ORDER",
  REMOVE_ORDER: "REMOVE_ORDER",
  INCREASE_ORDER_QUANTITY: "INCREASE_ORDER_QUANTITY",
  DECREASE_ORDER_QUANTITY: "DECREASE_ORDER_QUANTITY",
  DELETE_ORDER: "DELETE_ORDER",
  RESET_ORDERS: "RESET_ORDERS",
  ADD_TO_ORDER_HISTORY: "ADD_TO_ORDER_HISTORY",
  REMOVE_ORDER_HISTORY: "REMOVE_ORDER_HISTORY",
  ADD_CANCELED_BOOKING: "ADD_CANCELED_BOOKING",
  REMOVE_CANCELED_BOOKING: "REMOVE_CANCELED_BOOKING",
  RESET_CANCELED_BOOKINGS: "RESET_CANCELED_BOOKINGS",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  SET_USER_DATA: "SET_USER_DATA",
} as const;

const storeReducer: React.Reducer<OrebiState, StoreAction> = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TO_WATCHLIST: {
      const updatedWatchlist = [...state.watchlist, action.payload];
      return { ...state, watchlist: updatedWatchlist };
    }

    case ActionTypes.REMOVE_FROM_WATCHLIST: {
      const updatedWatchlist = state.watchlist.filter((item) => item._id !== action.payload);
      return { ...state, watchlist: updatedWatchlist };
    }

    case ActionTypes.ADD_TO_ORDER_HISTORY: {
      const updateHistory = [...state.orderHistory, action.payload];
      return { ...state, orderHistory: updateHistory };
    }

    case ActionTypes.REMOVE_ORDER_HISTORY: {
      const updateHistory = state.orderHistory.filter((item) => item._id !== action.payload);
      return { ...state, orderHistory: updateHistory };
    }

    case ActionTypes.ADD_CANCELED_BOOKING: {
      const updatedCanceledBookings = [...state.canceledBookings, action.payload];
      return { ...state, canceledBookings: updatedCanceledBookings };
    }

    case ActionTypes.REMOVE_CANCELED_BOOKING: {
      const updatedCanceledBookings = state.canceledBookings.filter(
        (item) => item._id !== action.payload
      );
      return { ...state, canceledBookings: updatedCanceledBookings };
    }

    case ActionTypes.RESET_CANCELED_BOOKINGS: {
      return { ...state, canceledBookings: [] };
    }

    case ActionTypes.PAYMENT_SUCCESS: {
      // Handle the payment success action
      // For example, you can update the state accordingly
      return state;
    }

    case ActionTypes.SET_USER_DATA: {
      const updatedState = {
        ...state,
        watchlist: action.payload.watchlist || [],
        orders: action.payload.orders || [],
        orderHistory: action.payload.orderHistory || [],
        canceledBookings: action.payload.canceledBookings || [],
      };
      return updatedState;
    }

    // Add other cases for different actions

    default:
      return state;
  }
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const useStoreDispatch = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStoreDispatch must be used within a StoreProvider");
  }
  return context.dispatch;
};
