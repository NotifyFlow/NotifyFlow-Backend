export type LogLevel = "INFO"
    | "WARN"
    | "ERROR"
    | "DEBUG";

export interface LogPayload
{
    service:string;
    event:string;
    message:string;
    metadata?:Record<string,unknown>;
}