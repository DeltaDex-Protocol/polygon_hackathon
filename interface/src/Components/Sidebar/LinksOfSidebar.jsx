import { useState } from 'react'

// import styles of this component
import styles from './LinksOfSidebar.module.css'

const LinksOfSidebar = ({sidebarLinks, onChangeToggle}) => {

	const [linksState, setLinks] = useState({
		links: [...sidebarLinks],
	})

	// console.log(linksState);

	const activeLink = (linkId) => {
		linksState.links.forEach(link => link.active = false);
		const link = linksState.links.find(link => link.id === linkId);

		// console.log(linkId);

        link.active = true;
        
        setLinks(prev => {
            return {
                links: [
                    ...prev.links
                ]
            }
        })
        onChangeToggle(link.text)

	}


	return (
		<>
			{linksState.links.map(link => 
				<Linkbox 
					text={link.text} 
					description={link.description} 
					key={link.id}
					onActive={activeLink}
					id={link.id}
					active={link.active}
					/>
			)}
		</>
		);

};

const Linkbox = ({text, description, onActive, id, active}) => {

	return (active ? (
			<div className={`${styles["active-link-sidebar"]}`} onClick={() => onActive(id)}>
				<h1 className={`${styles["title"]} mt-3`}> {text} </h1>
				<h2 className={`${styles["description"]} mt-3`}> {description} </h2>
			</div>
			) : (
			<div className={`${styles["link-sidebar"]}`} onClick={() => onActive(id)}>
				<h1 className={`${styles["title"]} mt-3`}> {text} </h1>
				<h2 className={`${styles["description"]} mt-3`}> {description} </h2>
			</div>
			)
			)

};



export default LinksOfSidebar;