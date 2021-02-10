import { Entry, ManagedParticipant } from "./types";

import { Cookoff } from "../../types";
import { createContext } from "react";

interface ManageContextProps {
    cookoff?: Cookoff;
    setCookoff: (cookoff: Cookoff) => void;
    participants?: ManagedParticipant[];
    setParticipants: (participants: ManagedParticipant[]) => void;
    entries?: Entry[];
    setEntries: (entries: Entry[]) => void;
}

export default createContext<ManageContextProps>({
    setCookoff: () => {
        throw new Error("not implemented");
    },
    setEntries: () => {
        throw new Error("not implemented");
    },
    setParticipants: () => {
        throw new Error("not implemented");
    }
});
