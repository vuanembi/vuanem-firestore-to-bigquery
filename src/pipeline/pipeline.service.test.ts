import { pipelineService } from './pipeline.service';
import { netsuiteOrder } from './collections';

it('Pipeline', () => {
    return pipelineService(netsuiteOrder);
});
