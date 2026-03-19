import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

//CONTCAT LIST
interface contactlist {
    id: number
    heading: string
    src1: string
    title: string
    class: string
    color: string
}
export const contactlists : contactlist[]=[
    {id:1, heading:'Taylor Swift', src1:ImagesData('users7'), title:'Employee', class:'Employee', color:'info'},
    {id:2, heading:' Amanda Nunes', src1:ImagesData('users2'), title:'Customer', class:'Customer', color:'success'},
    {id:3, heading:'Denver Athor', src1:ImagesData('users1'),title:'Employee', class:'Employee', color:'info'},
    {id:4, heading:'Mama Mia', src1:ImagesData('users5'), title:'Share holder', class:'Share Holder', color:'danger'},
    {id:5, heading:'Roddie Rich', src1:ImagesData('users15'), title:'Customer', class:'Customer', color:'info'},
    {id:6, heading:'Justin Cumber', src1:ImagesData('users13'),title:'Employee', class:'Employee', color:'info'},
    {id:7, heading:'Ronda Rousey', src1:ImagesData('users3'), title:'Employee', class:'Customer', color:'info'},
    {id:8, heading:'Corner McGergor', src1:ImagesData('users12'),title:'C.E.O', class:'Owner', color:'teal'},

]