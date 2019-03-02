import React from "react"


function TextField(props) {
	return (
		<label>
			{props.attField.field.text}:
			<input
				type="text"
				name={props.attField.field.text}
				placeholder="answer"
				onChange={(event) => props.onChange(event, props.attField)}
				value={props.attField.text}
			/>
		</label>
	)
}

function ChoiceField(props) {
	const selOptIds = props.attField.options.map(selOptions => selOptions.option)
	const options = props.attField.field.options.map(option => {
		const isChecked = selOptIds.includes(option.id)
		const selOptionId = isChecked ? props.attField.options.find(selOpt=>selOpt.option===option.id).id : null
		return <label key={option.id}>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={(event) => props.onChange(event, option.id, selOptionId, props.attField.id)}
			/>
			{option.value}
		</label>
	})
	return (
		<div>
			{props.attField.field.text}:{options}
		</div>
	)
}


class Reply extends React.Component {
	render() {
		let components
		try {
			components = this.props.attempt.fields.map(attField => {
				if(attField.field.field === "T") {
					return <li key={attField.id}>
						<TextField
							attField={attField}
							onChange={this.props.onTextChange}
						/>
					</li>
				}
				else if(attField.field.field === "R")
					return <li key={attField.id}>
						<ChoiceField attField={attField} onChange={
							(
								event,
								optionId,
								selOptionId,
								attFieldId
							) => this.props.onRadioChange(
								event,
								optionId,
								selOptionId,
								attFieldId,
								this.props.attempt.id
							)
						}/>
					</li>
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
					<ul>
						{components}
					</ul>
				</form>
			</div>
		)
	}
}

export default Reply