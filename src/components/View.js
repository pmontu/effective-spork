import React from 'react'

class View extends React.Component {
    render() {
        let components
        try {
            components = this.props.attempt.fields.map(attField => {
                if(attField.field.field==="T")
                    return <li key={attField.id}>{attField.field.text}: {attField.text}</li>

                else if(attField.field.field==="R") {
                    const selectedOptions = attField.options.map(selOpt => selOpt.value).join(",")
                    return (
                        <li key={attField.id}>
                            {attField.field.text}: {selectedOptions || "No options selected"}
                        </li>
                    )
                }
                else
                    throw new Error("Unknown field type while rending View Form.")

            })
        }
        catch(err) {
            alert(err)
        }
        return (
            <div>
                <h4>{`${this.props.attempt.username}'s ${this.props.attempt.form_name} Form`}</h4>
                <ul>
                    {components}
                </ul>
            </div>
        )
    }
}

export default View