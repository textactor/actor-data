import test from "ava";
import { launch, stop } from "dynamodb-local";
import DynamoDB = require("aws-sdk/clients/dynamodb");
import { DynamoActorRepository } from "./dynamo-actor-repository";
import { Actor, ActorHelper, ActorNameType } from "@textactor/actor-domain";

test.before("start dynamo", async (t) => {
  await t.notThrows(launch(8000, null, ["-inMemory", "-sharedDb"]));
});

test.after("top dynamo", async (t) => {
  t.notThrows(() => stop(8000));
});

const client = new DynamoDB.DocumentClient({
  region: "eu-central-1",
  endpoint: "http://localhost:8000",
  accessKeyId: "ID",
  secretAccessKey: "Key"
});

const repository = new DynamoActorRepository(client, "test");

test.beforeEach("createStorage", async (t) => {
  await t.notThrows(repository.createStorage());
});

test.afterEach("deleteStorage", async (t) => {
  await t.notThrows(repository.deleteStorage());
});

test.serial("#create input=output", async (t) => {
  const inputItem1: Actor = ActorHelper.build({
    lang: "en",
    country: "us",
    name: "Short Name",
    names: [{ name: "Name 1", type: ActorNameType.SAME, popularity: 1 }],
    wikiEntity: {
      countLinks: 10,
      countryCodes: [],
      name: "Long Name",
      wikiDataId: "Q123",
      wikiPageTitle: "Long title"
    }
  });

  const outputItem1 = await repository.create(inputItem1);

  t.is(inputItem1.id, outputItem1.id, "same id");
  t.deepEqual(inputItem1, outputItem1, "same object");
});

test.serial("#put", async (t) => {
  const inputItem1: Actor = ActorHelper.build({
    lang: "en",
    country: "us",
    name: "Short Name",
    names: [{ name: "Name 1", type: ActorNameType.SAME, popularity: 1 }],
    wikiEntity: {
      countLinks: 10,
      countryCodes: [],
      name: "Long Name",
      wikiDataId: "Q123",
      wikiPageTitle: "Long title"
    }
  });

  let outputItem1 = await repository.create(inputItem1);

  const inputItem2: Actor = { ...inputItem1, abbr: "WIKI" };

  const outputItem2 = await repository.put(inputItem2);

  t.is(outputItem2.id, outputItem1.id, "same id");
  t.is(outputItem2.abbr, "WIKI", "updated abbr");
});
