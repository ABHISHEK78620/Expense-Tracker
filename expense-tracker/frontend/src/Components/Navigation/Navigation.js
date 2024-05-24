import React from 'react';
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { dollar } from '../../utils/Icons';
function Navigation({ active, setActive }) {

    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('userName'));
    const [avatarURL, setAvatarURL] = useState('');
      
    useEffect(() => {
        // Retrieve avatar image for the logged-in user from the backend
        const fetchAvatar = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/avatar/${loggedInUser}`);
                const fetchedAvatarURL = response.data.avatarURL;
                console.log('Fetched avatar URL:', fetchedAvatarURL);
                setAvatarURL(fetchedAvatarURL);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };

        if (loggedInUser) {
            fetchAvatar();
        }
    }, [loggedInUser]);

    // Event handler for signing out
    const handleSignOut = () => {
        // Clear user authentication state
        localStorage.removeItem('userName');
        localStorage.removeItem('isLoggedIn');
        // Redirect to the signup  page
        window.location.href = '/';
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            // Upload the avatar image to the backend
            const response = await axios.post(`http://localhost:8000/avatar/${loggedInUser}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Update avatar URL in the frontend
            const avatarURL = response.data.avatarURL;
           
             // Debugging statement
            setAvatarURL(avatarURL);
            
            // Store avatar URL in localStorage
            const storedUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
            localStorage.setItem('loggedInUser', JSON.stringify({ ...storedUser, selectedImage: avatarURL }));

            console.log('Updated avatar URL');
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };
  
    const {totalBalance}=useGlobalContext();
    //console.log(totalBalance());
    return (
        <NavStyled>
            <div className="user-con">
                <label htmlFor="avatarUpload">
                <img src={avatarURL ? `http://localhost:8000/${avatarURL}` : avatar} />
                </label>
                <input id="avatarUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                <div className="text">
                    <h2>{loggedInUser}</h2>
                    <p>{dollar}{totalBalance()}</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>
            <div className="bottom-nav">
                <li>
                    {signout}
                    <button type="submit" className="btn btn-info w-40" style={{marginLeft:'10px', marginBottom:'5px'}} onClick={handleSignOut}>Sign Out</button>
                </li>
            </div>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background:#f5e4d7;
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #ffffff;
            padding: 0.2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }
        h2 {
            color: rgba(34, 34, 96, 1);
        }
        p {
            color:black;
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color:#352208;
            padding-left: 1rem;
            position: relative;
            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all 0.4s ease-in-out;
            }
        }
    }

    .active {
        color: #bc6c25 !important;
        i {
            color: rgba(34, 34, 96, 1) !important;
        }
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }
`;

export default Navigation;
