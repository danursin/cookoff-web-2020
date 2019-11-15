import React from "react";
import { useState } from "react";
import Axios from "axios";
import { Form, Header, Image, Message } from "semantic-ui-react";
import pot from "../../img/pot.png";
import config from "../../config";
import { Participant } from "../../types";
import { useContext } from "react";
import AuthContext from "../../shared/AuthContext";
import { storeToken } from "../../shared/StorageProvider";
import { Redirect } from "react-router";

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
            const { data } = await Axios.post<{ access_token: string; participant: Participant }>(url, { Username: username });
            storeToken(data.access_token);
            setUser(data.participant);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return <Redirect to="dashboard" />;
    }

    return (
        <Form loading={loading} onSubmit={onSubmit}>
            <Header as="h1" textAlign="center" size="huge" image={<Image src={pot} size="small" />} content="Cookoff Pro" />

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
    );
};

export default Login;
