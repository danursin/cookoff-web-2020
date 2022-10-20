import { Entry, ManagedParticipant } from "./types";
import React, { useState } from "react";

import AppContext from "../../shared/AppContextProvider";
import { Cookoff } from "../../types";
import CookoffEntries from "./CookoffEntries";
import CookoffForm from "./CookoffForm";
import CookoffParticipants from "./CookoffParticipants";
import ManageContext from "./ManageContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { Tab } from "semantic-ui-react";
import { query } from "../../services/DataService";
import { useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Manage: React.FC = () => {
    const { id } = useParams();
    const parsedID = +(id as string);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useContext(AppContext);

    const defaultCookoff: Cookoff = {
        Title: "",
        EventStartDate: "",
        EventEndDate: "",
        HostParticipantID: user?.ParticipantID as number,
        AreScoresReleased: false
    };

    const [cookoff, setCookoff] = useState<Cookoff>(defaultCookoff);
    const [participants, setParticipants] = useState<ManagedParticipant[]>();
    const [entries, setEntries] = useState<Entry[]>();

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
            menuItem: {
                content: "Participants",
                color: "grey",
                key: "participants",
                disabled: !cookoff || !cookoff.CookoffID
            },
            render: () => (
                <Tab.Pane>
                    <CookoffParticipants />
                </Tab.Pane>
            )
        },
        {
            menuItem: {
                content: "Entries",
                color: "grey",
                key: "entries",
                disabled: !cookoff || !cookoff.CookoffID
            },
            disabled: !cookoff || !cookoff.CookoffID,
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
                setCookoff,
                participants,
                setParticipants,
                entries,
                setEntries
            }}
        >
            <Tab panes={panes} menu={{ secondary: true, pointing: true }} />
        </ManageContext.Provider>
    );
};

export default Manage;
