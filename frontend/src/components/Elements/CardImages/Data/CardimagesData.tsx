import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'



//CARD GROUP
interface cardGroup {
    id: number
    class: string
    src1: string
    data:string
}
export const cardGroups: cardGroup[]=[
    {id:1,src1:ImagesData('media10'), class:'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', data:'border-end-0'},
    {id:2, src1:ImagesData('media11'), class:'This card has supporting text below as a natural lead-in to additional content.' , data:'border-end-0'},
    {id:3, src1:ImagesData('media12'), class:'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.', data:''},
]
//CARD GROUP FOOTERS
interface cardfooter {
    id: number
    class: string
    src1: string
    data:string
}
export const cardfooters: cardfooter[]=[
    {id:1,src1:ImagesData('media13'), class:'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', data:'border-end-0'},
    {id:2, src1:ImagesData('media14'), class:'This card has supporting text below as a natural lead-in to additional content.', data:'border-end-0'},
    {id:3, src1:ImagesData('media15'), class:'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.', data:''},
]
//EMPLOYEE CARD
interface employeecard {
    id: number
    heading: string
    src1: string
}
export const employeecards: employeecard[]=[
    {id:1, heading:'James Thomas', src1:ImagesData('users16')},
    {id:2, heading:'Rebacca Thomas', src1:ImagesData('users10')},
]