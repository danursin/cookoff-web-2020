import { Cookoff, CookoffEntry } from "../../types";
import { createContext } from "react";
import { EntryUserScore } from "./types";

interface CookoffContextProps {
    cookoff?: Cookoff;
    setCookoff: (cookoff: Cookoff | undefined) => void;
    entries?: CookoffEntry[];
    setEntries: (entries: CookoffEntry[] | undefined) => void;
    userScores?: EntryUserScore[];
    setUserScores: (entries: EntryUserScore[] | undefined) => void;
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
    }
});
