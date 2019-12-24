import React, { useState } from "react";
import { Form, Grid, Button } from "semantic-ui-react";
import { useContext } from "react";
import ManageContext from "./ManageContext";
import { update, insert } from "../../services/DataService";
import { Redirect } from "react-router";

const CookoffForm: React.FC = () => {
    const { cookoff, setCookoff } = useContext(ManageContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [redirect, setRedirect] = useState<string>();

    const goBack = () => {
        if (cookoff!.CookoffID) {
            setRedirect(`/cookoff/${cookoff!.CookoffID}`);
        } else {
            setRedirect("/dashboard");
        }
    };

    const onSubmit = async () => {
        setIsLoading(true);
        let { Title, EventStartDate, EventEndDate, AreScoresReleased } = cookoff!;
        EventStartDate = `${EventStartDate}:00`;
        EventEndDate = `${EventEndDate}:00`;

        if (cookoff!.CookoffID) {
            await update({
                table: "Cookoff",
                values: {
                    Title,
                    EventStartDate,
                    EventEndDate,
                    AreScoresReleased
                },
                where: {
                    CookoffID: cookoff!.CookoffID!
                }
            });
        } else {
            const { CookoffID } = await insert({
                table: "Cookoff",
                values: {
                    HostParticipantID: cookoff!.HostParticipantID,
                    Title,
                    EventStartDate,
                    EventEndDate,
                    AreScoresReleased
                }
            });
            // get new cookoff ID
            setCookoff({ ...cookoff!, CookoffID });
        }
        setIsLoading(false);
    };

    if (redirect) {
        return <Redirect to={redirect} />;
    }

    return (
        <Form onSubmit={onSubmit} loading={isLoading}>
            <Form.Input
                label="Cookoff Title"
                required
                placeholder="Cookoff Title"
                value={cookoff!.Title}
                onChange={(e, data) => setCookoff({ ...cookoff!, Title: data.value as string })}
            />
            <Form.Group>
                <Form.Input
                    width="8"
                    required
                    label="Event Start Date"
                    placeholder="Event Start Date"
                    type="datetime-local"
                    value={cookoff!.EventStartDate}
                    onChange={(e, data) => setCookoff({ ...cookoff!, EventStartDate: data.value as string })}
                />
                <Form.Input
                    width="8"
                    required
                    label="Event End Date"
                    type="datetime-local"
                    placeholder="Event End Date"
                    value={cookoff!.EventEndDate}
                    onChange={(e, data) => setCookoff({ ...cookoff!, EventEndDate: data.value as string })}
                />
            </Form.Group>

            <Form.Checkbox
                style={{ marginTop: "1rem" }}
                label="Are Scores Released?"
                toggle
                checked={cookoff!.AreScoresReleased}
                onChange={(e, data) => setCookoff({ ...cookoff!, AreScoresReleased: !!data.checked })}
            />

            <Grid columns="equal">
                <Grid.Column>
                    <Button content="Cancel" type="button" icon="times" color="grey" fluid onClick={goBack} />
                </Grid.Column>
                <Grid.Column>
                    <Button content="Save" type="submit" icon="save" color="blue" fluid />
                </Grid.Column>
            </Grid>
        </Form>
    );
};

export default CookoffForm;
