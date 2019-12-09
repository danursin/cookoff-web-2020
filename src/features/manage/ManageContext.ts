import { Cookoff } from "../../types";
import { createContext } from "react";
import { ManagedParticipant } from "./types";

interface ManageContextProps {
    cookoff?: Cookoff;
    setCookoff: (cookoff: Cookoff) => void;
    participants?: ManagedParticipant[];
    setParticipants: (participants: ManagedParticipant[]) => void;
}

export default createContext<ManageContextProps>({
    setCookoff: () => {
        throw new Error("not implemented");
    },
    setParticipants: () => {
        throw new Error("not implemented");
    }
});
