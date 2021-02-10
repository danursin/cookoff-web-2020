import { Image, Menu } from "semantic-ui-react";
import React, { useContext } from "react";

import AuthContext from "./AuthContext";
import { Link } from "react-router-dom";
import pot from "../img/pot.png";

const Navbar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Menu fluid compact tabular>
            <Menu.Item
                as={Link}
                to="/dashboard"
                header
                content={
                    <>
                        <Image src={pot} style={{ height: "2rem", paddingRight: "1rem" }} />
                        {!!user && <span>Welcome {user.Name}</span>}
                    </>
                }
                position="left"
                style={{ paddingTop: 0, paddingBottom: 0 }}
            />
            <Menu.Menu position="right">{!!user && <Menu.Item content="Logout" icon="log out" link onClick={logout} />}</Menu.Menu>
        </Menu>
    );
};

export default Navbar;
