import { Cookoff, Participant } from "../../types";
import { Form, Header, Message } from "semantic-ui-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AppContext from "../../shared/AppContextProvider";
import UnauthenticatedLayout from "../../shared/UnauthenticatedLayout";
import axios from "axios";
import config from "../../config";
import decode from "jwt-decode";
import { storeToken } from "../../shared/StorageProvider";

const Register: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [eventCode, setEventCode] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>();
    const [cookoff, setCookoff] = useState<Cookoff>();
    const [phase, setPhase] = useState<"code" | "register">("code");
    const { setUser } = useContext(AppContext);

    const navigate = useNavigate();
    const [search] = useSearchParams();

    const lookupCode = useCallback(async (code: string) => {
        try {
            const url = `${config.cookoffApiUrl}/cookoff/code`;
            const { data } = await axios.get(url, { params: { code } });
            setCookoff(data);
            setPhase("register");
        } catch (err) {
            setErrorMessage(`Event Code "${code}" not recognized`);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const code = search.get("code");
            if (code) {
                await lookupCode(code);
            }
        })();
    }, [search]);

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage(undefined);
        if (phase === "code") {
            await lookupCode(eventCode);
        } else {
            try {
                const url = `${config.cookoffApiUrl}/cookoff/register`;
                const { data } = await axios.post(url, {
                    CookoffID: cookoff?.CookoffID,
                    Username: username,
                    Nickname: nickname || undefined
                });
                const token = data[config.accessTokenName];
                const user: Participant = decode(token);
                setUser(user);
                storeToken(token);
                navigate("/dashboard");
            } catch (err) {
                setErrorMessage(`Registration not successful`);
            }
        }
        setLoading(false);
    };

    return (
        <UnauthenticatedLayout>
            <Form onSubmit={handleSubmit} error={!!errorMessage} loading={loading}>
                <Message error content={errorMessage} onDismiss={() => setErrorMessage(undefined)} />
                {phase === "code" && (
                    <Form.Input
                        value={eventCode}
                        placeholder="Enter Event Code to Register"
                        label="Event Code"
                        required
                        onChange={(e, { value }) => setEventCode(value)}
                    />
                )}
                {phase === "register" && !!cookoff && (
                    <>
                        <Header content={`Register for ${cookoff.Title}`} icon="signup" />
                        <Form.Input
                            value={username}
                            placeholder="Create a username"
                            label="Username"
                            required
                            onChange={(e, { value }) => setUsername(value)}
                        />
                        <Form.Input
                            value={nickname}
                            placeholder="What should we call you?"
                            label="Nickname (optional)"
                            onChange={(e, { value }) => setNickname(value)}
                        />
                    </>
                )}
                <Form.Button type="submit" content={phase === "code" ? "Lookup Event Code" : "Register and Sign In"} fluid color="blue" />
            </Form>
        </UnauthenticatedLayout>
    );
};

export default Register;
