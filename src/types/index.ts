export interface Participant {
    ParticipantID?: number;
    Username: string;
    Name: string;
    IsAdmin: boolean;
    exp?: number;
}

export interface Cookoff {
    CookoffID?: number;
    Title: string;
    EventStartDate: string;
    EventEndDate: string;
    HostParticipantID: number;
    AreScoresReleased: boolean;
}

export interface CookoffParticipant {
    CookoffID: number;
    ParticipantID: number;
    CookoffParticipantID: number;
    Cookoff?: Cookoff;
    Participant?: Participant;
}

export interface CookoffEntry {
    CookoffEntryID: number;
    CookoffParticipantID: number;
    Title: string;
    Description: string;
    Filename: string;
    CookoffEntryScore: CookoffEntryScore;
}

export interface CookoffEntryScore {
    CookoffEntryScoreID: number;
    CookoffEntryID: number;
    CookoffParticipantID: number;
    Score: number;
    Comment: string;
}

export interface CookoffListItem extends Cookoff {
    HostFacebookID: string;
}

export interface UserCookoffs {
    Hosted: CookoffListItem[];
    Participating: CookoffListItem[];
}
