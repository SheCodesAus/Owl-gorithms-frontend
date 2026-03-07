import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";

function Layout() {
    return (
        <div className="app-wrapper">
            <NavBar />
            <main className="main-content">
            <Outlet />
            </main>
        </div>
    );
}

export default Layout;