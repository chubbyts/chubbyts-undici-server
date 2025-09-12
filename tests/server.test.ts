import { describe, expect, test } from 'vitest';
import { pipe, Response, ServerRequest } from '../src/server.js';

describe('server', () => {
  describe('ServerRequest', () => {
    test('with url, without init', async () => {
      const serverRequest = new ServerRequest('https://example.com');

      expect(serverRequest.method).toBe('GET');
      expect(serverRequest.url).toBe('https://example.com/');
      expect([...serverRequest.headers.entries()]).toMatchInlineSnapshot('[]');
      expect(await serverRequest.text()).toBe('');
      expect(serverRequest.attributes).toMatchInlineSnapshot('{}');
    });

    test('with url, with init', async () => {
      const serverRequest = new ServerRequest('https://example.com', {
        method: 'POST',
        headers: { headerName: 'headerValue' },
        body: 'body',
        attributes: { attributeName: 'attributeValue' },
      });

      expect(serverRequest.method).toBe('POST');
      expect(serverRequest.url).toBe('https://example.com/');
      expect([...serverRequest.headers.entries()]).toMatchInlineSnapshot(`
        [
          [
            "content-type",
            "text/plain;charset=UTF-8",
          ],
          [
            "headername",
            "headerValue",
          ],
        ]
      `);
      expect(await serverRequest.text()).toBe('body');
      expect(serverRequest.attributes).toMatchInlineSnapshot(`
        {
          "attributeName": "attributeValue",
        }
      `);
    });

    test('with request, without init', async () => {
      const serverRequest = new ServerRequest(new ServerRequest('https://example.com'));

      expect(serverRequest.method).toBe('GET');
      expect(serverRequest.url).toBe('https://example.com/');
      expect([...serverRequest.headers.entries()]).toMatchInlineSnapshot('[]');
      expect(await serverRequest.text()).toBe('');
      expect(serverRequest.attributes).toMatchInlineSnapshot('{}');
    });

    test('with request, with init on inner request', async () => {
      const serverRequest = new ServerRequest(
        new ServerRequest('https://example.com', {
          method: 'POST',
          headers: { headerName: 'headerValue' },
          body: 'body',
          attributes: { attributeName: 'attributeValue' },
        }),
      );

      expect(serverRequest.method).toBe('POST');
      expect(serverRequest.url).toBe('https://example.com/');
      expect([...serverRequest.headers.entries()]).toMatchInlineSnapshot(`
        [
          [
            "content-type",
            "text/plain;charset=UTF-8",
          ],
          [
            "headername",
            "headerValue",
          ],
        ]
      `);
      expect(await serverRequest.text()).toBe('body');
      expect(serverRequest.attributes).toMatchInlineSnapshot(`
        {
          "attributeName": "attributeValue",
        }
      `);
    });

    test('with request, with init on outer request', async () => {
      const serverRequest = new ServerRequest(new ServerRequest('https://example.com'), {
        method: 'POST',
        headers: { headerName: 'headerValue' },
        body: 'body',
        attributes: { attributeName: 'attributeValue' },
      });

      expect(serverRequest.method).toBe('POST');
      expect(serverRequest.url).toBe('https://example.com/');
      expect([...serverRequest.headers.entries()]).toMatchInlineSnapshot(`
        [
          [
            "content-type",
            "text/plain;charset=UTF-8",
          ],
          [
            "headername",
            "headerValue",
          ],
        ]
      `);
      expect(await serverRequest.text()).toBe('body');
      expect(serverRequest.attributes).toMatchInlineSnapshot(`
        {
          "attributeName": "attributeValue",
        }
      `);
    });

    test('clone', async () => {
      const serverRequest = new ServerRequest('https://example.com', {
        method: 'POST',
        headers: { headerName: 'headerValue' },
        body: 'body',
        attributes: { attributeName: 'attributeValue' },
      });

      const clonedServerRequest = serverRequest.clone();

      expect(clonedServerRequest).not.toBe(serverRequest);
      expect(clonedServerRequest.headers).not.toBe(serverRequest.headers);
      expect(clonedServerRequest.attributes).not.toBe(serverRequest.attributes);

      expect(clonedServerRequest.method).toBe('POST');
      expect(clonedServerRequest.url).toBe('https://example.com/');
      expect([...clonedServerRequest.headers.entries()]).toMatchInlineSnapshot(`
        [
          [
            "content-type",
            "text/plain;charset=UTF-8",
          ],
          [
            "headername",
            "headerValue",
          ],
        ]
      `);
      expect(await clonedServerRequest.text()).toBe('body');
      expect(clonedServerRequest.attributes).toMatchInlineSnapshot(`
        {
          "attributeName": "attributeValue",
        }
      `);
    });
  });

  describe('pipe', () => {
    test('with 3 middlewares', async () => {
      const middleware = pipe<{ middleware1?: boolean; middleware2?: boolean; middleware3?: boolean }>([
        async (request, handler) => {
          return handler(new ServerRequest(request, { attributes: { ...request.attributes, middleware1: true } }));
        },
        async (request, handler) => {
          return handler(new ServerRequest(request, { attributes: { ...request.attributes, middleware2: true } }));
        },
        async (request, handler) => {
          return handler(new ServerRequest(request, { attributes: { ...request.attributes, middleware3: true } }));
        },
      ]);

      const response = await middleware(new ServerRequest('https://example.com'), async (request) => {
        return new Response(JSON.stringify(request.attributes));
      });

      expect(await response.text()).toMatchInlineSnapshot(
        '"{"middleware1":true,"middleware2":true,"middleware3":true}"',
      );
    });
  });
});
