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

https://c4s-api.netlify.app/

### Info on using Open API spec

TBA


## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT


## Todo

- add example responses, better notes & descriptions to all endpoints & schemas
- further flesh out README
- document required response parsing for remix stream endpoints
  - can this be documented in the open api spec somewhere?
- allow language to be truly optional using middleware rewrite
  - instead of using en as default, we should omit language (and therefore use regional default)
- Put badge somewhere on readme that can reflect status of tests passing - therefore showing types are still up to date
  - run tests on some kind of schedule ?
- add endpoint for generic public search
- add jsdoc comments to all methods
  