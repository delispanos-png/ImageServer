
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

//TODOLIST
interface todolist {
    id: number
    heading: string
    icon: string
    class: string
    color: string
    color1: string
    main: string
}
export const todolists : todolist[]=[
    {id:1, heading:'All Tasks', icon:'codepen fs-18', class:'14', color:'success', color1:'primary', main:'brround'},
    {id:2, heading:'Important', icon:'octagon fs-18', class:'3', color:'danger', color1:'warning', main:'brround'},
    {id:3, heading:'Starred', icon:'star fs-18', class:'', color:'', color1:'secondary', main:'brround'},
    {id:4, heading:'Spam', icon:'briefcase fs-18', class:'', color:'', color1:'danger', main:'brround'},
    {id:5, heading:'Archive', icon:'briefcase fs-18', class:'', color:'', color1:'success', main:'brround'},
    {id:6, heading:'Trash', icon:'trash fs-18', class:'', color:'', color1:'info', main:'brround'},
    {id:7, heading:'friends', icon:'arrow-right fs-10', class:'', color:'', color1:'secondary', main:'br-7'},
    {id:8, heading:'Family', icon:'arrow-right fs-10 ', class:'', color:'', color1:'primary', main:'br-7'},
    {id:9, heading:'Social', icon:'arrow-right fs-10', class:'', color:'', color1:'success', main:'br-7'},
    {id:10, heading:'Office', icon:'arrow-right fs-10', class:'', color:'', color1:'warning', main:'br-7'},
    {id:11, heading:'Work', icon:'arrow-right fs-10', class:'', color:'', color1:'info', main:'br-7'},
    {id:12, heading:'Settings', icon:'arrow-right fs-10', class:'', color:'', color1:'danger', main:'br-7'},
]
//LISTDATA
interface listdata {
    id: number
    heading: string
    icon: string
    class: string
    class1: string
    main: string
    color: string
    src1: string
}
export const listsdata : listdata[]=[
    {id:1, heading:'Shamika Griffith', main:'trash', class:'Work Assigned By Clients', class1:'New', icon:'star', color:'info',src1:ImagesData('users1')},
    {id:2, heading:'Archie Kesler', main:'trash', class:'Try To Get New Work', class1:'Completed', icon:'star text-warning', color:'success',src1:ImagesData('users2')},
    {id:3, heading:'Carolyne Wirtz', main:'trash', class:'Rationally Encounter Quences', class1:'New', icon:'star', color:'info',src1:ImagesData('users3')},
    {id:4, heading:'Consuelo Valenzuela', main:'trash', class:'	Which Of Us Ever Undertakes', class1:'Completed', icon:'star', color:'success',src1:ImagesData('users4')},
    {id:5, heading:'Myrta Powe', main:'trash', class:'Quis Autem Vel Eum Iure', class1:'New', icon:'star', color:'info',src1:ImagesData('users5')},
    {id:6, heading:'Margarette Wycoff', main:'trash', class:'Ut Enim Ad Minima Veniam', class1:'Pending', icon:'star', color:'warning',src1:ImagesData('users6')},
    {id:7, heading:'Veronica Kimery', main:'trash', class:'Inventore Veritatis Et Quasi', class1:'Completed', icon:'star text-warning', color:'success',src1:ImagesData('users7')},
    {id:8, heading:'Raisa Ladwig', main:'trash', class:'Vero Eos Et Accusamus Et Iusto', class1:'New', icon:'star', color:'info',src1:ImagesData('users8')},
    {id:9, heading:'Kathaleen Roysden', main:'trash', class:'Which Of Us Ever Undertakes', class1:'Pending', icon:'star text-warning', color:'warning',src1:ImagesData('users9')},
    {id:10, heading:'Elizabeth Loux', main:'trash', class:'Account Of The System', class1:'New', icon:'star', color:'info',src1:ImagesData('users10')},
]