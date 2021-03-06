import React from 'react';
import {observer} from 'mobx-react';
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button, Alert} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default observer(['store'], React.createClass({
	displayName: 'SignUp',
	componentWillMount() {
		this.signup = this.props.store.signup;
		this.translation = this.props.store.translation;

		this.app = this.props.store.app;
		this.app.customCSS = '';
	},
	render() {
		return (
			<Grid className="signup">

				<Row className="align-center">
					<Col md={12}>
						<h1>{this.translation.t('signup.title')}</h1>
						<hr/>
					</Col>
				</Row>

				<Row className="form-container">
					<Col md={4} xs={2} sm={2}/>
					<Col md={4} xs={8} sm={8}>
						<form>
							<FormGroup
								controlId="formBasicText"
								validationState={this.signup.formState}
							>
								<ControlLabel>{this.translation.t('signup.email')}</ControlLabel>
								<FormControl
									type="text"
									value={this.signup.email}
									placeholder={this.translation.t('signup.email_place')}
									onChange={(e) => this.signup.setEmail(e.target.value)}
								/>
								<FormControl.Feedback />
							</FormGroup>
						</form>
					</Col>
					<Col md={4} xs={2} sm={2}/>
				</Row>

				<Row>
					<Col md={4} xs={2} sm={2}/>
					<Col md={4} xs={8} sm={8}>
						<Alert bsStyle={this.signup.messageType} className={this.signup.messageClass}>
							<span>{this.signup.message}</span>
						</Alert>
					</Col>
					<Col md={4} xs={2} sm={2}/>
				</Row>

				<Row>
					<Col md={4} xs={2} sm={2}/>
					<Col md={4} xs={8} sm={8}>
						<Button
							block={true}
							bsStyle="success"
							disabled={this.signup.disabled}
							onClick={() => this.signup.register()}
						>
							{this.translation.t('signup.signup')}
						</Button>
					</Col>
					<Col md={4} xs={2} sm={2}/>
				</Row>

				<Row>
					<Col md={4} xs={2} sm={2}/>
					<Col md={4} xs={8} sm={8}>
						<LinkContainer to="/login">
							<Button
								block={true}
								bsStyle="link"
							>
								{this.translation.t('login.login')}
							</Button>
						</LinkContainer>
					</Col>
					<Col md={4} xs={2} sm={2}/>
				</Row>

			</Grid>
		);
	}
}));
