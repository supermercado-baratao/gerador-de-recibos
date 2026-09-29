import { yupResolver } from '@hookform/resolvers/yup'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { auth } from '@/infra'
import { useAlertStore } from '@/stores'

import { schema } from './schema'

export const useFormHandler = () => {
  const alert = useAlertStore((state) => state.alert)

  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' }
  })

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await sendPasswordResetEmail(auth, email)
      setSentTo(email)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/user-not-found') {
        setSentTo(email)
        return
      }
      alert({
        title: 'Erro ao enviar e-mail',
        description:
          code === 'auth/too-many-requests'
            ? 'Muitas tentativas. Aguarde um momento e tente novamente'
            : 'Tente novamente',
        severity: 'error'
      })
    }
  })

  return { register, onSubmit, errors, isSubmitting, sentTo }
}
