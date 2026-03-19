import { createRoot } from 'react-dom/client';
import AppRoutes from './app/routes/AppRoutes';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<AppRoutes />);
