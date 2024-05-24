import React, { useState } from 'react';
import axios from 'axios';
import './error.css';
import './LoginForm.css';
function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                username,
                password,
            });
            const userId = response.data.userId; // Assuming the response contains the user ID
            // Store the user ID in the frontend state or local storage
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', response.data.userName);
            console.log(response.data.userName);
            // Call the onLogin function passed from the parent component
            props.onLogin();
            console.log('Login successful:', response.data.success);
           
            
        } catch (error) {
            setErrorMessage(error.response.data.message);
            console.error('Login error:', error.response.data);
            setTimeout(() => setErrorMessage(''), 2000);
        }
    }

    return (
                <div className="col-md-6">
                    {errorMessage && (
                       
<div class="error">
    <div class="error__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
    </div>
    <div class="error__title">{errorMessage}</div>
</div>
                    )}
      <h1 style={{marginLeft:'670px', marginTop:'65px'}}>Login</h1>
                        <div class="login-box">

 <form onSubmit={handleSubmit}>
   <div class="user-box">
     <input type="text" name="username" 
      value={username} onChange={(e) => setUsername(e.target.value)} />
     <label>Username</label>
   </div>
   <div class="user-box">
     <input type="password" name="password" 
      value={password} onChange={(e) => setPassword(e.target.value)} />
     <label>Password</label>
   </div><center>
   <button style={{border:'none', color:'white', backgroundColor:'black'}}>
          SEND
      <span></span>
   </button></center>
 </form>
</div>
                        </div>
                
        
        
    );
}

export default LoginForm;
