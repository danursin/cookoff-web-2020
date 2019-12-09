import React from "react";
import { useContext } from "react";
import ManageContext from "./ManageContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { ManagedParticipant } from "./types";
import { List } from "semantic-ui-react";

const CookoffParticipants: React.FC = () => {
    const { cookoff, participants, setParticipants } = useContext(ManageContext);

    useEffect(() => {
        if (participants) {
            return;
        }

        (async () => {
            const data = await sproc<ManagedParticipant>({
                objectName: "GetCookoffParticipants",
                parameters: {
                    CookoffID: cookoff!.CookoffID!
                }
            });
            setParticipants(data);
        })();
    }, [cookoff, participants, setParticipants]);

    if (!participants) {
        return <SimpleLoader message="Loading participants" />;
    }

    return (
        <List divided relaxed>
            {participants.map(p => {
                const { ParticipantID, Name, Username, IsParticipant } = p;
                return (
                    <List.Item key={ParticipantID}>
                        <List.Icon name="user" size="large" verticalAlign="middle" />
                        <List.Content>
                            <List.Header as="a">{Name}</List.Header>
                            <List.Description as="a">{Username}</List.Description>
                        </List.Content>
                    </List.Item>
                );
            })}
        </List>
    );
};

export default CookoffParticipants;
