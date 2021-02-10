import "semantic-ui-css/semantic.min.css";

import { Cookoff, Participant } from "./types";
import React, { useState } from "react";
import { clearToken, getToken } from "./shared/StorageProvider";

import AppContext from "./shared/AppContext";
import AppRoutes from "./AppRoutes";
import AuthContext from "./shared/AuthContext";
import { Grid } from "semantic-ui-react";
import Navbar from "./shared/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import decode from "jwt-decode";

const App: React.FC = () => {
    const [user, setUser] = useState<Participant>();
    const [userCookoffs, setUserCookoffs] = useState<Cookoff[]>();
    const logout = () => {
        clearToken();
        setUser(undefined);
        setUserCookoffs(undefined);
    };

    if (!user) {
        const token = getToken();
        token && setUser(decode(token));
    }

    return (
        <Router>
            <AuthContext.Provider
                value={{
                    user,
                    setUser,
                    logout
                }}
            >
                <AppContext.Provider value={{ userCookoffs, setUserCookoffs }}>
                    <Navbar />
                    <Grid centered padded>
                        <Grid.Column mobile={16} computer={12}>
                            <AppRoutes />
                        </Grid.Column>
                    </Grid>
                </AppContext.Provider>
            </AuthContext.Provider>
        </Router>
    );
};

export default App;
