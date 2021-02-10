import { Button, Header, Tab } from "semantic-ui-react";
import { Comment, CookoffResult, EntryUserScore, ParticipantTrend } from "./types";
import { Cookoff, CookoffEntry } from "../../types";
import { Link, RouteComponentProps } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { query, sproc } from "../../services/DataService";

import AuthContext from "../../shared/AuthContext";
import CookoffComments from "./CookoffComments";
import CookoffContext from "./CookoffContext";
import CookoffResults from "./CookoffResults";
import CookoffScores from "./CookoffScores";
import Countdown from "../../shared/Countdown";
import SimpleLoader from "../../shared/SimpleLoader";
import moment from "moment";
import { useContext } from "react";

type CookoffProps = RouteComponentProps<{ id: string }>;

const CookoffComponent: React.FC<CookoffProps> = (props: CookoffProps) => {
    const { id } = props.match.params;

    const [cookoff, setCookoff] = useState<Cookoff>();
    const [entries, setEntries] = useState<CookoffEntry[]>();
    const [userScores, setUserScores] = useState<EntryUserScore[]>();
    const [comments, setComments] = useState<Comment[]>();
    const [results, setResults] = useState<CookoffResult[]>();
    const [hasCookoffEnded, setHasCookoffEnded] = useState<boolean>(true);
    const [participantTrends, setParticipantTrends] = useState<ParticipantTrend[]>();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!cookoff) {
                return;
            }
            const { EventEndDate } = cookoff;
            setHasCookoffEnded(moment(new Date()).isAfter(moment(EventEndDate.replace("Z", ""))));
        }, 1000);
        return () => clearInterval(interval);
    }, [cookoff]);

    useEffect(() => {
        (async () => {
            const [[cookoffData], entries] = await Promise.all([
                query<Cookoff>({
                    table: "Cookoff",
                    where: {
                        CookoffID: id
                    }
                }),
                sproc<CookoffEntry>({
                    objectName: "GetCookoffEntries",
                    parameters: {
                        CookoffID: id
                    }
                })
            ]);

            setCookoff(cookoffData);
            setEntries(entries);
        })();
    }, [id, user, setEntries]);

    useEffect(() => {
        if (results || !cookoff || !cookoff.AreScoresReleased) {
            return;
        }

        (async () => {
            const data = await sproc<CookoffResult>({
                objectName: "GetCookoffResults",
                parameters: {
                    CookoffID: cookoff.CookoffID as number
                }
            });
            setResults(data);
        })();
    }, [cookoff, results]);

    if (!cookoff) {
        return <SimpleLoader message="Loading cookoff data..." />;
    }

    const { AreScoresReleased, EventStartDate, EventEndDate } = cookoff;
    const startDate = moment(EventStartDate.replace("Z", ""));
    const endDate = moment(EventEndDate.replace("Z", ""));

    const eventDayString = startDate.format("dddd, MMMM Do YYYY");
    const eventStartTimeString = startDate.format("h:mm A");
    const eventEndTimeString = endDate.format("h:mm A");

    const panes = [
        {
            menuItem: {
                content: "Scores",
                icon: "pencil",
                color: "grey",
                key: "scores"
            },
            render: () => <CookoffScores />
        },
        {
            menuItem: {
                content: "Results",
                icon: AreScoresReleased ? "chart bar" : "lock",
                color: "grey",
                key: "results",
                disabled: !AreScoresReleased
            },
            render: () => <CookoffResults />
        },
        {
            menuItem: {
                content: "Comments",
                icon: AreScoresReleased ? "comment alternate outline" : "lock",
                color: "grey",
                key: "comments",
                disabled: !AreScoresReleased
            },
            render: () => <CookoffComments />
        }
    ];

    return (
        <CookoffContext.Provider
            value={{
                cookoff,
                setCookoff,
                entries,
                setEntries,
                userScores,
                setUserScores,
                comments,
                setComments,
                results,
                setResults,
                hasCookoffEnded,
                participantTrends,
                setParticipantTrends
            }}
        >
            <Header
                icon="spoon"
                size="huge"
                content={cookoff.Title}
                color="grey"
                subheader={`${eventDayString} from ${eventStartTimeString} to ${eventEndTimeString}`}
            />
            {user?.IsAdmin && (
                <Button
                    fluid
                    color="blue"
                    icon="cog"
                    content="Manage Cookoff"
                    as={Link}
                    to={`/manage/${cookoff.CookoffID}`}
                    style={{ marginBottom: "1rem" }}
                />
            )}

            {!hasCookoffEnded && <Countdown date={endDate.toDate()} />}

            <Tab panes={panes} menu={{ secondary: true, pointing: true }} />
        </CookoffContext.Provider>
    );
};

export default CookoffComponent;
