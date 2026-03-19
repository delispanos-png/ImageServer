import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import BacktoTop from './BackToTop/BackToTop';
import CustomSwitcher from './Switcher/CustomSwitcher'

const Custom = () => {
document.querySelector("body")?.classList.remove("layout-boxed");

  return (
    <Fragment>
    <CustomSwitcher/>
      <div className='page'>
        <div className='page-main'>
          <div className='main-content mt-0' 
          onClick={()=>Custom()}
          >
            <Outlet />
        </div>
        <BacktoTop />
       </div>
      </div>
    </Fragment>
  )
}
export default Custom;