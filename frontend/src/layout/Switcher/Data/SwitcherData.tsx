
//NAVIGATION STYLE

import React, { useState } from "react";

//vertical
export const vertical = () => {
  document.querySelector("body")?.classList.add("sidebar-mini");
  document.querySelector(".header")?.classList.add("app-header");
  document.querySelector(".main-content")?.classList.add("app-content");
  document.querySelector(".main-container")?.classList.add("container-fluid");
  document.querySelector("body")?.classList.remove("horizontal");
  document.querySelector("body")?.classList.remove("horizontal-hover");
  document.querySelector(".app-sidebar")?.classList.remove("horizontal-main");
  document.querySelector(".header")?.classList.remove("hor-header");
  document.querySelector(".main-container")?.classList.remove("container");
  document.querySelector(".main-content")?.classList.remove("hor-content");
  document.querySelector(".side-app")?.classList.remove("container");
  // name();

  localStorage.setItem("Azeavertical", 'true');
  localStorage.removeItem("Azeahorizontal");
  localStorage.removeItem("AzeahorizontalHover");
  let myonoffswitch34 = document.querySelector("#myonoffswitch34") as HTMLInputElement
  myonoffswitch34.checked = true;
};
//horizontal
export const horizontal = () => {

  document.querySelector("body")?.classList.add("horizontal");
  document.querySelector(".side-app")?.classList.add("container");
  document.querySelector(".main-content")?.classList.add("hor-content");
  document.querySelector(".app-sidebar")?.classList.add("horizontal-main");
  document.querySelector(".header")?.classList.add("hor-header");
  document.querySelector(".main-container")?.classList.add("container");
  document.querySelector(".main-sidemenu")?.classList.add("container");


  document.querySelector("body")?.classList.remove("sidebar-mini");
  document.querySelector(".header")?.classList.remove("app-header");
  document.querySelector(".main-content")?.classList.remove("app-content");
  document.querySelector(".main-container")?.classList.remove("container-fluid");
  document.querySelector("body")?.classList.remove("sidenav-toggled");
  document.querySelector("body")?.classList.remove("horizontal-hover");


  localStorage.removeItem("Azeavertical");
  localStorage.setItem("Azeahorizontal", 'true');
  localStorage.removeItem("AzeahorizontalHover");
  let myonoffswitch35 = document.querySelector("#myonoffswitch35") as HTMLInputElement
  myonoffswitch35.checked = true;
};
//horizontal hover
export const horizontalhover = () => {

  document.querySelector("body")?.classList.add("horizontal-hover");
  document.querySelector("body")?.classList.add("horizontal");
  document.querySelector(".main-content")?.classList.add("hor-content");
  document.querySelector(".main-container")?.classList.add("container");
  document.querySelector(".header")?.classList.add("hor-header");
  document.querySelector(".app-sidebar")?.classList.add("horizontal-main");
  document.querySelector(".side-app")?.classList.add("container");
  document.querySelector(".main-sidemenu")?.classList.add("container");


  document.querySelector("#slide-left")?.classList.remove("d-none");
  document.querySelector("#slide-right")?.classList.remove("d-none");
  document.querySelector(".main-content")?.classList.remove("app-content");
  document.querySelector(".main-container")?.classList.remove("container-fluid");
  document.querySelector(".header")?.classList.remove("app-header");
  document.querySelector("body")?.classList.remove("sidebar-mini");
  document.querySelector("body")?.classList.remove("sidenav-toggled");

  localStorage.setItem("Azeahorizontalhover", "true");
  localStorage.removeItem("Azeasidebarmini");
  localStorage.removeItem("Azeahorizontal");
  let myonoffswitch111 = document.querySelector("#myonoffswitch111") as HTMLInputElement
  myonoffswitch111.checked = true;


  document.querySelector(".horizontal-hover .side-menu")
    ?.classList.add("flex-nowrap");
  let li = document.querySelectorAll(".side-menu li");
  li.forEach((e, i) => {
    if (e.classList.contains("is-expaned")) {
      let ele: any = [...e.children];
      ele.forEach((el, i) => {
        el.classList.remove("active");
        if (el.classList.contains("slide-menu")) {
          el.style = "";
          el.style.display = "none";
        }
      });
      e.classList.remove("is-expaned");
    }
  });

}
//center logo
export const centerlogo = () => {
  document.querySelector("body")?.classList.add("center-logo");
  document.querySelector("body")?.classList.remove("default-logo");
  localStorage.setItem('Azeacenterlogo', 'true');
  localStorage.removeItem('Azeadefaultlogo');
  let switchbtn = document.querySelector("#switchbtn-centerlogo") as HTMLInputElement
  switchbtn.checked = true;
}
//default logo
export const defaultlogo = () => {
  document.querySelector("body")?.classList.add("default-logo");
  document.querySelector("body")?.classList.remove("center-logo");
  localStorage.setItem('Azeadefaultlogo', 'true');
  localStorage.removeItem('Azeacenterlogo');
  let switchbtn1 = document.querySelector("#switchbtn-defaultlogo") as HTMLInputElement
  switchbtn1.checked = true;
}
// RTL
export const Rtl = () => {
  document.querySelector("body")?.classList.add("rtl");
  document.getElementById("bootstrapLink")?.setAttribute("href", `${import.meta.env.BASE_URL === 'production' ? "/" : "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css"}`)
  document.querySelector("body")?.classList.remove("ltr");
  localStorage.setItem('Azeartl', "true");
  localStorage.removeItem('Azealtr');
  localStorage.removeItem('AzealightMode')
  let myonoffswitch55 = document.querySelector("#myonoffswitch55") as HTMLInputElement
  myonoffswitch55.checked = true;
};
//LTR
export const Ltr = () => {
  document.querySelector("body")?.classList.add("ltr");
  document.getElementById("bootstrapLink")?.setAttribute("href", `${import.meta.env.BASE_URL === 'production' ? "/" : "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"}`)
  document.querySelector("body")?.classList.remove("rtl");
  localStorage.setItem('Azealtr', "true");
  localStorage.removeItem('Azeartl');
  localStorage.removeItem('Azealightmenu')
  localStorage.removeItem('Azealightheader')
  let myonoffswitch54 = document.querySelector("#myonoffswitch54") as HTMLInputElement
  myonoffswitch54.checked = true;
};
//LIGHT THEME STYLES

//light-theme
export const lighttheme = () => {
  document.querySelector("body")?.classList.add("light-mode");
  document.querySelector("body")?.classList.remove("dark-mode");

  localStorage.setItem('Azealightmode', "true");
  localStorage.removeItem('Azeadarkmode');
  localStorage.removeItem('Azealightheader');
  localStorage.removeItem('Azealighmenu');
  localStorage.removeItem('Azeartl');

  let myonoffswitch1 = document.querySelector("#myonoffswitch1") as HTMLInputElement
  myonoffswitch1.checked = true;
  let myonoffswitch5 = document.querySelector("#myonoffswitch3") as HTMLInputElement
  myonoffswitch5.checked = true;
  let myonoffswitch8 = document.querySelector("#myonoffswitch6") as HTMLInputElement
  myonoffswitch8.checked = true;

};
//dark-theme
export const darktheme = () => {
  document.querySelector("body")?.classList.add("dark-mode");
  document.querySelector("body")?.classList.remove("light-mode");
  document.querySelector('body')?.classList.remove('light-menu');
  document.querySelector('body')?.classList.remove('color-menu');
  document.querySelector('body')?.classList.remove('dark-menu');
  document.querySelector('body')?.classList.remove('light-header');
  document.querySelector('body')?.classList.remove('color-header');
  document.querySelector('body')?.classList.remove('dark-header');
  localStorage.setItem('Azeadarkmode', "true");
  localStorage.removeItem('Azealightmode');
  localStorage.removeItem('Azealightheader');
  localStorage.removeItem('Azealighmenu');

  let myonoffswitch2 = document.querySelector("#myonoffswitch2") as HTMLInputElement
  myonoffswitch2.checked = true;
  let myonoffswitch5 = document.querySelector("#myonoffswitch5") as HTMLInputElement
  myonoffswitch5.checked = true;
  let myonoffswitch8 = document.querySelector("#myonoffswitch8") as HTMLInputElement
  myonoffswitch8.checked = true;
};
// MENU STYLES
//light menu
export const lightmenu = () => {
  document.querySelector("body")?.classList.add("light-menu");
  document.querySelector("body")?.classList.remove("dark-menu");
  document.querySelector("body")?.classList.remove("color-menu");
  document.querySelector("body")?.classList.remove("gradient-menu");

  localStorage.setItem("Azealightmenu", "true");
  localStorage.removeItem("Azeadarkmenu");
  localStorage.removeItem("Azeacolormenu");
  localStorage.removeItem("Azeagradientmenu");
  let myonoffswitch3 = document.querySelector("#myonoffswitch3") as HTMLInputElement
  myonoffswitch3.checked = true;
};

//color menu
export const colormenu = () => {
  document.querySelector("body")?.classList.add("color-menu");
  document.querySelector("body")?.classList.remove("dark-menu");
  document.querySelector("body")?.classList.remove("light-menu");
  document.querySelector("body")?.classList.remove("gradient-menu");

  localStorage.setItem("Azeacolormenu", "true");
  localStorage.removeItem("Azealightmenu");
  localStorage.removeItem("Azeadarkmenu");
  localStorage.removeItem("Azeagradientmenu");
  let myonoffswitch4 = document.querySelector("#myonoffswitch4") as HTMLInputElement
  myonoffswitch4.checked = true;
};

//dark menu

export const darkmenu = () => {
  document.querySelector("body")?.classList.add("dark-menu");
  document.querySelector("body")?.classList.remove("color-menu");
  document.querySelector("body")?.classList.remove("light-menu");
  document.querySelector("body")?.classList.remove("gradient-menu");

  localStorage.setItem("Azeadarkmenu", "true");
  localStorage.removeItem("Azealightmenu");
  localStorage.removeItem("Azeacolormenu");
  localStorage.removeItem("Azeagradientmenu");

  let myonoffswitch5 = document.querySelector("#myonoffswitch5") as HTMLInputElement
  myonoffswitch5.checked = true;
};

//gradient menu
export const gradientmenu = () => {
  document.querySelector("body")?.classList.add("gradient-menu");
  document.querySelector("body")?.classList.remove("dark-menu");
  document.querySelector("body")?.classList.remove("light-menu");
  document.querySelector("body")?.classList.remove("color-menu");

  localStorage.setItem("Azeagradientmenu", "true");
  localStorage.removeItem("Azealightmenu");
  localStorage.removeItem("Azeacolormenu");
  localStorage.removeItem("Azeadarkmenu");
  let myonoffswitch25 = document.querySelector("#myonoffswitch25") as HTMLInputElement
  myonoffswitch25.checked = true;
};
//HEADER STYLES
//light header
export const lightheader = () => {
  document.querySelector("body")?.classList.add("default-menu", "light-header");
  document.querySelector("body")?.classList.remove("dark-header");
  document.querySelector("body")?.classList.remove("color-header");
  document.querySelector("body")?.classList.remove("gradient-header");

  localStorage.setItem("Azealightheader", "true");
  localStorage.removeItem("Azeadarkheader");
  localStorage.removeItem("Azeacolorheader");
  localStorage.removeItem("Azeagradientheader");
  let myonoffswitch6 = document.querySelector("#myonoffswitch6") as HTMLInputElement
  myonoffswitch6.checked = true;
};
//dark header
export const darkheader = () => {
  document.querySelector("body")?.classList.add("default-menu", "dark-header");
  document.querySelector("body")?.classList.remove("light-header");
  document.querySelector("body")?.classList.remove("color-header");
  document.querySelector("body")?.classList.remove("gradient-header");

  localStorage.setItem("Azeadarkheader", "true");
  localStorage.removeItem("Azealightheader");
  localStorage.removeItem("Azeacolorheader");
  localStorage.removeItem("Azeagradientheader");
  let myonoffswitch8 = document.querySelector("#myonoffswitch8") as HTMLInputElement
  myonoffswitch8.checked = true;
};
//color header
export const colorheader = () => {
  document.querySelector("body")?.classList.add("default-menu", "color-header");
  document.querySelector("body")?.classList.remove("dark-header");
  document.querySelector("body")?.classList.remove("light-header");
  document.querySelector("body")?.classList.remove("gradient-header");

  localStorage.setItem("Azeacolorheader", "true");
  localStorage.removeItem("Azeadarkheader");
  localStorage.removeItem("Azealightheader");
  localStorage.removeItem("Azeagradientheader");
  let myonoffswitch7 = document.querySelector("#myonoffswitch7") as HTMLInputElement
  myonoffswitch7.checked = true;
}
//gradient header
export const gradientheader = () => {
  document.querySelector("body")?.classList.add("default-menu", "gradient-header");
  document.querySelector("body")?.classList.remove("dark-header");
  document.querySelector("body")?.classList.remove("color-header");
  document.querySelector("body")?.classList.remove("light-header");

  localStorage.setItem("Azeagradientheader", "true");
  localStorage.removeItem("Azeadarkheader");
  localStorage.removeItem("Azeacolorheader");
  localStorage.removeItem("Azealightheader");
  let myonoffswitch26 = document.querySelector("#myonoffswitch26") as HTMLInputElement
  myonoffswitch26.checked = true;
};

//LAYOUT WIDTH STYLES

//fullwidth
export const fullwidth = () => {
  document.querySelector("body")?.classList.add("default-menu", "layout-fullwidth");
  document.querySelector("body")?.classList.remove("layout-boxed");

  localStorage.setItem('Azealayoutfullwidth', "true");
  localStorage.removeItem('Azealayoutboxed');
  let myonoffswitch9 = document.querySelector("#myonoffswitch9") as HTMLInputElement
  myonoffswitch9.checked = true;
};
//boxwidth
export const boxwidth = () => {
  document.querySelector("body")?.classList.add("default-menu", "layout-boxed");
  document.querySelector("body")?.classList.remove("layout-fullwidth");
  document.querySelector("body")?.classList.remove("fixed-layout");
  document.querySelector("body")?.classList.remove("default-menu");

  localStorage.setItem('Azealayoutboxed', "true");
  localStorage.removeItem('Azealayoutfullwidth');
  let myonoffswitch10 = document.querySelector("#myonoffswitch10") as HTMLInputElement
  myonoffswitch10.checked = true;
};

//LAYOUT POSITIONS STYLES

//fixed
export const fixed = () => {
  document.querySelector("body")?.classList.add("fixed-layout");
  document.querySelector("body")?.classList.remove("scrollable-layout");

  localStorage.setItem('Azeafixedlayout', "true");
  localStorage.removeItem('Azeascrollablelayout');
  let myonoffswitch11 = document.querySelector("#myonoffswitch11") as HTMLInputElement
  myonoffswitch11.checked = true;
};
//scrollable
export const scrollable = () => {
  document.querySelector("body")?.classList.add("scrollable-layout");
  document.querySelector("body")?.classList.remove("fixed-layout");
  document.querySelector("body")?.classList.remove("layout-fullwidth");


  localStorage.setItem('Azeascrollablelayout', "true");
  localStorage.removeItem('Azeafixedlayout');
  let myonoffswitch12 = document.querySelector("#myonoffswitch12") as HTMLInputElement
  myonoffswitch12.checked = true;
};



export function Reset() {
  localStorage.clear();

  let myonoffswitch34 = document.querySelector("#myonoffswitch34") as HTMLInputElement
  myonoffswitch34.checked = true; //verticalmenu
  let myonoffswitch54 = document.querySelector("#myonoffswitch54") as HTMLInputElement
  myonoffswitch54.checked = true; //ltr
  let myonoffswitch1 = document.querySelector("#myonoffswitch1") as HTMLInputElement
  myonoffswitch1.checked = true; //ligth theme
  let myonoffswitch3 = document.querySelector("#myonoffswitch3") as HTMLInputElement
  myonoffswitch3.checked = true; //ligth menu
  let myonoffswitch6 = document.querySelector("#myonoffswitch6") as HTMLInputElement
  myonoffswitch6.checked = true; //ligth header
  let myonoffswitch9 = document.querySelector("#myonoffswitch9") as HTMLInputElement
  myonoffswitch9.checked = true; //full width
  let myonoffswitch11 = document.querySelector("#myonoffswitch11") as HTMLInputElement
  myonoffswitch11.checked = true; //fixed
  let switchbtn1 = document.querySelector("#switchbtn-defaultlogo") as HTMLInputElement
  switchbtn1.checked = true; //default logo
  document.querySelector("body")?.classList.remove("centerlogo")
  document.querySelector("body")?.classList.remove("horizontal");
  document.querySelector("body")?.classList.remove("horizontal", "horizontal-hover");
  document.querySelector("body")?.classList.remove("dark-theme");
  document.querySelector("body")?.classList.remove("dark-mode");
  document.querySelector("body")?.classList.remove("dark-menu");
  document.querySelector("body")?.classList.remove("color-menu");
  document.querySelector("body")?.classList.remove("gradient-menu");
  document.querySelector("body")?.classList.remove("dark-header");
  document.querySelector("body")?.classList.remove("color-header");
  document.querySelector("body")?.classList.remove("gradient-header");
  document.querySelector("body")?.classList.remove("layout-boxed");
  document.querySelector("body")?.classList.remove("icontext-menu");
  document.querySelector("body")?.classList.remove("icon-overlay");
  document.querySelector("body")?.classList.remove("closed-leftmenu");
  document.querySelector("body")?.classList.remove("hover-submenu");
  document.querySelector("body")?.classList.remove("hover-submenu1");
  document.querySelector("body")?.classList.remove("doble-menu");
  document.querySelector("body")?.classList.remove("double-menu-tabs");
  document.querySelector("body")?.classList.remove("scrollable-layout");
  document.querySelector("body")?.classList.add("ltr");
  document.querySelector("body")?.classList.remove("rtl");
  document.getElementById("bootstrapLink")?.setAttribute("href", `${import.meta.env.BASE_URL === 'production' ? "/" : "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"}`)
  document.querySelector("body")?.classList.add("sidebar-mini");
  document.querySelector(".header")?.classList.add("app-header");
  document.querySelector(".main-content")?.classList.add("app-content");
  document.querySelector(".main-container")?.classList.add("container-fluid");
  document.querySelector("body")?.classList.remove("sidenav-toggled");
  document.querySelector("body")?.classList.remove("horizontal");
  document.querySelector("body")?.classList.remove("horizontal-hover");
  document.querySelector(".app-sidebar")?.classList.remove("horizontal-main");
  document.querySelector(".header")?.classList.remove("hor-header");
  document.querySelector(".main-sidemenu")?.classList.remove("container");
  document.querySelector(".main-container")?.classList.remove("container");
  document.querySelector(".main-content")?.classList.remove("hor-content");
  document.querySelector(".side-app")?.classList.remove("container");
  document.querySelector(".app-sidebar")?.classList.remove("horizontal-main");
  document.querySelector("html[lang=en")?.removeAttribute("style");
  document.querySelector(".main-container")?.classList.remove("container");
  document.querySelector(".main-sidemenu")?.classList.remove("container");


  // primaryOpacityVaue();
}


export function localStorageBackup() {
  let html: any = document.querySelector("html")?.style;
  let body: any = document.querySelector("body");
  (localStorage.Azeartl) && Rtl();
  (localStorage.Azealtr) && Ltr();
  (localStorage.Azeasidebarmini) && vertical();
  (localStorage.Azeahorizontal) && horizontal();
  (localStorage.Azeahorizontalhover) && horizontalhover();
  (localStorage.Azealightmode) && lighttheme();
  (localStorage.Azeadarkmode) && darktheme();
  (localStorage.Azealightmenu) && lightmenu();
  (localStorage.Azeadarkmenu) && darkmenu();
  (localStorage.Azeacolormenu) && colormenu();
  (localStorage.Azealightheader) && lightheader();
  (localStorage.Azeadarkheader) && darkheader();
  (localStorage.Azeacolorheader) && colorheader();
  (localStorage.Azeagradientheader) && gradientheader();
  (localStorage.Azeagradientmenu) && gradientmenu();
  (localStorage.Azealayoutfullwidth) && fullwidth();
  (localStorage.Azealayoutboxed) && boxwidth();
  (localStorage.Azeafixedlayour) && fixed();
  (localStorage.Azeascrollablelayout) && scrollable();
  (localStorage.Azeacenterlogo) && centerlogo();
  (localStorage.Azeadefaultlogo) && defaultlogo();


  //dtnamic color
   if (localStorage.Azeaprimarycolor) {
    body.classList.add("light-mode");
    let ltr = document.getElementById("myonoffswitch1") as HTMLInputElement
    ltr.checked = true;
    body.classList.remove("dark-mode");
    body.classList.remove("gradient-mode");
    html.setProperty(
      "--primary-bg-color",
      localStorage.getItem("Azeaprimarycolor")
    );
    html.setProperty(
      "--primary-bg-hover",
      localStorage.getItem("Azeaprimaryhovercolor")
    );
    html.setProperty(
      "--primary-bg-border",
      localStorage.getItem("Azeaprimarybordercolor")
    );
  
  }
  
  
  // background color
  if (localStorage.Azeabgcolor) {
    body.classList.add("dark-mode");
  
    let ltr = document.getElementById("myonoffswitch2") as HTMLInputElement
    ltr.checked = true;
  
    body.classList.remove("light-mode");
    body.classList.remove("gradient-mode");
  
    html.setProperty(
      "--dark-body",
      localStorage.getItem("Azeabgcolor")
    );
    html.setProperty(
      "--dark-theme",
      localStorage.getItem("Azeathemecolor")
    );
  
  }
  
}

const ColorPicker = (props) => {
  return (
    React.createElement("div", null,
      React.createElement("input", { type: "color", ...props })
    )
  );
};
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
}




///primarycolor

export const ThemePrimaryColor = () => {
  const [state, updateState] = useState("#664dc9");
  const handleInput = (e) => {
    let { r, g, b }: any = hexToRgb(e.target.value);
    updateState(e.target.value);
    const rgbaValue = `rgba(${r}, ${g}, ${b})`;
    const rgbaValue005 = `rgba(${r}, ${g}, ${b}, 0.05)`;
    const rgbaValue1 = `rgba(${r}, ${g}, ${b}, 0.1)`;
    const rgbaValue2 = `rgba(${r}, ${g}, ${b}, 0.2)`;
    const rgbaValue3 = `rgba(${r}, ${g}, ${b}, 0.3)`;
    const rgbaValue4 = `rgba(${r}, ${g}, ${b}, 0.4)`;
    const rgbaValue5 = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const rgbaValue6 = `rgba(${r}, ${g}, ${b}, 0.6)`;
    const rgbaValue7 = `rgba(${r}, ${g}, ${b}, 0.7)`;
    const rgbaValue8 = `rgba(${r}, ${g}, ${b}, 0.8)`;
    const rgbaValue9 = `rgba(${r}, ${g}, ${b}, 0.9)`;

    const rgbaValue10 = `rgba(${r}, ${g}, ${b}, 0.58)`;
    const rgbaValue11 = `rgba(${r}, ${g}, ${b}, 1)`;

    document.documentElement.style.setProperty("--primary-bg-color", rgbaValue);
    document.documentElement.style.setProperty("--primary005", rgbaValue005);
    document.documentElement.style.setProperty("--primary01", rgbaValue1);
    document.documentElement.style.setProperty("--primary02", rgbaValue2);
    document.documentElement.style.setProperty("--primary03", rgbaValue3);
    document.documentElement.style.setProperty("--primary04", rgbaValue4);
    document.documentElement.style.setProperty("--primary05", rgbaValue5);
    document.documentElement.style.setProperty("--primary06", rgbaValue6);
    document.documentElement.style.setProperty("--primary07", rgbaValue7);
    document.documentElement.style.setProperty("--primary08", rgbaValue8);
    document.documentElement.style.setProperty("--primary09", rgbaValue9);
    document.documentElement.style.setProperty("--primary-bg-color", rgbaValue11);
    document.documentElement.style.setProperty("--primary-bg-hover", rgbaValue10);
    document.documentElement.style.setProperty("--primary-bg-border", rgbaValue11);

    localStorage.setItem("Azeaprimarybordercolor", rgbaValue11);
    localStorage.setItem("Azeaprimarycolor", rgbaValue11);
    localStorage.setItem("Azeaprimaryhovercolor", rgbaValue10);
    localStorage.setItem("AzealightMode", "true");
    

  };

  return (
    <div className="ThemePrimaryColor">
      <ColorPicker onChange={handleInput} value={state} />
      <div className="my-bootstrap-component" style={{ backgroundColor: 'var rgba(--primary-color)' }}>

      </div>
    </div>
  );
};



//background color
export const Backgroundcolor = () => {
  const [state, updateState] = useState("#1a1c32");
  const handleInput = (e) => {
    let { r, g, b }: any = hexToRgb(e.target.value);
    updateState(e.target.value);
    const rgbaValue = `rgba(${r}, ${g}, ${b})`;
    const rgbaValue10 = `rgba(${r}, ${g}, ${b}, 0.87)`;
    const rgbaValue11 = `rgba(${r}, ${g}, ${b},1)`;
    const rgbaValue005 = `rgba(${r}, ${g}, ${b}, 0.05)`;
    const rgbaValue1 = `rgba(${r}, ${g}, ${b}, 0.1)`;
    const rgbaValue2 = `rgba(${r}, ${g}, ${b}, 0.2)`;
    const rgbaValue3 = `rgba(${r}, ${g}, ${b}, 0.3)`;
    const rgbaValue4 = `rgba(${r}, ${g}, ${b}, 0.4)`;
    const rgbaValue5 = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const rgbaValue6 = `rgba(${r}, ${g}, ${b}, 0.6)`;
    const rgbaValue7 = `rgba(${r}, ${g}, ${b}, 0.7)`;
    const rgbaValue8 = `rgba(${r}, ${g}, ${b}, 0.8)`;
    const rgbaValue9 = `rgba(${r}, ${g}, ${b}, 0.9)`;
    document.documentElement.style.setProperty("--dark-body", rgbaValue10);
    document.documentElement.style.setProperty("--dark-theme", rgbaValue11);
    document.documentElement.style.setProperty("--primary01", rgbaValue1);
    document.documentElement.style.setProperty("--primary02", rgbaValue2);
    document.documentElement.style.setProperty("--primary03", rgbaValue3);
    document.documentElement.style.setProperty("--primary04", rgbaValue4);
    document.documentElement.style.setProperty("--primary05", rgbaValue5);
    document.documentElement.style.setProperty("--primary06", rgbaValue6);
    document.documentElement.style.setProperty("--primary07", rgbaValue7);
    document.documentElement.style.setProperty("--primary08", rgbaValue8);
    document.documentElement.style.setProperty("--primary09", rgbaValue9);
    document.documentElement.style.setProperty("--primary005", rgbaValue005);
    localStorage.setItem("Azeabgcolor", rgbaValue10);
    localStorage.setItem("Azeathemecolor", rgbaValue11);
    localStorage.setItem("AzeadarkMode", "true");
    document.querySelector('body')?.classList.add('dark-mode');
    document.querySelector('body')?.classList.remove('light-mode');
    document.querySelector('body')?.classList.remove('light-menu');
    document.querySelector('body')?.classList.remove('color-menu');
    document.querySelector('body')?.classList.remove('dark-menu');
    document.querySelector('body')?.classList.remove('light-header');
    document.querySelector('body')?.classList.remove('color-header');
    document.querySelector('body')?.classList.remove('dark-header');
    localStorage.removeItem('AzealightMode');
    localStorage.removeItem('Azealightheader');
    localStorage.removeItem('Azealighmenu');
   
  };
  return (
    <div className="ThemePrimaryColor">
      <ColorPicker onChange={handleInput} value={state} />
      <div className="my-bootstrap-component" style={{ backgroundColor: 'var rgba(--primary-color)' }}>
        {/* Content of the Bootstrap component */}
      </div>
    </div>
  );
};

export  //horizontalmenusticky
  const horizontalmenusticky = () => {
    if (window.scrollY > 30 && document.querySelector(".app-sidebar")) {
      let Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        e.classList.add("sticky-pin");
      });
    } else {
      let Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        e.classList.remove("sticky-pin");
      });
    }
  };
window.addEventListener("scroll", horizontalmenusticky);

//LandingSwitcher
export function Resets() {
  localStorage.clear();

  let myonoffswitch54 = document.querySelector("#myonoffswitch54") as HTMLInputElement
  myonoffswitch54.checked = true; //ltr
  let myonoffswitch1 = document.querySelector("#myonoffswitch1") as HTMLInputElement
  myonoffswitch1.checked = true; //ligth theme

  document.querySelector("body")?.classList.remove("dark-mode");
  document.querySelector("body")?.classList.remove("rtl");
  document.querySelector("html[lang=en")?.removeAttribute("style");
}
export function Resets1() {
  localStorage.clear();

  let myonoffswitch54 = document.querySelector("#myonoffswitch54") as HTMLInputElement
  myonoffswitch54.checked = true; //ltr
  let myonoffswitch1 = document.querySelector("#myonoffswitch1") as HTMLInputElement
  myonoffswitch1.checked = true; //ligth theme
  let myonoffswitch34 = document.querySelector("#myonoffswitch34") as HTMLInputElement
  myonoffswitch34.checked = true; //verticalmenu

  document.querySelector("body")?.classList.remove("dark-mode");
  document.querySelector("body")?.classList.remove("rtl");
  document.querySelector("html[lang=en")?.removeAttribute("style");
  document.querySelector("body")?.classList.remove("horizontal");
  document.querySelector("body")?.classList.remove("horizontal", "horizontal-hover");
}

export function localStorageBackup1() {
	throw new Error('Function not implemented.');
}

