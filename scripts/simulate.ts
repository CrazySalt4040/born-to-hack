import {writeFileSync} from 'node:fs';
import {ALL_EVENTS,cohortSummary,endingCatalog} from '../src/engine';
import {mortalitySource,remainingLifeExpectancy,hazardScale} from '../src/mortality';
import {gameplaySummary} from '../src/simulation';
const report={model:mortalitySource,hazardScale,expectedE0:remainingLifeExpectancy(),expectedRemainingAt15:remainingLifeExpectancy(15),expectedRemainingAt60:remainingLifeExpectancy(60),baseline:cohortSummary(100000,123),gameplay:gameplaySummary(2000,9001),catalogCount:endingCatalog.length,eventCount:ALL_EVENTS.length,limitations:['Age-specific curve is synthetic, not an observed life table.','Uniform random choices are not an optimal career policy.','Observed endings do not prove every catalog entry reachable from birth.','Rare transition witnesses are tested separately from population sampling.']};
writeFileSync('docs/simulation-results.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
