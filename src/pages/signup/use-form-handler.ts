import { yupResolver } from '@hookform/resolvers/yup'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  type User
} from 'firebase/auth'
import { useForm } from 'react-hook-form'

import { auth } from '@/infra'
import { companyModel } from '@/models'
import { useAlertStore } from '@/stores'

import { SIGNUP_ERRORS } from './errors'
import { defaultValues, schema } from './schema'

export const useFormHandler = () => {
  const alert = useAlertStore((state) => state.alert)

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })

  const onSubmit = methods.handleSubmit(
    async ({ email, password, confirmPassword, ...company }) => {
      let user: User
      try {
        ;({ user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ))
      } catch (err: unknown) {
        const code = (err as { code?: string }).code ?? ''
        alert({
          title: 'Erro ao criar conta',
          description: SIGNUP_ERRORS[code] ?? 'Tente novamente',
          severity: 'error'
        })
        return
      }

      const [companyResult] = await Promise.allSettled([
        companyModel.create(company),
        sendEmailVerification(user)
      ])
      if (companyResult.status === 'rejected') {
        alert({
          title: 'Conta criada, mas a empresa não foi salva',
          description:
            'Após verificar o e-mail, preencha os dados na página Empresa',
          severity: 'warning',
          autoHideDuration: 8000
        })
      }
    }
  )

  return { methods, onSubmit }
}
