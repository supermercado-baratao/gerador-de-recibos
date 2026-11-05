import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const currentDate = dayjs().format('YYYY-MM-DD')

const formatDateToUTC = (date: string) => new Date(date).getTime()

export const endDateIsGreater = (date: string, endDate: string) => {
  return formatDateToUTC(date) < formatDateToUTC(endDate)
}

export const getYearMonth = (date: string) => dayjs(date).format('YYYY-MM')

export const getEndDate = (date: string) =>
  dayjs(date).add(30, 'days').format('YYYY-MM-DD')

const DAYS_IN_MONTH = 30

const getNumberOfDays = (date: string, endDate: string) =>
  dayjs(endDate).diff(dayjs(date), 'day')

export const getNumberOfMonths = (date: string, endDate: string) =>
  getNumberOfDays(date, endDate) / DAYS_IN_MONTH

const pluralize = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`

export const getPeriod = (date: string, endDate: string) => {
  const days = getNumberOfDays(date, endDate)
  if (days > 0 && days % DAYS_IN_MONTH === 0) {
    return pluralize(days / DAYS_IN_MONTH, 'mês', 'meses')
  }
  return pluralize(days, 'dia', 'dias')
}
