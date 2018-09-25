import React from "react";

import {Grid, Row, Col, Button} from 'react-bootstrap';

import FormField from '../components/FormField.jsx';
import OperationStatus from '../components/OperationStatus.jsx';

class Register extends React.Component {

    state = {
        error: "", ok: "", fieldErrors: {},
        model: {email: "", password: "", password2: "", institution: "", name: ""}
    }

    updateInputValue = (control, value) => {
        const model = this.state.model;
        model[control] = value;
        this.setState({'model': model});
    }

    register = () => {
        const base = this.props.base;
        const success = this.props.success;
        if (this.state.model.password != this.state.model.password2) {
            this.setState({error: "Passwords do not match"})
            return
        }
        if (this.state.model.password.trim() == "") {
            this.setState({error: "Password cant be empty"})
            return
        }
        if (this.state.model.email.trim() == "") {
            this.setState({error: "Email cant be empty"})
            return
        }
        if (this.state.model.name.trim() == "") {
            this.setState({error: "Name cant be empty"})
            return
        }

        fetch(this.props.apiUrl + 'register', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify({
                email: this.state.model.email,
                name: this.state.model.name,
                institution: this.state.model.institution,
                password: this.state.model.password
            })
        }).then((res) => res.json())
            .then((user) => {

                if (user.name) {
                    success(user)

                } else {
                    this.setState({error: user["error"]})
                }
            })
            .catch((err) => console.log(err))
    }

    render() {

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
                <FormField name="name" label="Name"
                           value={this.state.institute}
                           error={this.state.fieldErrors["name"]}
                           placeholder="your name"
                           updateInputValue={this.updateInputValue}
                />
                <FormField name="institution" label="Institution"
                           value={this.state.institute}
                           error={this.state.fieldErrors["institution"]}
                           placeholder="place of work"
                           updateInputValue={this.updateInputValue}
                />
                <FormField name="password" label="Password"
                           value={this.state.owner}
                           error={this.state.fieldErrors["password"]}
                           updateInputValue={this.updateInputValue}
                           password
                />

                <FormField name="password2" label="Repeat Password"
                           value={this.state.owner}
                           error={this.state.fieldErrors["password2"]}
                           updateInputValue={this.updateInputValue}
                           password
                />

            </Col></Row>

            <Row><Col md={12}>

                <Button onClick={this.register}> Register</Button>
                <hr/>
            </Col>
            </Row>

        </Grid>
    }

}

export default Register;