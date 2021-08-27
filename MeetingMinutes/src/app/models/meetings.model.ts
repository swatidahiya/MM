import { MeetingActions } from './actions.model';
import { Decisions } from './decisions.model';
import { Comments } from './comment.model';
import { MeetingNote } from './meetingNote.model';

export class Meetings {
    MeetingID: number;
    project_Name: string;
    Meeting_Subject: string;
    Meeting_objective: string;
    Conclusion: string;
    Agenda: string;
    Agenda_SubItem: string;
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
    Meeting_Notes: MeetingNote;
}