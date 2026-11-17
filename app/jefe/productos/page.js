import PanelJefe from '@/components/jefe/PanelJefe';
import { cargarProductos } from '@/lib/productos';

export const dynamic = 'force-dynamic';

export default async function ProductosJefe() {
  const datos = await cargarProductos();
  return <PanelJefe productos={datos.productos} error={datos.ok ? '' : datos.error} />;
}
