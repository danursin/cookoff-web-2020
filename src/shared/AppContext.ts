import { Cookoff } from "../types";
import { createContext } from "react";

interface AppContextProps {
    userCookoffs?: Cookoff[];
    setUserCookoffs: (cookoffs: Cookoff[] | undefined) => void;
}

export default createContext<AppContextProps>({
    setUserCookoffs: () => {
        throw new Error("not implemented");
    }
});
