export type TokenString = `${string}:${string}:${string}`

/**
 * Helper class to decode and find JWT expiration.
 * Made static - copied from https://github.com/auth0/angular2-jwt/blob/master/angular2-jwt.ts
 * @dynamic (allow lambda in static function)
 */
export class JwtHelper {
  static urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/')
    switch (output.length % 4) {
      case 0: {
        break
      }
      case 2: {
        output += '=='
        break
      }
      case 3: {
        output += '='
        break
      }
      default: {
        throw new Error('Illegal base64url string!')
      }
    }
    return JwtHelper.b64DecodeUnicode(output)
  }

  // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
  static b64DecodeUnicode(str: any) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c: any) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
  static b64EncodeUnicode(str: string) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(<number>(<any>'0x') + p1)
      }),
    )
  }

  static isToken(token: unknown): token is TokenString {
    if (typeof token === 'string') {
      const parts = token.split('.')
      if (parts.length === 3) {
        try {
          const decoded = JwtHelper.urlBase64Decode(parts[1])
          if (decoded) {
            const parsed = JSON.parse(decoded)
            return typeof parsed === 'object' && parsed !== null
          }
        } catch (err) {}
      }
    }
    return false
  }

  static decodeToken<T>(token: unknown): T {
    if (typeof token === 'string') {
      const parts = token.split('.')

      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts')
      }

      const decoded = JwtHelper.urlBase64Decode(parts[1])
      if (!decoded) {
        throw new Error('Cannot decode the token')
      }
      let parsed: any
      try {
        parsed = JSON.parse(decoded)
      } catch (err) {}
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('token value not an object')
      }
      return parsed
    } else {
      throw new Error('token provided is not a string')
    }
  }

  static getTokenExpirationDate(token: string): Date | null {
    let decoded: any
    decoded = JwtHelper.decodeToken(token)

    if (!decoded.hasOwnProperty('exp')) {
      return null
    }

    const date = new Date(0) // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp)

    return date
  }

  /**
   *
   * @returns Returns true is the token is falsey or the claim exp is in the past
   */
  static isTokenExpired(token: string | null, offsetSeconds: number = 0): boolean {
    if (!token) {
      return true
    } else {
      const date = this.getTokenExpirationDate(token)

      if (date == null) {
        return false
      }

      // Token expired?
      return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000)
    }
  }
}
