import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => (
  <div className="layout">
    <NavBar />
    <main className="content">
      <Outlet />
    </main>
  </div>
);

export default Layout;
