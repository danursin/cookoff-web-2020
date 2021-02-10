import { Comment, CookoffResult, EntryUserScore, ParticipantTrend } from "./types";
import { Cookoff, CookoffEntry } from "../../types";

import { createContext } from "react";

interface CookoffContextProps {
    cookoff?: Cookoff;
    setCookoff: (cookoff: Cookoff) => void;
    entries?: CookoffEntry[];
    setEntries: (entries: CookoffEntry[]) => void;
    userScores?: EntryUserScore[];
    setUserScores: (entries: EntryUserScore[]) => void;
    comments?: Comment[];
    setComments: (comments: Comment[]) => void;
    results?: CookoffResult[];
    setResults: (results: CookoffResult[]) => void;
    hasCookoffEnded: boolean;
    participantTrends?: ParticipantTrend[];
    setParticipantTrends: (trends: ParticipantTrend[]) => void;
}

export default createContext<CookoffContextProps>({
    setCookoff: () => {
        throw new Error("not implemented");
    },
    setEntries: () => {
        throw new Error("not implemented");
    },
    setUserScores: () => {
        throw new Error("not implemented");
    },
    setComments: () => {
        throw new Error("not implemented");
    },
    setResults: () => {
        throw new Error("not implemented");
    },
    hasCookoffEnded: false,
    setParticipantTrends: () => {
        throw new Error("not implemented");
    }
});
