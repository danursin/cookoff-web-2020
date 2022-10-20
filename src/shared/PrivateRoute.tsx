/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext } from "react";

import AppContext from "./AppContextProvider";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
    const { component: Component, ...rest } = props;

    const navigate = useNavigate();

    const { user, logout } = useContext(AppContext);
    const currentTime = Math.floor(Date.now() / 1000);

    if (user && user.exp && currentTime < user.exp) {
        // eslint-disable-next-line no-debugger
        debugger;
        return <Component {...rest} />;
    }

    // eslint-disable-next-line no-debugger
    debugger;
    logout();

    const href = window.location.pathname;
    const search = window.location.search;
    const redirect = `/login${href ? `?redirect_uri=${href}${search}` : ""}`;
    window.location.href = redirect;
    return null;
};

export default PrivateRoute;
