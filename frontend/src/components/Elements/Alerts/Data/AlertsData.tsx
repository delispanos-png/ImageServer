
    //Default Data

     interface a {
      id: number
     color: string
     }
  export  const defaultData: a[]=[
        {id:1 , color:'success'},
        {id:2 , color:'info'},
        {id:3 , color:'warning'},
        {id:4 , color:'danger'},
     ]
//Links in Alerts

       interface b {
        id: number
        class: string
        color: string
        heading: string
        alertLine: string
        description: string
       }

export const linksAData: b[] = [
    {id:1, class:'light-success', color:'success', heading:'Well Done!', alertLine:'You Successfully Read', description:'This Important Alert Message'},
    {id:2, class:'light-info', color:'info', heading:'Head Up! This',alertLine:'but its not super important.',  description:'Alerts Needs Your Attension,', },
    {id:3, class:'light-warning', color:'warning', heading:'Warning!', alertLine:' Better check yourself, youre', description:' not looking too good.'},
    {id:4, class:'light-danger', color:'danger', heading:'Oh Snap!', alertLine:'and try submitting again.', description:'Change a few things up'},

]
//Transperant Alerts

interface c {
    id: number
    class: string
    alertLine: string
}

export const transparentData: c[] = [
    {id:1, class:'light-primary', alertLine:'This is a primary alert—check it out!'},
    {id:2, class:'light-info', alertLine:'This is a info alert—check it out!'},
    {id:3, class:'light-success', alertLine:'This is a success alert—check it out!'},
    {id:4, class:'light-danger', alertLine:'This is a danger alert—check it out!'},
    {id:5, class:'light-warning', alertLine:'This is a warning alert—check it out!'},
    {id:6, class:'light-info', alertLine:'This is a info alert—check it out!'},
    {id:7, class:'light', alertLine:'This is a light alert—check it out!'},
    {id:8, class:'dark', alertLine:'This is a dark alert—check it out!'},

]
//Link Alert

interface d {
    id: number
    class: string
    description: string
   }

export const linkAlert: d[] =[
    {id:1, class:'light-primary', description:''},
    {id:2, class:'light-info', description:''},
    {id:3, class:'light-success', description:''},
    {id:4, class:'light-danger', description:''},
    {id:5, class:'light-warning', description:''},
    {id:6, class:'light-info', description:''},
    {id:7, class:'light', description:''},
    {id:8, class:'dark', description:''},

]
//Alerts styles

interface g {
    id: number
    class: string
    heading: string
   description: string
   }

export const alertStyles: g[] = [
    {id:1, class:'success', heading:'Success Message', description:'You successfully read this important alert message.'},
    {id:2, class:'info', heading:'Info Message', description:'This alert needs your attention, but its not super important.'},
    {id:3, class:'warning', heading:'Warning Message', description:'Best check yo self, youre not looking too good.'},
    {id:4, class:'danger', heading:'Danger Message', description:'Change a few things up and try submitting again.'},

]

//Icon Alerts

interface h {
    id: number
    class: string
    description: string
    icon: JSX.Element
}

export const iconAlerts: h[] = [
{id:1, class:'success', description:'Well done! You successfully read this important alert message.', icon:<i className="fa fa-check-circle-o me-2"></i>},
{id:2, class:'info', description:'Heads up! This alert needs your attention, but its not super important.', icon:<i className="fa fa-bell-o me-2"></i>},
{id:3, class:'warning', description:'Warning! Better check yourself, youre not looking too good.', icon:<i className="fa fa-exclamation me-2"></i>},
{id:4, class:'danger', description:'Oh snap! Change a few things up and try submitting again.', icon:<i className="fa fa-frown-o me-2"></i>},

]