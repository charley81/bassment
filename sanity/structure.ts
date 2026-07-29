import { structureTool } from 'sanity/structure'
import { CogIcon } from '@sanity/icons/Cog'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { UsersIcon } from '@sanity/icons/Users'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { ImageIcon } from '@sanity/icons/Image'
import { HomeIcon } from '@sanity/icons/Home'
import { MasterDetailIcon } from '@sanity/icons/MasterDetail'
import type { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site Settings').icon(CogIcon).child(
        S.document().schemaType('siteSettings').documentId('siteSettings')
      ),
      S.divider(),
      S.listItem().title('Events').icon(CalendarIcon).child(
        S.documentTypeList('event').title('Events')
      ),
      S.listItem().title('Artists').icon(UsersIcon).child(
        S.documentTypeList('artist').title('Artists')
      ),
      S.divider(),
      S.listItem().title('FAQs').icon(HelpCircleIcon).child(
        S.documentTypeList('faq').title('FAQs')
      ),
      S.listItem().title('Gallery').icon(ImageIcon).child(
        S.documentTypeList('galleryImage').title('Gallery Images')
      ),
      S.divider(),
      S.listItem().title('Venue Page').icon(HomeIcon).child(
        S.document().schemaType('venuePage').documentId('venuePage')
      ),
      S.listItem().title('Sound System Page').icon(MasterDetailIcon).child(
        S.document().schemaType('soundSystemPage').documentId('soundSystemPage')
      ),
    ])
