//Default Button

interface defaultButtons {
    color: string
    Buttontheme: string
}
export const defaultButton: defaultButtons[] = [

    {color:'light', Buttontheme:'light'},
    {color:'primary', Buttontheme:'primary'},
    {color:'secondary', Buttontheme:'secondary'},
    {color:'success', Buttontheme:'success'},
    {color:'info', Buttontheme:'info'},
    {color:'warning', Buttontheme:'warning'},
    {color:'danger', Buttontheme:'danger'},    
]

//Disable Button

interface disableButtons {
    color: string
    Buttontheme: string
}
export const disableButton: disableButtons[] = [

    {color:'light', Buttontheme:'Light'},
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},    
]

//Square Button

interface squareButtons {
    color: string
    Buttontheme: string
}
export const squareButton: squareButtons[] = [

    {color:'light', Buttontheme:'Light'},
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},    
]
//round Button

interface roundButtons {
    color: string
    Buttontheme: string
}
export const roundButton: roundButtons[] = [

    {color:'light', Buttontheme:'Light'},
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},    
]
//light Button

interface lightButtons {
    color: string
    Buttontheme: string
}
export const lightButton: lightButtons[] = [

    
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'info', Buttontheme:'Teal'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},
    {color:'dark', Buttontheme:'Dark'},    
]

//disables light Button

interface disabledButtons {
    color: string
    Buttontheme: string
}
export const disabledButton: disabledButtons[] = [

    
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'info', Buttontheme:'Teal'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},
    {color:'dark', Buttontheme:'Dark'},    
]

//rounded light Button

interface roundedButtons {
    color: string
    Buttontheme: string
}
export const roundedButton: roundedButtons[] = [

    
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'info', Buttontheme:'Teal'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},
    {color:'dark', Buttontheme:'Dark'},    
]

//rounded disabled light Button

interface roundlightButtons {
    color: string
    Buttontheme: string
}
export const roundlightButton: roundlightButtons[] = [

    
    {color:'primary', Buttontheme:'Primary'},
    {color:'secondary', Buttontheme:'Secondary'},
    {color:'success', Buttontheme:'Success'},
    {color:'info', Buttontheme:'Info'},
    {color:'info', Buttontheme:'Teal'},
    {color:'warning', Buttontheme:'Warning'},
    {color:'danger', Buttontheme:'Danger'},
    {color:'dark', Buttontheme:'Dark'},    
]

//light icon Button

interface iconButtons {
    color: string
    icon: JSX.Element
}
export const iconButton: iconButtons[] = [
    {color:'primary', icon:<i className="fe fe-plus"></i>},
    {color:'warning', icon:<i className="fe fe-heart"></i>},
    {color:'success', icon:<i className="fe fe-check"></i>},
    {color:'danger', icon:<i className="fe fe-link"></i>},
    {color:'info', icon:<i className="fe fe-message-circle"></i>},
    {color:'teal', icon:<i className="fe fe-trash"></i>},
    {color:'dark', icon:<i className="fe fe-upload"></i>},
]
//toggleButton
interface toggleButtons {
    color: string
    Buttontheme: string
}
export const toggleButton: toggleButtons[] = [
    {color:'primary',Buttontheme:'Toggle Button' },
    {color:'primary',Buttontheme:'Active toggle Button' },
    {color:'primary disabled',Buttontheme:'Disabled toggle Button' },

]

//outline Buttons

interface outlineButtons {
color: string
Buttontheme: string
}
export const outlineButton: outlineButtons[] = [

    {color:'outline-light', Buttontheme:'light'},  
    {color:'outline-primary', Buttontheme:'Primary'},
    {color:'outline-secondary', Buttontheme:'Secondary'},
    {color:'outline-success', Buttontheme:'Success'},
    {color:'outline-info', Buttontheme:'Info'},
    {color:'outline-info', Buttontheme:'Teal'},
    {color:'outline-warning', Buttontheme:'Warning'},
    {color:'outline-danger', Buttontheme:'Danger'},
      
]

//outline Buttons

interface outlinedisableButtons {
    color: string
    Buttontheme: string
    }
    export const outlinedisableButton: outlinedisableButtons[] = [
    
        {color:'outline-light', Buttontheme:'light'},  
        {color:'outline-primary', Buttontheme:'Primary'},
        {color:'outline-secondary', Buttontheme:'Secondary'},
        {color:'outline-success', Buttontheme:'Success'},
        {color:'outline-info', Buttontheme:'Info'},
        {color:'outline-info', Buttontheme:'Teal'},
        {color:'outline-warning', Buttontheme:'Warning'},
        {color:'outline-danger', Buttontheme:'Danger'},
          
    ]

//Button with icon

interface buttonIcons {
    color: string
    icon: JSX.Element
    Buttontheme: string
}

export const buttonIcon:buttonIcons [] =[
    {color:'primary',Buttontheme:'More', icon:<i className="fe fe-plus me-2"></i>},
    {color:'success', Buttontheme:'Upload', icon:<i className="fe fe-upload me-2"></i>},
    {color:'warning', Buttontheme:'I like', icon:<i className="fe fe-heart me-2"></i>},
    {color:'success', Buttontheme:'I agree', icon:<i className="fe fe-check me-2"></i>},
    {color:'danger', Buttontheme:'Link', icon:<i className="fe fe-link me-2"></i>},
    {color:'info', Buttontheme:'Comment', icon:<i className="fe fe-message-circle me-2"></i>},
]


//Social Button
interface socialButtons {
    color: string
    icon: JSX.Element
    Buttontheme: string
}
export const socialButton: socialButtons [] = [
    {color:'primary', Buttontheme:'Facebook', icon:<i className="fa fa-facebook me-2"></i>},
    {color:'info', Buttontheme:'Twitter', icon:<i  className="fa fa-twitter me-2"></i>},
    {color:'danger', Buttontheme:'Google', icon:<i  className="fa fa-google me-2"></i>},
    {color:'red', Buttontheme:'Youtube', icon:<i className="fa fa-youtube me-2"></i>},
    {color:'info', Buttontheme:'Vimeo', icon:<i className="fa fa-vimeo me-2"></i>},
    {color:'pink', Buttontheme:'Dribble', icon:<i  className="fa fa-dribbble me-2"></i>},
    {color:'dark', Buttontheme:'Github', icon:<i className="fa fa-github me-2"></i>},
    {color:'danger', Buttontheme:'Instagram', icon:<i className="fa fa-instagram me-2"></i>},
    {color:'red', Buttontheme:'Pinterest', icon:<i  className="fa fa-pinterest me-2"></i>},
    {color:'gray', Buttontheme:'Vkontakta', icon:<i  className="fa fa-vk me-2"></i>},
    {color:'warning', Buttontheme:'RSS', icon:<i  className="fa fa-rss me-2"></i>},
    {color:'primary', Buttontheme:'Flickr', icon:<i  className="fa fa-flickr me-2"></i>},

]
//Color variations
interface colorButtons {
    color: string
    Buttontheme: string
}
export const colorButton: colorButtons[] = [
    {color:'blue', Buttontheme:'Blue'},
    {color:'azure', Buttontheme:'Azure'},
    {color:'indigo', Buttontheme:'Indigo'},
    {color:'purple', Buttontheme:'Purple'},
    {color:'pink', Buttontheme:'Pink'},
    {color:'red', Buttontheme:'Red'},
    {color:'orange', Buttontheme:'orange'},
    {color:'yellow', Buttontheme:'Yellow'},
    {color:'lime', Buttontheme:'Lime'},
    {color:'green', Buttontheme:'Green'},
    {color:'teal', Buttontheme:'Teal'},
    {color:'cyan', Buttontheme:'Cyan'},
    {color:'gray', Buttontheme:'Gray'},
    {color:'dark gray', Buttontheme:'Dark gray'},

]
//Social Icon Button
interface socialIcons {
    color: string
    icon: JSX.Element
}
export const socialIcon: socialIcons[] = [
    {color:'primary', icon:<i className="fa fa-facebook"></i>},
    {color:'info', icon:<i className="fa fa-twitter"></i>},
    {color:'danger', icon:<i  className="fa fa-google"></i>},
    {color:'red', icon:<i className="fa fa-youtube"></i>},
    {color:'info', icon:<i className="fa fa-vimeo"></i>},
    {color:'pink', icon:<i  className="fa fa-dribbble"></i>},
    {color:'dark', icon:<i className="fa fa-github"></i>},
    {color:'danger', icon:<i className="fa fa-instagram"></i>},
    {color:'red', icon:<i className="fa fa-pinterest"></i>},

]
//Icon Buttons
interface buttonIcon {
    color: string
    icon: JSX.Element
}
export const buttonIcons: buttonIcon [] = [
    {color:'primary', icon:<i className="fe fe-activity"></i>},
    {color:'dark', icon:<i className="fe fe-github"></i>},
    {color:'success', icon:<i  className="fe fe-bell"></i>},
    {color:'warning', icon:<i className="fe fe-star"></i>},
    {color:'danger', icon:<i className="fe fe-trash"></i>},
    {color:'purple', icon:<i className="fe fe-bar-chart"></i>},
    {color:'info', icon:<i className="fe fe-git-merge"></i>},

]