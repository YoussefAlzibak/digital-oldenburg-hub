import { expect, test } from 'vitest'
import { cn } from './utils'

test('cn merges class names correctly', () => {
    expect(cn('c-red', 'bg-blue')).toBe('c-red bg-blue')
})

test('cn handles conditional classes', () => {
    expect(cn('c-red', false && 'bg-blue', 'text-lg')).toBe('c-red text-lg')
})

test('cn merges tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
})
