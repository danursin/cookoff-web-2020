import { Grid, Header, Image } from "semantic-ui-react";

import { Link } from "react-router-dom";
import React from "react";
import pot from "../img/pot.png";

interface UnauthenticatedLayoutProps {
    children: React.ReactNode;
}

const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({ children }) => {
    return (
        <Grid centered padded>
            <Grid.Column mobile={16} computer={8}>
                <Header
                    as={Link}
                    to="/login"
                    style={{ display: "block" }}
                    textAlign="center"
                    size="huge"
                    image={<Image src={pot} size="small" />}
                    content="Cookoff Pro"
                />
                {children}
            </Grid.Column>
        </Grid>
    );
};

export default UnauthenticatedLayout;
