
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';



//Category
interface product {
    value: number
    label: string
}
export const products: product[]=[
    {value:0, label:'Dress'},
    {value:1, label:'Dress'},
    {value:2, label:'Bags &amp; Purses'},
    {value:3, label:'Coat &amp; Jacket'},
    {value:4, label:'Beauty'},
    {value:5, label:'Jeans'},
    {value:6, label:'Jewellery'},
    {value:7, label:'Electronics'},
    {value:8, label:'Sports'},
    {value:9, label:'Technology'},
    {value:10, label:'Watches'},
    {value:11, label:'Accessories'},
]
//Brand
interface brand {
    value:number
    label: string
}
export const brands : brand[]=[
    {value:0, label:'Black'},
    {value:1, label:'White'},
    {value:2, label:'Black'},
    {value:3, label:'Red'},
    {value:4, label:'Green'},
    {value:5, label:'Blue'},
    {value:6, label:'Yellow'},
]
// images
interface image {
    id: number
    data: string
    heading: string
    text: string
    text1: string
    src1: string
}

export const images: image[]=[
    {id:1, data:'(23)', heading:'Beautiful Leather Hand Bag', text:'$2,498', text1:'$1,967', src1:ImagesData('products7') },
    {id:2, data:'(64)', heading:'Premium Desktop Design', text:'$2,999', text1:'$1,999', src1:ImagesData('products8') },
    {id:3, data:'(41)', heading:'Your Phone With Latest Android', text:'$2,499', text1:'$999', src1:ImagesData('products9') },
    {id:4, data:'(232)', heading:'Beautiful Flower vase', text:'$498', text1:'$225', src1:ImagesData('products1') },
    {id:5, data:'(143)', heading:'Leather Finished Chair For Home', text:'$298', text1:'$198', src1:ImagesData('products2')},
    {id:6, data:'(29)', heading:'Branded Shoes lFor men', text:'$2,999', text1:'$2,499', src1:ImagesData('products3') },
    {id:7, data:'(20)', heading:'Igono Laptop Ryzen5 Processor', text:'$3,498', text1:'$2,999', src1:ImagesData('products4')},
    {id:8, data:'(283)', heading:'Orange Smart Watch', text:'$2,498', text1:'$1,967', src1:ImagesData('products5')},
    {id:9, data:'(14)', heading:'Micon Camera With 10x Zoom', text:'$1,498', text1:'$1,299', src1:ImagesData('products6')},
]