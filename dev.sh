#!/bin/bash

yarn remove @textactor/domain
yarn remove @textactor/actor-domain
yarn remove dynamo-item

yarn link @textactor/domain
yarn link @textactor/actor-domain
yarn link dynamo-item

yarn test
