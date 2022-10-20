import { Form, Grid, Header, Image, Message } from "semantic-ui-react";

import AppContext from "../../shared/AppContextProvider";
import Axios from "axios";
import { Participant } from "../../types";
import React from "react";
import SimpleLoader from "../../shared/SimpleLoader";
import config from "../../config";
import decode from "jwt-decode";
import pot from "../../img/pot.png";
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
        <Grid centered padded>
            <Grid.Column mobile={16} computer={8}>
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

                    {error && (
                        <Message negative icon="exclamation triangle" content="An error occurred. Check your username and try again" />
                    )}
                </Form>
            </Grid.Column>
        </Grid>
    );
};

export default Login;
