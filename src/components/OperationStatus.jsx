import React from 'react'
import {
    Alert
} from 'react-bootstrap';


const OperationStatus = ({ok, error, divId}) => (

    <div id={divId}>

        {error && <Alert bsStyle="danger">
            <h4>{error}</h4>
        </Alert>
        }

        {ok && <Alert bsStyle="success">
            <h4>{ok}</h4>
        </Alert>
        }
    </div>);


OperationStatus.defaultProps = {
    divId: 'operation_status_div'
};
OperationStatus.propTypes = {
    ok: React.PropTypes.string.isRequired,
    error: React.PropTypes.string.isRequired,
    divId: React.PropTypes.string
};


export default OperationStatus;