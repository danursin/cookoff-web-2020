import React from "react";
import { Form } from "semantic-ui-react";
import { useContext } from "react";
import ManageContext from "./ManageContext";

const CookoffForm: React.FC = () => {
    const { cookoff, setCookoff } = useContext(ManageContext);

    return (
        <Form>
            <Form.Input
                label="Cookoff Title"
                placeholder="Cookoff Title"
                value={cookoff!.Title}
                onChange={(e, data) => setCookoff({ ...cookoff!, Title: data.value as string })}
            />
            <Form.Group>
                <Form.Input
                    width="8"
                    label="Event Start Date"
                    placeholder="Event Start Date"
                    type="datetime-local"
                    value={cookoff!.EventStartDate}
                    onChange={(e, data) => setCookoff({ ...cookoff!, EventStartDate: data.value as string })}
                />
                <Form.Input
                    width="8"
                    label="Event End Date"
                    type="datetime-local"
                    placeholder="Event End Date"
                    value={cookoff!.EventEndDate}
                    onChange={(e, data) => setCookoff({ ...cookoff!, EventStartDate: data.value as string })}
                />
            </Form.Group>

            <Form.Button content="Save" icon="save" fluid color="blue" />
        </Form>
    );
};

export default CookoffForm;
