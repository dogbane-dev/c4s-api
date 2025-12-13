import openapiTS, { astToString, type OpenAPI3 } from 'openapi-typescript'
import { schema } from '../open-api/schema'

// open api schema json
await Bun.file('./public/schema.json').write(JSON.stringify(schema, null, 2))

// open api auto generated types
const contents = astToString(await openapiTS(schema as OpenAPI3))
await Bun.file('./src/open-api/paths.generated.ts').write(contents)
