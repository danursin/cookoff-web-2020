import { Grid } from "semantic-ui-react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
    return (
        <>
            <Navbar />
            <Grid centered padded>
                <Grid.Column mobile={16} computer={8}>
                    <Outlet />
                </Grid.Column>
            </Grid>
        </>
    );
};

export default Layout;
