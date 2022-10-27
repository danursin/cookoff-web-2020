import "semantic-ui-css/semantic.min.css";

import { Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from "react";

import Layout from "./shared/Layout";
import PrivateRoute from "./shared/PrivateRoute";
import SimpleLoader from "./shared/SimpleLoader";

const CookoffDetails = lazy(() => import("./features/cookoff/Cookoff"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const Login = lazy(() => import("./features/login/Login"));
const Manage = lazy(() => import("./features/manage/Manage"));
const Register = lazy(() => import("./features/register/Register"));

const App: React.FC = () => {
    return (
        <Suspense fallback={<SimpleLoader />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute component={Layout} />}>
                    <Route path="cookoff/:id" element={<CookoffDetails />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="manage/:id" element={<Manage />} />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default App;
