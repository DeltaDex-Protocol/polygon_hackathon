import { PureComponent } from 'react'

// import styles of this component
import styles from "./FormInput.module.css"
// import react bootstrap components 
import { FormGroup, FormLabel, FormControl, FormText } from 'react-bootstrap'
// import pkgs
import PropTypes  from 'prop-types'

class FormInput extends PureComponent {
    render() {
        // props
        const {
            inpClass='',
            className='', 
            controlId, 
            name, 
            text, 
            placeholder, 
            type="text", 
            as,
            errMsg, 
            successMsg, 
            valid, 
            invalid, 
            size='md',
            value,
            onChange,
            xs,
            sm,
            md,
            lg,
        } = this.props
        
        return (
            <FormGroup controlId={controlId} className={className} as={as} xs={xs} sm={sm} md={md} lg={lg}>
                <FormLabel className={styles['form-label']}>{text}</FormLabel>
                <FormControl 
                    isInvalid={invalid}
                    isValid={valid}
                    type={type} 
                    className={`${styles["form-input"]} ${inpClass}`} 
                    size={size}
                    placeholder={placeholder}
                    autoComplete="off"
                    name={name}
                    value={value}
                    onChange={onChange}
                    spellCheck="off"
                />
                {invalid && <FormText className="text-danger">{ errMsg }</FormText>}
                {valid && <FormText className="text-success">{ successMsg }</FormText>}
            </FormGroup>
        )
    }
}


export default FormInput