import { useEffect, useRef, useState } from 'react';
import styles from './Sidebar.module.css';
// import UserProfile from '../Panel/UserProfile/UserProfile';
import { Import } from 'iconsax-react'
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import LinksOfSidebar from './LinksOfSidebar';


const SidebarLogo = () => {
	return (
		<span className=" max-h-10 px-3 my-3 py-1 text-lg  rounded-lg bg-indigo-400 text-white" >Volatility Smilers</span>
	);
}



const Sidebar = ({userAddress, sidebarLinks, onChangeToggle} ) => {

	const sidebarStyle = {
		position: "fixed",
		top: "100px",
		left: "30px",
		height: "100vh",
		width: "190px",
}

	return (
		<>
		<div>123123</div>
		<SidebarLogo/>
		<div style={sidebarStyle}>
			<UserProfile userAddress={userAddress} />
			<LinksOfSidebar sidebarLinks={sidebarLinks} onChangeToggle={onChangeToggle}/>
		</div>
		</>
	);
}




const UserProfile = ({userAddress}) => {

	// console.log(userAddress)
    return (
        <div className={`${styles['user-profile']} d-flex flex-column border bg-white`}>
	        
	        <Jazzicon diameter={40} 
			seed={jsNumberForAddress(userAddress)
				  }/>

	        <h1 className={`${styles.username} mt-3`}>Your address</h1>
	        <h4 className={`${styles['user-birthday']} mt-1`}>
						{userAddress !== "Not connected" ? (
							"Connected: " +
							String(userAddress).substring(0, 6) +
							"..." +
							String(userAddress).substring(38)
							) : (
							<span>Not connected</span>
	                    )}
			</h4>

        </div>
    )
}



export default Sidebar;