import React, { useState } from "react";
import { Form, DropdownItemProps, Icon } from "semantic-ui-react";
import { CookoffEntry } from "../../types";
import { EntryUserScore } from "./types";

interface CookoffScoreEditableProps {
    entry: CookoffEntry;
    userScore: EntryUserScore;
}

const scoreOptions: DropdownItemProps[] = [
    { key: 1, value: 1, text: "1 - Ouch", icon: <Icon name="frown" color="red" /> },
    { key: 2, value: 2, text: "2 - Not Good", icon: <Icon name="frown" color="orange" /> },
    { key: 3, value: 3, text: "3 - Meh", icon: <Icon name="meh" color="yellow" /> },
    { key: 4, value: 4, text: "4 - Good", icon: <Icon name="smile" color="olive" /> },
    { key: 5, value: 5, text: "5 - Excellent", icon: <Icon name="smile" color="green" /> }
];

const CookoffScoreEditable: React.FC<CookoffScoreEditableProps> = (props: CookoffScoreEditableProps) => {
    const { userScore: us } = props;

    const [localComment, setLocalComment] = useState<string | null>(us.Comment);
    const [localScore, setLocalScore] = useState<number | null>(us.Score);

    const onSubmit = () => {};
    return (
        <Form onSubmit={onSubmit}>
            <Form.Dropdown
                label="Score"
                selection
                fluid
                placeholder="As yet unscored"
                value={localScore || undefined}
                options={scoreOptions}
                onChange={(e, { value }) => {
                    debugger;
                    setLocalScore((value as number) || null);
                }}
            />
            <Form.TextArea
                value={localComment || ""}
                rows={2}
                fluid
                placeholder="Notes"
                label="Notes"
                onChange={(e, { value }) => setLocalComment((value as string) || null)}
            />
        </Form>
    );
};

export default CookoffScoreEditable;
