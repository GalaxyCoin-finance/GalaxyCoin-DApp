import React, {Fragment, lazy, Suspense} from "react";
import {
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import LoadingScreen from "./components/Root/LoadingScreen";
import {ROUTES_NAMES} from "./constants";

export const renderRoutes = (routes = []) => {
    return (
        <Suspense fallback={<LoadingScreen transparent style={{height: '100vh'}}/>}>
            <Switch>
                {
                    routes.map((route, i) => {
                        const Component = route.component;

                        return (
                            <Route
                                key={i}
                                path={route.path}
                                exact={route.exact}
                                render={(props) => (
                                    route.routes
                                        ? renderRoutes(route.routes)
                                        : <Component {...props} />
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
        path: ROUTES_NAMES.FARMS,
        //exact: true,
        component: lazy(() => import("./views/LandingPage"))
    },
    {
        path: ROUTES_NAMES.LAUNCHPAD,
        exact: true,
        component: lazy(() => import("./views/Launchpad"))
    },
    {
        path: ROUTES_NAMES.LOTTERY,
        exact: true,
        component: lazy(() => import("./views/Lottery"))
    },
    {
        path: "/",
        exact: true,
        component: () => <Redirect to={ROUTES_NAMES.FARMS}/>
    },
    {
        path: "*",
        exact: true,
        component: () => <Redirect to={ROUTES_NAMES.FARMS}/>
    }
];

export default routes;