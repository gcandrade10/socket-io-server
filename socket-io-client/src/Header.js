import React, { Component } from 'react';

class Header extends Component {
	render() {
		return (
		<div className="header container">
            <img className="image-banner col-sm-12 col-m-6"
              src="./uniandes.png"
              alt="uniandes logo" />

              <img className="image-banner-left col-sm-12 col-m-6"
              src="./fopre.png"
              alt="fopre cafe logo" />
        </div>
		);
	}
}
export default Header;