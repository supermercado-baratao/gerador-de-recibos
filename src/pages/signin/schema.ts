import * as yup from 'yup'

export const schema = yup.object({
  email: yup.string().required('E-mail é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
})

export type TSchema = yup.InferType<typeof schema>
