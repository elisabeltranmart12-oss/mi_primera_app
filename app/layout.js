import './globals.css';

export const metadata = {
  title: 'Mi primera app',
  description: 'App de clase con Neon, GitHub y Vercel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
