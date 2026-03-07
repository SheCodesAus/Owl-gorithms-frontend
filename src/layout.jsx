import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="app-wrapper">
            <main className="main-content">
            <Outlet />
            </main>
        </div>
    );
}

export default Layout;