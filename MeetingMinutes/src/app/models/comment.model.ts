import { MeetingActions } from './actions.model';
import { Decisions } from './decisions.model';
import { Meetings } from './meetings.model';

export class Comments {
    CommentID: number;
    meetingName: string;
    comment: string;
    CommentDate: Date;
    CommentTime: string;
    // Status: number;
    HostUser: string;
    MeetingID: number;
    ActionItemID: number;
}