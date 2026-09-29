import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export const selectOption = async (
  user: UserEvent,
  label: string,
  option: string
) => {
  await user.click(await screen.findByRole('combobox', { name: label }))
  await user.click(await screen.findByRole('option', { name: option }))
}
