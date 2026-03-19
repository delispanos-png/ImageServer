//DEFAULT TOOLTIP

import { Placement } from "react-bootstrap/esm/types";

//** EXAMPLE
interface defaultTooltips {
    id: number
    placement?: Placement
    title: string
    heading: string
}
export const defaultTooltip: defaultTooltips[]=[
    {id:1, title:'Tooltip on top', heading:'Hover me', placement:'top'},
    {id:2, title:'Tooltip on bottom', heading:'Hover me', placement:'bottom'},
    {id:3, title:'Tooltip on left', heading:'Hover me', placement:'left'},
    {id:4, title:'Tooltip on right', heading:'Hover me', placement:'right'},
]
//COLOUR TOOLTIP
//** EXAMPLE
interface colorTooltips {
    id: number
    placement?: Placement
    title: string
    heading: string
    color: string
    color1: string
}
export const colorTooltip: colorTooltips[]=[
    {id:1, title:'Tooltip on top', heading:'Hover me', placement:'top', color:'primary', color1:'primary'},
    {id:2, title:'Tooltip on bottom', heading:'Hover me', placement:'bottom', color:'primary', color1:'primary'},
    {id:3, title:'Tooltip on left', heading:'Hover me', placement:'left', color:'primary', color1:'primary'},
    {id:4, title:'Tooltip on right', heading:'Hover me', placement:'right', color:'primary', color1:'primary'},
]
