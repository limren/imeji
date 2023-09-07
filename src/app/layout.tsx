import Provider from "./_trpc/Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
