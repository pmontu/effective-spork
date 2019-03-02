import React from 'react'


class CreateForm extends React.Component {
	constructor() {
		super()
		this.state = {
			name: ""
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		this.props.onCreateForm({ event, name: this.state.name })
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input
					type="text"
					name="name"
					value={this.state.name}
					onChange={this.handleChange}
					required={true}
					placeholder="Form Title"
				/>
				<button>Create New Form</button>
			</form>
		)
	}
}


class Forms extends React.Component {
	render() {
		const forms_components = this.props.forms.map(form => {
			let button, username, fill
			if(this.props.userId === form.user)
				button = <button onClick={() => this.props.onDesign(form)}>
					Design
				</button>
			else {
				username = `${form.username}'s `
				fill = <button onClick={() => this.props.onFillInit(form)}>Create Attempt</button>
			}
			return <li key={form.id}>{username}{form.name} {button} {fill}</li>
		})

		const attempt_components = this.props.attempts.map(attempt => {
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
				<h4>Design Forms</h4>
				<ul>
					{forms_components || "Loading..."}
				</ul>
				{forms_components.length === 0 ? "No Records" : null}
				<CreateForm onCreateForm={this.props.onFormCreate} />

				<h4>Submissions</h4>
				<ul>
					{attempt_components || "Loading..."}
				</ul>
				{attempt_components.length === 0 ? "No Records" : null}
			</div>
		)
	}
}

export default Forms