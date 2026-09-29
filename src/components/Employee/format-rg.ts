const RG_10_DIGITS = '##.###.###-##'
const RG_11_DIGITS = '###.###.###-##'

export const onlyDigits = (value: string) =>
  value.replace(/\D/g, '').slice(0, 11)

export const formatRg = (value: string) => {
  const digits = onlyDigits(value)
  const pattern = digits.length > 10 ? RG_11_DIGITS : RG_10_DIGITS
  let index = 0
  let result = ''
  for (const char of pattern) {
    if (index >= digits.length) break
    result += char === '#' ? digits[index++] : char
  }
  return result
}
