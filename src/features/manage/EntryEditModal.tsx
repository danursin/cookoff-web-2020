import React, { useState, FormEvent, useContext } from "react";
import { Modal, Form, Message, DropdownItemProps } from "semantic-ui-react";
import { useEffect } from "react";
import { update, insert, uploadFile } from "../../services/DataService";
import { Entry } from "./types";
import config from "../../config";
import ManageContext from "./ManageContext";

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
    const [dataUri, setDataUri] = useState<string>();

    const { participants } = useContext(ManageContext);

    let imageRef: HTMLImageElement | null = null;

    useEffect(() => {
        setLocalEntry({ ...entry });
        setError(undefined);
    }, [entry]);

    const cropImage = (image: HTMLImageElement): string => {
        const cropWidth = 680;
        const cropHeight = 512;

        const canvas = document.createElement("canvas");
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext("2d")!;

        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, cropWidth, cropHeight);

        const base64Image = canvas.toDataURL("image/png");
        return base64Image;
    };

    const onImageChange = async (event: React.FormEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (!files || !files.length) {
            setDataUri(undefined);
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
        setDataUri(url);
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setLoading(true);

        const { Title, CookoffParticipantID } = localEntry;

        const values: any = {
            Title: Title || null,
            CookoffParticipantID
        };

        if (imageRef) {
            const croppedImageUri = cropImage(imageRef);
            const filename = await uploadFile(croppedImageUri);
            values.Filename = filename;
            localEntry.Filename = filename;
        }

        try {
            if (localEntry.CookoffEntryID) {
                await update({
                    table: "CookoffEntry",
                    values,
                    where: {
                        CookoffEntryID: localEntry.CookoffEntryID
                    }
                });
            } else {
                const { CookoffEntryID } = await insert({
                    table: "CookoffEntry",
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
    const options: DropdownItemProps[] = participants!
        .filter(p => p.IsParticipant)
        .map(p => ({
            key: p.CookoffParticipantID,
            value: p.CookoffParticipantID,
            text: `${p.Name} (${p.Username})`
        }));

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

                    <Form.Dropdown
                        label="Entrant"
                        placeholder="Entrant"
                        selection
                        required
                        options={options}
                        value={localEntry.CookoffParticipantID}
                        onChange={(e, { value }) => setLocalEntry({ ...localEntry, CookoffParticipantID: value as number })}
                    />

                    <Form.Input placeholder="Entry Image" fluid maxLength="1" type="file" label="Entry Image" onChange={onImageChange} />

                    {(!!dataUri || !!srcUrl) && (
                        <img
                            alt="entry"
                            src={dataUri || srcUrl || ""}
                            style={{ margin: "2rem auto", display: "block", width: "100%" }}
                            ref={ref => (imageRef = ref)}
                        />
                    )}

                    <Form.Button fluid color="blue" content="Save" icon="save" type="submit" />
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default EntryEditModal;
