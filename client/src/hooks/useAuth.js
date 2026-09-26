import { useContext } from "react";
import { AuthContext } from "../contexts/authContextObject";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "Context Error: useAuth must be used within the Auth Provider",
    );
  }
  return context;
};
