import React from "react";
import { useContext } from "react";
import ManageContext from "./ManageContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { ManagedParticipant } from "./types";
import { List, Table, Button } from "semantic-ui-react";

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
        <Table compact="very" unstackable>
            <Table.Body>
                {participants.map(p => {
                    const { Name, Username, ParticipantID } = p;
                    return (
                        <Table.Row key={ParticipantID}>
                            <Table.Cell>
                                <Button icon="info circle" color="blue" basic size="small" />
                            </Table.Cell>
                            <Table.Cell>{`${Name} (${Username})`}</Table.Cell>
                            <Table.Cell>
                                <Button icon="plus circle" color="green" basic size="small" />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default CookoffParticipants;
