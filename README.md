# c4s-api

Unofficial api client, types, and open-api schema for Clips4Sale adult video web store

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

## Swagger Docs

https://c4s-api.netlify.app/


## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT


## TODO

- add example responses, better notes & descriptions to all endpoints & schemas
- further flesh out README
- document required response parsing for remix stream endpoints
  - can this be documented in the open api spec somewhere?
- allow language to be truly optional using middleware rewrite
  - instead of using en as default, we should omit language (and therefore use regional default)
- refactor sdk methods to have more readable input args (jsdoc?), does not need to conform to open api spec necessarily since type safety will be ensured regardless
  - rename category additional details to something else
  - higher level - get ALL ___ methods
- Put badge somewhere on readme that can reflect status of tests passing - therefore showing types are still up to date
  - run tests on some kind of schedule ?
  