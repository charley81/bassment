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

export interface FaqItem {
  question: string
  answer: string
}

export interface VenueStat {
  value: string
  label: string
}

export interface GalleryImage {
  src: string
  size?: 'tall' | 'short'
}

export interface SoundSpec {
  value: string
  label: string
}

export interface ResidentDj {
  name: string
  description: string
  tags: string[]
  image: string
}
