import React from "react";
import { useContext } from "react";
import CookoffContext from "./CookoffContext";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { Comment } from "./types";
import SimpleLoader from "../../shared/SimpleLoader";
import { Card, Label, List, Image, Grid, Header } from "semantic-ui-react";
import config from "../../config";
import { CookoffEntry } from "../../types";

const CookoffComments = () => {
    const { cookoff, entries, comments, setComments, results } = useContext(CookoffContext);

    useEffect(() => {
        if (comments) {
            return;
        }
        (async () => {
            const data = await sproc<Comment>({
                objectName: "GetCookoffComments",
                parameters: { CookoffID: cookoff!.CookoffID }
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

    return (
        <>
            {results.map(r => {
                const e: CookoffEntry = entries.find(ce => ce.CookoffEntryID === r.CookoffEntryID)!;
                const entryComments = comments.filter(c => c.CookoffEntryID === e.CookoffEntryID);
                return (
                    <Card key={e.CookoffEntryID} fluid>
                        <Card.Content>
                            <Card.Header>
                                <Grid verticalAlign="middle">
                                    <Grid.Column width="2">
                                        <Label
                                            content={
                                                <span>
                                                    {e.Title} - {r.Rank}
                                                    <sup>{getOrdinal(r.Rank)}</sup>
                                                </span>
                                            }
                                            color="grey"
                                        />
                                    </Grid.Column>
                                    <Grid.Column width="6">
                                        <Header as="span" color="grey" size="tiny">
                                            Average: {r.Average.toFixed(2)}
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column width="8">
                                        <Header
                                            as="span"
                                            color="grey"
                                            floated="right"
                                            size="tiny"
                                            icon="user"
                                            content={r.ParticipantName}
                                        />
                                    </Grid.Column>
                                </Grid>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content textAlign="center">
                            {!!e.Filename && <Image centered src={`${config.cookoffApiUrl}/file?key=${e.Filename}`} />}
                            <List divided verticalAlign="middle">
                                {entryComments.map(comment => {
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
