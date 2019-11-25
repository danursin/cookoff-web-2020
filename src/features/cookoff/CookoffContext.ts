import { Cookoff, CookoffEntry } from "../../types";
import { createContext } from "react";
import { EntryUserScore, Comment, CookoffResult } from "./types";

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
    }
});
