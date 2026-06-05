
import { LogPayload,LogLevel } from "src/types/log.types";

export class LoggerService
{
    private log(level:LogLevel,payload:LogPayload)
    {
        const logObject = {
            timestamp: new Date().toISOString(),
            level,
            service:payload.service,
            event:payload.event,
            message:payload.message,
            metadata:payload.metadata
        }
        console.log(JSON.stringify(logObject));
    };
    
    info(payload:LogPayload)
    {
        this.log("INFO",payload);
    }

    warn(payload:LogPayload)
    {
        this.log( "WARN",payload);
    }

    error(payload:LogPayload)
    {
        this.log("ERROR", payload);
    }

    debug(payload:LogPayload)
    {
        this.log("DEBUG", payload);
    }
}

export const logger = new LoggerService()