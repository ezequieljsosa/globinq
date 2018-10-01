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
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import {tour_globin} from './tours.js';

import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';

import {BrowserRouter as Router, Link, Route, withRouter} from 'react-router-dom'
//https://react-bootstrap.github.io/components.html
import {Nav, Navbar, NavItem} from 'react-bootstrap';


const Header = ({base, logged, logout}) => (

    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to={base}>GlobinQ</Link>
            </Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <NavItem eventKey={1}><Link to={base + "methodology"}>Methodology</Link></NavItem>
            <NavItem eventKey={1}><Link to={base + "global"}>Data </Link></NavItem>
            <NavItem eventKey={1}><Link to={base + "statistics"}>Statistics </Link></NavItem>
            {/*<NavItem eventKey={2}><Link to={base + "userguide"}>User Guide</Link></NavItem>*/}
            <NavItem eventKey={3}><Link to={base + "tutorial"}>Interactive Tutorials</Link></NavItem>
            <NavItem eventKey={3}><Link to={base + "downloads"}>Downloads</Link></NavItem>
            {(logged) ?
                <NavItem eventKey={3}><Link to={base + "upload"}>Upload My Globin</Link></NavItem>
                : <NavItem eventKey={3}><Link to={base + "login"}>Upload My Globin</Link></NavItem>}


            <NavItem eventKey={4}><Link to={base + "about"}>About</Link></NavItem>
            {logged && <NavItem eventKey={4} onClick={logout}><Link to={base}>Logout</Link></NavItem>
            }
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
        return (this.state.data) ? <this.props.component url={this.url} base={this.props.base} {...this.state.data} /> :
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
        }
    }

    render() {




        const {cookies} = this.props;
        const page = location.href.split("/")[location.href.split("/").length - 1];
        if (page !== "") {
            this.state.page = this.controls[page];
        }
        const b = this.props.basePath;
        const apiUrl = this.props.apiUrl;

        const logout = () => {
            cookies.set('user', null, {path: '/'});
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
                    <Route path={b + "tutorial"} component={Tutorial}/>
                    <Route path={b + "about"} component={About}/>
                    <Route path={b + "login"} render={withRouter(({history}) =>
                        <Login base={b} apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}
                               success={user => {

                                   cookies.set('user', user, {path: '/'});

                                   this.setState({user: user});
                                   history.push("/upload");
                               }}/>)}/>


                    <Route path={b + "register"} render={withRouter(({history}) =>
                        <Register base={b} apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}
                                  success={user => {

                                      cookies.set('user', user, {path: '/'});

                                      this.setState({user: user});
                                      history.push("/upload");
                                  }}/>)}/>


                    <Route path={b + "upload"} render={() =>
                        <UploadGlobin base={b} owner={this.state.user}
                                      apiUrl={`http://${this.props.ip}:${this.props.port}${apiUrl}`}/>

                    }/>

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
                                                                url={apiUrl + "protein/" + location.pathname.split("/")[location.pathname.split("/").length - 1]}
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
