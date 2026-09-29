import * as yup from 'yup'

export const schema = yup.object({
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido')
})
