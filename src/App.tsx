import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Participant, Cookoff } from "./types";
import { clearToken, getToken } from "./shared/StorageProvider";
import decode from "jwt-decode";
import AuthContext from "./shared/AuthContext";
import { Grid } from "semantic-ui-react";
import AppRoutes from "./AppRoutes";
import Navbar from "./shared/Navbar";
import AppContext from "./shared/AppContext";

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
