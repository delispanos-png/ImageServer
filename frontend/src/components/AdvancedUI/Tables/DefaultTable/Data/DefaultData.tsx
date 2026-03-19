//Default table
interface table {
    id: number
    heading: string
    color: string
    class: string
    data: string
}
export const tables : table []=[
    {id:1, heading:'BASIC TABLE', color:'', class:'', data:''},
    {id:2, heading:'STRIPED ROWS', color:'light', class:'', data:'table-striped'},
    {id:3, heading:'BORDERED TABLE', color:'', class:'border-top', data:'table-bordered'},

]
//color tables
interface colortable {
    id: number 
    heading: string
    color: string
}
export const colortables: colortable[]=[
    {id:1, heading:'PRIMARY TABLE', color:'primary'},
    {id:2, heading:'SUCCESS TABLE', color:'success'},
    {id:3, heading:'WARNING TABLE', color:'warning'},
    {id:4, heading:'DANGER TABLE', color:'danger'},
    {id:5, heading:'INFO TABLE', color:'info'},
]