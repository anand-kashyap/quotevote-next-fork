import { parseSearchQuery } from '@/utils/parseSearchQuery'

describe('parseSearchQuery (Frontend)', () => {
  it('returns plain text when no tokens exist', () => {
    const result = parseSearchQuery('hello world')
    expect(result.usernames).toEqual([])
    expect(result.hashtags).toEqual([])
    expect(result.textQuery).toBe('hello world')
  })

  it('extracts usernames and hashtags and preserves textQuery', () => {
    const result = parseSearchQuery('@alice and @bob went to #nyc for #reactconf')
    expect(result.usernames).toEqual(['alice', 'bob'])
    expect(result.hashtags).toEqual(['nyc', 'reactconf'])
    expect(result.textQuery).toBe('and went to for')
  })

  it('handles empty query strings', () => {
    const result = parseSearchQuery('')
    expect(result.usernames).toEqual([])
    expect(result.hashtags).toEqual([])
    expect(result.textQuery).toBe('')
  })
})
