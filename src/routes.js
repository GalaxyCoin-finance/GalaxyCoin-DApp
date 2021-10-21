import React, {Fragment, lazy, Suspense} from "react";
import {
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import {ROUTES_NAMES} from "./constants";
import MainLayout from "./layout/MainLayout";

export const renderRoutes = (routes = []) => {
    return (
        <Suspense fallback={<LoadingScreen/>}>
            <Switch>
                {
                    routes.map((route, i) => {
                        const Layout = route.layout || Fragment;
                        const Component = route.component;

                        return (
                            <Route
                                key={i}
                                path={route.path}
                                exact={route.exact}
                                render={(props) => (
                                    <Layout>
                                        {
                                            route.routes
                                                ? renderRoutes(route.routes)
                                                : <Component {...props} />
                                        }
                                    </Layout>
                                )}
                            />
                        );
                    })
                }
            </Switch>
        </Suspense>
    );
};

const routes = [
    {
        path: ROUTES_NAMES.HOME,
        exact: true,
        layout: MainLayout,
        component: lazy(() => import("./views/LandingPage"))
    },
    {
        path: "/",
        exact: true,
        component: () => <Redirect to={ROUTES_NAMES.HOME}/>
    },
    {
        path: "*",
        exact: true,
        component: () => <Redirect to={ROUTES_NAMES.HOME}/>
    }
];

export default routes;