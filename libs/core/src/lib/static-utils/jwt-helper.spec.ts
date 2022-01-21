import { JwtHelper } from './jwt-helper'

describe('JwtHelper', () => {

  xdescribe('urlBase64Decode', () => {
    // todo
  })

  xdescribe('b64DecodeUnicode', () => {
    // todo
  })

  xdescribe('b64EncodeUnicode', () => {
    // todo
  })

  describe('isToken', () => {
    test('returns false when not a string', () => {
      expect(JwtHelper.isToken(null)).toBe(false)
      expect(JwtHelper.isToken(undefined)).toBe(false)
      expect(JwtHelper.isToken(7)).toBe(false)
      expect(JwtHelper.isToken({})).toBe(false)
      expect(JwtHelper.isToken([])).toBe(false)
      expect(JwtHelper.isToken(new Date())).toBe(false)
    })
    test('returns false when not 3 parts', () => {
      expect(JwtHelper.isToken('abc:def')).toBe(false)
      expect(JwtHelper.isToken('abc:def:ghi:jkl')).toBe(false)
    })
    test('returns false when not decodable', () => {
      expect(JwtHelper.isToken('abc:def:ghi')).toBe(false)
    })
    test('returns false when decoded & parsed part not object', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode('just a string')}.part3`
      expect(JwtHelper.isToken(tokenString)).toBe(false)
    })
    test('returns false when decoded & parsed part is null', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(null))}.part3`
      expect(JwtHelper.isToken(tokenString)).toBe(false)
    })
    test('returns true when actual token', () => {
      const jwtToken = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(jwtToken))}.part3`
      expect(JwtHelper.isToken(tokenString)).toBe(true)
    })
  })

  describe('decodeToken', () => {
    test('throws when not typeof string', () => {
      expect(() => JwtHelper.decodeToken(null)).toThrow(Error)
      expect(() => JwtHelper.decodeToken(undefined)).toThrow(Error)
      expect(() => JwtHelper.decodeToken(7)).toThrow(Error)
      expect(() => JwtHelper.decodeToken({})).toThrow(Error)
      expect(() => JwtHelper.decodeToken([])).toThrow(Error)
      expect(() => JwtHelper.decodeToken(new Date())).toThrow(Error)
    })
    test('throws when not 3 parts', () => {
      expect(() => JwtHelper.decodeToken('abc.def')).toThrow(Error)
      expect(() => JwtHelper.decodeToken('abc.def.ghi.jkl')).toThrow(Error)
    })
    test('throws when not decodable', () => {
      expect(() => JwtHelper.decodeToken('abc:def:ghi')).toThrow(Error)

    })
    test('throws when decoded & parsed part not an object', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode('just a string')}.part3`
      expect(() => JwtHelper.decodeToken(tokenString)).toThrow(Error)
    })
    test('throws when decoded & parsed part is null', () => {
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(null))}.part3`
      expect(() => JwtHelper.decodeToken(tokenString)).toThrow()
    })
    test('returns decoded token when ok', () => {
      const jwtToken = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `part1.${JwtHelper.b64EncodeUnicode(JSON.stringify(jwtToken))}.part3`
      expect(JwtHelper.decodeToken(tokenString)).toEqual(jwtToken)
    })
  })

  describe('getTokenExpirationDate', () => {
    test('throws when invalid token', () => {
      const tokenString = `a.b.c`
      expect(() => JwtHelper.getTokenExpirationDate(tokenString)).toThrow(Error)
    })
    test('returns null when exp not set', () => {
      const token = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.getTokenExpirationDate(tokenString)).toBe(null)
    })
    test('returns correct date', () => {
      const token = { exp: Math.floor(Date.now() / 1_000) }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.getTokenExpirationDate(tokenString)).toEqual(new Date(token.exp * 1000))
    })
  })

  describe('isTokenExpired', () => {
    test('throws when invalid token', () => {
      const tokenString = `a.b.c`
      expect(() => JwtHelper.isTokenExpired(tokenString)).toThrow(Error)
    })
    test('returns false when exp not set', () => {
      const token = { iss: 'https://www.shiftcode.ch' }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.isTokenExpired(tokenString)).toBe(false)
    })
    test('returns true when expired', () => {
      const token = { exp: Math.floor(Date.now() / 1_000) - 10 }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.isTokenExpired(tokenString)).toBe(true)
    })
    test('works with offsetSeconds', () => {
      const token = { exp: Math.floor(Date.now() / 1_000) + 30 }
      const tokenString = `a.${JwtHelper.b64EncodeUnicode(JSON.stringify(token))}.c`
      expect(JwtHelper.isTokenExpired(tokenString, 20)).toBe(false)
      expect(JwtHelper.isTokenExpired(tokenString, 60)).toBe(true)
    })
  })

})
