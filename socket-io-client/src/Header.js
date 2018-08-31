import React, { Component } from 'react';

class Header extends Component {
	render() {
		return (
		<div className="header">
            <img className="image-banner"
              src="./uniandes.png"
              alt="uniandes logo" />

              <img className="image-banner-left"
              src="./fopre.png"
              alt="fopre cafe logo" />
        </div>
		);
	}
}
export default Header;