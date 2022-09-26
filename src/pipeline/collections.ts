import dayjs from 'dayjs';
import { Timestamp } from '@google-cloud/firestore';
import { PipelineOptions } from './pipeline.service';

const tsToIso = (value: Timestamp) => dayjs(value.toDate()).toISOString();

export const netsuiteOrder: PipelineOptions = {
    name: 'NetSuite__Order',
    collectionPath: 'EcommerceService/NetSuite/Order',
    transformFn: (row) => ({
        source_ref: row.source_ref.path,
        status: row.status,
        created_at: tsToIso(row.created_at),
        updated_at: tsToIso(row.updated_at),
        is_deleted: row.is_deleted,
        order: { id: row.order.id },
    }),
    schema: [
        { name: 'source_ref', type: 'STRING' },
        { name: 'status', type: 'STRING' },
        { name: 'created_at', type: 'TIMESTAMP' },
        { name: 'updated_at', type: 'TIMESTAMP' },
        { name: 'is_deleted', type: 'STRING' },
        {
            name: 'order',
            type: 'RECORD',
            fields: [{ name: 'id', type: 'NUMERIC' }],
        },
    ],
};
