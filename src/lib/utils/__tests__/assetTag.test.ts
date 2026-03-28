import { describe, expect, it } from 'vitest'

import { nextTagInSequence, parseTagParts, sanitizePrefix } from '../assetTag'

// ---------------------------------------------------------------------------
// sanitizePrefix
// ---------------------------------------------------------------------------

describe('sanitizePrefix', () => {
  it('uppercases lowercase letters', () => {
    expect(sanitizePrefix('laptop')).toBe('LAPTOP')
  })

  it('strips non-alphanumeric characters', () => {
    expect(sanitizePrefix('IT-DEPT')).toBe('ITDEPT')
    expect(sanitizePrefix('my prefix!')).toBe('MYPREFIX')
  })

  it('returns empty string for an all-symbol input', () => {
    expect(sanitizePrefix('---')).toBe('')
  })

  it('passes through already-clean input unchanged', () => {
    expect(sanitizePrefix('AST')).toBe('AST')
  })
})

// ---------------------------------------------------------------------------
// nextTagInSequence
// ---------------------------------------------------------------------------

describe('nextTagInSequence', () => {
  it('returns prefix-0001 when no existing tags match', () => {
    expect(nextTagInSequence('AST', [])).toBe('AST-0001')
    expect(nextTagInSequence('AST', ['LAPTOP-0001', 'PHONE-0003'])).toBe('AST-0001')
  })

  it('increments past the highest existing number', () => {
    expect(nextTagInSequence('AST', ['AST-0001', 'AST-0002', 'AST-0003'])).toBe('AST-0004')
  })

  it('handles gaps in the sequence', () => {
    expect(nextTagInSequence('AST', ['AST-0001', 'AST-0010'])).toBe('AST-0011')
  })

  it('pads to 4 digits', () => {
    expect(nextTagInSequence('AST', ['AST-0009'])).toBe('AST-0010')
    expect(nextTagInSequence('AST', [])).toBe('AST-0001')
  })

  it('exceeds 4-digit padding for large sequences', () => {
    expect(nextTagInSequence('AST', ['AST-9999'])).toBe('AST-10000')
  })

  it('matches case-insensitively', () => {
    expect(nextTagInSequence('AST', ['ast-0005'])).toBe('AST-0006')
  })

  it('ignores tags whose suffix is not purely numeric', () => {
    expect(nextTagInSequence('AST', ['AST-001A', 'AST-0002'])).toBe('AST-0003')
  })

  it('handles existing tags with extra leading zeros correctly', () => {
    // parseInt('0005') = 5, so next is 6
    expect(nextTagInSequence('AST', ['AST-0005'])).toBe('AST-0006')
  })
})

// ---------------------------------------------------------------------------
// parseTagParts
// ---------------------------------------------------------------------------

describe('parseTagParts', () => {
  it('splits a standard tag into prefix and suffix', () => {
    expect(parseTagParts('LAPTOP-0042')).toEqual({ prefix: 'LAPTOP', suffix: '0042' })
  })

  it('handles multi-part prefixes by splitting on the last dash', () => {
    expect(parseTagParts('IT-DEPT-0001')).toEqual({ prefix: 'IT-DEPT', suffix: '0001' })
  })

  it('returns full string as prefix when no dash is present', () => {
    expect(parseTagParts('NODASH')).toEqual({ prefix: 'NODASH', suffix: '0001' })
  })

  it('treats leading dash as no-split case', () => {
    // lastIndexOf('-') === 0 → idx is not > 0, so falls back
    expect(parseTagParts('-0001')).toEqual({ prefix: '-0001', suffix: '0001' })
  })
})
