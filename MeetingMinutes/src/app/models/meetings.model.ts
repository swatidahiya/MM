import { MeetingActions } from './actions.model';
import { Decisions } from './decisions.model';
import { Comments } from './comment.model';
import { MeetingNote } from './meetingNote.model';

export class Meetings {
    MeetingID: number;
    Meeting_Subject: string;
    Meeting_objective: string;
    Conclusion: string;
    MeetingDate: Date;
    MeetingTime: string;
    MeetingAssignedTo: string;
    reoccrence: string;
    Meeting_Location: string;
    Partipatents: string;
    Share_Link: string;
    Status: number;
    RoomKey: number;
    HostUser: string;
    Comment: Comments;
    Action_Item: MeetingActions;
    Decision_Item: Decisions;
}