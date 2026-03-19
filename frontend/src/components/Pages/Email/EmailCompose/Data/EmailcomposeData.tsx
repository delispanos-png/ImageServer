interface Emailcompose {
    id: number
    heading: string
    class: string
    icon: string
    color: string
}
export const Emailcomposes : Emailcompose []=[
    {id:1, heading:'Inbox', class:'14', icon:'inbox',color:'secondary'},
    {id:2, heading:'Sent mail', class:'', icon:'mail',color:''},
    {id:3, heading:'Important', class:'03', icon:'alert-octagon',color:'danger'},
    {id:4, heading:'Starred', class:'', icon:'star',color:''},
    {id:5, heading:'Drafts', class:'', icon:'briefcase',color:''},
    {id:6, heading:'Tags', class:'', icon:'tag',color:''},
    {id:7, heading:'Trash', class:'', icon:'inbox',color:''},

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
  