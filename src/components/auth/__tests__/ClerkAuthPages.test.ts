import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const signInPageSource = fs.readFileSync(
  path.resolve(__dirname, '../../../app/sign-in/[[...sign-in]]/page.tsx'),
  'utf8',
)
const signUpPageSource = fs.readFileSync(
  path.resolve(__dirname, '../../../app/sign-up/[[...sign-up]]/page.tsx'),
  'utf8',
)

describe('Clerk auth pages', () => {
  it('renderizan pantallas de Clerk para soportar Google y email', () => {
    expect(signInPageSource).toContain('ClerkSignInPage')
    expect(signInPageSource).toContain("import { ClerkSignInPage } from '@/components/auth/ClerkAuthCard'")

    expect(signUpPageSource).toContain('ClerkSignUpPage')
    expect(signUpPageSource).toContain("import { ClerkSignUpPage } from '@/components/auth/ClerkAuthCard'")
    expect(signUpPageSource).not.toContain('redirect(')
  })
})
