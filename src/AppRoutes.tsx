import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import RedirectIfNotAuthenticated from "./shared/RedirectIfNotAuthenticated";
import SimpleLoader from "./shared/SimpleLoader";

const Cookoff = lazy(() => import("./features/cookoff/Cookoff"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const Login = lazy(() => import("./features/login/Login"));
const Manage = lazy(() => import("./features/manage/Manage"));

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<SimpleLoader />}>
            <Switch>
                <Route path="/cookoff/:id" render={(props) => <RedirectIfNotAuthenticated children={<Cookoff {...props} />} />} />
                <Route path="/dashboard" render={() => <RedirectIfNotAuthenticated children={<Dashboard />} />} />
                <Route path="/manage/:id" render={(props) => <RedirectIfNotAuthenticated children={<Manage {...props} />} />} />
                <Route path="/login" render={() => <Login />} />
                <Redirect to="/login" />
            </Switch>
        </Suspense>
    );
};

export default AppRoutes;
