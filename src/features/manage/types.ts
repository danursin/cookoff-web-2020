export interface ManagedParticipant {
    ParticipantID: number;
    Name: string;
    Username: string;
    IsAdmin: boolean;
    IsParticipant: boolean;
    IsLoading?: boolean;
}
