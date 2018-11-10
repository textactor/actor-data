
import test from 'ava';
import { launch, stop } from 'dynamodb-local';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { DynamoActorNameItem } from './dynamo-actor-name';
import { ActorName, ActorNameType } from '@textactor/actor-domain';



test.before('start dynamo', async t => {
    await t.notThrows(launch(8000, null, ['-inMemory', '-sharedDb']));
})

test.after('top dynamo', async t => {
    t.notThrows(() => stop(8000));
})

const client = new DynamoDB.DocumentClient({
    region: "eu-central-1",
    endpoint: "http://localhost:8000",
    accessKeyId: 'ID',
    secretAccessKey: 'Key',
});

const dynamoItem = new DynamoActorNameItem(client, 'test');

test.beforeEach('createTable', async t => {
    await t.notThrows(dynamoItem.createTable());
})

test.afterEach('deleteTable', async t => {
    await t.notThrows(dynamoItem.deleteTable());
})


test.serial('#create input=output', async t => {
    const inputItem1: ActorName = {
        id: 'f4365456f4564356f45',
        name: 'Some Name',
        country: 'us',
        lang: 'en',
        actorId: '123423d43f',
        countWords: 2,
        createdAt: 2342543534,
        type: ActorNameType.SAME,
    };

    const outputItem1 = await dynamoItem.create(inputItem1);

    t.is(inputItem1.id, outputItem1.id, 'same id');
    t.deepEqual(inputItem1, outputItem1, 'same object');
})

test.serial('#create no duplicates', async t => {
    const inputItem1: ActorName = {
        id: 'f4365456f4564356f45',
        name: 'Some Name',
        country: 'us',
        lang: 'en',
        actorId: '123423d43f',
        countWords: 2,
        createdAt: 2342543534,
        type: ActorNameType.SAME,
    };

    const outputItem1 = await dynamoItem.create(inputItem1);

    t.is(inputItem1.id, outputItem1.id, 'same id');
    t.deepEqual(inputItem1, outputItem1, 'same object');

    await t.throws(dynamoItem.create(inputItem1), /The conditional request failed/);
})

test.serial('#createOrUpdate', async t => {
    const inputItem1: ActorName = {
        id: 'f4365456f4564356f45cc',
        name: 'Some Name',
        country: 'us',
        lang: 'en',
        actorId: '123423d43fa',
        countWords: 2,
        createdAt: 23425435344,
        type: ActorNameType.SAME,
    };

    let outputItem1 = await dynamoItem.create(inputItem1);

    const inputItem2: ActorName = { ...inputItem1, type: ActorNameType.WIKI };

    const outputItem2 = await dynamoItem.createOrUpdate(inputItem2);

    t.is(outputItem2.id, outputItem1.id, 'same id');
    t.is(outputItem2.type, ActorNameType.WIKI, 'updated type');
})
