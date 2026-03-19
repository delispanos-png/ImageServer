
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';


//COLOUR SQUARE FILEATTACHMENT
interface squarecolor {
    id: number
    heading: string
    color: string
    color1: string
    img: string
}
export const squarecolors : squarecolor[]=[
    {id:1, heading:' Image_file.jpg', color:'primary', color1:'primary', img:'mdi mdi-file-image'},
    {id:2, heading:' Word_file.doc', color:'secondary' , color1:'secondary', img:'mdi mdi-file-word'},
    {id:3, heading:' Excel_file.xls', color:'success', color1:'success', img:'mdi mdi-file-excel'},
    {id:4, heading:'  pdf_file.pdf', color:'warning', color1:'warning', img:'mdi mdi-file-pdf'},
    {id:5, heading:'Video_file.mp4', color:'danger', color1:'danger', img:'mdi mdi-file-video'},
    {id:6, heading:'Audio_file.mp3', color:'info', color1:'info', img:'mdi mdi-file-music'},   
]
//COLOUR ROUND FILEATTACHMENT
interface roundcolor {
    id: number
    heading: string
    color: string
    color1: string
    img: string
}
export const roundcolors : roundcolor[]=[
    {id:1, heading:' Image_file.jpg', color:'primary', color1:'primary', img:'mdi mdi-file-image'},
    {id:2, heading:' Word_file.doc', color:'secondary' , color1:'secondary', img:'mdi mdi-file-word'},
    {id:3, heading:' Excel_file.xls', color:'success', color1:'success', img:'mdi mdi-file-excel'},
    {id:4, heading:'  pdf_file.pdf', color:'warning', color1:'warning', img:'mdi mdi-file-pdf'},
    {id:5, heading:'Video_file.mp4', color:'danger', color1:'danger', img:'mdi mdi-file-video'},
    {id:6, heading:'Audio_file.mp3', color:'info', color1:'info', img:'mdi mdi-file-music'},   
]
//OUTLINE SQUARE FILE ATTACHMENT
interface outlinecolor {
    id: number
    heading: string
    color: string
    color1: string
    img: string
}
export const outlinecolors : outlinecolor[]=[
    {id:1, heading:' Image_file.jpg', color:'outline-primary', color1:'outline-primary', img:'mdi mdi-file-image'},
    {id:2, heading:' Word_file.doc', color:'outline-secondary' , color1:'outline-secondary', img:'mdi mdi-file-word'},
    {id:3, heading:' Excel_file.xls', color:'outline-success', color1:'outline-success', img:'mdi mdi-file-excel'},
    {id:4, heading:'  pdf_file.pdf', color:'outline-warning', color1:'outline-warning', img:'mdi mdi-file-pdf'},
    {id:5, heading:'Video_file.mp4', color:'outline-danger', color1:'outline-danger', img:'mdi mdi-file-video'},
    {id:6, heading:'Audio_file.mp3', color:'outline-info', color1:'outline-info', img:'mdi mdi-file-music'},   
]
//OUTLINE ROUND FILE ATTACHMENT
interface outlineroundcolor {
    id: number
    heading: string
    color: string
    color1: string
    img: string
}
export const outlineroundcolors : outlineroundcolor[]=[
    {id:1, heading:' Image_file.jpg', color:'outline-primary', color1:'outline-primary', img:'mdi mdi-file-image'},
    {id:2, heading:' Word_file.doc', color:'outline-secondary' , color1:'outline-secondary', img:'mdi mdi-file-word'},
    {id:3, heading:' Excel_file.xls', color:'outline-success', color1:'outline-success', img:'mdi mdi-file-excel'},
    {id:4, heading:'  pdf_file.pdf', color:'outline-warning', color1:'outline-warning', img:'mdi mdi-file-pdf'},
    {id:5, heading:'Video_file.mp4', color:'outline-danger', color1:'outline-danger', img:'mdi mdi-file-video'},
    {id:6, heading:'Audio_file.mp3', color:'outline-info', color1:'outline-info', img:'mdi mdi-file-music'},   
]
//TRANSPERANT SQUARE FILEATTACHMENT
interface transperantcolor {
    id: number
    heading: string
    color: string
    color1: string
    img: string
}
export const transperantcolors : transperantcolor[]=[
    {id:1, heading:' Image_file.jpg', color:'primary', color1:'primary', img:'mdi mdi-file-image'},
    {id:2, heading:' Word_file.doc', color:'secondary' , color1:'secondary', img:'mdi mdi-file-word'},
    {id:3, heading:' Excel_file.xls', color:'success', color1:'success', img:'mdi mdi-file-excel'},
    {id:4, heading:'  pdf_file.pdf', color:'warning', color1:'warning', img:'mdi mdi-file-pdf'},
    {id:5, heading:'Video_file.mp4', color:'danger', color1:'danger', img:'mdi mdi-file-video'},
    {id:6, heading:'Audio_file.mp3', color:'info', color1:'info', img:'mdi mdi-file-music'},   
]
//TRANSPERANT ROUND FILEATTACHMENT
interface transperantcolors {
    id: number
    heading: string
    color: string
    color1: string
    img: string
}
export const transperantcolorss : transperantcolors[]=[
    {id:1, heading:' Image_file.jpg', color:'primary', color1:'primary', img:'mdi mdi-file-image'},
    {id:2, heading:' Word_file.doc', color:'secondary' , color1:'secondary', img:'mdi mdi-file-word'},
    {id:3, heading:' Excel_file.xls', color:'success', color1:'success', img:'mdi mdi-file-excel'},
    {id:4, heading:'  pdf_file.pdf', color:'warning', color1:'warning', img:'mdi mdi-file-pdf'},
    {id:5, heading:'Video_file.mp4', color:'danger', color1:'danger', img:'mdi mdi-file-video'},
    {id:6, heading:'Audio_file.mp3', color:'info', color1:'info', img:'mdi mdi-file-music'},   
]
//IMAGE FILE ATTACHMENT
interface imagefile {
    id: number
    heading: string
    src1: string
}
export const imagefiles : imagefile[]=[
    {id:1, heading:'Image01.jpg', src1:ImagesData('media49')},
    {id:2, heading:'Image02.jpg', src1:ImagesData('media45')},
    {id:3, heading:'Image03.jpg', src1:ImagesData('media46')},
    {id:4, heading:'Image04', src1:ImagesData('media47')},
    {id:5, heading:'Image05.jpg', src1:ImagesData('media48')},
    {id:6, heading:'Image06.jpg', src1:ImagesData('media44')},

]
//IMAGE SMALL  FILE ATTACHMENT
interface imagesmallfile {
    id: number
    heading: string
    src1: string
}
export const imagesmallfiles : imagesmallfile[]=[
    {id:1, heading:'Image01.jpg', src1:ImagesData('media49')},
    {id:2, heading:'Word.doc', src1:ImagesData('pngs1')},
    {id:3, heading:'Excel.xls', src1:ImagesData('pngs3')},
    {id:4, heading:'Document.pdf', src1:ImagesData('pngs2')},
    {id:5, heading:'Image02.jpg', src1:ImagesData('pngs8')},
    

]
//IMAGE MEDIUM  FILE ATTACHMENT
interface imagemediumfile {
    id: number
    heading: string
    src1: string
}
export const imagemediumfiles : imagemediumfile[]=[
    {id:1, heading:'Image01.jpg', src1:ImagesData('media49')},
    {id:2, heading:'Word.doc', src1:ImagesData('pngs1')},
    {id:3, heading:'Excel.xls', src1:ImagesData('pngs3')},
    {id:4, heading:'Document.pdf', src1:ImagesData('pngs2')},
    {id:5, heading:'Image02.jpg', src1:ImagesData('pngs8')},
    

]
//IMAGE LARGE  FILE ATTACHMENT
interface imagelargefile {
    id: number
    heading: string
    src1: string
}
export const imagelargefiles : imagelargefile[]=[
    {id:1, heading:'Image01.jpg', src1:ImagesData('media49')},
    {id:2, heading:'Word.doc', src1:ImagesData('pngs1')},
    {id:3, heading:'Excel.xls', src1:ImagesData('pngs3')},
    {id:4, heading:'Document.pdf', src1:ImagesData('pngs2')},
    {id:5, heading:'Image02.jpg', src1:ImagesData('pngs8')},
    

]