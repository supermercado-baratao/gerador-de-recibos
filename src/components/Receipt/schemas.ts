import * as yup from 'yup'

import { endDateIsGreater } from './date'

export const salaryOrThirteenthSchema = yup.object().shape({
  date: yup.string().required('Data é obrigatória'),
  salary: yup
    .number()
    .required('Salário é obrigatório')
    .min(1, 'Salário deve ser maior que 0')
})

export const vacationSchema = yup.object().shape({
  date: yup.string().required('Data inicial é obrigatória'),
  endDate: yup
    .string()
    .required('Data final é obrigatória')
    .test(
      'is-greater',
      'Data final deve ser maior que a data inicial',
      (endDate, ctx) => endDateIsGreater(ctx.parent.date, endDate)
    ),
  period: yup.string().required('Período é obrigatório'),
  salary: yup
    .number()
    .required('Salário é obrigatório')
    .min(1, 'Salário deve ser maior que 0'),
  oneThird: yup
    .number()
    .required('Terço de férias é obrigatório')
    .min(0, 'Terço de férias deve ser maior ou igual a 0'),
  netValue: yup
    .number()
    .required('Valor líquido é obrigatório')
    .min(1, 'Valor líquido deve ser maior que 0')
})

export const proportionalVacationSchema = yup.object().shape({
  date: yup.string().required('Data inicial é obrigatória'),
  endDate: yup
    .string()
    .required('Data final é obrigatória')
    .test(
      'is-greater',
      'Data final deve ser maior que a data inicial',
      (endDate, ctx) => endDateIsGreater(ctx.parent.date, endDate)
    ),
  period: yup.string().required('Período é obrigatório'),
  salary: yup
    .number()
    .required('Salário é obrigatório')
    .min(1, 'Salário deve ser maior que 0'),
  proportionalValue: yup
    .number()
    .required('Valor proporcional ao período é obrigatório')
    .min(0, 'Valor proporcional ao período deve ser maior ou igual a 0'),
  proportionalOneThird: yup
    .number()
    .required('Terço de férias é obrigatório')
    .min(0, 'Terço de férias deve ser maior ou igual a 0'),
  proportionalNetValue: yup
    .number()
    .required('Valor líquido é obrigatório')
    .min(1, 'Valor líquido deve ser maior que 0')
})

export const proportionalThirteenthSchema = yup.object().shape({
  date: yup.string().required('Data inicial é obrigatória'),
  endDate: yup
    .string()
    .required('Data final é obrigatória')
    .test(
      'is-greater',
      'Data final deve ser maior que a data inicial',
      (endDate, ctx) => endDateIsGreater(ctx.parent.date, endDate)
    ),
  period: yup.string().required('Período é obrigatório'),
  salary: yup
    .number()
    .required('Salário é obrigatório')
    .min(1, 'Salário deve ser maior que 0'),
  proportionalNetValue: yup
    .number()
    .required('Valor líquido é obrigatório')
    .min(1, 'Valor líquido deve ser maior que 0')
})
