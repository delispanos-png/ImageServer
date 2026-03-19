import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

//USERLIST
interface userlist {
    id: number
    heading: string
}
export const userlists : userlist[]=[
    {id:1, heading:'Check'},
    {id:2, heading:'User'},
    {id:3, heading:'Date of joining'},
    {id:4, heading:'Status'},
    {id:5, heading:'Role'},
    {id:6, heading:'Actions'},

]
//USERDATA
interface userdata {
    id: number
    heading: string
    src1: string
    class: string
    class1: string
    class2: string
    main: string
    main1: string
    color: string
}
export const usersdata : userdata[]=[
    {id:1, src1:ImagesData('users2'), heading:'Nam Guy', class:'09 Dec 2017', class1:'Active', class2:'web designer', main:'Edit', main1:'trash', color:'primary'},
    {id:2, src1:ImagesData('users1'), heading:'Tracy Lindahl', class:'27 Jan 2018', class1:'Active', class2:'web developer', main:'Edit', main1:'trash', color:'warning'},
    {id:3, src1:ImagesData('users3'), heading:'Breana Millis', class:'09 Dec 2017', class1:'Ideal', class2:'php developer', main:'Edit', main1:'trash', color:'primary'},
    {id:4, src1:ImagesData('users4'), heading:'Antwan Tramel', class:'20 Jan 2018', class1:'Active', class2:'Hr Manager', main:'Edit', main1:'trash', color:'primary'},
    {id:5, src1:ImagesData('users5'), heading:'Geraldine Arpin', class:'13 Jan 2018', class1:'Active', class2:'Recriuter', main:'Edit', main1:'trash', color:'primary'},
    {id:6, src1:ImagesData('users6'), heading:'Clement Niehaus', class:'25 Jan 2018', class1:'Inactive', class2:'Ceo', main:'Edit', main1:'trash', color:'danger'},
    {id:7, src1:ImagesData('users7'), heading:'Melinda Mayers', class:'12 Jan 2018', class1:'Active', class2:'web developer', main:'Edit', main1:'trash', color:'primary'},
    {id:8, src1:ImagesData('users8'), heading:'Willodean Monson', class:'27 Jan 2018', class1:'Active', class2:'web designer', main:'Edit', main1:'trash', color:'primary'},
    {id:9, src1:ImagesData('users9'), heading:'Brenton Moncada', class:'12 Dec 2017', class1:'Ideal', class2:'web developer', main:'Edit', main1:'trash', color:'warning'},
    {id:10, src1:ImagesData('users10'), heading:'Cyndy Kirschbaum', class:'10 Dec 2017', class1:'Inactive', class2:'web developer', main:'Edit', main1:'trash', color:'danger'},
    {id:11, src1:ImagesData('users11'), heading:'Renna Spino', class:'03 Dec 2017', class1:'Active', class2:'Hr Manager', main:'Edit', main1:'trash', color:'primary'},
    {id:12, src1:ImagesData('users12'), heading:'Freeman Kozlowski', class:'09 Dec 2017', class1:'Inactive', class2:'web developer', main:'Edit', main1:'trash', color:'danger'},
]