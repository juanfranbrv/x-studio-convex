'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { StylePresetsManager } from '@/components/admin/StylePresetsManager'

const ADMIN_EMAILS = ['juanfranbrv@gmail.com']

export default function AdminStylePresetsPage() {
  const { user, isLoaded } = useUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || ''
  const isAdmin = isLoaded && ADMIN_EMAILS.includes(userEmail.toLowerCase())

  if (!isLoaded) {
    return <div className="p-8">Cargando...</div>
  }

  if (!isAdmin) {
    return (
      <div className="p-8 space-y-3">
        <p>No tienes permisos para esta sección.</p>
        <Link href="/admin" className="text-sm underline">Volver a Admin</Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Estilos predefinidos</h1>
          <p className="text-sm text-muted-foreground">CRUD de estilos con análisis guardado para inyección directa en prompt.</p>
        </div>
        <Link href="/admin" className="text-sm underline">Volver a Admin</Link>
      </div>
      <StylePresetsManager adminEmail={userEmail} />
    </div>
  )
}
