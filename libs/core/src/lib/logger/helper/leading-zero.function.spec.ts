import { leadingZero } from './leading-zero.function'

describe('leadingZero', () => {
  test('works', () => {
    expect(leadingZero(2, 1)).toEqual('01')
    expect(leadingZero(2, 22)).toEqual('22')
    expect(leadingZero(2, 333)).toEqual('33')

    expect(leadingZero(3, 1)).toEqual('001')
    expect(leadingZero(3, 22)).toEqual('022')
    expect(leadingZero(3, 333)).toEqual('333')
    expect(leadingZero(3, 4444)).toEqual('444')

    expect(leadingZero(4, 1)).toEqual('0001')
    expect(leadingZero(4, 22)).toEqual('0022')
    expect(leadingZero(4, 333)).toEqual('0333')
    expect(leadingZero(4, 4444)).toEqual('4444')
    expect(leadingZero(4, 55555)).toEqual('5555')
  })
  test('rounds decimal values', () => {
    expect(leadingZero(2, 1.3)).toEqual('01')
    expect(leadingZero(2, 5.8)).toEqual('06')
  })
})
