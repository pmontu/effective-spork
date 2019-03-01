import React, { Component } from 'react';
import './App.css';

import Login from './components/Login'
import Logout from './components/Logout'
import Forms from './components/Forms'
import Design from './components/Design'
import Reply from './components/Reply'
import View from './components/View'


class App extends Component {
    constructor() {
        super()
        this.state = {
            isLoggedIn: false,
            baseUrl: `http://${window.location.hostname}:8000`,
            isDesign: false,
            isReply: false,
            isView: false
        }

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.getForms = this.getForms.bind(this)
        this.handleDesign = this.handleDesign.bind(this)
        this.handleReply = this.handleReply.bind(this)
        this.handleView = this.handleView.bind(this)
        this.handleTextAttemptChange = this.handleTextAttemptChange.bind(this)
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
            isReply: false,
            isView: false
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
            isReply: false,
            isView: false
        })
    }

    handleReply(attempt) {
        this.setState({
            attempt: attempt,
            isDesign: false,
            isReply: true,
            isView: false
        })
    }

    handleView(attempt) {
        this.setState({
            attempt: attempt,
            isDesign: false,
            isReply: false,
            isView: true
        })

    }

    async handleTextAttemptChange(event, field_attempt) {
        const textFieldDetailUrl = `${this.state.baseUrl}/attempts/${field_attempt.attempt}/fields/${field_attempt.id}/`

        try {
            const response = await fetch(textFieldDetailUrl, {
                method: "patch",
                body: JSON.stringify({text: event.target.value}),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${this.state.token}`
                }
            })
            let data
            if(response.ok)
                data = await response.json()
            else
                throw new Error("Something went wrong")

            this.setState(prevState => ({
                attempt: {
                    fields: prevState.attempt.fields.map(field => {
                        if(field.id === data.id)
                            return data
                        return field
                    })
                }
            }))
        }
        catch(err)
        {
            alert(err)
        }
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
                            onView={this.handleView}
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
                        <Reply attempt={this.state.attempt} onTextChange={this.handleTextAttemptChange}/>
                    }
                </div>
                <div>
                    {
                        this.state.isLoggedIn && this.state.isView &&
                        <View attempt={this.state.attempt} />
                    }
                </div>
            </div>
        );
    }
}

export default App;
