# c4s-api

Unofficial api client, types, and open-api schema for Clips4Sale adult video web store

## Status

![Api Tests](https://github.com/dogbane-dev/c4s-api/actions/workflows/api-tests.yml/badge.svg)

If this is not passing, Clips4Sale's underlying API may have changed and the this library's requests & types may be incorrect.

## Installation

```bash
npm install c4s-api
```

## Usage

```typescript
import { getC4SClip } from 'c4s-api';

const clipData = await getC4SClip({
  clipId: 29869933,
  studioId: 254031,
});

console.log(clipData.clip.title); // Tatti Swallows Intruder Cum Then Fucked Again! 4K"
```

OR

```typescript
import { c4s } from 'c4s-api';

const clipData = await c4s.getClip({
  clipId: 29869933,
  studioId: 254031,
});

console.log(clipData.clip.title); // Tatti Swallows Intruder Cum Then Fucked Again! 4K"
```

## Swagger Docs

https://c4s-api.netlify.app/ ([Schema JSON](https://c4s-api.netlify.app/schema.json))

### Caveats

#### Remix Response Decoding

Some of the endpoints listed in the OpenAPI spec provided above will not work out of the box with a typical OpenAPI client due to the way the data is returned from clips4sale. The endpoints that have a content type of `remix/deferred;` require special parsing to be re-formed into valid JSON objects. Internally, `c4s-api` methods and SDK use [an internal remix-run method](https://github.com/dogbane-dev/c4s-api/blob/main/src/client/utils.ts#L3) in our client middleware to do this for you.

If you want to do this yourself, you can see how we do it [here](https://github.com/dogbane-dev/c4s-api/blob/main/src/client/utils.ts). This helper method is also exported from the library:

```typescript
import { parseRemixBody } from 'c4s-api';
```

#### Remix Redirects

Further, some of the endpoints have a unique behavior that allows you to use an incorrect clip or studio slug. If you attempt to fetch a clip with a valid studio and clip ID but invalid slug, the response will contain special headers with redirect information:

```
x-remix-redirect: /studio/[[id]]/[[clipId]]/[[correct-slug-here]]
x-remix-status: 302
```

The `c4s-api` methods and SDK will automatically follow these redirects for you, potentially resulting in multiple requests per call. To prevent multiple requests, explicitly pass in the correct `slug` parameter when calling one a method that requires it.


#### Censored Responses

Depending on your regional laws, Clips4Sale will censor all of its response data (clip and studio titles, descriptions, etc) with `*` characters masking all potentially NSFW words.

You can get around this by adding a `Cookie` request header with the value of `ageVerified=true;` to all requests. The `c4s-api` methods and SDK  automatically add this header to every request.


## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT

## Available Methods

TBD

## Future Work / Possible Contributions
- add endpoint(s) for performers
- add endpoint(s) for store search 
- add example responses, better notes & descriptions to all endpoints & schemas
- document available exports and SDK
- add jsdoc comments to all methods
  
