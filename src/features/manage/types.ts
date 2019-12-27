import { CookoffEntry } from "../../types";

export interface ManagedParticipant {
    ParticipantID: number;
    Name: string;
    Username: string;
    IsAdmin: boolean;
    IsParticipant: boolean;
    IsLoading?: boolean;
}

export type Entry = CookoffEntry & { ParticipantID: number };
