import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { renderApp } from './_mocks/App'
import { getSeededCollection } from './_mocks/database'
import { selectOption } from './_utils/select-option'
import { companyData, createUser, populateDatabase } from './orchestrator'

describe('Empresa', () => {
  test('edita os dados da empresa', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/company')

    const saveButton = await screen.findByRole('button', { name: 'Salvar' })
    expect(screen.getByLabelText('CNPJ')).toHaveValue(companyData.cnpj)
    expect(saveButton).toBeDisabled()

    await user.clear(screen.getByLabelText('Nome da Empresa'))
    await user.type(screen.getByLabelText('Nome da Empresa'), 'Mercado Novo')
    await user.click(saveButton)

    expect(
      await screen.findByText('Empresa salva com sucesso!')
    ).toBeInTheDocument()
    expect(getSeededCollection('companies')).toEqual([
      expect.objectContaining({ ...companyData, name: 'Mercado Novo' })
    ])
    expect(saveButton).toBeDisabled()
  })

  test('exige escolher a cidade de novo ao trocar o estado', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/company')

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: 'Cidade' })
      ).toHaveTextContent('Salvador')
    })

    await selectOption(user, 'Estado', 'São Paulo')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Cidade é obrigatória')).toBeInTheDocument()

    await selectOption(user, 'Cidade', 'Campinas')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText('Empresa salva com sucesso!')
    ).toBeInTheDocument()
    expect(getSeededCollection('companies')).toEqual([
      expect.objectContaining({ uf: 'SP', city: 'Campinas' })
    ])
  })

  test('permite cadastrar a empresa se ela não foi salva no cadastro', async () => {
    createUser()
    const user = userEvent.setup()
    renderApp('/company')

    await user.type(
      await screen.findByLabelText('Nome da Empresa'),
      companyData.name
    )
    await user.type(screen.getByLabelText('CNPJ'), '11222333000181')
    await user.type(screen.getByLabelText('Telefone'), '7133334444')
    await user.type(screen.getByLabelText('Logradouro'), companyData.street)
    await user.type(screen.getByLabelText('Número'), companyData.num)
    await user.type(screen.getByLabelText('Bairro'), companyData.district)
    await selectOption(user, 'Estado', 'Bahia')
    await selectOption(user, 'Cidade', 'Salvador')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText('Empresa salva com sucesso!')
    ).toBeInTheDocument()
    expect(getSeededCollection('companies')).toEqual([
      expect.objectContaining({ id: 'main', ...companyData })
    ])
  })
})
