import {endingService} from './ending-service';
import {configuredComposer} from './provider';
import {createEndingServer} from './http';
const service=endingService(process.env.ENDING_CACHE_DIR??'.ending-cache',configuredComposer());
createEndingServer(service).listen(Number(process.env.PORT??8787),'127.0.0.1',()=>console.log('Ending API listening on localhost'));
