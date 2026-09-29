import { yupResolver } from '@hookform/resolvers/yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'

import { auth } from '@/infra'
import { useAlertStore } from '@/stores'

import { SIGNIN_ERRORS } from './errors'
import { schema } from './schema'

export const useFormHandler = () => {
  const alert = useAlertStore((state) => state.alert)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      alert({
        title: 'Erro ao fazer login',
        description: SIGNIN_ERRORS[code] ?? 'Tente novamente',
        severity: 'error'
      })
    }
  })

  return { register, onSubmit, errors, isSubmitting }
}
