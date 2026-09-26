import { createContext } from "react";

// Separate from AuthContext.jsx so that file exports only a component and keeps fast
// refresh. Not named authContext.js: on a case-insensitive filesystem that would shadow
// AuthContext.jsx for extensionless imports.
export const AuthContext = createContext();
