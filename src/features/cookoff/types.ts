export interface EntryUserScore {
    CookoffEntryID: number;
    CookoffParticipantID: number;
    CookoffEntryScoreID: number;
    Score: number | null;
    Comment: string | null;
}

export interface Comment {
    CookoffEntryID: number;
    CookoffEntryScoreID: number;
    Comment: string;
}

export interface CookoffResult {
    CookoffEntryID: number;
    Title: string;
    ParticipantID: number;
    ParticipantName: string;
    Average: number;
    Maximum: number;
    Minimum: number;
    StandardDeviation: number;
    Rank: number;
}
