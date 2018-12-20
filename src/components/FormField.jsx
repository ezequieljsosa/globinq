import React from 'react'
import {
     FormGroup, FormControl, ControlLabel
     } from 'react-bootstrap';

const FormField = ( {name,label,value,error,disabled,placeholder,updateInputValue,autoFocus,area,password}) => (
    <div>
        <h3>{label}</h3>
        <FormGroup validationState={error && "error"}>
            <FormControl id={name} type={password && "password"}
                autoFocus={autoFocus} disabled={disabled} value={value} placeholder={placeholder}
        
        componentClass={area ? "textarea" : "input"}
        
                onChange={( evt ) => updateInputValue( name, evt.target.value )} />
            {error && <ControlLabel>{error}</ControlLabel>}
        </FormGroup>
    </div>

);

FormField.defaultProps = {
    }
FormField.propTypes = {
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        value:React.PropTypes.string,
        error:React.PropTypes.string,
        disabled:React.PropTypes.bool,
        placeholder: React.PropTypes.string ,
        updateInputValue: React.PropTypes.func        
    }

export default FormField;