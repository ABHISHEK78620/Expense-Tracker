import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './Signup.css';

const SignupForm = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [alertmsg, setAlertMsg] = useState('');

  useEffect(() => {
    // Cleanup the popup message after 5 seconds
    const popupTimer = setTimeout(() => {
      setPopupMessage('');
    }, 2000);

    // Cleanup the alert message after 5 seconds
    const alertTimer = setTimeout(() => {
      setAlertMsg('');
    }, 2000);

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(alertTimer);
    };
  }, [popupMessage, alertmsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend signup endpoint
      const response = await axios.post('http://localhost:8000/register', {
        username,
        email,
        password,
      });

      // Handle success
      setPopupMessage(response.data.message); // Set pop-up message
      console.log('Signup successful:', response.data);
    } catch (error) {
      // Handle error
      setAlertMsg(error.response.data.message); // Set alert message
    }

    // Reset form fields
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container">
      {/* Conditional rendering for success message */}
      {popupMessage && (
        <div className="success">
          <div className="success__icon">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z"
                fill="#393a37"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="success__title">{popupMessage}</div>
        </div>
      )}
      {/* Conditional rendering for error message */}
      {alertmsg && (
       <div className="error">
       <div className="error__icon">
         <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
           <path
             clipRule="evenodd"
             d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z"
             fill="#393a37"
             fillRule="evenodd"
           ></path>
         </svg>
       </div>
       <div className="error__title">{alertmsg}</div>
     </div>
      )}
      <div className="form_area">
        <p className="title">SIGN UP</p>
        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label className="sub_title" htmlFor="name">
              Name
            </label>
            <input
              placeholder="Enter your full name"
              className="form_style"
              type="text"
              id="name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form_group">
            <label className="sub_title" htmlFor="email">
              Email
            </label>
            <input
              placeholder="Enter your email"
              className="form_style"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form_group">
            <label className="sub_title" htmlFor="password">
              Password
            </label>
            <input
              placeholder="Enter your password"
              className="form_style"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className="btn" type="submit">
              SIGN UP
            </button>
            <p>
              Have an Account? <NavLink className="link" to="/login">Login Here!</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
