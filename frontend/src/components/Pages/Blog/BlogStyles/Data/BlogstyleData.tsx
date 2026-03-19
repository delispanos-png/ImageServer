
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';




//Blog Style
interface blogstyle {
    id: number
    data: string
    src1: string
    heading: string
    text: string
    src2: string
    data1:string
}
export const blogstyles: blogstyle[]=[
    {id:1, data:'To take a trivial example, which of us ever undertakes laborious physical exerciser , except to obtain some', src1:ImagesData('users16'), heading:'MeganPeters', text:'1 days ago', src2:ImagesData('media13'), data1:'col-lg-6 col-xl-4'},
    {id:2, data:'Who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces.', src1:ImagesData('users16'), heading:'Anna Ogden', text:'2 days ago', src2:ImagesData('media14'), data1:'col-lg-6 col-xl-4'},
    {id:3, data:'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque...', src1:ImagesData('users14'), heading:'Carol Paige', text:'2 days ago', src2:ImagesData('media15'), data1:'col-lg-12 col-xl-4'},

]
//blogstyle01
interface blogstyle01 {
    id: number
    heading:string
    src1: string
    data1:string
}
export const blogstyles01: blogstyle01[]=[
    {id: 1, heading:'To take a trivial example which of us ever undertakes laborious physical exerciser  except to obtain some advantage from it...', src1:ImagesData('media8'), data1:'col-md-12 col-xl-4'},
    {id: 1, heading:'To take a trivial example, which of us ever undertakes laborious physical exerciser , except to obtain some advantage from it...', src1:ImagesData('media9'), data1:'col-md-6 col-xl-4'},
    {id: 1, heading:'To take a trivial example, which of us ever undertakes laborious physical exerciser , except to obtain some advantage from it...', src1:ImagesData('media10'), data1:'col-md-6 col-xl-4'},

]
//blogstyle03
 interface blogstyle03 {
    id: number
    heading: string
    data: string
    text: string
    src1: string
  data1:string
 }
 export const blogstyles03 : blogstyle03 []=[
    {id:1, heading:'annoying consequences', data:'Who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces.', text:'Anna Ogden', src1:ImagesData('users16'), data1:'col-md-6 col-xl-4'},
    {id:2, heading:'voluptatem quia voluptas.', data:'Who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces.', text:'Anna Ogden', src1:ImagesData('users16'), data1:'col-md-6 col-xl-4'},
    {id:3, heading:'voluptatem quia voluptas.', data:'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque...', text:'Carol Paige', src1:ImagesData('users14'), data1:'col-md-12 col-xl-4'},
 ]