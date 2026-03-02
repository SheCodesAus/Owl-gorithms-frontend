import { Link } from "react-router";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
    <div className="error-code">404</div>
    <h2>Page Not Found</h2>
    <p>Sorry, the page you are looking for does not exist.   
    </p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-lg">
          ← Back to Home
        </Link>
        <Link to="/buckets" className="btn btn-outline btn-lg">
          My Bucket List
        </Link>
      </div>
    </div>
  );
}

export default NotFound;