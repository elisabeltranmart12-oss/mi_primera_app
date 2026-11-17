import { Fredoka, Nunito } from 'next/font/google';
import Link from 'next/link';
import Cabecera from '@/components/Cabecera';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-fredoka' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-nunito' });

export const metadata = {
  title: 'Ranita · Neceseres y bolsas para mamás',
  description:
    'Neceseres y bolsas de carro de tela estampada para mamás primerizas. Muy pronto abrimos nuestra tienda.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <Cabecera />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              <Link className="brand" href="/">
                <img src="/logo.svg" alt="" />
                Ranita
              </Link>
              <nav aria-label="Pie de página">
                <Link href="/tienda">Tienda</Link>
                <Link href="/#para-ti">Para ti</Link>
                <Link href="/apuntate">Apúntate</Link>
              </nav>
            </div>
            <p className="copy">
              © {new Date().getFullYear()} Ranita · Neceseres y bolsas de tela estampada para mamás. Hecho con mucho cariño.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
