import { create } from 'zustand';

type LoginInfo = {
  username: string;
  password: string;
  status: string;
  statusMessage: string;
};

type LoginStore = {
  loginInfo: LoginInfo;
  setLoginInfo: (
    fnOrObject:
      | LoginInfo
      | ((prev: LoginInfo) => LoginInfo)
  ) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  loginInfo: {
    username: '',
    password: '',
    status: '',
    statusMessage: '',
  },

  setLoginInfo: (fnOrObject) =>
    set((state) => ({
      loginInfo:
        typeof fnOrObject === 'function'
          ? fnOrObject(state.loginInfo)
          : fnOrObject,
    })),
}));
