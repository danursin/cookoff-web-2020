import React from "react";
import { useContext } from "react";
import CookoffContext from "./CookoffContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { Accordion, AccordionPanelProps, Label, Header, Image } from "semantic-ui-react";
import { SemanticShorthandItem } from "semantic-ui-react/dist/commonjs/generic";
import config from "../../config";

const CookoffScores = () => {
    const { userScores } = useContext(CookoffContext);

    if (!userScores) {
        return <SimpleLoader message="Loading scores..." />;
    }

    const panels: SemanticShorthandItem<AccordionPanelProps>[] = userScores.map(us => {
        return {
            key: us.CookoffEntryID,
            title: {
                content: (
                    <>
                        <Label content={us.Title} color="grey" />
                        <Header size="small" floated="right" color="grey" content={us.Score || "?"} />
                    </>
                )
            },
            content: {
                content: (
                    <>
                        <Image centered src={`${config.cookoffApiUrl}/file?key=${us.Filename}`} />
                    </>
                )
            }
        };
    });

    return <Accordion fluid styled panels={panels} exclusive={false} />;
};

export default CookoffScores;
