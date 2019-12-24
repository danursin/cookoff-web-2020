import React, { useState, FormEvent } from "react";
import { Participant } from "../../types";
import { Modal, Form } from "semantic-ui-react";
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

    useEffect(() => {
        setLocalParticipant({ ...participant });
    }, [participant]);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSaveComplete(localParticipant);
    };

    return (
        <Modal onClose={onClose} closeIcon size="small" open={open}>
            <Modal.Header content={localParticipant.ParticipantID ? "Edit Participant" : "Add Participant"} />
            <Modal.Content scrolling>
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
