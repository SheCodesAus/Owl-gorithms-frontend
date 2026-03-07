import { Link } from "react-router";

function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/bucket-lists">Bucket Lists</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}

export default NavBar;