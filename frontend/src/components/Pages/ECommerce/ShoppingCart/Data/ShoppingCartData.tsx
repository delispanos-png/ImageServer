
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';


interface cart {
    id: number
    src1: string
    heading: string
    text: string
}
export const carts: cart []=[
    {id:1, src1:ImagesData('products16'), heading:'Book', text:'$411'},
    {id:2, src1:ImagesData('products14'), heading:'Shoes', text:'$5436'},
    {id:3, src1:ImagesData('products15'), heading:'Watch', text:'$540'},
    {id:4, src1:ImagesData('products12'), heading:'Cosmetics', text:'$1543'},
    {id:5, src1:ImagesData('products18'), heading:'Head set', text:'$6427'},
    {id:6, src1:ImagesData('products19'), heading:'Ear Burds', text:'$67'},
    {id:7, src1:ImagesData('products20'), heading:'Smart Watch', text:'$427'},
    {id:8, src1:ImagesData('products21'), heading:'Canvas Sheos', text:'$647'},
]