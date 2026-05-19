import { cleanUpProcessor } from "../processors/cleanup-inapp.processor";


function cleanUpWorker()
{
    setInterval(async()=>await cleanUpProcessor(),15000);
}

cleanUpWorker();