//CARD WITH ALERT
interface cardalert {
    id: number
    heading: string
    color: string
    class: string
}
export const caredalerts : cardalert[]=[
    {id:1, heading:'Adding action was successful', color:'success', class:'Duis aute irure dolor in reprehrighterit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'},
    {id:2, heading:'Adding action failed', color:'danger', class:'No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful actual teachings of the great explorer'},

]
//BASIC CARD
interface basiccard {
    id:number
    heading: string
}
export const basiccards : basiccard[]=[
    {id:1, heading:'BASIC CARD'},
    {id:2, heading:'BASIC CARD'},
]
//CARD WITH LOADER
interface cardloader {
    id: number
    spinner: string
}
export const cardloaders: cardloader [] =[
    {id:1, spinner:'spinner'},
    {id:2, spinner:'spinner1'},
]