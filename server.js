import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * In production we run in Deno (Netlify Edge Functions),
 * otherwise we run in Node.js (Vite dev server).
 */
const getEnv = () => {
  if (globalThis.Netlify) {
    return globalThis.Netlify.env.toObject();
  }
  return process.env;
};

/**
 * Netlify Edge Functions handler.
 * @param {Request} request
 * @param {import('@netlify/edge-functions').Context} netlifyContext
 * @return {Promise<Response | undefined>}
 */
export default async function handler(request, netlifyContext) {
  try {
    const env = getEnv();

    // Netlify Edge Functions natively support waitUntil.
    // The Oxygen ExecutionContext type includes additional Cloudflare-specific
    // properties that are not available in Netlify Edge Functions, but Hydrogen
    // only uses `waitUntil` at runtime.
    const executionContext = {
      waitUntil: netlifyContext.waitUntil.bind(netlifyContext),
    };

    // Allows Storefront API, sessions, cart, and other Hydrogen features to be used in loaders and actions
    const hydrogenContext = await createHydrogenRouterContext(
      request,
      env,
      executionContext,
    );

    // Wraps around the React Router request handler to provide Hydrogen context to loaders and actions
    const handleRequest = createRequestHandler({
      build: serverBuild,
      mode: process.env.NODE_ENV,
      getLoadContext: () => hydrogenContext,
    });

    const response = await handleRequest(request);

    // If an action or loader has modified the session, commit the changes to the response headers
    if (hydrogenContext.session.isPending) {
      response.headers.set('Set-Cookie', await hydrogenContext.session.commit());
    }

    if (response.status === 404) {
      /**
       * Check for redirects only when there's a 404 from the app.
       * If the redirect doesn't exist, then `storefrontRedirect`
       * will pass through the 404 response.
       */
      return storefrontRedirect({
        request,
        response,
        storefront: hydrogenContext.storefront,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
}
