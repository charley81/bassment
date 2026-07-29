import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'bassment',
  title: 'BASSMENT CMS',
  projectId: 'cp66glrr',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
