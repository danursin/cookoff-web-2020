import { Card, Icon, Image, Label, List } from "semantic-ui-react";

import { CSSProperties } from "react";
import { Comment } from "./types";
import CookoffContext from "./CookoffContext";
import { CookoffEntry } from "../../types";
import React from "react";
import SimpleLoader from "../../shared/SimpleLoader";
import config from "../../config";
import { sproc } from "../../services/DataService";
import { useContext } from "react";
import { useEffect } from "react";

const CookoffComments: React.FC = () => {
    const { cookoff, entries, comments, setComments, results } = useContext(CookoffContext);

    useEffect(() => {
        if (comments) {
            return;
        }
        (async () => {
            const data = await sproc<Comment>({
                objectName: "GetCookoffComments",
                parameters: { CookoffID: cookoff?.CookoffID as number }
            });
            setComments(data);
        })();
    }, [comments, setComments, cookoff]);

    if (!entries || !comments || !results) {
        return <SimpleLoader message="Loading comments..." />;
    }

    const getOrdinal = (rank: number): string => {
        if (rank % 10 === 1 && rank !== 11) {
            return "st";
        }
        if (rank % 10 === 2) {
            return "nd";
        }
        if (rank % 10 === 3) {
            return "rd";
        }
        return "th";
    };

    const headerStyles: CSSProperties = {
        fontSize: "1rem",
        color: "grey",
        verticalAlign: "middle"
    };

    return (
        <>
            {results.map((r) => {
                const e = entries.find((ce) => ce.CookoffEntryID === r.CookoffEntryID) as CookoffEntry;
                const entryComments = comments.filter((c) => c.CookoffEntryID === e.CookoffEntryID);
                return (
                    <Card key={e.CookoffEntryID} fluid>
                        <Card.Content>
                            <Card.Header>
                                <Label
                                    size="small"
                                    content={
                                        <span>
                                            {e.Title} - {r.Rank}
                                            <sup>{getOrdinal(r.Rank)}</sup>
                                        </span>
                                    }
                                    color="grey"
                                />
                                <span style={{ ...headerStyles, paddingLeft: "0.5rem" }}>Avg: {r.Average.toFixed(2)}</span>
                                <span style={{ ...headerStyles, float: "right", paddingTop: 2 }}>
                                    <Icon name="user" /> {r.ParticipantName}
                                </span>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content textAlign="center">
                            {!!e.Filename && <Image centered src={`${config.cookoffApiUrl}/file?key=${e.Filename}`} />}
                            <List divided verticalAlign="middle">
                                {entryComments.map((comment) => {
                                    return (
                                        <List.Item
                                            key={comment.CookoffEntryScoreID}
                                            content={comment.Comment}
                                            style={{
                                                paddingTop: 10,
                                                paddingBottom: 10
                                            }}
                                        />
                                    );
                                })}
                            </List>
                        </Card.Content>
                    </Card>
                );
            })}
        </>
    );
};

export default CookoffComments;
