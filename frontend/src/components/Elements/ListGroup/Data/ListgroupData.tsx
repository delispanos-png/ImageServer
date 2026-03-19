//List
interface Lists {
    title: string
    item: string
    item1: string
    item2: string
    item3: string
    item4: string
    active: string
}
export const List: Lists[] = [
    {title:'BASIC LIST GROUP', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', active:''},
    {title:'ACTIVE LIST ITEM', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', active:'active'},

]

//List1
interface Lists1 {
    title: string
    item: string
    item1: string
    item2: string
    item3: string
    item4: string
    color: string
}
export const List1: Lists1[] = [
    {title:'DEFAULT ACTIVE LINK LIST', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', color:'default'},
    {title:'PRIMARY ACTIVE LINK LIST', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', color:'primary'},
    {title:'SUCCESS ACTIVE LINK LIST', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', color:'success'},
    {title:'INFO ACTIVE LINK LIST', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', color:'info'},
    {title:'WARNING ACTIVE LINK LIST', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', color:'warning'},
    {title:'LIST STYLES', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', color:'danger'},

]
//List Item
interface listItems {
    title: string
    item: string
    item1: string
    item2: string
    item3: string
    item4: string
    class: string
    color: string
    color1: string
    color2: string
    color3: string
    
}
export const listitem: listItems[] = [
    {title:'DISABLED LIST ITEM', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', class:'disabled', color:'', color1:'', color2:'', color3:''},
    {title:'CONTEXTUAL CLASSNAMEES WITH LIST GROUP', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', class:'', color:'success', color1:'info', color2:'warning', color3:'danger'},

]
//List Group
interface listGrops {
    title: string
    item: string
    item1: string
    item2: string
    item3: string
    item4: string
    icon: JSX.Element
    icon1: JSX.Element
    icon2: JSX.Element
    icon3: JSX.Element
    icon4: JSX.Element
}
export const listGroup: listGrops[] = [
    {title:'LIST GROUP WITH ICONS', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', icon:<i className="fa fa-check me-2" aria-hidden="true"></i>, icon1:<i className="fa fa-check me-2" aria-hidden="true"></i>, icon2:<i className="fa fa-check me-2" aria-hidden="true"></i>, icon3:<i className="fa fa-check me-2" aria-hidden="true"></i>, icon4:<i className="fa fa-check me-2" aria-hidden="true"></i>},
    {title:'LIST GROUP WITH COLORED ICONS', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', item3:'Porta ac consectetur ac', item4:'Vestibulum at eros', icon:<i className="fa fa-cog text-primary me-2" aria-hidden="true"></i>, icon1:<i className="fa fa-cog text-danger me-2" aria-hidden="true"></i>, icon2:<i className="fa fa-cog text-success me-2" aria-hidden="true"></i>, icon3:<i className="fa fa-cog text-warning me-2" aria-hidden="true"></i>, icon4:<i className="fa fa-cog text-info me-2"	aria-hidden="true"></i>},
]
//List Badges
interface listBadges {
    title: string
    item: string
    item1: string
    item2: string
   class: string
   class1: string
   class2: string
   color:string
   color1:string
   color2:string
}
export const listBadge: listBadges[] = [
    {title:'LIST GROUP WITH DEFALUT BADGES', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', class:"14", class1:"2", class2:"1",color:'dark', color1:'dark', color2:'dark'},
    {title:'LIST GROUP WITH COLOR BADGES', item:'Cras justo odio', item1:'Dapibus ac facilisis in', item2:'Morbi leo risus', class:"14", class1:"2", class2:"1", color:'primary', color1:'danger', color2:'success'},
]
//Custom List
interface customLists {
    title: string
    heading: string
    heading1: string
    heading2: string
    description: string
    description1: string
    description2: string
    class: string
    class1: string
    class2: string
    data: string
    data1: string
    data2: string
   main1: string
main: string
}
export const customList: customLists[] = [
    {title:'LIST GROUP WITH CUSTOM CONTENT', heading:'List group item heading',heading1:'List group item heading', heading2:'List group item heading', description:'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', description1:'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', description2:'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', class:'Donec id elit non mi porta.', class1:'Donec id elit non mi porta.', class2:'Donec id elit non mi porta.', data:'3 days ago', data1:'3 days ago', data2:'3 days ago',  main:'active', main1:''},
    {title:'LIST GROUP WITH DISABLED CUSTOM CONTENT', heading:'List group item heading', heading1:'List group item heading', heading2:'List group item heading',description:'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', description1:'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', description2:'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',  class:'Donec id elit non mi porta.', class1:'Donec id elit non mi porta.', class2:'Donec id elit non mi porta.',  data:'3 days ago', data1:'3 days ago', data2:'3 days ago', main:'disabled', main1:'disabled'},
] 