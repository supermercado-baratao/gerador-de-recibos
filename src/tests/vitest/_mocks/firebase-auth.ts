import type { Auth, User } from 'firebase/auth'
import { vi } from 'vitest'

type TAccount = {
  password: string
  user: User
  isVerified: boolean
}

const hoisted = vi.hoisted(() => ({
  state: { currentUser: null as User | null },
  listeners: new Set<(user: User | null) => void>(),
  accounts: new Map<string, TAccount>()
}))

const authError = (code: string) => Object.assign(new Error(code), { code })

export const setAuthMockUser = (user: User | null) => {
  hoisted.state.currentUser = user
  hoisted.listeners.forEach((listener) => listener(user))
}

export const resetAuthMock = () => {
  hoisted.state.currentUser = null
  hoisted.listeners.clear()
  hoisted.accounts.clear()
}

export const getMockCurrentUserUid = (): string | undefined =>
  hoisted.state.currentUser?.uid

export const createFakeUser = ({
  email = 'user@example.com',
  emailVerified = true
}: { email?: string; emailVerified?: boolean } = {}): User => {
  const user = {
    uid: crypto.randomUUID(),
    email,
    emailVerified,
    reload: vi.fn(async () => {
      const account = hoisted.accounts.get(email)
      if (account) user.emailVerified = account.isVerified
    }),
    getIdToken: vi.fn(async () => 'fake-token')
  }
  return user as unknown as User
}

export const registerAccount = ({
  email,
  password,
  emailVerified = true
}: {
  email: string
  password: string
  emailVerified?: boolean
}) => {
  const user = createFakeUser({ email, emailVerified })
  hoisted.accounts.set(email, { password, user, isVerified: emailVerified })
  return user
}

export const verifyAccountEmail = (email: string) => {
  const account = hoisted.accounts.get(email)
  if (account) account.isVerified = true
}

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>()
  return {
    ...actual,
    getAuth: () => hoisted.state as unknown as Auth,
    onAuthStateChanged: (
      _auth: Auth,
      callback: (user: User | null) => void
    ) => {
      hoisted.listeners.add(callback)
      callback(hoisted.state.currentUser)
      return () => hoisted.listeners.delete(callback)
    },
    signOut: vi.fn(async () => setAuthMockUser(null)),
    signInWithEmailAndPassword: vi.fn(
      async (_auth: Auth, email: string, password: string) => {
        const account = hoisted.accounts.get(email)
        if (!account || account.password !== password) {
          throw authError('auth/invalid-credential')
        }
        setAuthMockUser(account.user)
        return { user: account.user }
      }
    ),
    createUserWithEmailAndPassword: vi.fn(
      async (_auth: Auth, email: string, password: string) => {
        if (hoisted.accounts.has(email)) {
          throw authError('auth/email-already-in-use')
        }
        const user = registerAccount({ email, password, emailVerified: false })
        setAuthMockUser(user)
        return { user }
      }
    ),
    sendEmailVerification: vi.fn(async () => {}),
    sendPasswordResetEmail: vi.fn(async () => {})
  }
})
