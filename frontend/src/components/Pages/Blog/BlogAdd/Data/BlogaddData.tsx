
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';

//Blog add
interface blogadd {
    id: number
    src1: string
    heading: string
    text: string
    color: string
}
export const blogadds: blogadd[]=[
    {id:1, src1:ImagesData('media3'), heading:'Generator on the Internet..', text:'Lifestyle', color: 'danger'},
    {id:2, src1:ImagesData('media1'), heading:'Voluptatem quiavoluptas..', text:'Business', color: 'primary'},
    {id:3, src1:ImagesData('media1'), heading:'Generator on the Internet..', text:'Travel', color: 'info'},
    {id:4, src1:ImagesData('media4'), heading:'Voluptatem quiavoluptas..', text:'Meeting', color: 'success'},
]
//personal blog
interface personal {
    id: number
    src1: string
    heading: string
}
export const personals: personal[]=[
    {id:1, src1:ImagesData('users6'), heading:'John Paige'},
    {id:2, src1:ImagesData('users9'), heading:'Peter Hill'},
    {id:3, src1:ImagesData('users11'), heading:'Irene Harris'},
    {id:4, src1:ImagesData('users16'), heading:'Harry Fisher'},
]
//Add New Post 
interface post {
    id: number
    value:string
    label: string
}
export const posts: post []=[
    {id:1,value:'br', label:'Technology'},
    {id:2,value:'cz', label:'Travel'},
    {id:3,value:'de', label:'Food'},
    {id:4,value:'pl', label:'Fashion'},
]