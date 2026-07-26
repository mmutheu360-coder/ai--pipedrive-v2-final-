export const metadata = {
  title: 'AI Pipedrive',
  description: 'AI powered Pipedrive',
}

export default function RootLayout({
  children,
}: {
  children
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
