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
    <body>
      <script src="//cdn.jsdelivr.net/npm/eruda"></script>
      <script dangerouslySetInnerHTML={{ __html: `eruda.init();` }} />
      {children}
    </body>
  </html>
)
