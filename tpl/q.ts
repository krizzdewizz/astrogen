import { iff } from 'astrogen/util';

const a = iff('', false, false)

const model = {
    name: 'Person',
    toString: true,
    fields: [
        {
            name: 'name',
            type: 'string',
            required: true
        },
        {
            name: 'age',
            type: 'number',
            required: true
        },
        {
            name: 'alienDisaster-dont',
            type: 'boolean',
            required: false
        }
    ]
}


console.log('aaaa', a, model);
