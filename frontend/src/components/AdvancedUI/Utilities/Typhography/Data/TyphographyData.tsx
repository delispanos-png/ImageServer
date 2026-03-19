//Simple badges
interface header {
    id: number
    heading: string
    class: string
    class1: string
    class2:string
    class3: string
    class4: string
    class5: string
    color: string
    color1: string
    color2: string
    color3: string
    color4: string
    color5: string


}
export const headers: header[]=[
    {id:1, heading:'DEFAULT HEADING TEXT', class:'h1.Haeding', class5:'h1.Haeding', class1:'h1.Haeding',class2:'h1.Haeding',class3:'h1.Haeding', class4:'h1.Haeding',color:'',color1:'',color2:'',color3:'',color4:'',color5:'',},
    {id:2, heading:'HEADING WITH COLOR TEXT', class:'h1.Haeding', class5:'h1.Haeding', class1:'h1.Haeding',class2:'h1.Haeding',class3:'h1.Haeding', class4:'h1.Haeding',color:'text-primary',color1:'text-info',color2:'text-success',color3:'text-danger',color4:'text-secondary',color5:'text-warning',},
   
]
//Font color
interface font {
    id: number
    color:string
}
export const fonts: font[]=[
    {id:1, color:'primary'},
    {id:2, color:'secondary'},
    {id:3, color:'info'},
    {id:4, color:'success'},
    {id:5, color:'warning'},
    {id:6, color:'danger'},
    {id:7, color:'purple'},
    {id:8, color:'orange'},
]
//
interface size {
    id: number
    class:string
}
export const sizes: size[]=[
    {id:1, class:'fs-10'},
    {id:2, class:'fs-11'},
    {id:3, class:'fs-12'},
    {id:4, class:'fs-13'},
    {id:5, class:'fs-14'},
    {id:6, class:'fs-15'},
    {id:7, class:'fs-16'},
    {id:8, class:'fs-17'},
    {id:9, class:'fs-18'},
    {id:10, class:'fs-19'},
    {id:11, class:'fs-20'},
]
//Quoit
interface quoit {
    id: number
    class: string
    data: string
}
export const quoits: quoit[]=[
    {id:1, class:'QUOIT LEFT', data:''},
    {id:1, class:'QUOIT CENTER', data:'text-center'},
]