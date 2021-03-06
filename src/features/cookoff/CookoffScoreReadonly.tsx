import { EntryUserScore } from "./types";
import { Header } from "semantic-ui-react";
import React from "react";

interface CookoffScoreReadonlyProps {
    userScore: EntryUserScore;
}

const CookoffScoreReadonly: React.FC<CookoffScoreReadonlyProps> = (props: CookoffScoreReadonlyProps) => {
    const { userScore: us } = props;
    return (
        <>
            <Header content={us.Comment} color="grey" />
            <Header content={`Score: ${us.Score || "?"}`} size="small" color="grey" />
        </>
    );
};

export default CookoffScoreReadonly;
