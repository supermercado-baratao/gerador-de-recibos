import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { renderApp } from './_mocks/App'
import {
  databaseMock,
  getSeededCollection,
  seedCollection
} from './_mocks/database'
import { CURRENT_SALARY, pdfMock } from './_mocks/external'
import { selectOption } from './_utils/select-option'
import {
  companyData,
  createUser,
  employeesData,
  makeSalaryReceipt,
  populateDatabase
} from './orchestrator'

const [maria, joao] = employeesData

const goToReceiptStep = async (user: UserEvent, employeeName: string) => {
  await selectOption(user, 'Funcionário', employeeName)
  await user.click(screen.getByRole('button', { name: 'Próximo' }))
  await screen.findByRole('combobox', { name: 'Tipo de recibo' })
}

const getPdfContent = () =>
  JSON.stringify(pdfMock.createPdf.mock.calls.at(-1)?.[0])

describe('Recibos', () => {
  test('gera o recibo de salário, abre o PDF e salva vinculado ao funcionário', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await goToReceiptStep(user, maria.name)
    await waitFor(() => {
      expect(screen.getByLabelText('Salário')).toHaveValue('R$ 1.621,00')
    })
    await user.click(screen.getByRole('button', { name: 'Gerar Recibo' }))

    expect(
      await screen.findByText('Recibo salvo com sucesso!')
    ).toBeInTheDocument()
    expect(pdfMock.pdfOpen).toHaveBeenCalledTimes(1)
    expect(getPdfContent()).toContain(maria.name)
    expect(getPdfContent()).toContain(companyData.name)

    const receipts = getSeededCollection('receipts')
    expect(receipts).toHaveLength(1)
    expect(receipts[0]).toEqual(
      expect.objectContaining({
        employeeId: maria.id,
        type: 'salary',
        title: 'Recibo de Salário',
        company: companyData,
        employee: { name: maria.name, rg: maria.rg, cpf: maria.cpf },
        data: expect.objectContaining({ salary: CURRENT_SALARY })
      })
    )
  })

  test('gera recibo de férias com o valor líquido calculado', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await goToReceiptStep(user, joao.name)
    await selectOption(user, 'Tipo de recibo', 'Férias')
    await waitFor(() => {
      expect(screen.getByLabelText('Salário')).toHaveValue('R$ 1.621,00')
    })
    await user.click(screen.getByRole('button', { name: 'Gerar Recibo' }))

    await screen.findByText('Recibo salvo com sucesso!')
    const [receipt] = getSeededCollection('receipts')
    const data = receipt.data as Record<string, number | string>
    // O período depende da data de hoje (início + 30 dias)
    const months = Number(String(data.period).split(' ')[0])
    const oneThird = CURRENT_SALARY / 3

    expect(receipt).toEqual(
      expect.objectContaining({ employeeId: joao.id, type: 'vacation' })
    )
    expect(data).toEqual(
      expect.objectContaining({ salary: CURRENT_SALARY, oneThird })
    )
    expect(data.netValue).toBeCloseTo((CURRENT_SALARY + oneThird) * months)
    expect(screen.getByLabelText('Período')).toHaveValue(data.period)
  })

  test('volta para o funcionário mantendo a seleção', async () => {
    createUser()
    populateDatabase()
    const user = userEvent.setup()
    renderApp('/')

    await goToReceiptStep(user, maria.name)
    await user.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(
      await screen.findByRole('combobox', { name: 'Funcionário' })
    ).toHaveTextContent(maria.name)
    expect(screen.getByLabelText('Nome Completo')).toHaveValue(maria.name)
  })

  test('avisa quando o recibo não pôde ser salvo', async () => {
    createUser()
    populateDatabase()
    databaseMock.create.mockRejectedValueOnce(new Error('offline'))
    const user = userEvent.setup()
    renderApp('/')

    await goToReceiptStep(user, maria.name)
    await user.click(screen.getByRole('button', { name: 'Gerar Recibo' }))

    expect(await screen.findByText('Erro ao salvar recibo')).toBeInTheDocument()
    expect(pdfMock.pdfOpen).toHaveBeenCalledTimes(1)
    expect(getSeededCollection('receipts')).toHaveLength(0)
  })

  test('lista o histórico, filtra por funcionário e reabre o PDF', async () => {
    createUser()
    populateDatabase()
    seedCollection('receipts', [
      makeSalaryReceipt(maria, {
        id: 'receipt-maria',
        salary: 1518,
        date: '2025-05-05'
      }),
      makeSalaryReceipt(joao, {
        id: 'receipt-joao',
        salary: 1621,
        date: '2026-03-05'
      })
    ])
    const user = userEvent.setup()
    renderApp('/receipts')

    const table = await screen.findByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(within(table).getByText(maria.name)).toBeInTheDocument()
    expect(within(table).getByText('05/05/2025')).toBeInTheDocument()
    expect(within(table).getByText(/1\.518,00/)).toBeInTheDocument()

    await selectOption(user, 'Funcionário', joao.name)

    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(2)
    expect(rows[1]).toHaveTextContent(joao.name)
    expect(rows[1]).toHaveTextContent(/1\.621,00/)

    await user.click(within(rows[1]).getByRole('button', { name: 'Abrir PDF' }))

    expect(pdfMock.pdfOpen).toHaveBeenCalledTimes(1)
    expect(getPdfContent()).toContain(joao.name)
  })

  test('mantém o recibo no histórico mesmo após excluir o funcionário', async () => {
    createUser()
    populateDatabase()
    seedCollection('receipts', [
      makeSalaryReceipt(maria, {
        id: 'receipt-maria',
        salary: 1518,
        date: '2025-05-05'
      })
    ])
    const user = userEvent.setup()
    renderApp('/')

    await selectOption(user, 'Funcionário', maria.name)
    await user.click(
      screen.getByRole('button', { name: 'Excluir funcionário' })
    )
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))
    await screen.findByText('Funcionário excluído com sucesso!')

    await user.click(screen.getByRole('button', { name: 'Recibos' }))

    const table = await screen.findByRole('table')
    expect(within(table).getByText(maria.name)).toBeInTheDocument()
  })

  test('mostra mensagem quando ainda não há recibos', async () => {
    createUser()
    populateDatabase()
    renderApp('/receipts')

    expect(
      await screen.findByText('Você ainda não gerou nenhum recibo.')
    ).toBeInTheDocument()
  })
})
