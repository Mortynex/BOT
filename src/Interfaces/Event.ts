import Bot from "../Client";

interface EventRun{
    (client: Bot, ...args: any[])
}
 
export interface Event {
    name: string;
    run: EventRun
}