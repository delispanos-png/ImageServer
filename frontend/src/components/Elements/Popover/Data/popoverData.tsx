import { Placement } from "react-bootstrap/esm/types"

//DEFAULT POPOVER
interface defaultpopovers {
    id: number
    placement?: Placement
    heading: string
}
export const defaultpopover : defaultpopovers[] = [
    {id:1, placement:'top', heading:'popover top'},
    {id:2, placement:'bottom', heading:'popover bottom'},
    {id:3, placement:'right', heading:'popover right'},
    {id:4, placement:'left', heading:'popover left'},

]
//HEAD POPOVER
interface headpopovers {
    id: number
    placement?: Placement
    heading: string
  
}
export const headpopover : headpopovers[] = [
    {id:1, placement:'top', heading:'popover top'},
    {id:2, placement:'bottom', heading:'popover bottom'},
    

]
//COLORED POPOVER
interface coloredpopovers {
    id: number
    placement?: Placement
    heading: string
    color:string
  
}
export const coloredpopover : coloredpopovers[] = [
    {id:1, placement:'top', heading:'popover top', color:'primary'},
    {id:2, placement:'bottom', heading:'popover bottom', color:'secondary'},
    

]