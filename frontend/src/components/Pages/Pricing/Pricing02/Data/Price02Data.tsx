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
//pricing2
interface price2 {
    id: number
    icon:string
    heading: string
    class:string
    text: string
    text1: string
    text2: string
    color: string
    data:string
}
export const prices2: price2[]=[
    {id:1, icon:'plane', heading:' STARTER PACK', class:'$19', text:'2', text1:'5', text2:'10', color:'primary',data:'col-lg-4'},
    {id:2, icon:'trophy', heading:'PROFESSIONAL PACK', class:'$29', text:'2', text1:'5', text2:'10', color:'success',data:'col-lg-4'},
    {id:3, icon:'umbrella', heading:'ENTERPRISE PACK', class:'$39', text:'2', text1:'3', text2:'8', color:'info',data:'col-lg-4 col-12'},
   

]