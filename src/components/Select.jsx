import React from 'react'
import {
    FormControl
} from 'react-bootstrap';

const Select = ( { options, selected, onChange,placeholder,width}) =>
    ( <FormControl defaultValue={selected} style={{ width: width }} onChange={(evt) => onChange(evt.target.value)  } componentClass="select" placeholder={placeholder} >
        {options.map(( option, i ) => ( <option key={i} value={option.value}>{option.label}</option> ) )}
    </FormControl> )


Select.defaultProps = {
    width: 100
}
Select.propTypes = {
    selected: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    options: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func
}


export default Select;

