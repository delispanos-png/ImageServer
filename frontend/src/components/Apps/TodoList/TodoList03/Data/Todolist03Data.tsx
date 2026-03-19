import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';
//TODOLIST03
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
    icon: string
    src1: string
}
export const listsdata: listdata[]=[
    {id:1, heading:' Newdocument.xls', icon:'file', src1:ImagesData('pngs3')},
    {id:2, heading:'Newdocument.xls', icon:'file', src1:ImagesData('pngs1')},
    {id:3, heading:' PDFdocument.xls', icon:'file', src1:ImagesData('pngs3')},
    {id:4, heading:' PPTdocument.xls', icon:'file', src1:ImagesData('pngs5')},
    {id:5, heading:'PTdocument.xls', icon:'file', src1:ImagesData('pngs6')},
    {id:6, heading:'ZIPFile.ZIP', icon:'file', src1:ImagesData('pngs7')},
    {id:7, heading:' PDFdocument.xls', icon:'file', src1:ImagesData('pngs3')},
    {id:8, heading:'XLSdocument.xls', icon:'file', src1:ImagesData('pngs2')},
    {id:9, heading:'XLSdocument.xls', icon:'file', src1:ImagesData('pngs2')},
    {id:10, heading:'XLSdocument.xls', icon:'file', src1:ImagesData('pngs1')},
    {id:11, heading:'XLSdocument.xls', icon:'file', src1:ImagesData('pngs5')},
    {id:12, heading:'XLSdocument.xls', icon:'file', src1:ImagesData('pngs5')},
]