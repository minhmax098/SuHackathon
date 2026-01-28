import { createContext } from "react";
import type { AuthContextType } from "./auth.types";

export const AuthCtx = createContext<AuthContextType | null>(null);
