import { Form, Header, Image, Message } from "semantic-ui-react";

import AuthContext from "../../shared/AuthContext";
import Axios from "axios";
import { Participant } from "../../types";
import React from "react";
import { Redirect } from "react-router";
import SimpleLoader from "../../shared/SimpleLoader";
import config from "../../config";
import decode from "jwt-decode";
import pot from "../../img/pot.png";
import { storeToken } from "../../shared/StorageProvider";
import { useContext } from "react";
import { useState } from "react";

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const { user, setUser } = useContext(AuthContext);

    const onSubmit = async () => {
        try {
            setError(false);
            setLoading(true);
            const url = `${config.cookoffApiUrl}/login`;
            const { data } = await Axios.post(url, { Username: username }, { withCredentials: true });
            const token = data[config.accessTokenName];
            const user: Participant = decode(token);
            setUser(user);
            storeToken(token);
        } catch (err) {
            console.error(err);
            setError(true);
            setLoading(false);
        }
    };

    if (user) {
        return <Redirect to="/dashboard" />;
    }

    if (loading) {
        return <SimpleLoader message="Logging you in..." />;
    }

    return (
        <>
            <Header as="h1" textAlign="center" size="huge" image={<Image src={pot} size="small" />} content="Cookoff Pro" />
            <Form onSubmit={onSubmit}>
                <Form.Input
                    placeholder="Username"
                    icon="user"
                    iconPosition="left"
                    value={username}
                    fluid
                    onChange={(e, { value }) => setUsername(value)}
                />

                <Form.Button color="blue" icon="sign in" type="submit" fluid disabled={!username} content="Login" />

                {error && <Message negative icon="exclamation triangle" content="An error occurred. Check your username and try again" />}
            </Form>
        </>
    );
};

export default Login;
