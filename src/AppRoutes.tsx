import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SimpleLoader from "./shared/SimpleLoader";
import RedirectIfNotAuthenticated from "./shared/RedirectIfNotAuthenticated";

const Login = lazy(() => import("./features/login/Login"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<SimpleLoader />}>
            <Switch>
                <Route path="/login" render={() => <Login />} />
                <Redirect to="/login" />
            </Switch>
        </Suspense>
    );
};

export default AppRoutes;
