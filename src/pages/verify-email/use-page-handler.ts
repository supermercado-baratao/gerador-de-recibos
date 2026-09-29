import { sendEmailVerification, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { auth } from '@/infra'
import { useAlertStore, useAuthStore } from '@/stores'

const COOLDOWN_SECONDS = 60

export const usePageHandler = () => {
  const { user, setUser } = useAuthStore()
  const alert = useAlertStore((state) => state.alert)

  const navigate = useNavigate()

  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResendClick = async () => {
    try {
      await sendEmailVerification(auth.currentUser!)
      setCooldown(COOLDOWN_SECONDS)
      alert({ title: 'E-mail reenviado', severity: 'success' })
    } catch {
      alert({
        title: 'Erro ao reenviar e-mail',
        description: 'Tente novamente mais tarde',
        severity: 'error'
      })
    }
  }

  const handleLoginClick = async () => {
    try {
      const currentUser = auth.currentUser!
      await currentUser.reload()
      if (!currentUser.emailVerified) {
        alert({
          title: 'E-mail ainda não verificado',
          description: 'Clique no link enviado para o seu e-mail',
          severity: 'warning'
        })
        return
      }
      await currentUser.getIdToken(true)
      setUser(currentUser)
      navigate('/', { replace: true })
    } catch {
      alert({
        title: 'Erro ao verificar o e-mail',
        description: 'Tente novamente',
        severity: 'error'
      })
    }
  }

  const handleLogoutClick = () => signOut(auth)

  return {
    user,
    cooldown,
    handleResendClick,
    handleLoginClick,
    handleLogoutClick
  }
}
