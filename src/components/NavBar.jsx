import { Link, Outlet } from "react-router";
//import { AuthProvider } from "../context/AuthContext";
//import "./NavBar.css";

function NavBar() {
  return (
      <><nav>
      <Link to="/">Home</Link>
      <Link to="/bucket-lists">Bucket Lists</Link>
      <Link to="/login">Login</Link>
    </nav><Outlet /></>
  );
}

export default NavBar;