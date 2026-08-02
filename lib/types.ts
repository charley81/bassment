/* BASSMENT — Core Types (v1-latest)
 * Shared type definitions for all page content and components. */

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
}

export interface Event {
  id: string
  title: string
  date: string
  support: string
  image: string
}
