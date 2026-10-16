import {mkdirSync,writeFileSync} from 'node:fs';
import {play} from '../src/simulation';
import {serialize} from '../src/save';
mkdirSync('.qa',{recursive:true});
writeFileSync('.qa/completed-life.json',serialize(play(42)));
