import { ImagesData } from '../../../../CommonComponents/Images/CommonImages'



//SQUARE AVATAR
interface squareAvatars {
    id:number
    src1: string
   
}
export const squareAvatar : squareAvatars[]=[
    {id:1, src1:ImagesData('users1')},
    {id:2, src1:ImagesData('users2')},
    {id:3, src1:ImagesData('users1')},
    {id:4, src1:ImagesData('users2')},
    {id:5, src1:ImagesData('users3')},

]
//ROUND AVATAR
interface roundAvatars {
    id:number
    src1: string
   
}
export const roundAvatar : roundAvatars[]=[
    {id:1, src1:ImagesData('users1')},
    {id:2, src1:ImagesData('users2')},
    {id:3, src1:ImagesData('users1')},
    {id:4, src1:ImagesData('users2')},
    {id:5, src1:ImagesData('users3')},

]
//RADIUS AVATAR
interface radiusAvatars {
    id:number
    src1: string
   
}
export const radiusAvatar : radiusAvatars[]=[
    {id:1, src1:ImagesData('users1')},
    {id:2, src1:ImagesData('users2')},
    {id:3, src1:ImagesData('users1')},
    {id:4, src1:ImagesData('users2')},
    {id:5, src1:ImagesData('users3')},

]
//SIZE AVATAR
interface sizeAvatars {
    id:number
    src1: string
   size: string
}
export const sizeAvatar : sizeAvatars[]=[
    {id:1, src1:ImagesData('users4'), size:'me-2 avatar avatar-sm'},
    {id:1, src1:ImagesData('users3'), size:'me-2 avatar'},
     {id:2, src1:ImagesData('users5'), size:'me-2 avatar avatar-md'},
    {id:3, src1:ImagesData('users6'), size:'me-2 avatar avatar-lg'},
    {id:4, src1:ImagesData('users4'), size:'me-2 avatar avatar-xl'},
    {id:5, src1:ImagesData('users7'), size:'me-2 avatar avatar-xxl'},

]
// ROUNDED AVATAR SIZES
interface avatarsizes {
    id:number
    src1: string
   size: string
}
export const avatarsize : avatarsizes[]=[
    {id:1, src1:ImagesData('users15'), size:'me-2 avatar avatar-sm'},
    {id:1, src1:ImagesData('users13'), size:'me-2 avatar'},
    {id:2, src1:ImagesData('users16'), size:'me-2 avatar  avatar-md'},
    {id:3, src1:ImagesData('users7'), size:'me-2 avatar avatar-lg'},
    {id:4, src1:ImagesData('users14'), size:'me-2 avatar avatar-xl'},
    {id:5, src1:ImagesData('users8'), size:'me-2 avatar avatar-xxl'},

]
// RADIUS AVATAR SIZES
interface avatarradiuss {
    id:number
    src1: string
   size: string
}
export const avatarradius : avatarradiuss[]=[
    {id:1, src1:ImagesData('users15'), size:'me-2 avatar avatar-sm'},
    {id:1, src1:ImagesData('users13'), size:'me-2 avatar'},
    {id:2, src1:ImagesData('users16'), size:'me-2 avatar  avatar-md'},
    {id:3, src1:ImagesData('users7'), size:'me-2 avatar avatar-lg'},
    {id:4, src1:ImagesData('users14'), size:'me-2 avatar avatar-xl'},
    {id:5, src1:ImagesData('users8'), size:'me-2 avatar avatar-xxl'},

]
//AVATAR STATUS
interface statusAvatars {
    id: number
    src1: string
    size: string
}
export const statusavatar: statusAvatars[]=[
    {id:1, src1:ImagesData('users8'), size:''},
    {id:2, src1:ImagesData('users5'), size:'avatar-status'},
    {id:3, src1:ImagesData('users9'), size:'avatar-status bg-red'},
    {id:4, src1:ImagesData('users6'), size:'avatar-status bg-green'},
    {id:5, src1:ImagesData('users7'), size:'avatar-status bg-yellow'},
]
// ROUND AVATAR STATUS
interface statusroundAvatars {
    id: number
    src1: string
    size: string
}
export const statusroundavatar: statusroundAvatars[]=[
    {id:1, src1:ImagesData('users9'), size:''},
    {id:2, src1:ImagesData('users15'), size:'avatar-status'},
    {id:3, src1:ImagesData('users2'), size:'avatar-status bg-red'},
    {id:4, src1:ImagesData('users16'), size:'avatar-status bg-green'},
    {id:5, src1:ImagesData('users7'), size:'avatar-status bg-yellow'},
]

// RADIUS AVATAR STATUS
interface statusradiusAvatars {
    id: number
    src1: string
    size: string
}
export const statusradiusavatar: statusradiusAvatars[]=[
    {id:1, src1:ImagesData('users9'), size:''},
    {id:2, src1:ImagesData('users15'), size:'avatar-status'},
    {id:3, src1:ImagesData('users2'), size:'avatar-status bg-red'},
    {id:4, src1:ImagesData('users16'), size:'avatar-status bg-green'},
    {id:5, src1:ImagesData('users7'), size:'avatar-status bg-yellow'},
]
//AVATAR LIST
interface avatarLists {
    id: number
    src1: string
}
export const avatarList :avatarLists[]=[
    {id:1, src1:ImagesData('users10')},
    {id:2, src1:ImagesData('users8')},
    {id:3, src1:ImagesData('users9')},
    {id:4, src1:ImagesData('users10')},
    {id:5, src1:ImagesData('users11')},

]
//AVATAR ROUND LIST
interface avatarroundLists {
    id: number
    src1: string
}
export const avatarroundList :avatarroundLists[]=[
    {id:1, src1:ImagesData('users10')},
    {id:2, src1:ImagesData('users8')},
    {id:3, src1:ImagesData('users9')},
    {id:4, src1:ImagesData('users10')},
    {id:5, src1:ImagesData('users11')},

]
//AVATAR RADIUS LIST
interface avatarradiusLists {
    id: number
    src1: string
}
export const avatarradiusList :avatarradiusLists[]=[
    {id:1, src1:ImagesData('users10')},
    {id:2, src1:ImagesData('users8')},
    {id:3, src1:ImagesData('users9')},
    {id:4, src1:ImagesData('users10')},
    {id:5, src1:ImagesData('users11')},

]