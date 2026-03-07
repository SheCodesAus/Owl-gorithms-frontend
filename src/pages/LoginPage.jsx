import { useNavigate } from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";

function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();



    return (
        <GoogleLogin />
    )
}

export default LoginPage;