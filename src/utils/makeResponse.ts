import type { TResponse } from '../utils/types';


/**
 * Creates a response object with the given body, status, and optional headers.
 *
 * @param {TResponse} body - the body of the response
 * @param {number} status - the HTTP status code of the response
 * @param {Object} headers - optional headers for the response
 * @return {Response} a Promise that resolves to a Response object
 */
export default function makeResponse(
  { body, status, headers = {} }: TResponse): Response {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })
};