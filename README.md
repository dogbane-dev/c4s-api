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

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
