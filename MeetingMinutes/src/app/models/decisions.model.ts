import { Meetings } from "./meetings.model";

export class Decisions {
    DecisionItemID: number;
    DecisionItem_Title: string;
    project_Name: string;
    Description: string;
    DecisionDate: Date;
    DecisionTime: string;
    DecisionAssignedTo: string;
    Priority: string;
    Status: number;
    MeetingID: number;
    Meeting: Meetings
}