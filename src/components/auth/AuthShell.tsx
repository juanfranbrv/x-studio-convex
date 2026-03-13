'use client'

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Bot, FileImage, FolderKanban, House, LayoutPanelTop, PanelsTopLeft } from 'lucide-react'
import { brand } from '@/lib/brand'

type AuthMode = 'sign-in' | 'sign-up'

function AppPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/68 p-4 shadow-[0_34px_90px_-46px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(212,138,52,0.16),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(93,122,57,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]" />
      <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="grid min-h-[32rem] grid-cols-[82px_1fr]">
          <aside className="flex flex-col justify-between border-r border-slate-200/80 bg-[linear-gradient(180deg,#f4f6fb,#eef2f8)] p-3">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f4aa3] text-white shadow-[0_12px_28px_-18px_rgba(15,74,163,0.9)]">
                <Bot className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-[1.1rem] bg-white/92 px-3 py-2 shadow-[0_14px_26px_-18px_rgba(15,23,42,0.35)]">
                  <House className="h-4 w-4 text-slate-500" strokeWidth={1.9} />
                  <div className="h-2.5 w-8 rounded-full bg-slate-300/80" />
                </div>
                <div className="flex items-center gap-3 rounded-[1.1rem] px-3 py-2 text-[#0f4aa3]">
                  <FileImage className="h-4 w-4" strokeWidth={1.9} />
                  <div className="h-2.5 w-8 rounded-full bg-[#0f4aa3]/30" />
                </div>
                <div className="flex items-center gap-3 rounded-[1.1rem] px-3 py-2 text-slate-500">
                  <FolderKanban className="h-4 w-4" strokeWidth={1.9} />
                  <div className="h-2.5 w-8 rounded-full bg-slate-300/70" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-9 rounded-2xl bg-white/90 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.4)]" />
              <div className="h-9 rounded-2xl bg-white/70" />
            </div>
          </aside>

          <div className="grid grid-rows-[64px_1fr]">
            <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/75 px-5">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-semibold tracking-tight text-[#0f4aa3]">{brand.name}</div>
                <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/88 px-3 py-1.5 md:flex">
                  <div className="h-6 w-6 rounded-full bg-[linear-gradient(135deg,#647a35,#d8a64d)]" />
                  <div className="h-2.5 w-20 rounded-full bg-slate-300/80" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#0f4aa3] px-3 py-1.5 text-xs font-semibold text-white">76</div>
                <div className="h-9 w-9 rounded-2xl bg-white/88" />
              </div>
            </header>

            <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5 p-5">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-[linear-gradient(180deg,#f6f1e8_0%,#d48739 18%,#845b39 44%,#f4c487 100%)] p-5 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.45)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,248,235,0.92),transparent_16%),radial-gradient(circle_at_18%_86%,rgba(255,219,163,0.36),transparent_18%)]" />
                  <div className="relative">
                    <div className="mb-5 flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="h-3 w-28 rounded-full bg-white/72" />
                        <div className="h-12 w-72 rounded-[1rem] bg-black/14" />
                        <div className="h-8 w-56 rounded-[0.9rem] bg-black/12" />
                      </div>
                      <div className="rounded-2xl bg-white/16 p-2 text-white">
                        <PanelsTopLeft className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                    </div>
                    <div className="flex min-h-[17rem] items-end justify-center gap-6">
                      <div className="mb-2 h-20 w-28 rounded-[1.2rem] bg-[#c98544]/80 blur-[1px]" />
                      <div className="relative h-56 w-20 rounded-[1.4rem] bg-[linear-gradient(180deg,#2e261f,#0f0e0d)] shadow-[0_28px_36px_-24px_rgba(0,0,0,0.9)]">
                        <div className="absolute left-1/2 top-[-18px] h-8 w-5 -translate-x-1/2 rounded-t-xl bg-[#161310]" />
                        <div className="absolute left-2 right-2 top-16 h-24 rounded-[0.8rem] bg-[linear-gradient(180deg,#647a35,#c9a44c)] opacity-90" />
                      </div>
                      <div className="relative h-40 w-16 rounded-[1.2rem] bg-[linear-gradient(180deg,#2b241f,#100f0d)] shadow-[0_28px_36px_-24px_rgba(0,0,0,0.8)]">
                        <div className="absolute left-1/2 top-[-14px] h-6 w-4 -translate-x-1/2 rounded-t-xl bg-[#161310]" />
                        <div className="absolute left-2 right-2 top-12 h-16 rounded-[0.7rem] bg-[linear-gradient(180deg,#647a35,#c9a44c)] opacity-90" />
                      </div>
                      <div className="h-16 w-24 rounded-[999px] bg-[#a9774f]/80 shadow-[0_20px_24px_-18px_rgba(0,0,0,0.45)]" />
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-12 flex-1 rounded-[999px] bg-[linear-gradient(180deg,rgba(73,79,52,0.95),rgba(104,110,72,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" />
                      <div className="h-10 w-10 rounded-full bg-white/26" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/84 p-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.35)]">
                  <div className="mb-3 h-3 w-36 rounded-full bg-slate-300/75" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="overflow-hidden rounded-[1.1rem] border border-slate-200/70 bg-[linear-gradient(180deg,#efe6d8,#ba7232)] p-2">
                      <div className="h-20 rounded-[0.9rem] bg-[linear-gradient(180deg,rgba(255,248,235,0.8),rgba(0,0,0,0.12))]" />
                    </div>
                    <div className="overflow-hidden rounded-[1.1rem] border border-slate-200/70 bg-[linear-gradient(180deg,#f3eee7,#d6c7af)] p-2">
                      <div className="h-20 rounded-[0.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(0,0,0,0.06))]" />
                    </div>
                    <div className="overflow-hidden rounded-[1.1rem] border-2 border-[#0f4aa3] bg-[linear-gradient(180deg,#efe6d8,#ba7232)] p-2 shadow-[0_16px_30px_-24px_rgba(15,74,163,0.75)]">
                      <div className="h-20 rounded-[0.9rem] bg-[linear-gradient(180deg,rgba(255,248,235,0.8),rgba(0,0,0,0.12))]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/84 p-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.35)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <LayoutPanelTop className="h-4 w-4 text-[#0f4aa3]" strokeWidth={1.8} />
                      Historial
                    </div>
                    <div className="h-2.5 w-16 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-10 rounded-[1rem] border border-slate-200/80 bg-[#f8fafc]" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 w-16 rounded-full bg-white shadow-[0_10px_20px_-18px_rgba(15,23,42,0.35)]" />
                    <div className="h-8 w-28 rounded-full bg-white" />
                    <div className="h-8 w-24 rounded-full bg-white" />
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/84 p-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.35)]">
                  <div className="mb-3 h-3 w-32 rounded-full bg-slate-300/75" />
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-[#f8fafc] p-3">
                    <div className="space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-slate-200/80" />
                      <div className="h-2.5 w-[86%] rounded-full bg-slate-200/80" />
                      <div className="h-2.5 w-[64%] rounded-full bg-slate-200/80" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="h-8 w-24 rounded-full bg-[#0f4aa3]/16" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-11 rounded-[1rem] border border-[#0f4aa3]/24 bg-[#0f4aa3]/6" />
                    <div className="h-11 rounded-[1rem] border border-[#0f4aa3]/18 bg-white" />
                    <div className="h-11 rounded-[1rem] border border-[#0f4aa3]/18 bg-white" />
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/84 p-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.35)]">
                  <div className="mb-3 h-3 w-24 rounded-full bg-slate-300/75" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.1rem] border border-[#0f4aa3]/24 bg-[#0f4aa3]/6 p-3">
                      <div className="mb-2 h-8 w-8 rounded-2xl bg-[#0f4aa3]/12" />
                      <div className="h-2.5 w-16 rounded-full bg-[#0f4aa3]/26" />
                    </div>
                    <div className="rounded-[1.1rem] border border-slate-200/80 bg-[#f8fafc] p-3">
                      <div className="mb-2 h-8 w-8 rounded-2xl bg-slate-200/80" />
                      <div className="h-2.5 w-16 rounded-full bg-slate-200/90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthShell({
  mode,
  children,
}: {
  mode: AuthMode
  children: ReactNode
}) {
  const { t } = useTranslation('auth')
  const isSignIn = mode === 'sign-in'

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-hidden bg-mesh text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(212,138,52,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(15,74,163,0.08),transparent_22%),linear-gradient(135deg,hsl(var(--background)/0.97),hsl(var(--muted)/0.82))]" />
      <div className="pointer-events-none absolute -left-12 top-0 h-64 w-64 rounded-full bg-[#d48a34]/10 blur-[110px] sm:-left-20 sm:h-80 sm:w-80 sm:blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-7rem] right-[-2rem] h-64 w-64 rounded-full bg-[#0f4aa3]/8 blur-[110px] sm:bottom-[-8rem] sm:right-[-3rem] sm:h-80 sm:w-80 sm:blur-[140px]" />

      <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)] lg:items-center xl:gap-14">
          <section className="hidden lg:block">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/15 bg-background/72 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Bot className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">x-studio</p>
                  <p className="text-sm font-medium text-foreground/72">{t('shell.systemAccess')}</p>
                </div>
              </div>

              <div className="max-w-xl space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                  {isSignIn ? t('shell.privateAccess') : t('shell.earlyAccess')}
                </p>
                <h1 className="max-w-lg text-balance font-heading text-5xl font-bold leading-[0.94] tracking-tight text-foreground">
                  {t('shell.heroTitle')}
                </h1>
                <p className="max-w-md text-base leading-7 text-muted-foreground">{t('shell.heroBody')}</p>
              </div>

              <AppPreview />
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="relative w-full max-w-[32rem] rounded-[2rem] border border-white/40 bg-background/68 p-5 shadow-[0_26px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Bot className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">x-studio</p>
                    <p className="text-sm font-medium text-foreground/72">{t('shell.systemAccess')}</p>
                  </div>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/80">
                  {isSignIn ? t('shell.privateAccess') : t('shell.earlyAccess')}
                </p>
                <div className="space-y-2">
                  <h2 className="max-w-sm font-heading text-3xl font-bold tracking-tight text-foreground sm:text-[2.15rem]">
                    {t('shell.title')}
                  </h2>
                  <p className="max-w-md text-sm leading-6 text-muted-foreground">
                    {isSignIn ? t('shell.signInDescription') : t('shell.signUpDescription')}
                  </p>
                </div>
              </div>

              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
