//PANEL WITH HEADING
interface panelHeading {
    id: number
    heading: string
}
export const panelHeadings : panelHeading[]=[
    {id:1, heading:'Panel heading without title'},
    {id:2, heading:'Panel title'},
]
//HEADER PANEL
interface headerpanel {
    id: number
    color: string
}
export const headerpanels: headerpanel[]=[
    {id:1, color:"primary"},
    {id:2, color:"secondary"},
    {id:3, color:"success"},
    {id:4, color:"danger"},

]