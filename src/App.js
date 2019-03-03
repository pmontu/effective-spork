import React, { Component } from 'react'
import './App.css'
import 'bulma/css/bulma.css'

import Login from './components/Login'
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
            isView: false,
            isForms: true,
            forms: [],
            attempts: []
        }

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.getForms = this.getForms.bind(this)
        this.handleDesign = this.handleDesign.bind(this)
        this.handleReply = this.handleReply.bind(this)
        this.handleView = this.handleView.bind(this)
        this.handleForms = this.handleForms.bind(this)
        this.handleTextAttemptChange = this.handleTextAttemptChange.bind(this)
        this.handleRadioAttemptChange = this.handleRadioAttemptChange.bind(this)
        this.handleDesignTextSubmit = this.handleDesignTextSubmit.bind(this)
        this.handleDesignOptionSubmit = this.handleDesignOptionSubmit.bind(this)
        this.handleFillInit = this.handleFillInit.bind(this)
        this.handleFormCreate = this.handleFormCreate.bind(this)
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
            .then(d => {
                this.setState({
                    username: user.username,
                    token: d.token,
                    isLoggedIn: true,
                    user: {id: d.user.id}
                })
                this.getForms()
            })
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
            isView: false,
            isForms: false
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
        this.setState({ forms: forms, attempts: attempts, isForms: true })
    }

    handleDesign(form) {
        this.setState({
            form: form,
            isDesign: true,
            isReply: false,
            isView: false,
            isForms: false
        })
    }

    handleReply(attempt) {
        this.setState({
            attempt: attempt,
            isDesign: false,
            isReply: true,
            isView: false,
            isForms: false
        })
    }

    handleView(attempt) {
        this.setState({
            attempt: attempt,
            isDesign: false,
            isReply: false,
            isView: true,
            isForms: false
        })
    }

    handleForms(attempt) {
        this.setState({
            attempt: attempt,
            isDesign: false,
            isReply: false,
            isView: false,
            isForms: true
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
                    ...prevState.attempt,
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

    async handleRadioAttemptChange(...args) {
        const [ event, optionId, selOptionId, attFieldId, attemptId ] = args
        const { checked } = event.target

        try {
            if(checked) {
                const attOptListUrl = `${this.state.baseUrl}/attempts/${attemptId}/fields/${attFieldId}/options/`
                const response = await fetch(attOptListUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${this.state.token}`
                    },
                    method: "post",
                    body: JSON.stringify({ option: optionId })
                })
                if(!response.ok)
                    throw new Error("Something went wrong while posting option")
                const data = await response.json()
                this.setState(prevState => ({
                    attempt: {
                        ...prevState.attempt,
                        fields: prevState.attempt.fields.map(attField => {
                            const newOpts = attField.options
                            newOpts.push(data)
                            return {
                                ...attField,
                                options: newOpts
                            }}
                        )}
                }))
            }
            else {
                const attOptDetailUrl = `${this.state.baseUrl}/attempts/${attemptId}/fields/${attFieldId}/options/${selOptionId}/`
                const response = await fetch(attOptDetailUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${this.state.token}`
                    },
                    method: "delete"
                })
                if(!response.ok)
                    throw new Error("Something went wrong while deleting option")

                this.setState(prevState => ({
                    attempt: {
                        ...prevState.attempt,
                        fields: prevState.attempt.fields.map(attField => {
                            const newOpts = attField.options.filter(attOpt => attOpt.id !== selOptionId)
                            return {
                                ...attField,
                                options: newOpts
                            }
                        })
                    }
                }))
            }
        }
        catch(err) {
            alert(err)
        }
    }

    async handleDesignTextSubmit(args) {
        try {
            const { fieldType, text, formId } = args
            const postFieldUrl = `${this.state.baseUrl}/forms/${formId}/fields/`
            const response = await fetch(postFieldUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${this.state.token}`
                },
                method: "post",
                body: JSON.stringify({ text: text, field: fieldType })
            })

            if(!response.ok)
                throw new Error("Something went wrong while creating field in form")

            const data = await response.json()
            this.setState(prevState => {
                const newFields = prevState.form.fields
                newFields.push(data)
                return {
                    form: {
                        ...prevState.form,
                        "fields": newFields
                    }
                }
            })
        }
        catch(err) {
            alert(err)
        }
    }

    async handleDesignOptionSubmit(args) {
        try {
            const { fieldId, value, formId } = args
            const postOptUrl = `${this.state.baseUrl}/forms/${formId}/fields/${fieldId}/options/`
            const response = await fetch(postOptUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${this.state.token}`
                },
                method: "post",
                body: JSON.stringify({ value: value })
            })

            if(!response.ok)
                throw new Error("Something went wrong while creating option in form field")

            const data = await response.json()
            this.setState(prevState => {
                return {
                    form: {
                        ...prevState.form,
                        "fields": prevState.form.fields.map(field => {
                            if(field.id === fieldId){
                                let newOptions = field.options
                                newOptions.push(data)
                                return {
                                    ...field,
                                    options: newOptions
                                }
                            }
                            return field
                        })
                    }
                }
            })
        }
        catch(err) {
            alert(err)
        }
    }

    async handleFillInit(form) {
        try {
            const postAttempt = `${this.state.baseUrl}/attempts/`
            const response = await fetch(postAttempt, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${this.state.token}`
                },
                method: "post",
                body: JSON.stringify({ form: form.id })
            })

            if(!response.ok)
                throw new Error("Something went wrong while creating attempt")

            const data = await response.json()
            this.setState(prevState => {
                const newAttempts = prevState.attempts
                newAttempts.push(data)
                return { attempts: newAttempts }
            })

            this.handleReply(data)
        }
        catch(err) {
            alert(err)
        }
    }

    async handleFormCreate(params) {
        try {
            const postForm = `${this.state.baseUrl}/forms/`
            const response = await fetch(postForm, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${this.state.token}`
                },
                method: "post",
                body: JSON.stringify(params)
            })

            if(!response.ok)
                throw new Error("Something went wrong while creating the form")

            const data = await response.json()
            this.setState(prevState => {
                const newForms = prevState.forms
                newForms.push(data)
                return { forms: newForms }
            })

            this.handleDesign(data)
        }
        catch(err) {
            alert(err)
        }
    }

    render() {
        return (
            <div>
                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title is-1">Form Builder</h1>
                            <h2 className="subtitle">Build Forms and Fill Forms</h2>
                        </div>
                    </div>
                </section>

                <div className="columns">
                    <div className="column">
                        {
                            this.state.isLoggedIn &&
                            <div>
                                <button
                                    onClick={this.handleLogout}
                                    className="button is-fullwidth"
                                >Logout {this.state.username}</button>

                                <button
                                    onClick={this.handleForms}
                                    className="button is-fullwidth"
                                >Forms</button>
                            </div>
                        }
                    </div>
                    <div className="column is-three-quarters">
                        <div>
                            {
                                !this.state.isLoggedIn &&
                                <Login onSubmit={this.handleLogin}/>
                            }
                        </div>
                        <div>
                            {
                                this.state.isLoggedIn && this.state.isForms &&
                                <Forms
                                    forms={this.state.forms}
                                    attempts={this.state.attempts}
                                    onLoad={this.getForms}
                                    userId={this.state.user.id}
                                    onDesign={this.handleDesign}
                                    onReply={this.handleReply}
                                    onView={this.handleView}
                                    onFillInit={this.handleFillInit}
                                    onFormCreate={this.handleFormCreate}
                                />
                            }
                        </div>
                        <div>
                            {
                                this.state.isLoggedIn && this.state.isDesign &&
                                <Design
                                    form={this.state.form}
                                    onTextSubmit={this.handleDesignTextSubmit}
                                    onOptionSubmit={this.handleDesignOptionSubmit}
                                />
                            }
                        </div>
                        <div>
                            {
                                this.state.isLoggedIn && this.state.isReply &&
                                <Reply
                                    attempt={this.state.attempt}
                                    onTextChange={this.handleTextAttemptChange}
                                    onRadioChange={this.handleRadioAttemptChange}
                                />
                            }
                        </div>
                        <div>
                            {
                                this.state.isLoggedIn && this.state.isView &&
                                <View attempt={this.state.attempt} />
                            }
                        </div>
                    </div>
                    <div className="column"></div>
                </div>
            </div>
        );
    }
}

export default App;
