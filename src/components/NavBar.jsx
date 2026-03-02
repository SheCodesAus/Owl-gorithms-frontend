import { Link, Outlet } from "react-router-dom";

function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/bucket-lists">Bucket Lists</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;