import { useState } from "react";
//import postRegister from "../api/post-register.js";
//import postLogin from "../api/post-login.js";
import { useNavigate, useOutletContext } from "react-router-dom";

function RegisterForm() {
    const navigateTo = useNavigate();
    const { setIsLoggedIn } = useOutletContext();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        firstName: "",
        lastName: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: "" }));
    }
};

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
    
        // Validation
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.password2) {
            newErrors.password2 = "Passwords don't match";
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Register the user COME BACK TO THIS AFTER post-register.js and post-login.js are ACTIONED
            //await postRegister(
                //formData.username,
                //formData.email,
                //formData.password,
                //formData.firstName,
                //formData.lastName
            //);

            // Automatically log them in
            //const loginResponse = await postLogin(formData.username, formData.password);
            //window.localStorage.setItem("token", loginResponse.token);
            //window.localStorage.setItem("userId", loginResponse.user_id);
            //setIsLoggedIn(true);
    
            // Redirect to home
            //navigateTo("/account");
            console.log("Register from submitted", formData);
            navigateTo("/");
        } catch (error) {
            setErrors({ general: error.message || "Registration failed. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            {errors.general && (
                <div className="error-message">{errors.general}</div>
            )}
    
            <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
                type="text"
                id="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
            />
        </div>

        <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
                type="text"
                id="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
            />
        </div>

        <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <p className="field-help">Password must be at least 8 characters long, and not too common</p>
        </div>

        <div className="form-group">
            <label htmlFor="password2">Confirm Password *</label>
            <input
                type="password"
                id="password2"
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={handleChange}
                disabled={isLoading}
            />
            {errors.password2 && <span className="field-error">{errors.password2}</span>}
        </div>

            <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? "Creating KickIt Account..." : "Sign Up"}
            </button>
        </form>
    );
}

export default RegisterForm;