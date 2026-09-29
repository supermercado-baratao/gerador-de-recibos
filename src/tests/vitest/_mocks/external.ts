import dayjs from 'dayjs'
import { type Mock, vi } from 'vitest'

export const CURRENT_SALARY = 1621

const hoisted = vi.hoisted(() => ({
  pdfOpen: vi.fn(async () => {}),
  createPdf: vi.fn()
}))

export const pdfMock: { pdfOpen: Mock; createPdf: Mock } = hoisted

export const resetExternalMocks = () => {
  hoisted.pdfOpen.mockReset()
  hoisted.pdfOpen.mockImplementation(async () => {})
  hoisted.createPdf.mockReset()
  hoisted.createPdf.mockImplementation(() => ({ open: hoisted.pdfOpen }))
}

vi.mock('@/services', () => ({
  getUfs: vi.fn(async () => [
    { name: 'São Paulo', acronym: 'SP' },
    { name: 'Bahia', acronym: 'BA' }
  ]),
  getCities: vi.fn(async (uf: string) =>
    uf === 'BA' ? ['Salvador', 'Feira de Santana'] : ['São Paulo', 'Campinas']
  ),
  getSalaries: vi.fn(async () => [
    { yearMonth: dayjs().format('YYYY-MM'), salary: CURRENT_SALARY }
  ])
}))

vi.mock('pdfmake/build/pdfmake', () => ({
  default: {
    addVirtualFileSystem: vi.fn(),
    createPdf: hoisted.createPdf
  }
}))

vi.mock('pdfmake/build/vfs_fonts', () => ({ default: {} }))
