import { Form, Message, Modal } from "semantic-ui-react";
import React, { FormEvent, useState } from "react";
import { insert, update } from "../../services/DataService";

import { Participant } from "../../types";
import { useEffect } from "react";

interface ParticipantEditModalProps {
    open: boolean;
    participant: Participant;
    onClose: () => void;
    onSaveComplete: (participant: Participant) => void;
}

const ParticipantEditModal: React.FC<ParticipantEditModalProps> = (props: ParticipantEditModalProps) => {
    const { onClose, participant, open, onSaveComplete } = props;
    const [localParticipant, setLocalParticipant] = useState<Participant>({ ...participant });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        setLocalParticipant({ ...participant });
        setError(undefined);
    }, [participant]);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const { Name, Username, IsAdmin } = localParticipant;

        try {
            if (localParticipant.ParticipantID) {
                await update({
                    table: "Participant",
                    values: {
                        Name: Name || null,
                        Username: Username || null,
                        IsAdmin: !!IsAdmin
                    },
                    where: {
                        ParticipantID: localParticipant.ParticipantID
                    }
                });
            } else {
                const { ParticipantID } = (await insert({
                    table: "Participant",
                    values: {
                        Name: Name || null,
                        Username: Username || null,
                        IsAdmin: !!IsAdmin
                    }
                })) as { ParticipantID: number };
                localParticipant.ParticipantID = ParticipantID;
            }
            onSaveComplete(localParticipant);
        } catch (err) {
            setError((err as Error).message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose} closeIcon size="small" open={open}>
            <Modal.Header content={localParticipant.ParticipantID ? "Edit Participant" : "Add Participant"} />
            <Modal.Content scrolling>
                {!!error && <Message error icon="exclamation triangle" content={error} />}
                <Form onSubmit={onSubmit} loading={loading}>
                    <Form.Input
                        placeholder="Participant Name"
                        fluid
                        label="Participant Name"
                        value={localParticipant.Name}
                        onChange={(e, { value }) => setLocalParticipant({ ...localParticipant, Name: value })}
                    />
                    <Form.Input
                        placeholder="Username"
                        fluid
                        label="Username"
                        value={localParticipant.Username}
                        onChange={(e, { value }) => setLocalParticipant({ ...localParticipant, Username: value })}
                    />

                    <Form.Checkbox
                        toggle
                        label="Is Administrator?"
                        checked={localParticipant.IsAdmin}
                        onChange={(data, { checked }) => setLocalParticipant({ ...localParticipant, IsAdmin: !!checked })}
                    />

                    <Form.Button fluid color="blue" content="Save" icon="save" type="submit" />
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default ParticipantEditModal;
