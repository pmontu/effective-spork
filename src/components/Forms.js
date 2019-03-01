import React from 'react'

class Forms extends React.Component {
	constructor() {
		super()
		this.state = {
			forms: [],
			attempts: []
		}
	}
	async componentDidMount() {
		const {forms, attempts} = await this.props.onLoad()
		this.setState({ forms: forms, attempts: attempts })
	}

	render() {
		const forms_components = this.state.forms.map(form => {
			let button, username
			if(this.props.userId === form.user)
				button = <button onClick={() => this.props.onDesign(form)}>
					Design
				</button>
			else
				username = `${form.username}'s `
			return <li key={form.id}>{username}{form.name} {button}</li>
		})

		const attempt_components = this.state.attempts.map(attempt => {
			let button, username
			if(attempt.user === this.props.userId)
				button = <button onClick={() => this.props.onReply(attempt)}>
					Fill
				</button>
			else {
				button = <button onClick={() => this.props.onView(attempt)}>
					View
				</button>
				username = `${attempt.username}'s `
			}
			return <li key={attempt.id}>{username}{attempt.form_name} {button}</li>
		})
		return (
			<div>
				<h2>Forms</h2>
				<h4>All Forms</h4>
				<ul>
					{forms_components || "Loading..."}
				</ul>
				<h4>Forms Submissions</h4>
				<ul>
					{attempt_components || "Loading..."}
				</ul>
			</div>
		)
	}
}

export default Forms