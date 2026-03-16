'use client';

import * as React from'react';
import { useTheme } from'next-themes';
import { useTranslation } from'react-i18next';
import { Moon, Sun } from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from'@/lib/utils';

interface ThemeToggleProps {
 className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
 const { setTheme, resolvedTheme } = useTheme();
 const { t } = useTranslation('common');

 return (
 <Button
 variant="ghost"
 size="icon"
 className={cn("", className)}
 onClick={() => setTheme(resolvedTheme ==='dark' ?'light' :'dark')}
 >
 <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
 <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all" />
 <span className="sr-only">{t('labels.theme')}</span>
 </Button>
 );
}
