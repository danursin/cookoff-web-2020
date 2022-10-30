import { DropdownItemProps, Form, Icon, TextAreaProps } from "semantic-ui-react";
import React, { useCallback, useState } from "react";
import { insert, update } from "../../services/DataService";

import { CookoffEntry } from "../../types";
import { EntryUserScore } from "./types";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";
import { debounce } from "lodash";

interface CookoffScoreEditableProps {
    entry: CookoffEntry;
    userScore: EntryUserScore;
    onSaveScore: (userScore: EntryUserScore) => void;
}

const iconSize: SemanticSIZES = "large";
const scoreOptions: DropdownItemProps[] = [
    { key: 0, value: undefined, text: "Unscored", icon: <Icon name="question" color="grey" size={iconSize} /> },
    { key: 1, value: 1, text: "1 - Not for me", icon: <Icon name="frown" color="red" size={iconSize} /> },
    { key: 2, value: 2, text: "2 - Meh", icon: <Icon name="frown" color="orange" size={iconSize} /> },
    { key: 3, value: 3, text: "3 - Average", icon: <Icon name="meh" color="yellow" size={iconSize} /> },
    { key: 4, value: 4, text: "4 - Good", icon: <Icon name="smile" color="olive" size={iconSize} /> },
    { key: 5, value: 5, text: "5 - Excellent", icon: <Icon name="smile" color="green" size={iconSize} /> }
];

const CookoffScoreEditable: React.FC<CookoffScoreEditableProps> = (props: CookoffScoreEditableProps) => {
    const { userScore: us, onSaveScore } = props;

    const [localComment, setLocalComment] = useState<string | null>(us.Comment);
    const [localScore, setLocalScore] = useState<number | null>(us.Score);
    const [savingScore, setSavingScore] = useState<boolean>(false);
    const [savingComment, setSavingComment] = useState<boolean>(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedTextUpdate = useCallback(
        debounce(async (comment: string | null) => {
            setSavingComment(true);
            const { CookoffEntryScoreID, CookoffEntryID, CookoffParticipantID } = us;
            if (CookoffEntryScoreID) {
                await update({
                    table: "CookoffEntryScore",
                    values: {
                        Comment: comment
                    },
                    where: {
                        CookoffEntryScoreID
                    }
                });
            } else {
                const { CookoffEntryScoreID } = (await insert({
                    table: "CookoffEntryScore",
                    values: {
                        CookoffEntryID,
                        CookoffParticipantID,
                        Comment: comment
                    }
                })) as { CookoffEntryScoreID: number };
                us.CookoffEntryScoreID = CookoffEntryScoreID;
            }
            us.Comment = comment;
            setSavingComment(false);
            onSaveScore(us);
        }, 750),
        []
    );

    const handleScoreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const score = +e.currentTarget.value || null;
        setLocalScore(score);
        setSavingScore(true);
        const { CookoffEntryScoreID, CookoffEntryID, CookoffParticipantID } = us;
        if (CookoffEntryScoreID) {
            await update({
                table: "CookoffEntryScore",
                values: {
                    Score: score
                },
                where: {
                    CookoffEntryScoreID
                }
            });
        } else {
            const { CookoffEntryScoreID } = (await insert({
                table: "CookoffEntryScore",
                values: {
                    CookoffEntryID,
                    CookoffParticipantID,
                    Score: score
                }
            })) as { CookoffEntryScoreID: number };
            us.CookoffEntryScoreID = CookoffEntryScoreID;
        }
        us.Score = score;
        setSavingScore(false);
        onSaveScore(us);
    };

    const handleCommentChange = (e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
        const comment = (data.value as string) || null;
        setLocalComment(comment);
        debouncedTextUpdate(comment);
    };

    const selectedOption = scoreOptions.find((o) => o.value === localScore) || scoreOptions[0];

    return (
        <Form>
            <div className="field">
                <label>
                    <>Score {savingScore ? <Icon name="spoon" loading color="grey" size={iconSize} /> : selectedOption.icon}</>
                </label>
                <select className="ui fluid selection dropdown" value={localScore || undefined} onChange={handleScoreChange}>
                    {scoreOptions.map(({ key, value, text }) => (
                        <option key={key} value={value as number}>
                            {text}
                        </option>
                    ))}
                </select>
            </div>

            <Form.TextArea
                value={localComment || ""}
                rows={2}
                placeholder="Notes"
                label={
                    savingComment ? (
                        // eslint-disable-next-line jsx-a11y/label-has-associated-control
                        <label>
                            Notes <Icon name="spoon" loading color="grey" size={iconSize} />
                        </label>
                    ) : (
                        "Notes"
                    )
                }
                onChange={handleCommentChange}
            />
        </Form>
    );
};

export default CookoffScoreEditable;
