import { describe, it, expect } from 'vitest'

// Core scoring logic extracted for testing
function calculatePercentage(score, total) {
  return Math.round((score / total) * 100)
}

function rankScores(scores) {
  return [...scores].sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage
    if (b.score !== a.score) return b.score - a.score
    return a.time - b.time
  })
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

describe('Score calculation', () => {
  it('calculates percentage correctly', () => {
    expect(calculatePercentage(8, 10)).toBe(80)
  })

  it('returns 100% for a perfect score', () => {
    expect(calculatePercentage(10, 10)).toBe(100)
  })

  it('returns 0% for no correct answers', () => {
    expect(calculatePercentage(0, 10)).toBe(0)
  })

  it('rounds percentages correctly', () => {
    expect(calculatePercentage(1, 3)).toBe(33)
  })
})

describe('Leaderboard ranking', () => {
  it('ranks higher percentage first', () => {
    const scores = [
      { name: 'Alice', percentage: 70, score: 7, time: 60 },
      { name: 'Bob', percentage: 90, score: 9, time: 90 },
    ]
    const ranked = rankScores(scores)
    expect(ranked[0].name).toBe('Bob')
  })

  it('ranks faster time first when percentages are equal', () => {
    const scores = [
      { name: 'Alice', percentage: 80, score: 8, time: 90 },
      { name: 'Bob', percentage: 80, score: 8, time: 45 },
    ]
    const ranked = rankScores(scores)
    expect(ranked[0].name).toBe('Bob')
  })

  it('ranks higher score first when percentages are equal but scores differ', () => {
    const scores = [
      { name: 'Alice', percentage: 80, score: 8, time: 60 },
      { name: 'Bob', percentage: 80, score: 9, time: 60 },
    ]
    const ranked = rankScores(scores)
    expect(ranked[0].name).toBe('Bob')
  })
})
describe('Time formatting', () => {
  it('formats seconds under a minute correctly', () => {
    expect(formatTime(45)).toBe('0:45')
  })

  it('formats exactly one minute correctly', () => {
    expect(formatTime(60)).toBe('1:00')
  })

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(125)).toBe('2:05')
  })
})