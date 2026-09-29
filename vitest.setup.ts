import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

import { useAlertStore, useAppStore, useCallbackStore } from '@/stores'
import { resetDatabaseMock } from '@/tests/vitest/_mocks/database'
import { resetExternalMocks } from '@/tests/vitest/_mocks/external'
import { resetAuthMock } from '@/tests/vitest/_mocks/firebase-auth'

beforeEach(() => {
  resetDatabaseMock()
  resetAuthMock()
  resetExternalMocks()
  useAppStore.getState().reset()
  useAlertStore.getState().clear()
  useCallbackStore.setState({ queue: [] })
})

afterEach(() => {
  cleanup()
})
