/**
 * Zustand store for managing login state
 */

import { create } from "zustand";

/* ----------------------------- Types ---------------------------------- */

/**
 * Information about user login
 */
type LoginInfo = {
  username: string;
  password: string;
  status: string | number;      // e.g., "102" = loading, 200 = success
  statusMessage: string;        // e.g., "signed in" or error messages
};

/**
 * Store type
 */
type LoginStore = {
  loginInfo: LoginInfo;

  /**
   * Updates loginInfo in the store.
   * Can accept either:
   * - A full LoginInfo object to overwrite state
   * - A function that receives previous state and returns new state
   */
  setLoginInfo: (
    fnOrObject: LoginInfo | ((prev: LoginInfo) => LoginInfo)
  ) => void;
};

/* ----------------------------- Store ---------------------------------- */

export const useLoginStore = create<LoginStore>((set) => ({
  /* Initial login state */
  loginInfo: {
    username: "",
    password: "",
    status: "",
    statusMessage: "",
  },

  /* Update function */
  setLoginInfo: (fnOrObject) =>
    set((state) => ({
      loginInfo:
        typeof fnOrObject === "function"
          ? fnOrObject(state.loginInfo) // functional update
          : fnOrObject,                // direct object update
    })),
}));
