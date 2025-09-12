# chubbyts-undici-server

[![CI](https://github.com/chubbyts/chubbyts-undici-server/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-undici-server/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-undici-server/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-undici-server?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-undici-server%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-undici-server/master)
[![npm-version](https://img.shields.io/npm/v/@chubbyts/chubbyts-undici-server.svg)](https://www.npmjs.com/package/@chubbyts/chubbyts-undici-server)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-undici-server&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-undici-server)

## Description

Use undici within a server framework.

## Requirements

 * node: 20
 * [undici][2]: ^7.16.0

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-undici-server][1].

```sh
npm i @chubbyts/chubbyts-undici-server@^1.0.0
```

## Usage

```ts
import type { Handler, Middleware } from '@chubbyts/chubbyts-undici-server/dist/server';
import { ServerRequest, Response } from '@chubbyts/chubbyts-undici-server/dist/server';

const serverRequest = new ServerRequest('https://example.com/path/to/route', {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json'
  },
  body: JSON.stringify({ message: 'text' }),
});

const handler: Handler = async (serverRequest: ServerRequest): Promise<Response> => {
  return new Response(
    JSON.stringify({
      method: serverRequest.method,
      url: serverRequest.url,
      headers: Object.fromEntries(serverRequest.headers.entries()),
      body: await serverRequest.json(),
    }),
    {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    },
  );
};

const middleware: Middleware = async (
  serverRequest: ServerRequest,
  handler: Handler
): Promise<Response> => handler(serverRequest);

const response = await middleware(serverRequest, handler);
```

## Copyright

2025 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-server
[2]: https://www.npmjs.com/package/undici
