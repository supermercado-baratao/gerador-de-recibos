import * as yup from 'yup'

import { cpfIsValid } from './cpf-validator'

export const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  rg: yup.string().required('RG é obrigatório'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('cpf', 'CPF inválido', (value) => cpfIsValid(value))
})
