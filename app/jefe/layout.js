import EntrarJefe from '@/components/jefe/EntrarJefe';
import NavJefe from '@/components/jefe/NavJefe';
import { esJefe, hayClave } from '@/lib/jefe';
import '../backoffice.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Back office · Nenúfar',
  robots: { index: false, follow: false },
};

// Todo lo que cuelga de /jefe exige haber entrado con la clave de jefe.
export default async function LayoutJefe({ children }) {
  if (!(await esJefe())) return <EntrarJefe configurada={hayClave()} />;

  return (
    <div className="bo">
      <NavJefe />
      <div className="bo-contenido">{children}</div>
    </div>
  );
}
