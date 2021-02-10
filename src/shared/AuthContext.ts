import { Participant } from "../types";
import { createContext } from "react";

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
