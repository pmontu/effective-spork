import React from "react"


function TextField(props) {
	return (
        <div className="field">
            <label className="label">{props.attField.field.text}: </label>
            <div className="control">
    			<input
                    className="input"
    				type="text"
    				name={props.attField.field.text}
    				placeholder="Answer"
    				onChange={(event) => props.onChange(event, props.attField)}
    				value={props.attField.text}
    			/>
            </div>
        </div>
	)
}

function ChoiceField(props) {
	const selOptIds = props.attField.options.map(selOptions => selOptions.option)
	const options = props.attField.field.options.map(option => {
		const isChecked = selOptIds.includes(option.id)
		const selOptionId = isChecked ? props.attField.options.find(selOpt=>selOpt.option===option.id).id : null
		return (
            <div className="field" key={option.id}>
                <div className="control">
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(event) => props.onChange(event, option.id, selOptionId, props.attField.id)}
                        />
                        {option.value}
                    </label>
                </div>
            </div>
        )
	})
	return (
		<div>
			<strong>{props.attField.field.text}:</strong> {options}
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
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            Fill Form <strong>{this.props.attempt.form_name}</strong>
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <form>
                                <ol>
                                    {components}
                                </ol>
                                {components.length === 0 ? "No Fields have been added to this form" : null}
                                <br />
                            </form>
                        </div>
                    </div>
                </div>
			</div>
		)
	}
}

export default Reply