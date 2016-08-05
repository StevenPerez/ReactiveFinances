import React from 'react';
import _ from 'lodash';
import {observer} from 'mobx-react';
import {Navbar, Nav, NavItem, Button, Glyphicon, NavDropdown, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default observer(['store'], React.createClass({
	componentWillMount() {
		this.translation = this.props.store.translation;
		this.auth = this.props.store.auth;
	},
	handleSelect(eventKey) {
		event.preventDefault();
		if (eventKey === '2') {
			this.props.store.translation.setLanguage('es');
		} else if (eventKey === '3') {
			this.props.store.translation.setLanguage('en');
		}
	},
	render() {
		const labelLogInOut = (!this.auth.isAuth) ?
			this.translation.t('header.login') :
			this.translation.t('header.logout');

		const pathLogInOut = (!this.auth.isAuth) ? '/login' : '/logout';

		const Settings = (this.auth.isAuth) ? (
			<LinkContainer to="/settings" className="btn-link header-brandname">
				<NavItem eventKey="5"><Glyphicon glyph="cog"/>&nbsp;&nbsp;{this.translation.t('header.settings')}</NavItem>
			</LinkContainer>
		) : null;

		return (
			<div className="header">
				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<LinkContainer to="/" className="btn-link header-brandname">
								<Button>
									<span className="label-reactive">Reactive</span>
									<span className="label-finance-tracking">&nbsp;Finance Tracking</span></Button>
							</LinkContainer>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>

						<Nav pullRight onSelect={this.handleSelect}>
							<NavDropdown
								eventKey="1"
								title={`${this.translation.t('header.language')} - ${_.toUpper(this.translation.language)}`}
								id="basic-nav-dropdown"
							>
								<MenuItem eventKey="2" ref="2">ES</MenuItem>
								<MenuItem eventKey="3" ref="3">EN</MenuItem>
							</NavDropdown>

							{Settings}

							<LinkContainer to={pathLogInOut} className="btn-link header-brandname">
								<NavItem eventKey="4"><Glyphicon glyph="user"/>&nbsp;&nbsp;{labelLogInOut}</NavItem>
							</LinkContainer>

						</Nav>

					</Navbar.Collapse>
				</Navbar>
			</div>
		);
	}
}));
