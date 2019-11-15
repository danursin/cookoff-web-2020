import { createContext } from "react";
import { Participant } from "../types";

interface AuthContextProps {
    user?: Participant;
    setUser: (user: Participant | undefined) => void;
    logout: () => void;
}

export default createContext<AuthContextProps>({
    setUser: () => {
        throw new Error("not implemented");
    },
    logout: () => {
        throw new Error("not implemented");
    }
});
