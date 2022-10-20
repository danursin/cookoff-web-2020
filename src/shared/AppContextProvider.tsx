import { Cookoff, Participant } from "../types";
import React, { createContext, useCallback, useState } from "react";
import { clearToken, getToken } from "./StorageProvider";

import decode from "jwt-decode";

interface AppContextProps {
    user?: Participant;
    setUser: (user: Participant | undefined) => void;
    logout: () => void;
    userCookoffs?: Cookoff[];
    setUserCookoffs: (cookoffs: Cookoff[] | undefined) => void;
}

const AppContext = createContext<AppContextProps>({
    setUser: () => {
        throw new Error("not implemented");
    },
    logout: () => {
        throw new Error("not implemented");
    },
    setUserCookoffs: () => {
        throw new Error("not implemented");
    }
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Participant | undefined>(() => {
        const token = getToken();
        if (token) {
            return decode(token);
        }
    });
    const [userCookoffs, setUserCookoffs] = useState<Cookoff[]>();

    const logout = useCallback(() => {
        clearToken();
        setUser(undefined);
        setUserCookoffs(undefined);
    }, []);

    return <AppContext.Provider value={{ user, setUser, logout, userCookoffs, setUserCookoffs }}>{children}</AppContext.Provider>;
};

export default AppContext;
