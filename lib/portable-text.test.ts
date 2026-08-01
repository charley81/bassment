import { describe, it, expect } from 'vitest'
import { toParagraphs, toPlainText } from './portable-text'

const blocks = [
  { _type: 'block', children: [{ text: 'First ' }, { text: 'paragraph' }] },
  { _type: 'image', alt: 'not a block' },
  { _type: 'block', children: [{ text: 'Second paragraph' }] },
]

describe('toParagraphs', () => {
  it('returns one string per block, joining spans', () => {
    expect(toParagraphs(blocks)).toEqual(['First paragraph', 'Second paragraph'])
  })

  it('ignores non-block types', () => {
    expect(toParagraphs(blocks)).toHaveLength(2)
  })

  it('wraps a plain string', () => {
    expect(toParagraphs('hello')).toEqual(['hello'])
  })

  it('returns [] for empty string, null, and non-array input', () => {
    expect(toParagraphs('')).toEqual([])
    expect(toParagraphs(null)).toEqual([])
    expect(toParagraphs(undefined)).toEqual([])
    expect(toParagraphs(42)).toEqual([])
  })

  it('handles blocks with missing children', () => {
    expect(toParagraphs([{ _type: 'block' }])).toEqual([])
  })
})

describe('toPlainText', () => {
  it('joins paragraphs with a space', () => {
    expect(toPlainText(blocks)).toBe('First paragraph Second paragraph')
  })

  it('returns empty string for null', () => {
    expect(toPlainText(null)).toBe('')
  })
})
