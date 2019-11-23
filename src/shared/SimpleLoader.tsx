import React from "react";
import { Dimmer, Icon, Header } from "semantic-ui-react";

interface SimpleLoaderProps {
    message?: string;
}
const SimpleLoader = (props: SimpleLoaderProps) => {
    const { message } = props;
    return (
        <Dimmer active inverted inline="centered">
            <Header size="medium" color="grey" content={message || "Loading..."} icon={<Icon name="spoon" loading color="grey" />} />
        </Dimmer>
    );
};

export default SimpleLoader;
