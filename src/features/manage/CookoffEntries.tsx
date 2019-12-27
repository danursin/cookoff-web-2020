import React, { useState } from "react";
import { useContext } from "react";
import ManageContext from "./ManageContext";
import { useEffect } from "react";
import SimpleLoader from "../../shared/SimpleLoader";
import { sproc } from "../../services/DataService";
import { Entry, ManagedParticipant } from "./types";
import { Table, Button, Header } from "semantic-ui-react";

const CookoffEntries: React.FC = () => {
    const { cookoff, participants, setParticipants, entries, setEntries } = useContext(ManageContext);

    const [selectedEntry, setSelectedEntry] = useState<Entry>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (entries) {
            return;
        }

        (async () => {
            const promises: [Promise<Entry[]>, Promise<ManagedParticipant[]> | undefined] = [
                sproc<Entry>({
                    objectName: "GetCookoffEntries",
                    parameters: {
                        CookoffID: cookoff!.CookoffID!
                    }
                }),
                participants
                    ? undefined
                    : sproc<ManagedParticipant>({
                          objectName: "GetCookoffParticipants",
                          parameters: {
                              CookoffID: cookoff!.CookoffID!
                          }
                      })
            ];

            const [entryData, participantData] = await Promise.all(promises);

            setEntries(entryData);
            if (participantData) {
                setParticipants(participantData);
            }
        })();
    }, [cookoff, entries, setEntries, participants, setParticipants]);

    if (!participants || !entries) {
        return <SimpleLoader />;
    }

    return (
        <>
            <Button color="blue" fluid icon="plus circle" content="Add Entry" />
            <Table compact="very" unstackable>
                <Table.Body>
                    {!entries.length && (
                        <Table.Row>
                            <Table.Cell colSpan={3} content="No entries registered yet..." warning />
                        </Table.Row>
                    )}
                    {entries.map(e => {
                        const { CookoffEntryID, Title, ParticipantID } = e;
                        const { Name, Username } = participants.find(p => p.ParticipantID === ParticipantID)!;
                        return (
                            <Table.Row key={CookoffEntryID}>
                                <Table.Cell>
                                    <Button
                                        icon="pencil"
                                        color="blue"
                                        basic
                                        size="small"
                                        onClick={() => {
                                            setSelectedEntry(e);
                                            setModalOpen(true);
                                        }}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Header color="grey" content={Title} subheader={`${Name} (${Username})`} />
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    <Button
                                        color="red"
                                        basic
                                        icon="trash"
                                        size="small"
                                        onClick={() => {
                                            if (window.confirm("Are you sure?")) {
                                            }
                                        }}
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

export default CookoffEntries;
