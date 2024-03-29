import { Button, Header, Table } from "semantic-ui-react";
import { Entry, ManagedParticipant } from "./types";
import React, { useState } from "react";

import EntryEditModal from "./EntryEditModal";
import ManageContext from "./ManageContext";
import { Participant } from "../../types";
import SimpleLoader from "../../shared/SimpleLoader";
import { sortBy } from "lodash";
import { sproc } from "../../services/DataService";
import { useContext } from "react";
import { useEffect } from "react";

const defaultEntry: Entry = {
    Title: ""
};

const CookoffEntries: React.FC = () => {
    const { cookoff, participants, setParticipants, entries, setEntries } = useContext(ManageContext);

    const [selectedEntry, setSelectedEntry] = useState<Entry>(defaultEntry);
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
                        CookoffID: cookoff?.CookoffID as number
                    }
                }),
                participants
                    ? undefined
                    : sproc<ManagedParticipant>({
                          objectName: "GetCookoffParticipants",
                          parameters: {
                              CookoffID: cookoff?.CookoffID as number
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

    const onSaveComplete = (entry: Entry) => {
        const existingEntry = entries.find((p) => p.CookoffEntryID === entry.CookoffEntryID);
        if (existingEntry) {
            Object.assign(existingEntry, entry);
        } else {
            entries.push(entry);
        }
        setEntries(sortBy(entries, "Title"));
        setModalOpen(false);
    };

    return (
        <>
            <Button
                color="blue"
                fluid
                icon="plus circle"
                content="Add Entry"
                onClick={() => {
                    setSelectedEntry({ ...defaultEntry });
                    setModalOpen(true);
                }}
            />
            {modalOpen && <EntryEditModal onClose={() => setModalOpen(false)} entry={selectedEntry} onSaveComplete={onSaveComplete} />}
            <Table compact="very" unstackable>
                <Table.Body>
                    {!entries.length && (
                        <Table.Row>
                            <Table.Cell colSpan={3} content="No entries registered yet..." warning />
                        </Table.Row>
                    )}
                    {entries.map((e) => {
                        const { CookoffEntryID, Title, CookoffParticipantID } = e;
                        const { Name, Username } = participants.find((p) => p.CookoffParticipantID === CookoffParticipantID) as Participant;
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
                                                // todo implement
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
