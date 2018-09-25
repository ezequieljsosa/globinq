import React from "react";

import {Grid, Row, Col, Button} from 'react-bootstrap';

import {Link} from 'react-router-dom'

import FormField from '../components/FormField.jsx';
import OperationStatus from '../components/OperationStatus.jsx';

class Login extends React.Component {

    state = {
        error: "", ok: "", fieldErrors: {},
        model: {email: "", password: ""}
    }

    updateInputValue = (control, value) => {
        const model = this.state.model;
        model[control] = value;
        this.setState({'model': model});
    }

    login = () => {

        const success = this.props.success;
        fetch(this.props.apiUrl + 'login', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify({
                email: this.state.model.email,
                password: this.state.model.password
            })
        }).then((res) => res.json())
            .then((user) => {

                if (user.name) {
                    success(user)

                } else {
                    this.setState({error: "Login error"})
                }
            })
            .catch((err) => console.log(err))
    }

    render() {
        const base = this.props.base;
        return <Grid>

            <Row>
                <Col md={12}><h1>Upload Globin</h1>
                    <OperationStatus error={this.state.error} ok={this.state.ok}/>
                </Col>

            </Row>

            <Row><Col md={12}>

                <FormField name="email" label="EMail"
                           value={this.state.institute}
                           error={this.state.fieldErrors["email"]}
                           placeholder="xx@yy.com"
                           updateInputValue={this.updateInputValue}
                />
                <FormField name="password" label="Password"
                           value={this.state.owner}
                           error={this.state.fieldErrors["password"]}
                           updateInputValue={this.updateInputValue}
                           password
                />


            </Col></Row>

            <Row><Col md={12}>
                <table>
                    <tr><td><Button onClick={this.login}> Login</Button></td>
                        <td>&#160;<Link to={base + "register"}>Register</Link></td></tr>
                </table>



                <hr/>
            </Col>
            </Row>

        </Grid>
    }

}

export default Login;