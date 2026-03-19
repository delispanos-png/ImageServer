import React, { Fragment } from "react";
import Switcher from "./Switcher/Switcher";
import SideBar from "./SideBar/SideBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header1 from "./Header/Header1";

 function Switcherlayout() {
  
  return (
    <Fragment>
      <div className='horizontalMenucontainer'>
<div className='page'>
  <div className='page-main'>
    <Header1/>
    <SideBar/>
    <div className='jumps-prevent' style={{ paddingTop: "0px" }}></div>
    <div className='app-content main-content'>
      <div className='side-app'>
        <div className='main-container container-fluid px-0'>
        <Outlet/>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</div>

</div>
    </Fragment>
  );
}
export default Switcherlayout;