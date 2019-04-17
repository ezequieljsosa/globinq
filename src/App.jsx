import React from 'react';

import Search from './Search.jsx';
import Organism from './Organism.jsx';
import GlobinGroup from './GlobinGroup.jsx';
import Protein from './Protein.jsx';
import BlastResult from './BlastResult.jsx';
import SearchResult from './SearchResult.jsx';

import Methodology from './pages/Methodology.jsx';
import Downloads from './pages/Downloads.jsx';
import UserGuide from './pages/UserGuide.jsx';
import Tutorial from './pages/Tutorial.jsx';
import About from './pages/About.jsx';
import DataAnalysis from './pages/DataAnalysis.jsx';
import Statistics from './pages/Statistics.jsx';
import UploadGlobin from './pages/UploadGlobin.jsx';
import User from './pages/User.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import {tour_globin,tour_stats,tour_blast,tour_upload} from './tours.js';

import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';

import {BrowserRouter as Router, Link, Route, withRouter} from 'react-router-dom'
//https://react-bootstrap.github.io/components.html
import {Nav, Navbar, NavItem, Button} from 'react-bootstrap';


const Header = ({base, logged, logout}) => (

    <Navbar sticky="top"  bsStyle={"inverse" }>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to={base}>GlobinQ</Link>
            </Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <NavItem eventKey={3}><Link to={base + "tutorial"} style={{color:"white"}}>Interactive <br /> Tutorials</Link></NavItem>
            <NavItem eventKey={1}><Link to={base + "global"} style={{color:"white"}}>Analyzed <br />Data </Link></NavItem>
            <NavItem eventKey={1}><Link to={base + "statistics"} style={{color:"white"}}>AA distributions </Link></NavItem>
            {(logged) ?
                <NavItem eventKey={3}><Link to={base + "upload"} style={{color:"white"}}>Upload <br />My Globin</Link></NavItem>
                : <NavItem eventKey={3} disabled="" >Upload Globin</NavItem>}

            <NavItem eventKey={3}><Link to={base + "downloads"} style={{color:"white"}}>Downloads</Link></NavItem>
            {/*{logged && <NavItem eventKey={6}><Link to={base + "user/"  + logged.id.toString()} style={{color:"white"}}>My Data</Link></NavItem> }*/}
            <NavItem eventKey={1}><Link to={base + "methodology"} style={{color:"white"}}>Methodology</Link></NavItem>
            <NavItem eventKey={4}><Link to={base + "about"} style={{color:"white"}}>About us</Link></NavItem>

            {!logged && <NavItem eventKey={4} onClick={logout}>
                    <Link to={base + "register"} style={{color:"white"}}>Sign up</Link></NavItem>   }
            {logged ? <NavItem eventKey={4} onClick={logout}><Link to={base} style={{color:"white"}}><Button bsStyle={"primary"}>Sign out</Button></Link></NavItem> :
                <NavItem eventKey={5}>  <Link to={base + "login"} style={{color:"white"}}><Button bsStyle={"primary"}> Sign in </Button></Link></NavItem>
            }
            {logged && <NavItem><Link to={base + "user/"  + logged.id.toString()}> <b style={{color:"white"}}> {logged.name} </b> </Link></NavItem>}

        </Nav>


    </Navbar>


);

class AjaxWrapper extends React.Component {

    state = {data: false};


    componentDidMount() {

        let url = `http://${this.props.ip}:${this.props.port}${this.props.url}`;
        if (this.props.search) {
            url += this.props.search;
        }
        this.url = url;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                this.setState({'data': data})
            });
    }

    render() {
        return (this.state.data) ? <this.props.component user={this.props.user} url={this.url} apiUrl={this.props.apiUrl}
                                                         base={this.props.base} {...this.state.data} /> :
            <h1>Loading...</h1>
    }

}


class App extends React.Component {


    constructor(props) {
        super(props);
        const {cookies} = this.props;

        this.state = {
            'page': Search,
            user: cookies.get('user') || null,
        };

        this.controls = {
            'search': Search,
            'organism': Organism,
            'group': GlobinGroup,
            'protein': Protein,
            'blast': BlastResult
        }

    }


    componentDidMount() {
        this.tour()
    }

    to = (page) => {
        //this.setState({'page':this.controls[page]})
        window.location = `http://${this.props.ip}:${this.props.port}/${page}`;
    };

    tour = () => {
        if (location.href.split("?").length > 1) {
            const arr = location.href.split("?")[1].split("&").filter(x => x.split("=")[0] === "tour");
            const enabledTour = (arr.length > 0) ? arr[0].split("=")[1] : 0;
            if (enabledTour==="1") {
                tour_globin();
            }
            if (enabledTour==="2") {
                tour_stats();
            }
            if (enabledTour==="3") {
                tour_blast();
            }
            if (enabledTour==="4") {
                tour_upload();
            }
        }
    };

    render() {




        const {cookies} = this.props;
        const page = location.href.split("/")[location.href.split("/").length - 1];
        if (page !== "") {
            this.state.page = this.controls[page];
        }
        const b = this.props.basePath;
        const apiUrl = this.props.apiUrl;

        const logout = () => {
            delete cookies.user;
            cookies.set('user', "", {path: '/'});
            this.setState({user: null});

        };


        return (
            <Router>
                <div>


                    <Header logged={this.state.user}
                            logout={logout}
                            base={b} home={() => this.to('search')}
                            methodology={() => this.to('organism')}
                            userGuide={() => this.to('group')}
                            tutorial={() => this.to('blast')}
                    />


                    <Route exact path={b} render={() => <Search base={b}
                                                                baseApi={apiUrl}
                                                                port={this.props.port} ip={this.props.ip}/>}/>

                    <Route path={b + "methodology"} component={Methodology}/>
                    <Route path={b + "global"} component={DataAnalysis}/>
                    <Route path={b + "statistics"} component={Statistics}/>
                    <Route path={b + "downloads"} render={() =>
                        <Downloads
                            apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}/>

                    }/>
                    <Route path={b + "userguide"} component={UserGuide}/>
                    <Route path={b + "tutorial"} render={withRouter(({history}) =>
                     <Tutorial user={this.state.user}  />
                    )}/>
                        <Route path={b + "about"} component={About}/>
                    <Route path={b + "login"} render={withRouter(({history}) =>
                        <Login base={b} apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}
                               success={user => {

                                   cookies.set('user', user, {path: '/'});

                                   this.setState({user: user});
                                   history.push("/user/"  + user.id.toString());
                               }}/>)}/>


                    <Route path={b + "register"} render={withRouter(({history}) =>
                        <Register base={b} apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}
                                  success={user => {

                                      cookies.set('user', user, {path: '/'});

                                      this.setState({user: user});
                                      history.push("/user/"  + user.id.toString());
                                  }}/>)}/>


                    <Route path={b + "upload"} render={() =>
                        <UploadGlobin base={b} owner={this.state.user}
                                      apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}/>

                    }/>

                    { this.state.user &&
                        <Route path={b + "user"} render={() =>

                            <AjaxWrapper base={b} port={this.props.port}
                                         ip={this.props.ip} user={this.state.user}
                                         apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}
                                         url={apiUrl + "user/" + this.state.user.id.toString()} search={location.search}
                                         component={User}/>}/>
                    }




                    <Route path={b + "search"}
                           render={({location}) => <AjaxWrapper base={b} port={this.props.port}
                                                                ip={this.props.ip}
                                                                url={apiUrl + "search"} search={location.search}
                                                                component={SearchResult}/>}/>
                    <Route path={b + "blast"}
                           render={({location}) => <AjaxWrapper base={b} port={this.props.port}
                                                                ip={this.props.ip}
                                                                url={apiUrl + "blast"} search={location.search}
                                                                component={BlastResult}/>}/>
                    <Route path={b + "protein"}
                           render={({location}) => <AjaxWrapper base={b} port={this.props.port}
                                                                ip={this.props.ip}
                                                                user={this.state.user }
                                                                apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}
                                                                url={apiUrl + "protein/" + location.pathname.split(
                                                                    "/")[location.pathname.split("/").length - 1]}
                                                                search={location.search} component={Protein}/>}/>


                </div>
            </Router>
        );
    }
}

App.propTypes = {
    cookies: instanceOf(Cookies).isRequired
};
export default withCookies(App);
