import React, { useContext } from "react";
import { Image, Menu } from "semantic-ui-react";
import pot from "../img/pot.png";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";

const Navbar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Menu fluid compact>
            <Menu.Item
                as={Link}
                to="/dashboard"
                header
                content={<Image src={pot} style={{ height: "2rem" }} />}
                position="left"
                style={{ paddingTop: 0, paddingBottom: 0 }}
            />
            <Menu.Menu position="right">
                {!!user && (
                    <>
                        <Menu.Item content={`Welcome ${user.Name}`} />
                        <Menu.Item content="Logout" icon="log out" link onClick={logout} />
                    </>
                )}
            </Menu.Menu>
        </Menu>
    );
};

export default Navbar;
