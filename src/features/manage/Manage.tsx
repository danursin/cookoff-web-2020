import React, { useState } from "react";
import { Tab } from "semantic-ui-react";
import CookoffForm from "./CookoffForm";
import CookoffParticipants from "./CookoffParticipants";
import CookoffEntries from "./CookoffEntries";
import { Cookoff } from "../../types";
import ManageContext from "./ManageContext";
import { useContext } from "react";
import AuthContext from "../../shared/AuthContext";
import { RouteComponentProps } from "react-router-dom";
import { useEffect } from "react";
import SimpleLoader from "../../shared/SimpleLoader";
import { query } from "../../services/DataService";

interface ManageProps extends RouteComponentProps<{ id: string }> {}

const Manage: React.FC<ManageProps> = (props: ManageProps) => {
    const { id } = props.match.params;
    const parsedID = +id;
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useContext(AuthContext);

    const defaultCookoff: Cookoff = {
        Title: "",
        EventStartDate: "",
        EventEndDate: "",
        HostParticipantID: user!.ParticipantID,
        AreScoresReleased: false
    };

    const [cookoff, setCookoff] = useState<Cookoff>(defaultCookoff);

    useEffect(() => {
        if (!parsedID) {
            setLoading(false);
            return;
        }

        (async () => {
            const [data] = await query<Cookoff>({
                table: "Cookoff",
                where: {
                    CookoffID: parsedID
                }
            });
            data.EventStartDate = data.EventStartDate.replace("Z", "");
            data.EventEndDate = data.EventEndDate.replace("Z", "");
            setCookoff(data);
            setLoading(false);
        })();
    }, [parsedID, setLoading, setCookoff]);

    if (loading) {
        return <SimpleLoader message="Loading cookoff data..." />;
    }

    const panes = [
        {
            menuItem: "Cookoff",
            render: () => (
                <Tab.Pane>
                    <CookoffForm />
                </Tab.Pane>
            )
        },
        {
            menuItem: "Participants",
            render: () => (
                <Tab.Pane>
                    <CookoffParticipants />
                </Tab.Pane>
            )
        },
        {
            menuItem: "Entries",
            render: () => (
                <Tab.Pane>
                    <CookoffEntries />
                </Tab.Pane>
            )
        }
    ];

    return (
        <ManageContext.Provider
            value={{
                cookoff,
                setCookoff
            }}
        >
            <Tab panes={panes} menu={{ secondary: true, pointing: true }} />
        </ManageContext.Provider>
    );
};

export default Manage;
