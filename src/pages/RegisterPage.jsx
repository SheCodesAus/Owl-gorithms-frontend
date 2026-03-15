import { Link } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";

function RegisterPage() {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Join Bucket List</p>
                <RegisterForm />
                <div className="login-footer">
                    Already have an account? <Link to="/log">Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;