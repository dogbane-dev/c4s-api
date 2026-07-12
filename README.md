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

### SDK Object

| Export | Input | Output |
| --- | --- | --- |
| `c4s` | N/A | Convenience SDK object containing `getCategories`, `getCategoryById`, `getCategoryByName`, `getCategoryDetails`, `getClip`, `getStudio`, `searchStudio`, `getTopStudios`, `getTopClips`, `getAllStudioClips`, and `searchClips`. |

### Core API Methods

| Export | Input | Output |
| --- | --- | --- |
| `getC4SCategories` | Optional language. | Category dropdown response with category entries. |
| `getC4SCategoryById` | Category ID and optional language. | Matching category entry. |
| `getC4SCategoryByName` | Exact category name and optional language. | Matching category entry. |
| `getC4SCategoryDetails` | Category ID, optional language, and optional sexual preference filters. | Category page data with metadata, top clips, top stores, and related sections. |
| `getC4SCategorySeeMore` | Category ID, section type, page, optional language, and optional sexual preference filters. | Raw "see more" category section response. |
| `getC4SCategorySeeMoreTopStores` | Category ID, page, optional language, and optional sexual preference filters. | Additional top store entries for the category. |
| `getC4SCategorySeeMoreTopClips` | Category ID, page, optional language, and optional sexual preference filters. | Additional top clip entries for the category. |
| `getC4SCategorySeeMoreRecentlyAddedRelatedClips` | Category ID, page, optional language, and optional sexual preference filters. | Additional recently added related clip entries for the category. |
| `searchC4SClips` | Optional search text, language, filters, page, sort, and spellcheck flag. | Clip search results with matching clips, stores, categories, filters, and metadata. |
| `getC4SClip` | Clip ID, optional studio ID, optional clip slug, and optional language. | Single clip detail data. |
| `getC4SClipById` | Clip ID plus optional studio ID, clip slug, and language. | Single clip detail data. |
| `getC4SClipByUrl` | Full or short Clips4Sale clip URL. | Single clip detail data. |
| `getC4SStudio` | Studio ID, optional studio slug, and optional language. | Single studio detail data. |
| `getC4SStudioByUrl` | Clips4Sale studio URL. | Single studio detail data. |
| `getC4SStudioClips` | Studio ID, optional slug, page, category ID, sort, search text, `onlyClips`, and language. | Paginated studio clip data. |

### Extended API Methods

| Export | Input | Output |
| --- | --- | --- |
| `getC4SAllStudioClips` | Studio clip query options plus optional `onPage` callback. | Flat array of all fetched studio clip entries. |
| `getC4STopClips` | Category ID, optional language, and optional sexual preference filters. | Combined top clip entries from category and "see more" pages. |
| `getC4STopStudios` | Category ID, optional language, and optional sexual preference filters. | Combined top studio entries from category and "see more" pages. |

### Client and Utility Methods

| Export | Input | Output |
| --- | --- | --- |
| `createC4SClient` | Optional custom `fetch` implementation. | Configured OpenAPI client for Clips4Sale. |
| `parseRemixBody` | Remix deferred response body and optional abort signal. | Parsed and unwrapped Remix deferred payload. |
| `safeParseC4SClipUrl` | Full or short Clips4Sale clip URL. | Parsed clip URL parts, or `null`. |
| `parseC4SClipUrl` | Full or short Clips4Sale clip URL. | Parsed clip URL parts, or throws `InvalidC4SUrlError`. |
| `getC4SClipUrlFromId` | Clip ID. | Parsed full clip URL parts resolved through the short-link redirect. |
| `safeParseC4SStudioUrl` | Clips4Sale studio URL or clip URL. | Parsed studio URL parts, or `null`. |
| `parseC4SStudioUrl` | Clips4Sale studio URL or clip URL. | Parsed studio URL parts, or throws `InvalidC4SUrlError`. |
| `parseLanguage` | Optional language code. | Internal language path parameter value. |
| `parseStudioId` | Optional studio ID. | Internal studio ID path parameter value. |
| `parseSlug` | Optional slug. | Provided slug or the redirect placeholder slug. |
| `parseSexualPreferences` | Optional sexual preference names. | Sorted Clips4Sale numeric preference IDs. |
| `parseStudioSearchSort` | Optional studio search sort option. | Clips4Sale studio search sort value. |
| `parseClipSearchSort` | Optional clip search sort option. | Clips4Sale clip search sort value. |
| `parseClipSearchFilters` | Optional clip search filter object. | Encoded Clips4Sale search filter path segment. |

### Error Exports

| Export | Input | Output |
| --- | --- | --- |
| `C4SApiError` | Response-like status object or error message. | Error for failed Clips4Sale API responses. |
| `C4SClipNotFoundError` | N/A | Error for missing Clips4Sale clips. |
| `C4SStudioNotFoundError` | N/A | Error for missing Clips4Sale studios. |
| `InvalidC4SUrlError` | Invalid URL string. | Error for unrecognized Clips4Sale URLs. |

## Future Work / Possible Contributions
- possibly fix language handling - `parseLanguage` is a bit yucky
  - this and the other request rewrite stuff is not great 
- add endpoint(s) for performers
- add endpoint(s) for store search 
- add example responses, better notes & descriptions to all endpoints & schemas (for openAPI spec)
