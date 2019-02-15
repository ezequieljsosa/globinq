import React from 'react';
import FormField from '../components/FormField.jsx';

const kon = <span>Kon O<sup>2</sup> Experimental  [M<sup>-1</sup>s<sup>-1</sup>]  </span>;
const koff = <span>Koff O<sup>2</sup> Experimental  [s<sup>-1</sup>]  </span>;

const ExperimentalData = ({idx, model, updateInputValue, errors}) => {

    return <div>
        <h4>{"Globin Variation " + idx.toString()}</h4>
        <FormField
            name={"name" + ((idx !== "") ? "_" : "") + idx.toString()} value={model.name} error={errors["name"]}
            placeholder="WT or Mutant short description" updateInputValue={updateInputValue}/>

        <FormField
            label={kon} name="k_on_o2_exp" value={model.k_on_o2_exp} error={errors["k_on_o2_exp"]}
            placeholder="kon" updateInputValue={updateInputValue}/>

        <FormField
            label={koff} name="k_off_o2_exp" value={model.k_off_o2_exp} error={errors["k_off_o2_exp"]}
            placeholder="off" updateInputValue={updateInputValue}/>


    </div>
};


export default ExperimentalData;