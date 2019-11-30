import { INIT } from '@podlove/player-actions/types'
import { takeEvery, put } from 'redux-saga/effects'
import * as lifecycle from '@podlove/player-actions/lifecycle'

import { lifeCycleSaga, ready, constructed } from './lifecycle'

describe('lifecycle', () => {
  describe('lifeCycleSaga()', () => {
    let gen

    beforeEach(() => {
      gen = lifeCycleSaga()
    })

    test('should export a generator', () => {
      expect(typeof gen.next).toBe('function')
    })

    test('should register ready on INIT', () => {
      expect(gen.next().value).toEqual(takeEvery(INIT, ready))
    })
  })

  describe('ready()', () => {
    let gen

    beforeEach(() => {
      gen = ready({ payload: { chapters: 'some url', transcripts: 'some url' } })
    })

    test('should export a generator', () => {
      expect(typeof gen.next).toBe('function')
    })

    test('should call apis', async () => {
      const result = await gen.next().value
      expect(result).toEqual(['result', 'result'])
    })

    test('should put READY', async () => {
      gen.next()
      expect(gen.next(['chapters', 'transcripts']).value).toEqual(
        put(
          lifecycle.ready({
            chapters: 'chapters',
            transcripts: 'transcripts'
          })
        )
      )
    })
  })

  describe('constructed()', () => {
    let gen

    beforeEach(() => {
      gen = constructed({ payload: { foo: 'bar' } })
    })

    test('should export a generator', () => {
      expect(typeof gen.next).toBe('function')
    })

    test('should put CONSTRUCTED', () => {
      expect(gen.next().value).toEqual(put(lifecycle.constructed({ foo: 'bar' })))
    })
  })
})
