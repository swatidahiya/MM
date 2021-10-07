import { PollOption } from './pollOption.model';

export class Poll {
    PollID: number;
    Question: string;
    Polldate: Date;
    Active: boolean;
    options: Array<Object>;
    answered: Array<String>;
    
}