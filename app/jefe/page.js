import EntrarJefe from '@/components/jefe/EntrarJefe';
import PanelJefe from '@/components/jefe/PanelJefe';
import { esJefe, hayClave } from '@/lib/jefe';
import { cargarProductos } from '@/lib/productos';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Zona jefe · Nenúfar',
  robots: { index: false, follow: false },
};

export default async function Jefe() {
  if (!(await esJefe())) {
    return <EntrarJefe configurada={hayClave()} />;
  }
  const datos = await cargarProductos();
  return <PanelJefe productos={datos.productos} error={datos.ok ? '' : datos.error} />;
}
