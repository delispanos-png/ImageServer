import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

//TODOLIST02
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
    {id:7, heading:'friends', icon:'arrow-right fs-10 px-0 py-2', class:'', color:'', color1:'secondary', main:'br-7'},
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
    class: string
    class1: string
    main: string
    color: string
    src1: string
}
export const listsdata: listdata[]=[
    {id:1, heading:'Shamika Griffith', class:'Work Assigned by Clients', class1:'Sed ut perspiciatis unde omnis istenatus', main:'Done', color:'success', src1:ImagesData('users1')},
    {id:2, heading:'Margarette Wycoff', class:'Voluptatem Accusantium Dolo Laudantium', class1:'Inventore Veritatis Et Quasi Architecto', main:'Pending', color:'warning', src1:ImagesData('users2')},
    {id:3, heading:'Myrta Powe', class:'Nemo Enim Ipsam Voluptatem Quia Voluptas', class1:'Vero Eos Et Accusamus Et Iusto Odio  Dignissimos', main:'Pending', color:'warning', src1:ImagesData('users3')},
    {id:4, heading:'Consuelo Valenzuela', class:'Ut Enim Ad Minima Veniam Nostrum Exercitationem', class1:'Quis Autem Vel Eum Iure Reprehrighterit Qui', main:'Delay', color:'danger', src1:ImagesData('users4')},
    {id:5, heading:'Carolyne Wirtz', class:'I Must Explain To You How All This Mistaken', class1:'I Will Give You A Complete Account Of The System', main:'Done', color:'success', src1:ImagesData('users5')},
    {id:6, heading:'Archie Kesler', class:'Rationally Encounter Quences Extremely Painful', class1:'Which Of Us Ever Undertakes Laborious Physical', main:'Delay', color:'danger', src1:ImagesData('users6')},
]