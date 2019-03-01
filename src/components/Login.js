import React from 'react'


class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "manoj2",
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

export default Login