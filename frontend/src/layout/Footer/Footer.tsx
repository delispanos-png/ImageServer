import React, { FC } from 'react';
import cloudonLogo from '../../assets/images/brand/cloudon-wordmark.svg';
interface FooterProps {}
const Footer: FC<FooterProps> = () => (
  <footer className="footer">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-12 col-sm-12 text-center">
          <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-2">
            <span className="text-muted fw-semibold">Powered by</span>
            <img
              src={cloudonLogo}
              alt="CloudOn ContentSync Platform"
              style={{ height: '34px', width: 'auto', verticalAlign: 'middle' }}
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
