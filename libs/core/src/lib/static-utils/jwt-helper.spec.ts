import { describe, it, expect } from 'vitest'
import { JwtHelper } from './jwt-helper'

describe('JwtHelper', () => {
  describe('isToken', () => {
  it('returns false when not a string', () => {
      expect(JwtHelper.isToken(null)).toBe(false)
      expect(JwtHelper.isToken(undefined)).toBe(false)
      expect(JwtHelper.isToken(7)).toBe(false)
      expect(JwtHelper.isToken({})).toBe(false)
      expect(JwtHelper.isToken([])).toBe(false)
      expect(JwtHelper.isToken(new Date())).toBe(false)
    })
  it('returns false when not 3 parts', () => {
      expect(JwtHelper.isToken('abc:def')).toBe(false)
      expect(JwtHelper.isToken('abc:def:ghi:jkl')).toBe(false)
    })
  it('returns false when not decodable', () => {
      expect(JwtHelper.isToken('abc:def:ghi')).toBe(false)
    })
  it('returns false when decoded & parsed part not object', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode('just a string')}.part3`
      expect(JwtHelper.isToken(tokenString)).toBe(false)
    })
  it('returns false when decoded & parsed part is null', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(null))}.part3`
      expect(JwtHelper.isToken(tokenString)).toBe(false)
    })
  it('returns true when actual token', () => {
      const jwtToken = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(jwtToken))}.part3`
      expect(JwtHelper.isToken(tokenString)).toBe(true)
    })
  })

  describe('decodeToken', () => {
  it('throws when not typeof string', () => {
      expect(() => JwtHelper.decodeToken(null)).toThrow(Error)
      expect(() => JwtHelper.decodeToken(undefined)).toThrow(Error)
      expect(() => JwtHelper.decodeToken(7)).toThrow(Error)
      expect(() => JwtHelper.decodeToken({})).toThrow(Error)
      expect(() => JwtHelper.decodeToken([])).toThrow(Error)
      expect(() => JwtHelper.decodeToken(new Date())).toThrow(Error)
    })
  it('throws when not 3 parts', () => {
      expect(() => JwtHelper.decodeToken('abc.def')).toThrow(Error)
      expect(() => JwtHelper.decodeToken('abc.def.ghi.jkl')).toThrow(Error)
    })
  it('throws when not decodable', () => {
      expect(() => JwtHelper.decodeToken('abc:def:ghi')).toThrow(Error)
    })
  it('throws when decoded & parsed part not an object', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode('just a string')}.part3`
      expect(() => JwtHelper.decodeToken(tokenString)).toThrow(Error)
    })
  it('throws when decoded & parsed part is null', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(null))}.part3`
      expect(() => JwtHelper.decodeToken(tokenString)).toThrow()
    })
  it('returns decoded token when ok', () => {
      const jwtToken = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(jwtToken))}.part3`
      expect(JwtHelper.decodeToken(tokenString)).toEqual(jwtToken)
    })
  })

  describe('getTokenExpirationDate', () => {
  it('throws when invalid token', () => {
      const tokenString = `a.b.c`
      expect(() => JwtHelper.getTokenExpirationDate(tokenString)).toThrow(Error)
    })
  it('returns null when exp not set', () => {
      const token = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.getTokenExpirationDate(tokenString)).toBe(null)
    })
  it('returns correct date', () => {
      const token = { exp: Math.floor(Date.now() / 1_000) }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.getTokenExpirationDate(tokenString)).toEqual(new Date(token.exp * 1000))
    })
  })

  describe('isTokenExpired', () => {
  it('throws when invalid token', () => {
      const tokenString = `a.b.c`
      expect(() => JwtHelper.isTokenExpired(tokenString)).toThrow(Error)
    })
  it('returns false when exp not set', () => {
      const token = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.isTokenExpired(tokenString)).toBe(false)
    })
  it('returns true when expired', () => {
      const token = { exp: Math.floor(Date.now() / 1_000) - 10 }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.isTokenExpired(tokenString)).toBe(true)
    })
  it('works with offsetSeconds', () => {
      const token = { exp: Math.floor(Date.now() / 1_000) + 30 }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.isTokenExpired(tokenString, 20)).toBe(false)
      expect(JwtHelper.isTokenExpired(tokenString, 60)).toBe(true)
    })
  })
})
