import { PureComponent, useState, useEffect } from 'react';
import {Button, Navbar, Container} from 'react-bootstrap';
import PropTypes from 'prop-types';
import styles from './Header.module.css';
import logo from "./../../etc/logo.png";




const Header = ({walletAddress, connectPressed}) => {

	// console.log('header:', walletAddress)
    return (
        <div className={`${styles['header']} fixed`}>
        	<img src={logo} className={`${styles['logo']}`} />

    		<button className='fixed top-5 right-5 rounded bg-indigo-400 text-white font-normal' onClick={connectPressed}> 
	                    {walletAddress !== "Not connected" ? (
	                      "Connected: " +
	                      String(walletAddress).substring(0, 6) +
	                      "..." +
	                      String(walletAddress).substring(38)
	                    ) : (
	                      <span>Connect Wallet</span>
	                    )}
	    	</button>

        </div>
    );

};


const Btn = ({walletAddress, connectWalletPressed}) => {

	// walletPressed () => connectWalletPressed();

	return (
		<Button variant="primary" className="float-end mt-5 py-2" onClick={connectWalletPressed}> 
	                    {walletAddress !== "Not connected" ? (
	                      "Connected: " +
	                      String(walletAddress).substring(0, 6) +
	                      "..." +
	                      String(walletAddress).substring(38)
	                    ) : (
	                      <span>Connect Wallet</span>
	                    )}
	    </Button>
    )
};

export default Header;

