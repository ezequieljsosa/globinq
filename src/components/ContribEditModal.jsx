import React from 'react';
import {  Button } from 'react-bootstrap';


import Modal from 'react-modal';
import FormField from '../components/FormField.jsx';
import ExperimentalData from '../components/ExperimentalData.jsx';

const ContribEditModal = ({open,model,updateInputValue,onClose,onSave,fieldErrors}) => {




    return <Modal isOpen={open}
           onRequestClose={onClose}
           contentLabel="Edit data">

        <h3>Edit data</h3>

        <FormField
            value={model.paper} name="paper"
            placeholder="Link for pubmed,  doi  or paper name" updateInputValue={updateInputValue}/>
        <FormField area
            value={model.description} name="description"
            placeholder="Description" updateInputValue={updateInputValue}/>

        {(model.ctype == "exp") && <ExperimentalData errors={fieldErrors}
                                                     key={0} model={model} idx=""
                                                     updateInputValue={updateInputValue}/>}



        <br/>
        <Button id="close_aln_btn" onClick={onClose}>Close</Button>
        <Button onClick={onSave}>Save</Button>
    </Modal>
};
export default ContribEditModal ;