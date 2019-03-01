import React from 'react'

class View extends React.Component {
	render() {
		return (
			<div>
				<h4>View {this.props.attempt.form_name} Form</h4>
			</div>
		)
	}
}

export default View