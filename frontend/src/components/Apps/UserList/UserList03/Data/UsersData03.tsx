
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

//USERLIST03
interface userlist {
    id: number
    heading: string
    class: string
    src1: string
}
export const userslist : userlist[]=[
    {id:1, heading:'Denis Rosenblum', class:'Project Manager', src1:ImagesData('users7')},
    {id:2, heading:'Harvey Mattos', class:'Develpoer', src1:ImagesData('users6')},
    {id:3, heading:'Catrice Doshier', class:'Assistant Manager', src1:ImagesData('users5')},
    {id:4, heading:'Catherina Bamber', class:'Company Manager', src1:ImagesData('users1')},
    {id:5, heading:'Margie Fitts', class:'It Manager', src1:ImagesData('users8')},
    {id:6, heading:'Dana Lott', class:'Hr Manager', src1:ImagesData('users5')},
    {id:7, heading:'Benedict Vallone', class:'Hr Recriuter', src1:ImagesData('users6')},
    {id:8, heading:'Robbie Ruder', class:'Ceo', src1:ImagesData('users8')},
    {id:9, heading:'Micaela Aultman', class:'Php developer', src1:ImagesData('users3')},
    {id:10, heading:'Jacquelynn Sapienza', class:'Web developer', src1:ImagesData('users4')},
    {id:11, heading:'Elida Distefano', class:'Hr Manager', src1:ImagesData('users9')},
    {id:12, heading:'Collin Bridgman', class:'web designer', src1:ImagesData('users7')},
]