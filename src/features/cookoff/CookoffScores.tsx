import React from "react";
import { useContext } from "react";
import CookoffContext from "./CookoffContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { Accordion, AccordionPanelProps, Label, Header, Image } from "semantic-ui-react";
import { SemanticShorthandItem } from "semantic-ui-react/dist/commonjs/generic";
import config from "../../config";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { EntryUserScore } from "./types";
import AuthContext from "../../shared/AuthContext";
import { CookoffEntry } from "../../types";

const CookoffScores = () => {
    const { user } = useContext(AuthContext);
    const { cookoff, userScores, setUserScores, entries } = useContext(CookoffContext);

    useEffect(() => {
        if (userScores) {
            return;
        }
        (async () => {
            const result = await sproc<EntryUserScore>({
                objectName: "GetCookoffParticipantScores",
                parameters: {
                    CookoffID: cookoff!.CookoffID!,
                    ParticipantID: user!.ParticipantID
                }
            });
            setUserScores(result);
        })();
    }, [cookoff, user, userScores, setUserScores]);

    if (!entries || !userScores) {
        return <SimpleLoader message="Loading scores..." />;
    }

    const panels: SemanticShorthandItem<AccordionPanelProps>[] = userScores.map(us => {
        const entry: CookoffEntry = entries.find(e => e.CookoffEntryID === us.CookoffEntryID)!;
        return {
            key: us.CookoffEntryID,
            title: {
                content: (
                    <>
                        <Label content={entry.Title} color="grey" />
                        <Header
                            size="small"
                            floated="right"
                            color="grey"
                            content={us.Score === null || us.Score === undefined ? "?" : us.Score}
                        />
                    </>
                )
            },
            content: {
                content: (
                    <>
                        {!!entry.Filename && <Image centered src={`${config.cookoffApiUrl}/file?key=${entry.Filename}`} />}
                        <Header content={us.Comment} color="grey" />
                        <Header content={`Score: ${us.Score}`} size="small" color="grey" />
                    </>
                )
            }
        };
    });

    return <Accordion fluid styled panels={panels} exclusive={false} />;
};

export default CookoffScores;
