import React from 'react';
import FormField from '../components/FormField.jsx';

const kon = <span>k<sub>on</sub> O<sup>2</sup>   [M<sup>-1</sup>s<sup>-1</sup>]  </span>;
const koff = <span>k<sub>off</sub> O<sup>2</sup>   [s<sup>-1</sup>]  </span>;

const ExperimentalData = ({idx, model, updateInputValue, errors}) => {
    const name = "name" + ((idx !== "") ? "_" : "") + idx.toString();
    const value = model[name];
    return <div>
        <h4>{"Kinetic data " + idx.toString()}</h4>
        <FormField
            name={name} value={value} error={errors["name"]}
            placeholder="wt or mutant short description (example: amino acid wild type W - structural position G8, mutant form F, so: WG8F)" updateInputValue={updateInputValue}/>

        <FormField 
                   label={kon} name="k_on_o2_exp" value={model.k_on_o2_exp} error={errors["k_on_o2_exp"]}
            placeholder="example: 950000" updateInputValue={updateInputValue}/>

        <FormField
            label={koff} name="k_off_o2_exp" value={model.k_off_o2_exp} error={errors["k_off_o2_exp"]}
            placeholder="example: 0.00020" updateInputValue={updateInputValue}/>


    </div>
};


export default ExperimentalData;