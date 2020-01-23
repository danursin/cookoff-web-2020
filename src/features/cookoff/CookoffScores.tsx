import React from "react";
import { useContext } from "react";
import CookoffContext from "./CookoffContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { Accordion, AccordionPanelProps, Label, Header, Image } from "semantic-ui-react";
import { SemanticShorthandItem } from "semantic-ui-react/dist/commonjs/generic";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { EntryUserScore } from "./types";
import AuthContext from "../../shared/AuthContext";
import { CookoffEntry } from "../../types";
import CookoffScoreReadonly from "./CookoffScoreReadonly";
import CookoffScoreEditable from "./CookoffScoreEditable";
import config from "../../config";

const CookoffScores = () => {
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
                    CookoffID: cookoff!.CookoffID!,
                    ParticipantID: user!.ParticipantID!
                }
            });
            setUserScores(result);
        })();
    }, [cookoff, user, userScores, setUserScores]);

    if (!entries || !userScores) {
        return <SimpleLoader message="Loading scores..." />;
    }

    const panels: SemanticShorthandItem<AccordionPanelProps>[] = userScores.map(userScore => {
        const entry: CookoffEntry = entries.find(e => e.CookoffEntryID === userScore.CookoffEntryID)!;
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
                        {!!entry.Filename && <Image centered src={`${config.cookoffApiUrl}/file?key=${entry.Filename}`} />}
                        {hasCookoffEnded ? (
                            <CookoffScoreReadonly userScore={userScore} />
                        ) : (
                            <CookoffScoreEditable
                                entry={entry}
                                userScore={userScore}
                                onSaveScore={us => {
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
