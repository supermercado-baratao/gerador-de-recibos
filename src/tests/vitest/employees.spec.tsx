import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { renderApp } from './_mocks/App'
import { databaseMock, getSeededCollection } from './_mocks/database'
import { selectOption } from './_utils/select-option'
import { createUser, employeesData, populateDatabase } from './orchestrator'

const [maria] = employeesData

describe('Funcionários', () => {
  test('cadastra um novo funcionário e avança para o recibo', async () => {
    createUser()
    populateDatabase({ withEmployees: false })
    const user = userEvent.setup()
    renderApp('/')

    expect(
      await screen.findByRole('combobox', { name: 'Funcionário' })
    ).toHaveTextContent('Novo funcionário')

    await user.type(screen.getByLabelText('Nome Completo'), 'Ana Pereira')
    await user.type(screen.getByLabelText('RG'), '1234567890')
    await user.type(screen.getByLabelText('CPF'), '52998224725')
    await user.click(screen.getByRole('button', { name: 'Próximo' }))

    expect(
      await screen.findByText('Funcionário criado com sucesso!')
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('combobox', { name: 'Tipo de recibo' })
    ).toBeInTheDocument()
    expect(getSeededCollection('employees')).toEqual([
      expect.objectContaining({
        name: 'Ana Pereira',
        rg: '12.345.678-90',
        cpf: '529.982.247-25'
      })
    ])
  })

  test('valida CPF inválido e CPF já cadastrado', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await user.type(await screen.findByLabelText('Nome Completo'), 'Ana')
    await user.type(screen.getByLabelText('RG'), '1234567890')
    await user.type(screen.getByLabelText('CPF'), '12345678900')
    await user.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(await screen.findByText('CPF inválido')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('CPF'))
    await user.type(screen.getByLabelText('CPF'), '52998224725')
    await user.click(screen.getByRole('button', { name: 'Próximo' }))

    expect(
      await screen.findByText('Já existe um funcionário com este CPF')
    ).toBeInTheDocument()
    expect(databaseMock.create).not.toHaveBeenCalled()
  })

  test('seleciona um funcionário salvo e avança sem regravar quando nada muda', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await selectOption(user, 'Funcionário', maria.name)

    expect(screen.getByLabelText('Nome Completo')).toHaveValue(maria.name)
    expect(screen.getByLabelText('CPF')).toHaveValue(maria.cpf)

    await user.click(screen.getByRole('button', { name: 'Próximo' }))

    expect(
      await screen.findByRole('combobox', { name: 'Tipo de recibo' })
    ).toBeInTheDocument()
    expect(databaseMock.update).not.toHaveBeenCalled()
  })

  test('edita os dados de um funcionário', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await selectOption(user, 'Funcionário', maria.name)
    await user.clear(screen.getByLabelText('Nome Completo'))
    await user.type(screen.getByLabelText('Nome Completo'), 'Maria Souza')
    await user.click(screen.getByRole('button', { name: 'Próximo' }))

    expect(
      await screen.findByText('Funcionário atualizado com sucesso!')
    ).toBeInTheDocument()
    expect(
      getSeededCollection('employees').find(({ id }) => id === maria.id)
    ).toEqual(expect.objectContaining({ name: 'Maria Souza' }))
  })

  test('exclui um funcionário após confirmar', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await selectOption(user, 'Funcionário', maria.name)
    await user.click(
      screen.getByRole('button', { name: 'Excluir funcionário' })
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent(`Deseja excluir ${maria.name}?`)
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    expect(
      await screen.findByText('Funcionário excluído com sucesso!')
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.getByRole('combobox', { name: 'Funcionário' })
      ).toHaveTextContent('Novo funcionário')
    })
    expect(getSeededCollection('employees').map(({ id }) => id)).not.toContain(
      maria.id
    )
  })

  test('mantém o funcionário quando a exclusão falha', async () => {
    createUser()
    populateDatabase()
    databaseMock.deleteUniqueById.mockRejectedValueOnce(new Error('offline'))
    const user = userEvent.setup()
    renderApp('/')

    await selectOption(user, 'Funcionário', maria.name)
    await user.click(
      screen.getByRole('button', { name: 'Excluir funcionário' })
    )
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    expect(
      await screen.findByText('Erro ao excluir funcionário')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome Completo')).toHaveValue(maria.name)
  })
})
