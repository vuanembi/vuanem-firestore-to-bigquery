import { pipeline } from 'stream/promises';

import es from 'event-stream';
import ndjson from 'ndjson';
import { DocumentSnapshot } from '@google-cloud/firestore';

import { firestore } from '../db/firestore.service';
import { bigquery } from '../db/bigquery.service';

export type PipelineOptions = {
    name: string;
    collectionPath: string;
    transformFn: (data: any) => any;
    schema: Record<string, any>[];
};

export const pipelineService = (options: PipelineOptions) => {
    const { name, collectionPath, transformFn, schema } = options;

    return pipeline(
        firestore.collection(collectionPath).stream(),
        es.map((data: DocumentSnapshot, cb: any) => {
            cb(null, { id: data.id, ...transformFn(data.data()) });
        }),
        ndjson.stringify(),
        bigquery
            .dataset('IP_Marketplace')
            .table(name)
            .createWriteStream({
                schema: { fields: [{ name: 'id', type: 'STRING' }, ...schema] },
                createDisposition: 'CREATE_IF_NEEDED',
                writeDisposition: 'WRITE_TRUNCATE',
                sourceFormat: 'NEWLINE_DELIMITED_JSON',
            }),
    );
};
