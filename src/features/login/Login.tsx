import { Form, Header, Message } from "semantic-ui-react";

import AppContext from "../../shared/AppContextProvider";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Participant } from "../../types";
import React from "react";
import SimpleLoader from "../../shared/SimpleLoader";
import UnauthenticatedLayout from "../../shared/UnauthenticatedLayout";
import config from "../../config";
import decode from "jwt-decode";
import { storeToken } from "../../shared/StorageProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

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
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(true);
            setLoading(false);
        }
    };

    if (loading) {
        return <SimpleLoader message="Logging you in..." />;
    }

    return (
        <UnauthenticatedLayout>
            <Header as="h4">
                Have an event code?
                <Link to="/register"> Click to register!</Link>
            </Header>
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
        </UnauthenticatedLayout>
    );
};

export default Login;
