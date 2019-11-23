import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Cookoff, CookoffEntry } from "../../types";
import CookoffContext from "./CookoffContext";
import { query, sproc } from "../../services/DataService";
import SimpleLoader from "../../shared/SimpleLoader";
import { Header, Tab } from "semantic-ui-react";
import CookoffScores from "./CookoffScores";
import CookoffResults from "./CookoffResults";
import CookoffComments from "./CookoffComments";
import { EntryUserScore, Comment } from "./types";
import { useContext } from "react";
import AuthContext from "../../shared/AuthContext";

interface CookoffProps extends RouteComponentProps<{ id: string }> {}

const CookoffComponent: React.FC<CookoffProps> = (props: CookoffProps) => {
    const { id } = props.match.params;

    const [cookoff, setCookoff] = useState<Cookoff>();
    const [entries, setEntries] = useState<CookoffEntry[]>();
    const [userScores, setUserScores] = useState<EntryUserScore[]>();
    const [comments, setComments] = useState<Comment[]>();
    const { user } = useContext(AuthContext);

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

    if (!cookoff) {
        return <SimpleLoader message="Loading cookoff data..." />;
    }

    const panes = [
        {
            menuItem: {
                content: "Scores",
                icon: "pencil",
                color: "grey",
                key: "scores"
            },
            pane: {
                key: "scores",
                content: <CookoffScores />
            }
        },
        {
            menuItem: {
                content: "Results",
                icon: "chart bar",
                color: "grey",
                key: "results"
            },
            pane: {
                key: "results",
                content: <CookoffResults />
            }
        },
        {
            menuItem: {
                content: "Comments",
                icon: "comment alternate outline",
                color: "grey",
                key: "comments"
            },
            pane: {
                key: "comments",
                content: <CookoffComments />
            }
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
                setComments
            }}
        >
            <Header icon="spoon" size="huge" content={cookoff.Title} color="grey" />

            <Tab panes={panes} renderActiveOnly={false} menu={{ secondary: true, pointing: true }} />
        </CookoffContext.Provider>
    );
};

export default CookoffComponent;
