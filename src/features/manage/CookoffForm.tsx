import { Button, Form, Grid } from "semantic-ui-react";
import React, { useState } from "react";
import { insert, update } from "../../services/DataService";

import ManageContext from "./ManageContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const CookoffForm: React.FC = () => {
    const { cookoff, setCookoff } = useContext(ManageContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    if (!cookoff) {
        throw new Error("Cookoff undefined in page dedicated to cookoff");
    }

    const goBack = () => {
        if (cookoff.CookoffID) {
            navigate(`/cookoff/${cookoff.CookoffID}`);
        } else {
            navigate("/dashboard");
        }
    };

    const onSubmit = async () => {
        setIsLoading(true);
        const { Title, EventStartDate, EventEndDate, AreScoresReleased, EventCode } = cookoff;

        if (cookoff.CookoffID) {
            await update({
                table: "Cookoff",
                values: {
                    Title,
                    EventStartDate,
                    EventEndDate,
                    AreScoresReleased,
                    EventCode: EventCode || null
                },
                where: {
                    CookoffID: cookoff.CookoffID as number
                }
            });
        } else {
            const { CookoffID } = (await insert({
                table: "Cookoff",
                values: {
                    HostParticipantID: cookoff.HostParticipantID,
                    Title,
                    EventStartDate,
                    EventEndDate,
                    AreScoresReleased,
                    EventCode: EventCode || null
                }
            })) as { CookoffID: number };
            // get new cookoff ID
            setCookoff({ ...cookoff, CookoffID });
        }
        setIsLoading(false);
    };

    return (
        <Form onSubmit={onSubmit} loading={isLoading}>
            <Form.Input
                label="Cookoff Title"
                required
                placeholder="Cookoff Title"
                value={cookoff.Title || ""}
                onChange={(e, data) => setCookoff({ ...cookoff, Title: data.value as string })}
            />
            <Form.Input
                label="Event Code"
                placeholder="Optional Event Code"
                value={cookoff.EventCode || ""}
                onChange={(e, data) => setCookoff({ ...cookoff, EventCode: data.value })}
            />
            <Form.Group>
                <Form.Input
                    width="8"
                    required
                    label="Event Start Date"
                    placeholder="Event Start Date"
                    type="datetime-local"
                    value={cookoff.EventStartDate || ""}
                    onChange={(e, { value }) => setCookoff({ ...cookoff, EventStartDate: `${value}:00` as string })}
                />
                <Form.Input
                    width="8"
                    required
                    label="Event End Date"
                    type="datetime-local"
                    placeholder="Event End Date"
                    value={cookoff.EventEndDate || ""}
                    onChange={(e, { value }) => {
                        setCookoff({ ...cookoff, EventEndDate: `${value}:00` as string });
                    }}
                />
            </Form.Group>

            <Form.Checkbox
                style={{ marginTop: "1rem" }}
                label="Are Scores Released?"
                toggle
                checked={cookoff.AreScoresReleased}
                onChange={(e, data) => setCookoff({ ...cookoff, AreScoresReleased: !!data.checked })}
            />

            <Grid columns="equal">
                <Grid.Column>
                    <Button content="Go Back" type="button" icon="arrow left" color="grey" fluid onClick={goBack} />
                </Grid.Column>
                <Grid.Column>
                    <Button content="Save" type="submit" icon="save" color="blue" fluid />
                </Grid.Column>
            </Grid>
        </Form>
    );
};

export default CookoffForm;
