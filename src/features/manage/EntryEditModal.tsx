import React, { useState, FormEvent } from "react";
import { Modal, Form, Message, Image } from "semantic-ui-react";
import { useEffect } from "react";
import { update, insert } from "../../services/DataService";
import { Entry } from "./types";
import config from "../../config";

interface EntryEditModalProps {
    open: boolean;
    entry: Entry;
    onClose: () => void;
    onSaveComplete: (entry: Entry) => void;
}

const EntryEditModal: React.FC<EntryEditModalProps> = (props: EntryEditModalProps) => {
    const { onClose, entry, open, onSaveComplete } = props;
    const [localEntry, setLocalEntry] = useState<Entry>({ ...entry });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [imageDataUrl, setImageDataUrl] = useState<string>();

    useEffect(() => {
        setLocalEntry({ ...entry });
        setError(undefined);
    }, [entry]);

    const onImageChange = async (event: React.FormEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (!files || !files.length) {
            setImageDataUrl(undefined);
            return;
        }
        const file = files[0];
        const url = await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.addEventListener(
                "load",
                () => {
                    resolve(reader.result as string);
                },
                false
            );
            reader.readAsDataURL(file);
        });
        setImageDataUrl(url);
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setLoading(true);

        const { Title } = localEntry;

        const values: any = {
            Title: Title || null
        };

        if (imageDataUrl) {
            const filename = await null;
            values.Filename = filename;
        }

        try {
            if (localEntry.CookoffEntryID) {
                await update({
                    table: "Entry",
                    values,
                    where: {
                        CookoffEntryID: localEntry.CookoffEntryID
                    }
                });
            } else {
                const { CookoffEntryID } = await insert({
                    table: "Entry",
                    values
                });
                localEntry.CookoffEntryID = CookoffEntryID;
            }
            onSaveComplete(localEntry);
        } catch (err) {
            setError(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const srcUrl = localEntry.Filename ? `${config.cookoffApiUrl}/file?key=${localEntry.Filename}` : null;
    return (
        <Modal onClose={onClose} closeIcon size="small" open={open}>
            <Modal.Header content={localEntry.CookoffEntryID ? "Edit Entry" : "Add Entry"} />
            <Modal.Content scrolling>
                {!!error && <Message error icon="exclamation triangle" content={error} />}
                <Form onSubmit={onSubmit} loading={loading}>
                    <Form.Input
                        placeholder="Entry Title"
                        fluid
                        label="Entry Title"
                        maxLength="100"
                        value={localEntry.Title}
                        onChange={(e, { value }) => setLocalEntry({ ...localEntry, Title: value })}
                    />

                    <Form.Input placeholder="Entry Image" fluid maxLength="1" type="file" label="Entry Image" onChange={onImageChange} />

                    {(!!srcUrl || !!imageDataUrl) && (
                        <Image src={srcUrl || imageDataUrl} centered style={{ marginTop: "2rem", marginBottom: "2rem" }} />
                    )}

                    <Form.Button fluid color="blue" content="Save" icon="save" type="submit" />
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default EntryEditModal;
