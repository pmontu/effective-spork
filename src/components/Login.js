import React from 'react'
import 'bulma/css/bulma.css'


class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "puru",
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
            <div className="card">
                <div className="card-content">
                    <h3 className="title">Login</h3>

                    <form onSubmit={this.handleSubmit}>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    required={true}
                                    name="username"
                                    placeholder="Username"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    required={true}
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-small is-link">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login