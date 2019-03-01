import React, { Component } from 'react';
import './App.css';

import Login from './components/Login'
import Logout from './components/Logout'
import Forms from './components/Forms'
import Design from './components/Design'
import Reply from './components/Reply'


class App extends Component {
    constructor() {
        super()
        this.state = {
            isLoggedIn: false,
            baseUrl: `http://${window.location.hostname}:8000`,
            isDesign: false,
            isReply: false
        }

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.getForms = this.getForms.bind(this)
        this.handleDesign = this.handleDesign.bind(this)
        this.handleReply = this.handleReply.bind(this)
        this.handleAttemptFieldChange = this.handleAttemptFieldChange.bind(this)
    }

    handleLogin(user) {
        const loginUrl = `${this.state.baseUrl}/api-token-auth/`
        fetch(loginUrl, {
            method: "post",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        })
            .then(r => {
                if(r.ok)
                    return r.json()
                throw new Error("Something went wrong.")
            })
            .then(d => this.setState({
                username: user.username,
                token: d.token,
                isLoggedIn: true,
                user: {id: d.user.id}
            }))
            .catch(e => {
                alert(e)
                this.setState({ isLoggedIn: false })
            })
    }

    handleLogout() {
        this.setState({
            isLoggedIn: false,
            isDesign: false,
            isReply: false
        })
    }

    async getForms() {
        let forms = []

        try {
            const formsUrl = `${this.state.baseUrl}/forms/`
            const response = await fetch(formsUrl)
            if(response.ok)
                forms = await response.json()
            else
                throw new Error("Something went wrong.")
        }

        catch(err) {
            alert(err)
        }


        let attempts = []

        try {
            const attemptsUrl = `${this.state.baseUrl}/attempts/`
            const response = await fetch(attemptsUrl, {
                headers: {"Authorization": `JWT ${this.state.token}`}
            })
            if(response.ok)
                attempts = await response.json()
            else
                throw new Error("Something went wrong.")
        }

        catch(err) {
            alert(err)
        }
        return {forms: forms, attempts: attempts}
    }

    handleDesign(form) {
        this.setState({
            form: form,
            isDesign: true,
            isReply: false
        })
    }

    handleReply(attempt) {
        this.setState({
            attempt: attempt,
            isDesign: false,
            isReply: true
        })
    }

    handleAttemptFieldChange() {
        console.log("here")
    }

    render() {
        return (
            <div>
                <div>
                    {
                        this.state.isLoggedIn &&
                        <Logout
                            username={this.state.username}
                            onClick={this.handleLogout}
                        />
                    }
                </div>
                <div>
                    {
                        !this.state.isLoggedIn &&
                        <Login onSubmit={this.handleLogin}/>
                    }
                </div>
                <div>
                    {
                        this.state.isLoggedIn &&
                        <Forms
                            onLoad={this.getForms}
                            userId={this.state.user.id}
                            onDesign={this.handleDesign}
                            onReply={this.handleReply}
                        />
                    }
                </div>
                <div>
                    {
                        this.state.isLoggedIn && this.state.isDesign &&
                        <Design form={this.state.form}/>
                    }
                </div>
                <div>
                    {
                        this.state.isLoggedIn && this.state.isReply &&
                        <Reply attempt={this.state.attempt} onChange={this.handleAttemptFieldChange}/>
                    }
                </div>
            </div>
        );
    }
}

export default App;
