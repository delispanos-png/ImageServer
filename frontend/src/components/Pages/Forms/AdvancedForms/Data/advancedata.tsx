import { Button } from "react-bootstrap";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { SketchPicker } from "react-color";
import React, { Component, useState } from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
//Beast
interface option {
    value: number
    label: string
}
export const options: option[] = [
    { value: 1, label: 'Chuck Testa'},
    { value: 2, label: 'Sage Cattabriga-Alosa' },
    { value:3, label: 'Nikola Tesla' },
    { value:4, label: 'Cattabriga-Alosa' },
    { value:5, label: 'Nikola Alosa' },
  ];
//Bacsic select 2
interface option1 {
    value: string
    label: string
}
  export const options1: option1[] = [
    {value:'', label:'Mountain Time Zone'},
    {value:'AZ', label:'Arizona'},
    {value:'CO', label:'Colorado'},
    {value:'ID', label:'Idaho'},
    {value:'MT', label:'Montana'},
    {value:'NE', label:'Nebraska'},
    {value:'NM', label:'New Mexico'},
    {value:'ND', label:'North Dakota'},
    {value:'UT', label:'Utah'},
    {value:'', label:'Central Time Zone'},
    {value:'WY', label:'Wyoming'},
    {value:'AL', label:'Alabama'},
    {value:'AR', label:'Arkansas'},
    {value:'IL', label:'Illinois'},
    {value:'IO', label:'Iowa'},
    {value:'KS', label:'Kansas'},
    {value:'KY', label:'Kentucky'},
    {value:'LS', label:'Louisiana'},
    {value:'MN', label:'Minnesota'},
    {value:'MS', label:'Mississippi'},
    {value:'MO', label:'Missouri'},
    {value:'OK', label:'Oklahoma'},
    {value:'SD', label:'South Dakota'},
    {value:'TX', label:'Texas'},
    {value:'TN', label:'Tennessee'},
    {value:'WI', label:'Wisconsin'},
]
//Select2 with searchbox
interface option2 {
    value: string
    label: string
}
export const options2:option2[] = [
    {value:'', label:'Mountain Time Zone'},
    {value:'AZ', label:'Arizona'},
    {value:'CO', label:'Colorado'},
    {value:'ID', label:'Idaho'},
    {value:'MT', label:'Montana'},
    {value:'NE', label:'Nebraska'},
    {value:'NM', label:'New Mexico'},
    {value:'ND', label:'North Dakota'},
    {value:'UT', label:'Utah'},
    {value:'', label:'Central Time Zone'},
    {value:'WY', label:'Wyoming'},
    {value:'AL', label:'Alabama'},
    {value:'AR', label:'Arkansas'},
    {value:'IL', label:'Illinois'},
    {value:'IO', label:'Iowa'},
    {value:'KS', label:'Kansas'},
    {value:'KY', label:'Kentucky'},
    {value:'LS', label:'Louisiana'},
    {value:'MN', label:'Minnesota'},
    {value:'MS', label:'Mississippi'},
    {value:'MO', label:'Missouri'},
    {value:'OK', label:'Oklahoma'},
    {value:'SD', label:'South Dakota'},
    {value:'TX', label:'Texas'},
    {value:'TN', label:'Tennessee'},
    {value:'WI', label:'Wisconsin'},
]

//Userlist
interface option3 {
    value: string
    label: string
}
export const options3: option3[] = [
{value:'Firefox', label:'Firefox'},
{value:'Chrome selected', label:'Chrome'},
{value:'Safari', label:'Safari'},
{value:'Internet Explorer', label:'Internet Explorer'},
]
// Multiple select
interface option4 {
    value: string
    label: string
}
export const options4: option4[] = [
{value:"1", label:'January'},
{value:"2", label:'February'},
{value:"3", label:'March'},
{value:"4", label:'April'},
{value:"5", label:'May'},
{value:"6", label:'June'},
{value:"7", label:'July'},
{value:"8", label:'Agust'},
{value:"9", label:'September'},
{value:"10", label:'October'},
{value:"11", label:'November'},
{value:"12", label:'December'},                                           
]
//Disable select
interface option5 {
    value: string
    label: string
}
export const options5: option5[] = [
    {value:"1", label:'January'},
    {value:"2", label:'February'},
    {value:"3", label:'March'},
    {value:"4", label:'April'},
    {value:"5", label:'May'},
    {value:"6", label:'June'},
    {value:"7", label:'July'},
    {value:"8", label:'Agust'},
    {value:"9", label:'September'},
    {value:"10", label:'October'},
    {value:"11", label:'November'},
    {value:"12", label:'December'},                                            
    ]
//Single group disable multiselect
interface option6 {
    value: number
    label: string
    disabled: string
}
export const options6: option6[] = [
    {value:1, label:'Group1' ,disabled: "disabled"},
    {value:2, label:'Option 1', disabled:''},
    {value:3, label:'Option 2', disabled:''},
    {value:4, label:'Option 3', disabled:''},
    {value:5, label:'Option 4', disabled:''},
    {value:6, label:'Option 5', disabled:''},
    {value:6, label:'Group2', disabled:''},
    {value:7, label:'Option 1', disabled:''},
    {value:8, label:'Option 2', disabled:''},
    {value:9, label:'Option 3', disabled:''},
    {value:10, label:'Option 4', disabled:''},
    {value:11, label:'Option 5', disabled:''},
    {value:12, label:'Option 6', disabled:''},
    {value:13, label:'Option 7', disabled:''},
    {value:14, label:'Option 8', disabled:''},
    {value:15, label:'Group3', disabled:''},
    {value:16, label:'Option 1', disabled:''},
    {value:17, label:'Option 2', disabled:''},
    {value:18, label:'Option 3', disabled:''},
    {value:19, label:'Option 4', disabled:''},
    {value:20, label:'Option 5', disabled:''},
    {value:21, label:'Option 6', disabled:''},
    {value:22, label:'Option 7', disabled:''},
    {value:23, label:'Option 8', disabled:''},
    {value:24, label:'Option 9', disabled:''},
]
//Multiple Items With Group-Option
interface option7 {
    value: number
    label: string
    
}
export const options7: option7[] =[
    {value:1, label:'Group1'},
    {value:2, label:'1'},
    {value:3, label:'2'},
    {value:4, label:'3'},
    {value:5, label:'4'},
    {value:6, label:'5'},
    {value:7,label:'Group2'},
    {value:8, label:'6'},
    {value:9, label:'7'},
    {value:10, label:'8'},
    {value:11, label:'9'},
    {value:12, label:'10'},
    {value:13, label:'Group3'},
    {value:14, label:'11'},
    {value:15, label:'12'},
    {value:16, label:'13'},
    {value:17, label:'14'},
    {value:18, label:'15'},

]
//Single select
interface option8 {
    value: number
    label: string
   
}
export const options8:option8[] = [
    {value:1, label:'One'},
    {value:2, label:'Two'},
    {value:3, label:'Three'},
    {value:4, label:'Four'},

]
//Group option filter
interface option9 {
    value: number
    label: string
    
}
export const options9:option9[] = [
    {value:1, label:'Group1'},
    {value:2, label:'1'},
    {value:3, label:'2'},
    {value:4, label:'3'},
    {value:5, label:'4'},
    {value:6, label:'5'},
    {value:7, label:'Group2'},
    {value:8, label:'1'},
    {value:9, label:'2'},
    {value:10, label:'3'},
    {value:11, label:'4'},
    {value:12, label:'5'},
    {value:13, label:'6'},
    {value:14, label:'7'},
    {value:15, label:'8'},
    {value:16, label:'Group3'},
    {value:12, label:'1'},
    {value:18, label:'2'},
    {value:19, label:'3'},
    {value:20, label:'4'},
    {value:21, label:'5'},
    {value:22, label:'6'},
    {value:23, label:'7'},
    {value:24, label:'8'},
    {value:25, label:'9'},
]
// Multiple select
interface option10 {
    value: string
    label: string
    
}
export const options10:option10[] = [
    {value:"1", label:'January'},
    {value:"2", label:'February'},
    {value:"3", label:'March'},
    {value:"4", label:'April'},
    {value:"5", label:'May'},
    {value:"6", label:'June'},
    {value:"7", label:'July'},
    {value:"8", label:'Agust'},
    {value:"9", label:'September'},
    {value:"10", label:'October'},
    {value:"11", label:'November'},
    {value:"12", label:'December'},                                           
    ]
    //Group option multiselect
    interface option11 {
        value: number
        label: string
       
    }
    export const options11:option11[] = [
        {value:1, label:'Group1'},
        {value:2, label:'Option 1'},
        {value:3, label:'Option 2'},
        {value:4, label:'Option 3'},
        {value:5, label:'Option 4'},
        {value:6, label:'Option 5'},
        {value:7, label:'Group2'},
        {value:8, label:'Option 1'},
        {value:9, label:'Option 2'},
        {value:10, label:'Option 3'},
        {value:11, label:'Option 4'},
        {value:12, label:'Option 5'},
        {value:13, label:'Option 6'},
        {value:14, label:'Option 7'},
        {value:15, label:'Option 8'},
        {value:16, label:'Group3'},
        {value:17, label:'Option 1'},
        {value:18, label:'Option 2'},
        {value:19, label:'Option 3'},
        {value:20, label:'Option 4'},
        {value:21, label:'Option 5'},
        {value:22, label:'Option 6'},
        {value:23, label:'Option 7'},
        {value:24, label:'Option 8'},
        {value:25, label:'Option 9'},
    ]
    //Multiple items
    interface option12 {
        value: number
        label: string
       
    }
    export const options12:option12[] = [
        {value:1, label:'1'},
        {value:2, label:'2'},
        {value:3, label:'3'},
        {value:4, label:'4'},
        {value:5, label:'5'},
        {value:6, label:'6'},
        {value:7, label:'7'},
        {value:8, label:'8'},
        {value:9, label:'9'},
        {value:10, label:'10'},
        {value:11, label:'11'},
        {value:12, label:'12'},
        {value:13, label:'13'},
        {value:14, label:'14'},
        {value:15, label:'15'},
        {value:16, label:'16'},
        {value:17, label:'17'},
        {value:18, label:'18'},
        {value:19, label:'19'},
        {value:20, label:'20'},
        {value:21, label:'21'},
        {value:22, label:'22'},
        {value:23, label:'23'},
        {value:24, label:'24'},
        {value:25, label:'25'},
        {value:26, label:'26'},
        {value:27, label:'27'},
        {value:28, label:'28'},
        {value:29, label:'29'},
        {value:30, label:'30'},

    ]
    //Hide select all
    interface option13 {
        value: number
        label: string
       
    }
    export const options13 :option13[]=[
        {value:1, label:'First'},
        {value:2, label:'Second'},
        {value:3, label:'Third'},
        {value:4, label:'Fourth'},

    ]
    //Select filter
    interface option14 {
        value: number
        label: string
       
    }
    export const options14:option14[]= [
        {value:1, label:'1'},
        {value:2, label:'2'},
        {value:3, label:'3'},
        {value:4, label:'4'},
        {value:5, label:'5'},
        {value:6, label:'6'},
        {value:7, label:'7'},
        {value:8, label:'8'},
        {value:9, label:'9'},
        {value:10, label:'10'},
        {value:11, label:'11'},
        {value:12, label:'12'},
        {value:13, label:'13'},
        {value:14, label:'14'},
        {value:15, label:'15'},
        {value:16, label:'16'},
        {value:17, label:'17'},
        {value:18, label:'18'},
        {value:19, label:'19'},
        {value:20, label:'20'},
    ]
    //custom select
    interface option27 {
        value: string
        label: string
    }
    export const options27:option27[] = [
    {value:"1", label:'January'},
    {value:"2", label:'February'},
    {value:"3", label:'March'},
    {value:"4", label:'April'},
    {value:"5", label:'May'},
    {value:"6", label:'June'},
    {value:"7", label:'July'},
    {value:"8", label:'Agust'},
    {value:"9", label:'September'},
    {value:"10", label:'October'},
    {value:"11", label:'November'},
    {value:"12", label:'December'},                                            
    ]
    //Single select
    interface option15 {
        value: string
        label: string
       
    }
    export const options15:option15[] = [
        {value:"1", label:'Volvo'},
        {value:"2", label:'Sab'},
        {value:"3", label:'Merceds'},
        {value:"4", label:'Audi'},
]
//Disable select
interface option16 {
    value: string
    label: string
   
}
export const options16:option16[] = [
   
    {value:"1",label:'Volvo'},
    {value:"2",label:'Sab'},
    {value:"3",label:'Merceds'},
    {value:"4",label:'Audi'}, 
    {value:"optn1",label:'option1'},
    {value:"optn2",label:'option2'},
    {value:"optn3",label:'option3'},
   
]
//Inline select
interface option17 {
    value: string
    label: string
   
}
export const options17:option17[] = [
    
        {value:'1', label:'selected'},
        {value:"2",label:'Volvo'},
        {value:"3",label:'Sab'},
        {value:"4",label:'Merceds'},
        {value:"5",label:'Audi'},  
        {value:"6",label:'Volvo'},
        {value:"7",label:'Sab'},
        {value:"8",label:'Merceds'},
        {value:"9",label:'Audi'}, 
    
];
//Multiple select-1
interface option18 {
    value: string
    label: string
}
export const options18:option18 [] = [
    {value:"1", label:'Volvo'},
    {value:"2", label:'Saab'},
    {value:"3", label:'Mercedes'},
        {value:"4", label:'Audi'},
    {value:"5", label:'BMW'},
    {value:"6", label:'Porche'},
    {value:"7", label:'Ferrari'},
    {value:"8", label:'Mitsubishi'},

]
    //Multiple select-2
    interface option19 {
        value: string
        label: string
    }
export const options19:option19 [] = [
    {value:"1", label:'Volvo'},
    {value:"2", label:'Saab'},
    {value:"3", label:'Mercedes'},
        {value:"4", label:'Audi'},
    {value:"5", label:'BMW'},
    {value:"6", label:'Porche'},
    {value:"7", label:'Ferrari'},
    {value:"8", label:'Mitsubishi'},

]
//search select-1
interface option20 {
    value: string
    label: string
}
export const options20:option20[] = [
    {value:'Saab', label:'Saab'},
    {value:'Opel', label:'Opel'},
    {value:'Mercedez', label:'Mercedez'},
    {value:'', label:'US Brands'},
    {value:'Chrysler', label:'Chrysler'},
    {value:'General Motors', label:'General Motors'},
    {value:'Ford', label:'Ford'},
    {value:'Plymouth', label:'Plymouth'},
    {value:'', label:'French Brands'},
    {value:'Citroën', label:'Citroën'},
    {value:'Peugeot', label:'Peugeot'},
    {value:'Renault', label:'Renault'},
    {value:'Nissan', label:'Nissan'},
    {value:'', label:'Italian brands'},
    {value:'Fiat', label:'Fiat'},
    {value:'Alpha Romeo', label:'Alpha Romeo'},
    {value:'Lamborghini', label:'Lamborghini'},
    {value:'', label:'German brands'},
    {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Volkswagen', label:'Volkswagen'},
    {value:'Aston Martin', label:'Aston Martin'},
    {value:'Hyundai', label:'Hyundai'},
    {value:'Mitsubishi', label:'Mitsubishi'},

]
//Multi select #
interface option21 {
    value: string
    label: string
   
}
export const options21:option21[] =[
    {value:'Volvo', label:'Volvo'},
    {value:'Sab', label:'Sab'},
    {value:'Mercedes', label:'Mercedes'},
    {value:'Audi', label:'Audi'},

]
//Disable select 3
interface option22 {
    value: string
    label: string
   
}
export const options22 :option22[]= [
    {value:'Volvo', label:'Volvo'},
    {value:'Saab', label:'Saab'},
    {value:'Mercedes', label:'Mercedes'},
    {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Porche', label:'Porche'},
    {value:'Ferrari', label:'Ferrari'},
    {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Porche', label:'Porche'},
    {value:'Ferrari', label:'Ferrari'},
     {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Porche', label:'Porche'},
    {value:'Ferrari', label:'Ferrari'},
    {value:'Hyundai', label:'Hyundai'},
    {value:'Mitsubishi', label:'Mitsubishi'},


]
//optgroup select 
interface option23 {
    value: string
    label: string
   
}
 export const options23:option23[] = [
    {value:'Volvo', label:'Volvo'},
    {value:'Saab', label:'Saab'},
    {value:'Mercedes', label:'Mercedes'},
    {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Porche', label:'Porche'},
    {value:'Ferrari', label:'Ferrari'},
    {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Porche', label:'Porche'},
    {value:'Ferrari', label:'Ferrari'},
     {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Porche', label:'Porche'},
    {value:'Ferrari', label:'Ferrari'},
    {value:'Hyundai', label:'Hyundai'},
    {value:'Mitsubishi', label:'Mitsubishi'},
  
 ]
 //Search select-2
 interface option24 {
    value: string
    label: string
}
 export const options24 :option24[]=[
    {value:'Saab', label:'Saab'},
    {value:'Opel', label:'Opel'},
    {value:'Mercedez', label:'Mercedez'},
    {value:'Aston Martin', label:'Aston Martin'},
    {value:'Hyundai', label:'Hyundai'},
    {value:'Mitsubishi', label:'Mitsubishi'},
 ]
 //search select-3
 interface option25 {
    value: string
    label: string
}
 export const options25:option25[] =[
    {value:'Volvo', label:'Volvo'},
 {value:'Saab', label:'Saab'},
 {value:'Opel', label:'Opel'},
 {value:'Mercedez', label:'Mercedez'},
 {value:'Aston Martin', label:'Aston Martin'},
 {value:'Hyundai', label:'Hyundai'},
 {value:'Mitsubishi', label:'Mitsubishi'},
 ]
 //search select-4
 interface option26 {
    value: string
    label: string
}
export const options26:option26[] = [
    {value:'Saab', label:'Saab'},
    {value:'Opel', label:'Opel'},
    {value:'Mercedez', label:'Mercedez'},
    {value:'', label:'US Brands'},
    {value:'Chrysler', label:'Chrysler'},
    {value:'General Motors', label:'General Motors'},
    {value:'Ford', label:'Ford'},
    {value:'Plymouth', label:'Plymouth'},
    {value:'', label:'French Brands'},
    {value:'Citroën', label:'Citroën'},
    {value:'Peugeot', label:'Peugeot'},
    {value:'Renault', label:'Renault'},
    {value:'Nissan', label:'Nissan'},
    {value:'', label:'Italian brands'},
    {value:'Fiat', label:'Fiat'},
    {value:'Alpha Romeo', label:'Alpha Romeo'},
    {value:'Lamborghini', label:'Lamborghini'},
    {value:'', label:'German brands'},
    {value:'Audi', label:'Audi'},
    {value:'BMW', label:'BMW'},
    {value:'Volkswagen', label:'Volkswagen'},
    {value:'Aston Martin', label:'Aston Martin'},
    {value:'Hyundai', label:'Hyundai'},
    {value:'Mitsubishi', label:'Mitsubishi'},

]


export class SketchExample extends Component {
    state = {
      displayColorPicker: false,
      color: {
        r: 241,
        g: 112,
        b: 19,
        a: 1,
      },
    }
    handleClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
  
    handleClose = () => {
      this.setState({ displayColorPicker: false })
    };
  
    handleChange  = (color) => {
      this.setState({ color: color.rgb })
    };
    render() {
  
      return (
        <div>
          <p className="mt-4 mb-1">Show Adove photoshop with Alphaline and pallete. </p>
          <Button className='btn-pill' variant='primary' size='sm' onClick={this.handleClick}>
            <ColorLensIcon />
          </Button>
          {this.state.displayColorPicker ? <div >
            <div onClick={this.handleClose} />
            <SketchPicker className='mt-3' color={this.state.color} onChange={this.handleChange} />
          </div> : null}
  
        </div>
  
      )
    }
  }
  //Select Box 
  export function SelectBox() {
    let [value, setValue] = useState([""]);
    function handleChange(selected) {
      setValue(selected);
      console.log(selected);
    }
  const boxs =[
    {label:'HTML5'},
    {label:'CSS3'},
    {label:'PHP'},
    {label:'Jquery'},
    {label:'.Net'},
    {label:'Java'},
    {label:'Andrpid'},
    {label:'Angular Js'},
    {label:'PhotoShop'},
    {label:'Python'},
    {label:'Sql'},
    {label:'Java Script'},
  ]
}
//Dual List Box
const optionss = [
    {
      label: 'Java Script',
      options: [
        { value: 'Jquery', label: 'Jquery' },
        { value: 'Angular JS', label: 'Angular JS' },
        { value: 'React JS', label: 'React JS' },
        { value: 'Vue JS', label: 'Vue JS' }
      ],
    },
    {
      label: 'Popular',
      options: [
        { value: 'Java Script', label: 'Java Script' },
        { value: 'Java', label: 'Java' },
        { value: 'Python', label: 'Python' },
        { value: 'TypeScript', label: 'TypeScript' },
        { value: 'PHP', label: 'PHP' },
        { value: 'Ruby on Rails', label: 'Ruby on Rails' },
      ],
    }
  ];
  export class DualList extends Component {
    state:any = {
      selected: [options[0]],
    };
  
    onChange = (selected) => {
      console.log(selected);
      this.setState({ selected });
    };
  
    render() {
      const { selected } = this.state;
  
      return (
        <DualListBox
          options={optionss}
          selected={selected}
          allowDuplicates
          simpleValue={false}
          onChange={this.onChange}
        />
      );
    }
  }
  
  // Select Box START

// Box 1

export function SelectBox1() {
    let [value, setValue] = useState([""]);
    function handleChange(selected) {
      setValue(selected);
      console.log(selected);
    }
    const options = [
  
      { value: "HTML5", label: "HTML5" },
      { value: "CSS 3", label: "CSS 3" },
      { value: "PHP", label: "PHP" },
      { value: "J-Query", label: "J-Query" },
      { value: ".Net", label: ".Net" },
      { value: "Java", label: "Java" },
      { value: "Android", label: "Android" },
      { value: "React JS", label: "React JS" },
      { value: "Angular JS", label: "Angular JS" },
      { value: "PhotoShop", label: "PhotoShop" },
      { value: "Python", label: "Python" },
      { value: "Sql", label: "Sql" },
      { value: "JavaScript", label: "JavaScript" }
    ];
  
  
    return (
      <DualListBox
        canFilter
        selected={value}
        options={options}
        filterCallback={(option, filterInput) => {
          if (filterInput === "") {
            return true;
          }
          console.log(option);
          // return containsWord(option.label, filterInput);
          let words = filterInput.split(" ");
          let res = false;
          for (let word of words) {
            console.log(word);
            res = new RegExp(word, "i").test(option.label);
            if (res === false) {
              break;
            }
          }
          return res;
        }}
        onChange={handleChange}
      />
    );
  }
  
  // Box 2
  
  export function SelectBoxwithLabel() {
    let [value, setValue] = useState([""]);
    function handleChange(selected) {
      setValue(selected);
      console.log(selected);
    }
    const options = [
      {
        label: "Software Side",
        options: [
          { value: "Web designer", label: "Web designer" },
          {
            value: "Web Developer",
            label: "Web Developer"
          },
          {
            value: "Application Developer",
            label: "Application Developer"
          },
          {
            value: "App Designer",
            label: "App Designer"
          }
        ]
      },
      {
        label: "Voice Side",
        options: [
          { value: "Tell Caller", label: "Tell Caller" },
          {
            value: "Recruiter",
            label: "Recruiter"
          },
          {
            value: "HR",
            label: "HR"
          },
          {
            value: "Data Entry",
            label: "Data Entry"
          },
          {
            value: "Mapping",
            label: "Mapping"
          },
          {
            value: "US Recruiter",
            label: "US Recruiter"
          }
        ]
      }
    ];
  
    return (
      <DualListBox
        canFilter
        selected={value}
        options={options}
        filterCallback={(option, filterInput) => {
          if (filterInput === "") {
            return true;
          }
          console.log(option);
          // return containsWord(option.label, filterInput);
          let words = filterInput.split(" ");
          let res = false;
          for (let word of words) {
            console.log(word);
            res = new RegExp(word, "i").test(option.label);
            if (res === false) {
              break;
            }
          }
          return res;
        }}
        onChange={handleChange}
      />
    );
  }