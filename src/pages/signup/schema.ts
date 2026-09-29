import * as yup from 'yup'

import { companyDefaultValues, companySchema } from '@/components'

export const schema = companySchema.shape({
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirme sua senha')
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
})

export type TSchema = yup.InferType<typeof schema>

export const defaultValues: TSchema = {
  ...companyDefaultValues,
  email: '',
  password: '',
  confirmPassword: ''
}
