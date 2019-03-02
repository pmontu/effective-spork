import React from 'react'


class TextInputForm extends React.Component {
	constructor() {
		super()
		this.state = {
			text: ""
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const { name, value } = event.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		this.props.onSubmit({
			event,
			text: this.state.text,
			fieldType: this.props.fieldType
		})
		this.setState({ text: "" })
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input
					type="text"
					placeholder="Title"
					value={this.state.text}
					name="text"
					onChange={this.handleChange}
					required={true}
				/>
				<button>Add {this.props.fieldType === "T" ? "Textbox Question" : "Checkbox Question"}</button>
			</form>
		)
	}
}


class Option extends React.Component {
	constructor() {
		super()
		this.state = {
			value: ""
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const {value, name} = event.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		this.props.onSubmit({
			event: event,
			fieldId: this.props.field.id,
			value: this.state.value
		})
		this.setState({ value: ""})
	}

	render() {
		const options = this.props.options.map(opt => <span key={opt.id}>{opt.value} </span>)
		return (
			<li>
				<form onSubmit={this.handleSubmit}>
					<label>
						{this.props.field.text}: {options}
						<input
							type="text"
							placeholder="Title"
							value={this.state.value}
							name="value"
							onChange={this.handleChange}
							required={true}
						/>
						<button>Add Option</button>
					</label>
				</form>
			</li>
		)
	}
}

class Design extends React.Component {
	constructor() {
		super()
		this.state = {
			text: "",
			isText: true
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {value, name} = event.target
		this.setState({
			[name]: value
		})
	}

	render() {
		let components
		try {
			components = this.props.form.fields.map(field => {
				if(field.field === "T")
					return <li key={field.id}><label>{field.text}</label></li>
				else if(field.field === "R")
					return <Option
						key={field.id}
						options={field.options}
						field={field}
						onSubmit={
							(args) => {
								args["formId"] = this.props.form.id
								this.props.onOptionSubmit(args)
							}
						}
					/>
				else
					throw new Error("Unexpted field type in Design Form Rendering")
			})
		}
		catch(err) {
			alert(err)
		}

		let button, input
		if(this.state.isText) {
			button = <button onClick={() => this.setState({isText: false})}>Checkboxes</button>
			input = <TextInputForm
				onSubmit={
					(args) => {
						args["formId"] = this.props.form.id
						this.props.onTextSubmit(args)
					}
				}
				fieldType="T"
			/>
		}
		else {
			button = <button onClick={() => this.setState({isText: true})}>TextBox</button>
			input = <TextInputForm
				onSubmit={
					(args) => {
						args["formId"] = this.props.form.id
						this.props.onTextSubmit(args)
					}
				}
				fieldType="R"
			/>
		}

		return (
			<div>
				<h4>Design {this.props.form.name} Form</h4>
				<ul>
					{components}
				</ul>
				{components.length === 0 ? "Add Textboxes or Checkboxes to continue" : null}
				<br />
				{button}
				{input}
			</div>
		)
	}
}

export default Design