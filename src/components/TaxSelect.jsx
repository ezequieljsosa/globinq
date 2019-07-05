import React from 'react'

import Select from 'react-select';
import 'react-select/dist/react-select.css';

const TaxSelect = ( {apiUrl, value, onChange, label}) => {


    const getOptions = ( input, callback ) => {

        if ( !input && value ) {
            callback( null, { options: [{ 'label': label, 'value': value }] });

        } else {
            if ( (input != "") && (input.length >= 3)) {

                fetch( apiUrl + 'tax?search=' + input )
                    .then(( response ) => {
                        return response.json();
                    }).then(( json ) => {
                        const data = { options: json.tax.map(( x => { return { 'value': x.id.toString(), 'label': x.name, 'object': x } }) ) };  
                        callback( null,  data);
                    });
            } else {
                callback( null, { options: [] })
            }
        }
    }

    return ( <Select.Async
        name="taxSelect"
        clearable={false}
            value={value}
        loadOptions={getOptions}
        onChange={( x ) => onChange( x.object )}
        /> );
};

TaxSelect.defaultProps = {
    value: ""
};
TaxSelect.propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string

};

export default TaxSelect;

