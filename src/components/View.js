import React from 'react'

const styles = {
    "answer": {
        textDecoration: "underline",
        fontStyle: "italic"
    }
}

class View extends React.Component {
    render() {
        let components
        try {
            components = this.props.attempt.fields.map(attField => {
                if(attField.field.field==="T")
                    return <li key={attField.id}>Text Question - <strong>{attField.field.text}</strong>: <span style={styles.answer}>{attField.text || "No Answer"}</span></li>

                else if(attField.field.field==="R") {
                    const selectedOptions = attField.options.map(selOpt => <li key={selOpt.id}><span style={styles.answer}>{selOpt.value}</span></li>)
                    return (
                        <li key={attField.id}>
                            Choice Question - <strong>{attField.field.text}</strong>
                            <br />
                            Options Selected:
                            <ul>
                                {selectedOptions}
                                {selectedOptions.length === 0 ? <li>No options selected</li> : null}
                            </ul>

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
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            {`View ${this.props.attempt.username}'s ${this.props.attempt.form_name} Form`}
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <ol>
                                {components}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default View