import { Outlet } from '@tanstack/react-router';
import Layout from './components/Layout.jsx';

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
