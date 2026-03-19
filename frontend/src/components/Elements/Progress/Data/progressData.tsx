//BASIC PROGRESS
interface basicProgress {
    id: number
    width: number
    color: string
   
}
export const basicProgres: basicProgress[] =[
    {id:1, width:0, color:'primary'},
    {id:2, width:20, color:'primary'},
    {id:3, width:40, color:'primary'},
    {id:4, width:60, color:'primary'},
    {id:5, width:80, color:'primary'},
]
//Contextual PROGRESS
interface contextualProgress {
    id: number
    width: number
    color: string
}
export const contextualProgres: contextualProgress[] =[
    {id:1, width:7, color:'primary'},
    {id:2, width:20, color:'primary'},
    {id:3, width:40, color:'primary'},
    {id:4, width:60, color:'primary'},
    {id:5, width:80, color:'primary'},
]
//LABEL PROGRESS
 interface labelProgress {
    id: number
    width: number
    color: string
    label:string
   
 }
 export const labelProgres : labelProgress[] = [
    {id:1, color:'primary', width:7,label:"7%"  },
    {id:2, color:'primary', width:20,  label:"20%"},
    {id:3, color:'primary', width:40, label:"40%"},
    {id:4, color:'primary', width:60, label:"60%"},
    {id:5, color:'primary', width:80, label:"80%"},

 ]
 //LABEL PROGRESS
 interface labelsProgress {
    id: number
    width: number
    color: string
    label:string
    }
 export const labelsProgres : labelsProgress[] = [
    {id:1, color:'primary', width:7, label:"7%" },
    {id:2, color:'primary-1', width:20, label:"20%" },
    {id:3, color:'primary-2', width:40, label:"40%" },
    {id:4, color:'primary-3', width:60, label:"60%" },
    {id:5, color:'primary-4', width:80, label:"80%" },

 ]
 //SIZE PROGRESS
 interface sizeProgress {
    id: number
    width: number
    color: string
    label:string
    size: string
 }
 export const sizeProgres : sizeProgress[] = [
    {id:1, color:'primary', width:30, size:'xs mb-3', label:'' },
    {id:2, color:'primary', width:60, size:'sm mb-3',  label:'' },
    {id:3, color:'primary', width:70, label:'70%', size:'md mb-3'},
    {id:4, color:'primary', width:80, label:'80%', size:'lg'},
 ]
//MIXED PROGRESS
interface mixedProgress {
    id: number
    width: number
    width1: number
    width2: number
    color: string
    color1: string
    color2: string
    size: string
}
export const mixedProgres : mixedProgress[] = [
    {id:1, width:5, width1:5, width2:5, color:'primary', color1:'primary-1', color2:'primary-2', size:'xs mb-3'},
    {id:2, width:10, width1:15, width2:15, color:'danger', color1:'danger-1', color2:'danger-2', size:'sm mb-3'},
    {id:3, width:18, width1:20, width2:30, color:'warning', color1:'warning-1', color2:'warning-2', size:'md mb-3'},
    {id:4, width:30, width1:20, width2:40, color:'success', color1:'success-1', color2:'success-2', size:'lg '},

]
//STRIPPED PROGRESS
interface strippedProgress {
    id: number
    color: string
    width: number
    size: string
    label: string
    
}
export const strippedProgres : strippedProgress[] =[
    {id:1, color:'teal', width:15, size:'md mb-3', label:''},
    {id:2, color:'info', width:25, size:'md mb-3', label:'',},
    {id:3, color:'yellow', width:50, size:'md mb-3', label:'50%'},
    {id:4, color:'green', width:70, size:'md mb-3', label:'40%'},
]
//ANIMATED PROGRESS
interface animatedProgress {
    id: number
    color: string
    size: string
}
export const animatedProgres: animatedProgress[]=[
    {id:1, color:'primary', size:'md mb-3'},
    {id:2, color:'primary', size:'md mb-3'},
    {id:3, color:'primary', size:'md mb-3'},
    {id:4, color:'primary', size:'md mb-3'},

]