import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import BacktoTop from './BackToTop/BackToTop';
import LandingSwitcher from './Switcher/LandingSwitcher';

const Landing = () => {

  document.querySelector("body")?.classList.add("landing-page", "horizontal");
  document.querySelector("body")?.classList.remove("sidebar-mini", "light-mode");

  return (
    <Fragment>
      <div className='page'>
        <div className='page-main'>
          <div className='main-content mt-0'>
            <LandingSwitcher/>
            <Outlet />
          </div>
        </div>
        <BacktoTop />
      </div>
      <Footer/>
    </Fragment>
  )
}
export default Landing;