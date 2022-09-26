import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { pipelineService } from './pipeline/pipeline.service';
import { netsuiteOrder } from './pipeline/collections';

const app = express();

app.use('/', (req, res) => {
    Promise.all([netsuiteOrder].map((options) => pipelineService(options)))
        .then(() => res.status(200).end())
        .catch((err) => res.status(400).json({ err }));
});

http('main', app);
