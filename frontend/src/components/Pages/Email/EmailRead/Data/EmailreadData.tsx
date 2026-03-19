//Emailread
interface email {
    id: number
    heading: string
    icon: string
    text: string
   color: string
  }
  export const emails: email[]=[
    {id:1,heading:'Inbox', icon:'inbox',text:'14', color:'info'},
    {id:2,heading:'Sent mail', icon:'mail',text:'', color:''},
    {id:3, heading:'Important', text:'03', icon:'alert-octagon',color:'danger'},
    {id:4,heading:'Starred', icon:'star',text:'', color:''},
    {id:5,heading:'Drafts', icon:'briefcase',text:'', color:''},
    {id:6,heading:'Tags', icon:'tag',text:'', color:''},
    {id:7,heading:'Trash', icon:'trash-2',text:'', color:''},
  
  ]
  //Emailcolor
  interface emailcolor {
    id: number
    heading: string
    color: string
  }
  export const emailcolors: emailcolor[]=[
    {id:1, heading:'Friends', color:'primary'},
    {id:2, heading:'Family', color:'secondary'},
    {id:3, heading:'Social', color:'success'},
    {id:4, heading:'Office', color:'info'},
    {id:5, heading:'Work', color:'warning'},
    {id:6, heading:'Settings', color:'danger'},
  ]