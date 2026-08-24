export const metadata = {
  title: 'Meu Blog de Resenhas',
  description: 'Resenhas de livros com notas e opiniões',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}