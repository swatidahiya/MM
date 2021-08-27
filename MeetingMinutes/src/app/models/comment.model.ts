import { MeetingActions } from './actions.model';
import { Decisions } from './decisions.model';
import { Meetings } from './meetings.model';

export class Comments {
    CommentID: number;
    project_Name: string;
    Comment1: string;
    CommentDate: Date;
    CommentTime: string;
    Status: number;
    HostUser:   string;
    MeetingID: number;
    ActionID: number;
    DecisionID: number;
    Action_Item: MeetingActions;
    Decision_Item: Decisions;
    Meetings: Meetings
}