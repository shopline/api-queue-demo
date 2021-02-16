# API Queue Demo

This library tries to solve the problems with API requests from client side using axios where you need to retry and queue a lot of requests.

All requests are to be made with async.

The library needs to be able to scale with parallel workers/threads using a worker queue for faster processing.

The project should be split into a service class which is used by the client, an api client that handles the queues and workers and apicalls that define the possible api calls
and manipulation of data from the server before recieved by the client.

This project utilizes axios for API calls and should work in a nodejs environment.

Create a project at https://requestbin.com/ for testing.

## Example scenarios

Imagine an order system where you have 1000 orders and need to update every order from Open to Closed. The user marks all the others and sends 1000 requests to the server.
This needs to be queued and throttled. If any update fails it should retry X times but not stop the other order updates from failing.

Imagine listing or batch updating products on a backend where you fetch 100 products for listing. Each get request should be done asynchronously not blocking each other.
If a request fails it will retry X times.

## Options

The library needs to support the following options:

- How many threads/forks/workers to use
- How many request attempts before giving up
- How many requests to be made per second, supporting throttling
- Support caching of responses


## Caching

Each API call should have the ability to set a flag to support caching, and each API call should set how long to cache. If the client makes a second request on a cached
API call it should first hit the cache if it exists.

Cache can be done in JSON files on disk or SQLite DB.

## Example problems

Following scenarios are some of the typical problems that can occur when making an API request in where the library needs retry the request.

### Network error

Can happen when the client loses connection to the internet, or the API server is not responsive. Network errors do not return a status code in axios and should
be the final fallback if no other errors occur before it.

### CORS problems

Can happen when the server either is misconfigured and does not send the correct CORS headers, or if for some reason the response is invalid and missing CORS headers

### 50x / 40x errors

Can happen when the server is under heavy load or other issues.


## Libraries

Possibly use the following libraries:


Fastq. In memory queue. DO NOT use REDIS based queues:

https://github.com/mcollina/fastq
