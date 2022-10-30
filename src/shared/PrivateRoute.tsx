/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext } from "react";

import AppContext from "./AppContextProvider";

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
    const { component: Component, ...rest } = props;

    const { user, logout } = useContext(AppContext);
    const currentTime = Math.floor(Date.now() / 1000);

    if (user && user.exp && currentTime < user.exp) {
        return <Component {...rest} />;
    }

    logout();

    const href = window.location.pathname;
    const search = window.location.search;
    const redirect = `/login${href ? `?redirect_uri=${href}${search}` : ""}`;
    window.location.href = redirect;
    return null;
};

export default PrivateRoute;
