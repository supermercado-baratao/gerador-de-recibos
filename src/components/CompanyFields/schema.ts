import * as yup from 'yup'

const hasDigits = (length: number) => (value: string | undefined) =>
  (value ?? '').replace(/\D/g, '').length === length

export const companySchema = yup.object({
  name: yup.string().required('Nome da empresa é obrigatório'),
  cnpj: yup
    .string()
    .required('CNPJ é obrigatório')
    .test('cnpj', 'CNPJ incompleto', hasDigits(14)),
  tel: yup
    .string()
    .required('Telefone é obrigatório')
    .test('tel', 'Telefone incompleto', hasDigits(10)),
  street: yup.string().required('Logradouro é obrigatório'),
  num: yup.string().required('Número é obrigatório'),
  district: yup.string().required('Bairro é obrigatório'),
  uf: yup.string().required('Estado é obrigatório'),
  city: yup.string().required('Cidade é obrigatória')
})

export type TCompanyForm = yup.InferType<typeof companySchema>

export const companyDefaultValues: TCompanyForm = {
  name: '',
  cnpj: '',
  tel: '',
  street: '',
  num: '',
  district: '',
  uf: '',
  city: ''
}
