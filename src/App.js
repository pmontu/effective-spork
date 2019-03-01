import React, { Component } from 'react';
import './App.css';

function Logout() {
    return <span>Logout</span>
}

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

class App extends Component {
    constructor() {
        super()
        this.state = {
            isLoggedIn: false,
            baseUrl: `http://${window.location.hostname}:8000`,
        }

        this.handleLogin = this.handleLogin.bind(this)
    }

    handleLogin(user) {
        console.log(user)
        const loginUrl = `${this.state.baseUrl}/api-token-auth/`
        console.log(loginUrl)
        console.log(user, JSON.stringify(user))
        fetch(loginUrl, {
            method: "post",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        })
            .then(r => r.json())
            .then(d => console.log(d))
            .catch(e => alert(e))
    }

    render() {
        return (
            <div>
                <span>{this.state.isLoggedIn && <Logout />}</span>
                <span>{!this.state.isLoggedIn && <Login onSubmit={this.handleLogin}/>}</span>
            </div>
        );
    }
}

export default App;
