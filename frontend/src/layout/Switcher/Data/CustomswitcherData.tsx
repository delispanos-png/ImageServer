import React from "react";
import { useState } from "react";

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
  
  };
  //dark-theme
  export const darkmode = () => {
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
  };
  export function Reset1() {
    localStorage.clear();
  
    let myonoffswitch54 = document.querySelector("#myonoffswitch54") as HTMLInputElement
    myonoffswitch54.checked = true; //ltr
    let myonoffswitch1 = document.querySelector("#myonoffswitch1") as HTMLInputElement
    myonoffswitch1.checked = true; //ligth theme
    document.getElementById("bootstrapLink")?.setAttribute("href", `${import.meta.env.BASE_URL === 'production' ? "/" : "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"}`)
  
    document.querySelector("body")?.classList.remove("dark-mode");
    document.querySelector("body")?.classList.remove("rtl");
    document.querySelector("html[lang=en")?.removeAttribute("style");

  }
  
  
  export function localStorageBackup1() {
    let html: any = document.querySelector("html")?.style;
    let body: any = document.querySelector("body");
    (localStorage.Azeartl) && Rtl();
    (localStorage.Azealtr) && Ltr();
    (localStorage.Azeadarkmode) && darkmode();
  
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
  