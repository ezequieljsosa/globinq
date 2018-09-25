import React from 'react'
import {
    Alert
} from 'react-bootstrap';




const OperationStatus = ( {ok, error}) => (

    <div>

        {error && <Alert bsStyle="danger">
            <h4>{error}</h4>
        </Alert>
        }

        {ok && <Alert bsStyle="success">
            <h4>{ok}</h4>
        </Alert>
        }
    </div> )


OperationStatus.defaultProps = {

}
OperationStatus.propTypes = {
    ok: React.PropTypes.string.isRequired,
    error: React.PropTypes.string.isRequired

}


export default OperationStatus;