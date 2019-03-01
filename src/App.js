import React, { Component } from 'react';
import './App.css';


class Login extends Component {
    constructor() {
        super()
        this.state = {
            username: "manoj",
            password: "1",

        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({ [name]: value })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    render() {
        return (
            <div>
                <h3>Login</h3>

                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        required={true}
                        name="username"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                    <br />
                    <input
                        type="password"
                        required={true}
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <br />

                    <button>Submit</button>
                </form>
            </div>
        )
    }
}

function Logout(props) {
    return (
        <div>
            <h3>Logged In as {props.username}</h3>
            <button onClick={props.onClick}>Logout</button>
        </div>
    )
}

class App extends Component {
    constructor() {
        super()
        this.state = {
            isLoggedIn: false,
            baseUrl: `http://${window.location.hostname}:8000`,
        }

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogin(user) {
        const loginUrl = `${this.state.baseUrl}/api-token-auth/`
        fetch(loginUrl, {
            method: "post",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        })
            .then(r => r.json())
            .then(d => this.setState({
                username: user.username,
                token: d.token,
                isLoggedIn: true
            }))
            .catch(e => {
                alert(e)
                this.setState({
                    isLoggedIn: false,
                    token: null,
                    username: null
                })
            })
    }

    handleLogout() {
        console.log("logout")
        this.setState({
            isLoggedIn: false,
            token: null,
            username: null
        })
    }

    render() {
        return (
            <div>
                <div>{
                    this.state.isLoggedIn &&
                    <Logout
                        username={this.state.username}
                        onClick={this.handleLogout}
                    />}
                </div>
                <div>{!this.state.isLoggedIn && <Login onSubmit={this.handleLogin}/>}</div>
            </div>
        );
    }
}

export default App;
