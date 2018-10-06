export const OPS = {
  add: '+',
  divide: '/',
  multiply: 'x',
  subtract: '-'
}

export const ERROR_MSG = [
  'Unsupported request',
  'Server Error',
  'Invalid Calculation',
  'Cannot connect to database',
  'Missing Params'
]

export const DEFAULT_STATE = {
  a: '0',
  b: '0',

  activeValue: 'a',
  display: '0',
  operand: null
}
