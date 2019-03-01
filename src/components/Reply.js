import React from "react"


function TextField(props) {
	return (
		<div>
			<label>
				{props.field_attempt.field.text}:
				<input
					type="text"
					name={props.field_attempt.field.text}
					placeholder={props.field_attempt.field.text}
					onChange={(event) => props.onChange(event, props.field_attempt)}
					value={props.field_attempt.text}
				/>
			</label>
		</div>
	)
}

function ChoiceField(props) {
	const options = props.field_attempt.field.options.map(option => {
		return (
			<div key={option.id}>
				<label><input
					type="checkbox"
				/>{option.value}</label>
			</div>
		)
	})
	return (
		<div>
			{props.field_attempt.field.text}:{options}
		</div>
	)
}


class Reply extends React.Component {
	render() {
		let components
		try {
			components = this.props.attempt.fields.map(field_attempt => {
				if(field_attempt.field.field === "T") {
					return <TextField
						field_attempt={field_attempt}
						onChange={this.props.onTextChange}
						key={field_attempt.id}
					/>
				}
				else if(field_attempt.field.field === "R")
					return <ChoiceField
						field_attempt={field_attempt}
						key={field_attempt.id}
					/>
				else
					throw new Error("Unknown field type.")
			})
		}
		catch(err) {
			alert(err)
		}
		return (
			<div>
				<h4>Attempt Form {this.props.attempt.form_name}</h4>
				<form>
					{components}
				</form>
			</div>
		)
	}
}

export default Reply