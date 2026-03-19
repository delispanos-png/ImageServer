//Simple badges
interface simpleBadges {
    title: string
    color: string
    color1: string
    color2: string
    color3: string
    color4: string
    color5: string
    header: string
    header1: string
    header2: string
    header3: string
    header4: string
    header5: string
    classNam: string
    class: string
}
export const simpleBadge: simpleBadges[] = [
    {title:'SIMPLE BADGES', header:'Heading 01', classNam: 'badge-default',header1:'Heading 02',header2:'Heading 03',header3:'Heading 04',header4:'Heading 05',header5:'Heading 06', class:'New', color:'', color1:'', color2:'', color3:'', color4:'', color5:''},
    {title:'COLORED BADGES', header:'Heading 01',classNam: '',header1:'Heading 02',header2:'Heading 03',header3:'Heading 04',header4:'Heading 05',header5:'Heading 06', class:'New', color:'primary', color1:'danger', color2:'warning', color3:'success', color4:'info', color5:'info'},

]
//Square badge
interface squareBadges {
   id: number
    heading: string
    class: string
     color: string   
}
export const squareBadge: squareBadges[] =[
    {id:1, heading:'Notifications', class:'2', color:'primary'},
    {id:2, heading:'Notifications', class:'1', color:'info'},
    {id:3, heading:'Notifications', class:'5', color:'success'},
    {id:4, heading:'Notifications', class:'3', color:'info'},
    {id:5, heading:'Notifications', class:'6', color:'warning'},
    {id:6, heading:'Notifications', class:'4', color:'danger'},
  
]
//Border badge
interface borderBadges {
    id: number
     heading: string
     class: string
      color: string 
      color1: string 
 }
 export const borderBadge: borderBadges[] =[
     {id:1, heading:'Notifications', class:'2', color:'outline-primary', color1:'primary'},
     {id:2, heading:'Notifications', class:'65', color:'outline-success', color1:'success'},
     {id:3, heading:'Notifications', class:'1', color:'outline-info', color1:'info'},
     {id:4, heading:'Notifications', class:'5333', color:'outline-info', color1:'info'},
      
 ]
 //Round badge
interface roundBadges {
   id: number
    heading: string
    class: string
     color: string   
}
export const roundBadge: roundBadges[] =[
    {id:2, heading:'Notifications', class:'3', color:'info'},
    {id:1, heading:'Notifications', class:'22', color:'primary'},
    {id:4, heading:'Notifications', class:'145', color:'info'},
    {id:3, heading:'Notifications', class:'3225', color:'success'}, 
]
//Borderround badge
interface borderoundBadges {
    id: number
     heading: string
     class: string
      color: string 
      color1: string 
 }
 export const borderoundBadge: borderoundBadges[] =[
     {id:1, heading:'Notifications', class:'2', color:'outline-primary', color1:'primary'},
     {id:2, heading:'Notifications', class:'65', color:'outline-success', color1:'success'},
     {id:3, heading:'Notifications', class:'1', color:'outline-info', color1:'info'},
     {id:4, heading:'Notifications', class:'5333', color:'outline-danger', color1:'danger'},
      
 ]
 //Border Buttons with Rounded Badges
 interface borderBadges {
    id: number
    heading: string
    class: string
    color: string
    color1: string
 }
 export const borderBadgee : borderBadges[] = [
    {id:1, heading:'Inbox', class:'99+', color:'primary', color1:'danger'},
    {id:2, heading:'Inbox', class:'99+', color:'success', color1:'danger'},
    {id:3, heading:'Inbox', class:'99+', color:'danger', color1:'danger'},
    {id:4, heading:'Inbox', class:'99+', color:'teal', color1:'danger'},
    {id:5, heading:'Inbox', class:'99+', color:'info', color1:'danger'},
    {id:6, heading:'Inbox', class:'99+', color:'warning', color1:'danger'},
 ]
 //CONTEXTUAL VARIATIONS
 interface Contextuals {
    id: number
    heading: string
    color: string
 }
 export const Contextual: Contextuals[] =[
     {id:1, heading:'default', color:'dark'},
     {id:2, heading:'primary', color:'primary'},
     {id:3, heading:'success', color:'success'},
     {id:4, heading:'info', color:'info'},
     {id:5, heading:'warning', color:'warning'},
     {id:6, heading:'danger', color:'danger'},

 ] 
  //CONTEXTUAL ROUND VARIATIONS
  interface roundContextuals {
    id: number
    heading: string
    color: string
 }
 export const roundContextual: roundContextuals[] =[
     {id:1, heading:'default', color:'dark'},
     {id:2, heading:'primary', color:'primary'},
     {id:3, heading:'success', color:'success'},
     {id:4, heading:'info', color:'info'},
     {id:5, heading:'warning', color:'warning'},
     {id:6, heading:'danger', color:'danger'},

 ] 
  //LIGHT VARIATIONS
  interface lightBadges {
    id: number
    heading: string
    color: string
 }
 export const lightBadge: lightBadges[] =[
     {id:1, heading:'primary', color:'primary-light'},
     {id:2, heading:'success', color:'success-light'},
     {id:3, heading:'secondary', color:'secondary-light'},
     {id:4, heading:'info', color:'info-light'},
     {id:5, heading:'warning', color:'warning-light'},
     {id:6, heading:'danger', color:'danger-light'},

 ] 
   //GRADIENT VARIATIONS
   interface gradientBadges {
    id: number
    heading: string
    color: string
 }
 export const gradientBadge: gradientBadges[] =[
     {id:1, heading:'primary', color:'gradient-primary'},
     {id:2, heading:'success', color:'gradient-success'},
     {id:3, heading:'secondary', color:'gradient-secondary'},
     {id:4, heading:'info', color:'gradient-info'},
     {id:5, heading:'warning', color:'gradient-warning'},
     {id:6, heading:'danger', color:'gradient-danger'},

 ] 
 //SHAPE BADGES
 interface shapeBadges {
    id: number
    title: string
    heading: string
    class: string
    color: string
 }
  export const shapeBadge  : shapeBadges[] = [
    {id:1, title:'Top', heading:'Default Badge', class:' And a little description. and so one', color:'offer-default'},
    {id:2, title:'Top', heading:'Success Badge', class:' And a little description. and so one', color:'offer-success'},
    {id:3, title:'Top', heading:'Primary Badge', class:' And a little description. and so one', color:'offer-primary'},
    {id:4, title:'Top', heading:'Info Badge', class:' And a little description. and so one', color:'offer-info'},
    {id:5, title:'Top', heading:'Warning Badge', class:' And a little description. and so one', color:'offer-warning'},
    {id:6, title:'Top', heading:'Danger Badge', class:' And a little description.and so one', color:'offer-danger'},
  ]