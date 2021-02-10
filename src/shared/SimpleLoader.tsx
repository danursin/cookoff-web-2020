import { Dimmer, Header, Icon } from "semantic-ui-react";

import React from "react";

interface SimpleLoaderProps {
    message?: string;
}
const SimpleLoader: React.FC<SimpleLoaderProps> = (props: SimpleLoaderProps) => {
    const { message } = props;
    return (
        <Dimmer active inverted inline="centered">
            <Header size="medium" color="grey" content={message || "Loading..."} icon={<Icon name="spoon" loading color="grey" />} />
        </Dimmer>
    );
};

export default SimpleLoader;
