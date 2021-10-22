import React, { forwardRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";
import {Fade} from "@material-ui/core";

const Page = forwardRef(({ children, title = "", ...rest }, ref) => {

    return (
        <HelmetProvider>
            <div ref={ref} {...rest}>
                <Helmet>
                    <title>{"GALAXY | " + title}</title>
                </Helmet>
                <Fade direction={"up"} in={true} timeout={1000} mountOnEnter unmountOnExit>
                    <div>{children}</div>
                </Fade>
            </div>
        </HelmetProvider>
    );
});

Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
};

export default Page;
