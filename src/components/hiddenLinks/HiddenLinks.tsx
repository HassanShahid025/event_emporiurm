import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const ShowOnLogin = ({ children }: any) => {
  const { isLoggedIn } = useSelector((store: RootState) => store.auth);

  if (isLoggedIn) {
    return  children ;
  }
  return null;
};

export const ShowOnLogout = ({ children }: any) => {
  const { isLoggedIn } = useSelector((store: RootState) => store.auth);

  if (!isLoggedIn) {
    return  children ;
  }
  return null;
};
