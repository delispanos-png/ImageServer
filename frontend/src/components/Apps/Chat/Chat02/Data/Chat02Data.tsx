
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';
interface contact {
    id:number
    heading: string
    src1: string
}
export const contacts: contact[] = [

    {id:1,heading:'Kecia', src1:ImagesData('users12')},
    {id:2,heading:'Copp', src1:ImagesData('users2')},
    {id:3,heading:'Edwina', src1:ImagesData('users14')},
    {id:4,heading:'Uriarte', src1:ImagesData('users2')},
    {id:5,heading:'Ambrose', src1:ImagesData('users8')},
    {id:6,heading:'Cawthon', src1:ImagesData('users3')},
    {id:7,heading:'Celesta', src1:ImagesData('users11')},
    {id:8,heading:'Briones', src1:ImagesData('users1')},
]
interface chat {
    id: number
    heading: string
    data: string
    text: string
    user: string
    src1: string
    text1: string
}
export const chats: chat []=[
    
    {id:1, heading:'Melodi Maul', data:'culpa qui officia deserunt...', text:'2',src1:ImagesData('users2'), text1:'2 hours', user:'main-img-user online'},
    {id:2, heading:'MeloLourdes Eiland', data:'Et harum quidem rerum facilis est', text:'1',src1:ImagesData('users8'), text1:'3 hours', user:'main-img-user online'},
    {id:3, heading:'Zofia Mccutcheon', data:'Nam libero tempore, cum soluta nobis', text:'',src1:ImagesData('users3'), text1:'10 hours', user:""},
    {id:4, heading:'Erlinda Leeder', data:'omnis voluptas assumrighta est', text:'',src1:ImagesData('users13'), text1:'2 days', user:''},
    {id:5, heading:'Melodi Randy Booze', data:'Temporibus autem quibusdam et', text:'',src1:ImagesData('users14'), text1:'2 days', user:''},
    {id:6, heading:'Camelia Kimber', data:'saepe eveniet ut et voluptates ', text:'1',src1:ImagesData('users2'), text1:'3 days', user:'main-img-user'},
    {id:7, heading:'Jerome Vowell', data:'reicirightis voluptatibus maiores', text:'',src1:ImagesData('users7'), text1:'4 days', user:''},
    {id:8, heading:'Regine Mccrystal', data:'we denounce with righteous indignation', text:'',src1:ImagesData('users5'), text1:'5 days', user:''},
    {id:9, heading:'Nigel Knarr', data:'certain circumstances and owing to the claims', text:'',src1:ImagesData('users6'), text1:'5 days', user:''},
    {id:10, heading:'Marva Constante', data:'Mae cenas tempus, tellus eget co ndimen', text:'',src1:ImagesData('users12'), text1:'5 days', user:''},
    {id:11, heading:'Twila Hammers', data:'certain circumstances and owing to the claims', text:'',src1:ImagesData('users6'), text1:'6 days', user:''},
    {id:12, heading:'Vertie Raap', data:'certain circumstances and owing to the claims', text:'',src1:ImagesData('users7'), text1:'6 days', user:''},
    {id:13, heading:'Cory Gardenhire', data:'certain circumstances and owing to the claims', text:'',src1:ImagesData('users5'), text1:'6 days', user:''},
]