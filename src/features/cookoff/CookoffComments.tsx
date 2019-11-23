import React from "react";
import { useContext } from "react";
import CookoffContext from "./CookoffContext";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { Comment } from "./types";
import SimpleLoader from "../../shared/SimpleLoader";
import { Card, Label, List, Image } from "semantic-ui-react";
import config from "../../config";

const CookoffComments = () => {
    const { cookoff, entries, comments, setComments } = useContext(CookoffContext);

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

    if (!entries || !comments) {
        return <SimpleLoader message="Loading comments..." />;
    }

    return (
        <>
            {entries.map(e => {
                const entryComments = comments.filter(c => c.CookoffEntryID === e.CookoffEntryID);
                return (
                    <Card key={e.CookoffEntryID} fluid>
                        <Card.Content>
                            <Card.Header content={<Label content={`${e.Title} - nth`} color="grey" />} />
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
