import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface SimpleLoaderProps {
    message?: string;
}
const SimpleLoader = (props: SimpleLoaderProps) => {
    const { message } = props;
    return (
        <Dimmer active inverted inline="centered">
            <Loader inline>{message || "Loading..."}</Loader>
        </Dimmer>
    );
};

export default SimpleLoader;
