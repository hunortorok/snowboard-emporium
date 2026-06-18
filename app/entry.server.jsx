import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
// `server.browser` sounds funny, but it is the correct entry point to use when
// rendering in a non-Node.js edge environment (Netlify Edge Functions / Deno)
import {renderToReadableStream} from 'react-dom/server.browser';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  // Deno's ReadableByteStreamController throws if the stream is closed after
  // an abort signal fires. Work around this by using an intermediary
  // AbortController that only forwards the abort if the stream is still open.
  let isStreamClosing = false;
  const abortController = new AbortController();
  request.signal.addEventListener('abort', () => {
    if (!isStreamClosing) {
      abortController.abort(request.signal.reason);
    }
  });

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: abortController.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  // Identity transform to detect when the stream finishes naturally,
  // preventing the abort handler from double-closing it.
  const transformedBody = body.pipeThrough(
    new TransformStream({
      flush() {
        isStreamClosing = true;
      },
    }),
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(transformedBody, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
