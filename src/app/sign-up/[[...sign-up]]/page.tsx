import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth-config'

export default function SignUpPage() {
  redirect(authConfig.signInPath)
}
