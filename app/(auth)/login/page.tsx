import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Log In — PixHive',
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl mx-auto mb-4" />
          <div className="w-32 h-6 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
