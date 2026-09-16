import React from 'react'
import {useState} from "react";
import {useAuth} from "../hooks/useAuth.js";
import {useNavigate, Link} from "react-router";
import '../auth.form.scss'



const Register = () => {
    const navigate = useNavigate();
    const {loading, handleRegister} = useAuth();


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("")
   

    const handleSubmit = async (e) =>{
    e.preventDefault()
    setIsSubmitting(true);
    try {
    await handleRegister({username, email, password});
    navigate("/");
    } catch (error) {

         setErrorMessage(
            error.response?.data?.message || "Registration failed"
        );
    } finally {
        setIsSubmitting(false);
    }
}

    if (loading) {
        return (
            <main className="auth-loading">
                <div>
                    <span className="loading-spinner" />
                    <h1>{isSubmitting ? "Creating your workspace..." : "Checking your session..."}</h1>
                </div>
            </main>
        )
    }


  return (
        <main className="auth-page">
        <div className="form-container">
            <h1>Register</h1>
                {errorMessage && (
                <p>{errorMessage}</p>
                )}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" id="username" name="username" placeholder="Enter your username" required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" id="email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" id="password" name="password" placeholder="Enter your password" required />
                </div>
                <button className="button primary-button" type="submit">Register</button>

            </form>

            <p>Already have an account? <Link to="/login">Login</Link></p>


        </div>
    </main>
  )
}

export default Register