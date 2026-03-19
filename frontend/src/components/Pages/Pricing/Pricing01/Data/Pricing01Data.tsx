//Pricing
interface price {
    id: number
    heading: string
    main: string
    text: string
    text1: string
    text2: string
    color: string
}
export const prices: price[]=[
    {id:1,heading:'Personal', main:'$15', text:'2', text1:'3', text2:'1',  color:'primary'},
    {id:2,heading:'Team', main:'$25', text:'3', text1:'4', text2:'2',  color:'danger'},
    {id:3,heading:'Corporate', main:'$99', text:'5', text1:'8', text2:'2',  color:'warning'},
    {id:4,heading:'Business', main:'$35', text:'4', text1:'6', text2:'2',  color:'success'},

]
//pricing1
interface price1 {
    id: number
    heading: string
    title: string
    color: string
}
export const prices1: price1[]=[
    {id:1, heading:'Personal', title:'$15', color:"primary"},
    {id:2, heading:'Unlimited', title:'$13', color:"success"},
    {id:3, heading:'Enterprice', title:'$17', color:"info"},
    {id:4, heading:'Team', title:'$12', color:"danger"},

]
//pricing2
interface price2 {
    id: number
    icon:string
    heading: string
    text: string
    main: string
    color: string
    color1: string
}
export const prices2: price2[]=[
    {id:1, icon:'zap', heading:'Personal', text:'Popular', main:'$15', color:'primary', color1:'outline-primary'},
    {id:2, icon:'layers', heading:'Business', text:'Free', main:'$21', color:'success', color1:'outline-success'},
    {id:3, icon:'users', heading:'Team', text:'Popular', main:'$18', color:'danger', color1:'outline-danger'},
    {id:4, icon:'box', heading:'Enterprice', text:'Popular', main:'$12', color:'warning', color1:'outline-warning'},
]