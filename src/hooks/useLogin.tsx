import { useCallback, useContext } from "react";

import AppContext from "../shared/AppContextProvider";
import { Participant } from "../types";
import axios from "axios";
import config from "../config";
import decode from "jwt-decode";
import { storeToken } from "../shared/StorageProvider";
import { useNavigate } from "react-router-dom";

interface UseLoginOutput {
    loginWithRedirect: (username: string) => Promise<void>;
}

const useLogin = (): UseLoginOutput => {
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const loginWithRedirect = useCallback(
        async (username: string) => {
            const url = `${config.cookoffApiUrl}/login`;
            const { data } = await axios.post(url, { Username: username }, { withCredentials: true });
            const token = data[config.accessTokenName];
            const user: Participant = decode(token);
            setUser(user);
            storeToken(token);
            navigate("/dashboard");
        },
        [navigate, setUser]
    );
    return {
        loginWithRedirect
    };
};

export default useLogin;
