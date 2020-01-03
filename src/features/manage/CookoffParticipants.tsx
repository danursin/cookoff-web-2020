import React, { useState } from "react";
import { useContext } from "react";
import ManageContext from "./ManageContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { useEffect } from "react";
import { sproc, insert, destroy } from "../../services/DataService";
import { ManagedParticipant } from "./types";
import { Table, Button, Icon } from "semantic-ui-react";
import ParticipantEditModal from "./ParticipantEditModal";
import { Participant } from "../../types";
import { sortBy } from "lodash";

const defaultParticipant: Participant = {
    Name: "",
    Username: "",
    IsAdmin: false
};

const CookoffParticipants: React.FC = () => {
    const { cookoff, participants, setParticipants } = useContext(ManageContext);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant>(defaultParticipant);

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
        const { CookoffParticipantID } = await insert({
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
                    p.CookoffParticipantID = CookoffParticipantID;
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

    const onSaveComplete = (participant: Participant) => {
        const existingParticipant = participants.find(p => p.ParticipantID === participant.ParticipantID);
        if (existingParticipant) {
            Object.assign(existingParticipant, participant);
        } else {
            const mp: ManagedParticipant = {
                ...participant,
                IsParticipant: false,
                ParticipantID: participant.ParticipantID!
            };
            participants.push(mp);
        }
        setParticipants(sortBy(participants, "Name"));
        setModalOpen(false);
    };

    return (
        <>
            <Button
                color="blue"
                content="Add Participant"
                icon="plus circle"
                fluid
                onClick={() => {
                    setSelectedParticipant(defaultParticipant);
                    setModalOpen(true);
                }}
            />
            <ParticipantEditModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                participant={selectedParticipant}
                onSaveComplete={onSaveComplete}
            />
            <Table compact="very" unstackable>
                <Table.Body>
                    {participants.map(p => {
                        const { Name, Username, ParticipantID, IsParticipant, IsLoading, IsAdmin } = p;
                        return (
                            <Table.Row key={ParticipantID}>
                                <Table.Cell>
                                    <Button
                                        icon="pencil"
                                        color="blue"
                                        basic
                                        size="small"
                                        onClick={() => {
                                            setSelectedParticipant(p);
                                            setModalOpen(true);
                                        }}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    {`${Name} (${Username})`}{" "}
                                    {IsAdmin && <Icon name="cog" color="grey" title="This user is an administrator" />}
                                </Table.Cell>
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
        </>
    );
};

export default CookoffParticipants;
