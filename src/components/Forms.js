import React from 'react'
import 'bulma/css/bulma.css'


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
		this.props.onCreateForm({ ...this.state })
	}

	render() {
		return (
            <div className="card">
                <div className="card-content">
                    <h3 className="title">Create New Form</h3>
					<form onSubmit={this.handleSubmit}>
						<div className="field">
							<label className="label">Name</label>
							<div className="control">
								<input
                                    className="input"
									type="text"
									name="name"
									value={this.state.name}
									onChange={this.handleChange}
									required={true}
									placeholder="Form Title"
								/>
							</div>
						</div>

						<div className="field">
							<label className="label">Message</label>
							<div className="control">
								<textarea
									className="textarea"
									placeholder="Description"
									value={this.state.description}
									name="description"
									onChange={this.handleChange}
									required={true}
								/>
							</div>
						</div>

						<div className="field is-grouped">
							<div className="control">
								<button className="button is-link">Create</button>
							</div>
						</div>
					</form>
                </div>
            </div>
		)
	}
}


class Forms extends React.Component {
	render() {
		const forms_components = this.props.forms.map(form => {
			let design, username = "Me", fill
			if(this.props.userId === form.user) {
				design = <button
					onClick={() => this.props.onDesign(form)}
					className="card-footer-item"
				>
					Design
				</button>
				fill = "N.A."
			}
			else {
				username = form.username
				fill = <button
					onClick={() => this.props.onFillInit(form)}
					className="card-footer-item"
				>Create Attempt</button>
				design = "N.A."
			}
			return (
				<tr key={form.id}>
					<th>{form.id}</th>
					<td>{username}</td>
					<td>{form.name}</td>
					<td>{design}</td>
					<td>{fill}</td>
					<td>{form.description}</td>
				</tr>
			)
		})

		const attempt_components = this.props.attempts.map(attempt => {
			let fill, username, view
			if(attempt.user === this.props.userId) {
				fill = <button onClick={() => this.props.onReply(attempt)}>
					Fill
				</button>
				view = "N.A."
				username = "Me"
			}
			else {
				view = <button onClick={() => this.props.onView(attempt)}>
					View
				</button>
				username = attempt.username
				fill = "N.A."
			}
			return (
				<tr key={attempt.id}>
					<th>{attempt.id}</th>
					<td>{username}</td>
					<td>{attempt.form_author}</td>
					<td>{attempt.form_name}</td>
					<td>{fill}</td>
					<td>{view}</td>
				</tr>
			)
		})
		return (
			<div>
				<div className="card">
					<header className="card-header">
						<p className="card-header-title">
							Forms
						</p>
					</header>
					<div className="card-content">
						<div className="content">
							<table className="table">
								<thead>
									<tr>
										<th><abbr title="Unique Identifier">Id</abbr></th>
										<th>Author</th>
										<th><abbr title="Form Title">Form Title</abbr></th>
										<th><abbr title="Add Elements to Form">Design</abbr></th>
										<th><abbr title="Fill the Form">Create New Submission</abbr></th>
										<th><abbr title="Fill the Form">Description</abbr></th>
									</tr>
								</thead>
								<tbody>
									{forms_components}
								</tbody>
								<tfoot>
									{!forms_components ? <tr><th>{"Loading..."}</th></tr> : null}
									{forms_components.length === 0 ? <tr><th>{"No Records"}</th></tr> : null}
								</tfoot>
							</table>
						</div>
					</div>

					<CreateForm onCreateForm={this.props.onFormCreate} />
				</div>

				<div className="card">
					<header className="card-header">
						<p className="card-header-title">
							Submissions
						</p>
					</header>
					<div className="card-content">
						<div className="content">
							<table className="table">
								<thead>
									<tr>
										<th><abbr title="Unique Identifier">Id</abbr></th>
										<th>User</th>
										<th>Form Author</th>
										<th>Form Title</th>
										<th>Continue Filling</th>
										<th>View</th>
									</tr>
								</thead>
								<tbody>
									{attempt_components}
								</tbody>
								<tfoot>
									{!attempt_components ? <tr><th>{"Loading..."}</th></tr> : null}
									{attempt_components.length === 0 ? <tr><th>{"No Records"}</th></tr> : null}
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Forms