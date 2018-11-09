#!/bin/bash

yarn unlink @textactor/domain
yarn unlink @textactor/actor-domain
yarn unlink dynamo-item

yarn upgrade --latest

yarn add @textactor/domain
yarn add @textactor/actor-domain
yarn add dynamo-item

yarn test
