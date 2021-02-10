import React, { ReactElement, useContext } from "react";

import AuthContext from "./AuthContext";
import { Redirect } from "react-router-dom";

interface RedirectIfNotAuthenticatedProps {
    children: ReactElement;
}

const RedirectIfNotAuthenticated: React.FC<RedirectIfNotAuthenticatedProps> = (props: RedirectIfNotAuthenticatedProps) => {
    const { children } = props;
    const { user, logout } = useContext(AuthContext);
    const currentTime = Math.floor(Date.now() / 1000);

    if (user && user.exp && currentTime < user.exp) {
        return children;
    }

    logout();

    const href = window.location.pathname;
    const search = window.location.search;
    const redirect = `/login${href ? `?redirect_uri=${href}${search}` : ""}`;
    return <Redirect to={redirect} />;
};

export default RedirectIfNotAuthenticated;
