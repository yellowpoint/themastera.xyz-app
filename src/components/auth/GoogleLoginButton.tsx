'use client'

import GoogleIcon from '@/components/icons/GoogleIcon'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

type Props = {
  className?: string
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
  callbackURL?: string
  text?: string
}

export default function GoogleLoginButton({
  className,
  variant = 'outline',
  callbackURL = '/',
  text = 'Continue with Google',
}: Props) {
  const { signInWithGoogle } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  if (process.env.NODE_ENV !== 'development') return null

  const onClick = async () => {
    try {
      setSubmitting(true)
      await signInWithGoogle({ callbackURL })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Field>
      <Button
        type="button"
        variant={variant}
        className={`w-full flex items-center justify-center gap-2 ${className || ''}`}
        onClick={onClick}
        loading={submitting}
      >
        <GoogleIcon />
        {text}
      </Button>
    </Field>
  )
}
