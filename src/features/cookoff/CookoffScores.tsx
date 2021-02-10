import { Accordion, AccordionPanelProps, Header, Image, Label, Message } from "semantic-ui-react";

import AuthContext from "../../shared/AuthContext";
import CookoffContext from "./CookoffContext";
import CookoffScoreEditable from "./CookoffScoreEditable";
import CookoffScoreReadonly from "./CookoffScoreReadonly";
import { EntryUserScore } from "./types";
import React from "react";
import { SemanticShorthandItem } from "semantic-ui-react/dist/commonjs/generic";
import SimpleLoader from "../../shared/SimpleLoader";
import config from "../../config";
import { sproc } from "../../services/DataService";
import { useContext } from "react";
import { useEffect } from "react";

const CookoffScores: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { cookoff, userScores, setUserScores, entries, hasCookoffEnded } = useContext(CookoffContext);

    useEffect(() => {
        if (userScores) {
            return;
        }
        (async () => {
            const result = await sproc<EntryUserScore>({
                objectName: "GetCookoffParticipantScores",
                parameters: {
                    CookoffID: cookoff?.CookoffID as number,
                    ParticipantID: user?.ParticipantID as number
                }
            });
            setUserScores(result);
        })();
    }, [cookoff, user, userScores, setUserScores]);

    if (!entries || !userScores) {
        return <SimpleLoader message="Loading scores..." />;
    }

    const panels: SemanticShorthandItem<AccordionPanelProps>[] = userScores.map((userScore) => {
        const entry = entries.find((e) => e.CookoffEntryID === userScore.CookoffEntryID);
        if (!entry) {
            return <Message content={`Couldn't find entry with id ${userScore.CookoffEntryID}`} error icon="exclamation triangle" />;
        }
        return {
            key: userScore.CookoffEntryID,
            title: {
                content: (
                    <>
                        <Label content={entry.Title} color={!userScore.Score || hasCookoffEnded ? "grey" : "green"} />
                        <Header
                            size="small"
                            floated="right"
                            color="grey"
                            content={userScore.Score === null || userScore.Score === undefined ? "?" : userScore.Score}
                        />
                    </>
                )
            },
            content: {
                content: (
                    <>
                        {!!entry.Filename && <Image fluid centered src={`${config.cookoffApiUrl}/file?key=${entry.Filename}`} />}
                        {hasCookoffEnded ? (
                            <CookoffScoreReadonly userScore={userScore} />
                        ) : (
                            <CookoffScoreEditable
                                entry={entry}
                                userScore={userScore}
                                onSaveScore={(us) => {
                                    const indexOfScore = userScores.indexOf(us);
                                    userScores[indexOfScore] = us;
                                    setUserScores([...userScores]);
                                }}
                            />
                        )}
                    </>
                )
            }
        };
    });

    return <Accordion fluid styled panels={panels} exclusive={false} />;
};

export default CookoffScores;
