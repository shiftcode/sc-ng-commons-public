// @dynamic https://github.com/angular/angular/issues/18867#issuecomment-357484102
export class LoggerHelper {
  static REGEX_PLACEHOLDERS = /%((%)|s|i|f|o|c)/g

  /* tslint:disable:no-bitwise */
  static stringToColor(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let k = 0; k < 3; k++) {
      const value = (hash >> (k * 8)) & 0xff
      color += ('00' + value.toString(16)).substr(-2)
    }
    return color.substring(0, 7)
  }

  static sprintFn(format: any[]) {
    const stringy = format[0]
    let i = 1

    return stringy.replace(LoggerHelper.REGEX_PLACEHOLDERS, (m: any) => {
      // m is the matched format, e.g. %s, %i, etc.
      let val: string | number
      if (m[2]) {
        val = m[2]
      } else {
        const val2 = format[i]
        // A switch statement so that the formatter can be extended. Default is %s
        switch (m) {
          case '%i':
            val = parseInt(val2, 10)
            break
          case '%f':
            val = parseFloat(val2)
            break
          case '%o':
            try {
              val = JSON.stringify(val2)
            } catch (e) {
              val = 'NOT SERIALIZABLE TO JSON'
              // tslint:disable-next-line:no-console
              console.warn('Make sure logged object is serializable to json for loggly %o', e)
            }
            break
          case '%c':
            val = ''
            break
          default:
            val = format[i]
        }
        i++
      }
      return val
    })
  }

  static formatArguments(msg: string, args: any[]): string {
    // use a formatting function if supplied argument is string, will fail otherwise
    let message = LoggerHelper.sprintFn(args)

    /*
     * the browser console has support for this api console.log('my message', jsObject), we wanna make
     * sure that variables provided like this are visible in loggly too, so we need to check if there
     * are any arguments not used in placeholder replacement
     */

    // check for all the placeholders
    const placeholderMatches = msg.match(LoggerHelper.REGEX_PLACEHOLDERS)
    const placeholderCount = placeholderMatches ? placeholderMatches.length : 0

    // ignore message template for count
    if (args.length - 1 !== placeholderCount) {
      // there is at least one argument not used in sprint function, make it visible with JSON.stringify
      message +=
        ' ' +
        args
          // remove message
          .slice(1)
          // remove all arguments used in placeholder replacement
          .slice(placeholderCount)
          // stringify
          .map((value) => {
            // JSON.stringify for instances of Error return {}, pretty useless
            if (value instanceof Error) {
              return JSON.stringify({ name: value.name, message: value.message, stack: value.stack })
            } else {
              try {
                return JSON.stringify(value)
              } catch (e) {
                return 'NOT SERIALIZABLE TO JSON'
              }
            }
          })
          .join(' / ')
    }

    return message
  }
}
