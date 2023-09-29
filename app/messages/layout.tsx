import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin nhắn',
  description: 'Tin nhắn của dự án!',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
