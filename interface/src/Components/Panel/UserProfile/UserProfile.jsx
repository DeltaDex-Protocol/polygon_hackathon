// import styles of this component
import styles from './UserProfile.module.css'
// import other pkgs
import { Import } from 'iconsax-react'
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';


import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'



const UserProfile = ({ userProfile='0x1111111111111111111111111111111111111111', userBirthday, username, userEmail }) => {

    
    return (
        <div className={`${styles['user-profile']} d-flex flex-column align-items-center border bg-white`}>
        <Jazzicon diameter={100} seed={jsNumberForAddress(userBirthday)} />

        <h1 className={`${styles.username} mt-3`}> {(username)} </h1>
        <h4 className={`${styles['user-birthday']} mt-1`}> {userBirthday}</h4>
        <h4 className={`${styles['user-email']} mt-1`}>{(userEmail)}</h4>

        </div>
    )
}


export default UserProfile