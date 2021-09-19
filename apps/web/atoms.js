import { atom, atomFamily } from "recoil";

export const currentUser = atom({
  key: "currentUser", // unique ID (with respect to other atoms/selectors)
  default: null
});
