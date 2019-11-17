import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SimpleLoader from "./shared/SimpleLoader";
import RedirectIfNotAuthenticated from "./shared/RedirectIfNotAuthenticated";

const Cookoff = lazy(() => import("./features/cookoff/Cookoff"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const Login = lazy(() => import("./features/login/Login"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<SimpleLoader />}>
            <Switch>
                <Route path="/cookoff/:id" render={props => <RedirectIfNotAuthenticated children={<Cookoff {...props} />} />} />
                <Route path="/dashboard" render={() => <RedirectIfNotAuthenticated children={<Dashboard />} />} />
                <Route path="/login" render={() => <Login />} />
                <Redirect to="/login" />
            </Switch>
        </Suspense>
    );
};

export default AppRoutes;
