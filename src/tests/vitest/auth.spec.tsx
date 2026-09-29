import { screen, waitFor } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'
import { describe, expect, test } from 'vitest'

import { renderApp } from './_mocks/App'
import { getSeededCollection } from './_mocks/database'
import { registerAccount, verifyAccountEmail } from './_mocks/firebase-auth'
import { selectOption } from './_utils/select-option'
import {
  companyData,
  createUser,
  PASSWORD,
  populateDatabase
} from './orchestrator'

const signIn = async (user: UserEvent, email: string, password: string) => {
  await user.type(await screen.findByLabelText('E-mail'), email)
  await user.type(screen.getByLabelText('Senha'), password)
  await user.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('Autenticação', () => {
  test('cria a conta com os dados da empresa e pede a verificação do e-mail', async () => {
    const user = userEvent.setup()
    renderApp('/signup')

    await user.type(await screen.findByLabelText('E-mail'), 'novo@mercado.com')
    await user.type(screen.getByLabelText('Senha'), PASSWORD)
    await user.type(screen.getByLabelText('Confirmar senha'), PASSWORD)

    await user.type(screen.getByLabelText('Nome da Empresa'), companyData.name)
    await user.type(screen.getByLabelText('CNPJ'), '11222333000181')
    await user.type(screen.getByLabelText('Telefone'), '7133334444')
    await user.type(screen.getByLabelText('Logradouro'), companyData.street)
    await user.type(screen.getByLabelText('Número'), companyData.num)
    await user.type(screen.getByLabelText('Bairro'), companyData.district)
    await selectOption(user, 'Estado', 'Bahia')
    await selectOption(user, 'Cidade', 'Salvador')

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      await screen.findByRole('heading', { name: 'Verifique seu e-mail' })
    ).toBeInTheDocument()
    expect(screen.getByText('novo@mercado.com')).toBeInTheDocument()
    expect(sendEmailVerification).toHaveBeenCalled()

    await waitFor(() => {
      expect(getSeededCollection('companies')).toEqual([
        expect.objectContaining({ id: 'main', ...companyData })
      ])
    })
  })

  test('valida os campos do cadastro antes de criar a conta', async () => {
    const user = userEvent.setup()
    renderApp('/signup')

    await user.type(await screen.findByLabelText('Senha'), PASSWORD)
    await user.type(screen.getByLabelText('Confirmar senha'), 'outra-senha')
    await user.type(screen.getByLabelText('CNPJ'), '1122')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('E-mail é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
    expect(screen.getByText('CNPJ incompleto')).toBeInTheDocument()
    expect(screen.getByText('Estado é obrigatório')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Criar conta' })).toBeVisible()
  })

  test('não permite cadastrar um e-mail já utilizado', async () => {
    registerAccount({ email: 'dono@mercado.com', password: PASSWORD })
    const user = userEvent.setup()
    renderApp('/signup')

    await user.type(await screen.findByLabelText('E-mail'), 'dono@mercado.com')
    await user.type(screen.getByLabelText('Senha'), PASSWORD)
    await user.type(screen.getByLabelText('Confirmar senha'), PASSWORD)
    await user.type(screen.getByLabelText('Nome da Empresa'), companyData.name)
    await user.type(screen.getByLabelText('CNPJ'), '11222333000181')
    await user.type(screen.getByLabelText('Telefone'), '7133334444')
    await user.type(screen.getByLabelText('Logradouro'), companyData.street)
    await user.type(screen.getByLabelText('Número'), companyData.num)
    await user.type(screen.getByLabelText('Bairro'), companyData.district)
    await selectOption(user, 'Estado', 'Bahia')
    await selectOption(user, 'Cidade', 'Salvador')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      await screen.findByText('Este e-mail já está cadastrado')
    ).toBeInTheDocument()
  })

  test('entra com e-mail e senha e carrega os dados da conta', async () => {
    createUser()
    populateDatabase()
    await signOut({} as never)

    const user = userEvent.setup()
    renderApp('/')

    await signIn(user, 'dono@mercado.com', PASSWORD)

    expect(
      await screen.findByRole('combobox', { name: 'Funcionário' })
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Empresa' }))
    expect(await screen.findByLabelText('Nome da Empresa')).toHaveValue(
      companyData.name
    )
  })

  test('mostra erro com senha incorreta', async () => {
    registerAccount({ email: 'dono@mercado.com', password: PASSWORD })
    const user = userEvent.setup()
    renderApp('/signin')

    await signIn(user, 'dono@mercado.com', 'senha-errada')

    expect(
      await screen.findByText('E-mail ou senha incorretos')
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  })

  test('só libera o app depois que o e-mail é verificado', async () => {
    registerAccount({
      email: 'dono@mercado.com',
      password: PASSWORD,
      emailVerified: false
    })
    const user = userEvent.setup()
    renderApp('/signin')

    await signIn(user, 'dono@mercado.com', PASSWORD)
    expect(
      await screen.findByRole('heading', { name: 'Verifique seu e-mail' })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Já verifiquei, entrar' })
    )
    expect(
      await screen.findByText('E-mail ainda não verificado')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reenviar e-mail' }))
    expect(sendEmailVerification).toHaveBeenCalled()
    expect(
      await screen.findByRole('button', { name: /Reenviar e-mail \(\d+s\)/ })
    ).toBeDisabled()

    verifyAccountEmail('dono@mercado.com')
    await user.click(
      screen.getByRole('button', { name: 'Já verifiquei, entrar' })
    )

    expect(
      await screen.findByRole('combobox', { name: 'Funcionário' })
    ).toBeInTheDocument()
  })

  test('envia o e-mail de recuperação de senha', async () => {
    const user = userEvent.setup()
    renderApp('/signin')

    await user.click(
      await screen.findByRole('link', { name: 'Esqueci minha senha' })
    )
    await user.type(await screen.findByLabelText('E-mail'), 'dono@mercado.com')
    await user.click(screen.getByRole('button', { name: 'Enviar link' }))

    expect(await screen.findByText(/você receberá um e-mail/)).toBeVisible()
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'dono@mercado.com'
    )
  })

  test('sai da conta e volta para o login', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await user.click(await screen.findByRole('button', { name: 'Sair' }))

    expect(
      await screen.findByRole('heading', { name: 'Entrar' })
    ).toBeInTheDocument()
  })

  test('redireciona para o login ao acessar uma página privada sem conta', async () => {
    renderApp('/receipts')

    expect(
      await screen.findByRole('heading', { name: 'Entrar' })
    ).toBeInTheDocument()
  })
})
