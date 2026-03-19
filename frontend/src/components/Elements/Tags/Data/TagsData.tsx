import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'


//AVATAR TAG
interface avatarTag {
    id: number
    src1: string
    heading: string
}
export const avatarTags : avatarTag[]=[
    {id:1, src1:ImagesData('users1'), heading:'Victoria'},
    {id:2, src1:ImagesData('users4'), heading:'Nathan'},
    {id:3, src1:ImagesData('users6'), heading:'	Alice'},
    {id:4, src1:ImagesData('users7'), heading:'Rose'},
    {id:5, src1:ImagesData('users9'), heading:'	Peter'},
    {id:6, src1:ImagesData('users11'), heading:'	Wayne'},
    {id:7, src1:ImagesData('users12'), heading:'Michelle'},
    {id:8, src1:ImagesData('users14'), heading:'Debra'},

]
//COLOR TAG
interface colorTag {
    id: number
    heading: string
    color:string
}
export const colortags : colorTag[]=[
{id:1, heading:'Blue tag', color:'blue'},
{id:2, heading:'Azure tag', color:'azure'},
{id:3, heading:'Indigo tag', color:'indigo'},
{id:4, heading:'Purple tag', color:'purple'},
{id:5, heading:'Pink tag', color:'pink'},
{id:6, heading:'Red tag', color:'red'},
{id:7, heading:'Orange tag', color:'orange'},
{id:8, heading:'Yellow tag', color:'yellow'},
{id:9, heading:'Lime tag', color:'lime'},
{id:10, heading:'Green tag', color:'green'},
{id:11, heading:'Teal tag', color:'teal'},
{id:12, heading:'Cyan tag', color:'cyan'},
{id:13, heading:'Gray tag', color:'gray'},
{id:14, heading:'Dark gray tag', color:'dark gray'},

]
//LIST OF TAGS
interface listTag {
    id: number
    heading: string
}
export const listTags : listTag[]=[
    {id:1, heading:'One'},
    {id:2, heading:'Two'},
    {id:3, heading:'Three'},
    {id:4, heading:'Four'},
    {id:5, heading:'Five'},
    {id:6, heading:'Six'},
    {id:7, heading:'Seven'},
    {id:8, heading:'Eight'},
    {id:9, heading:'Nine'},
    {id:10, heading:'Ten'},
    {id:11, heading:'Eleven'},
    {id:12, heading:'Twelve'},
    {id:13, heading:'Thirteen'},
    {id:14, heading:'Fourteen'},
    {id:15, heading:'Fivteen'},
    {id:16, heading:'Sixteen'},
    {id:17, heading:'Seventeen'},
    {id:18, heading:'Eighteen'},
    {id:19, heading:'Ninteen'},
    {id:20, heading:'Twenty'},

]