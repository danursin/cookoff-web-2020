import React from "react";
import { useContext } from "react";
import ManageContext from "./ManageContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { useEffect } from "react";
import { sproc, insert, destroy } from "../../services/DataService";
import { ManagedParticipant } from "./types";
import { Table, Button, Icon } from "semantic-ui-react";

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

    const addParticipant = async (participantID: number) => {
        setParticipants(
            participants.map(p => {
                if (p.ParticipantID === participantID) {
                    p.IsLoading = true;
                }
                return p;
            })
        );
        await insert({
            table: "CookoffParticipant",
            values: {
                CookoffID: cookoff!.CookoffID,
                ParticipantID: participantID
            }
        });
        setParticipants(
            participants.map(p => {
                if (p.ParticipantID === participantID) {
                    p.IsParticipant = true;
                    p.IsLoading = false;
                }
                return p;
            })
        );
    };

    const removeParticipant = async (participantID: number) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        setParticipants(
            participants.map(p => {
                if (p.ParticipantID === participantID) {
                    p.IsLoading = true;
                }
                return p;
            })
        );
        await destroy({
            table: "CookoffParticipant",
            where: {
                CookoffID: cookoff!.CookoffID,
                ParticipantID: participantID
            }
        });
        setParticipants(
            participants.map(p => {
                if (p.ParticipantID === participantID) {
                    p.IsParticipant = false;
                    p.IsLoading = false;
                }
                return p;
            })
        );
    };

    return (
        <Table compact="very" unstackable>
            <Table.Body>
                {participants.map(p => {
                    const { Name, Username, ParticipantID, IsParticipant, IsLoading } = p;
                    return (
                        <Table.Row key={ParticipantID}>
                            <Table.Cell>
                                <Button icon="info circle" color="blue" basic size="small" />
                            </Table.Cell>
                            <Table.Cell>{`${Name} (${Username})`}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Button
                                    icon={
                                        <Icon
                                            name={IsLoading ? "cog" : IsParticipant ? "minus circle" : "plus circle"}
                                            loading={IsLoading}
                                        />
                                    }
                                    color={IsParticipant ? "red" : "green"}
                                    basic
                                    size="small"
                                    onClick={() => (IsParticipant ? removeParticipant(ParticipantID) : addParticipant(ParticipantID))}
                                />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default CookoffParticipants;
