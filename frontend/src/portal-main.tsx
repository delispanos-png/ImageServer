import { createRoot } from 'react-dom/client';
import PortalRoutes from './portal/routes/PortalRoutes';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<PortalRoutes />);
