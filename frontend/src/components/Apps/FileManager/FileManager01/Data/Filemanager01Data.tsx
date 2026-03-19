import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';
import media1 from '../../../../../assets/images/media/1.jpg';
import { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

//FILE MANAGER
interface filemanager {
    id: number
    heading: string
    icon: JSX.Element
}
export const filemanagers : filemanager[]=[
    {id:1, heading:'Images', icon:<i className="fe fe-image fs-18 me-2"></i>},
    {id:2, heading:'Videos', icon:<i className="fe fe-video fs-18 me-2"></i>},
    {id:3, heading:'Docs', icon:<i className="fe fe-file-text fs-18 me-2"></i>},
    {id:4, heading:'Music', icon:<i className="fe fe-music fs-18 me-2"></i>},
    {id:5, heading:'APKs', icon: <i className="fe fe-smartphone fs-18 me-2"></i>},
    {id:6, heading:'Downloads', icon:<i className="fe fe-download fs-18 me-2"></i>},
    {id:7, heading:'More', icon:<i className="fe fe-grid fs-18 me-2"></i>},
    {id:8, heading:'Hidden Files', icon:<i className="fe fe-lock fs-18 me-2"></i>},

]
//FILE MANAFER1
interface filemanager1 {
    id: number
    heading: string
    color: string
}
export const filemanagers1: filemanager1[]=[
    {id:1, heading:'Remote Control',color:'primary'},
    {id:2, heading:'Google Drive',color:'secondary'},
    {id:3, heading:'FTP Files',color:'success'},
    {id:4, heading:'Transfer files',color:'info'},
    {id:5, heading:'Deep Clean',color:'warning'},
    {id:6, heading:'Favourities',color:'danger'},
    {id:7, heading:'Settings',color:'primary'},
]
//RECENT FILES
interface recentfiles {
    id: number
    heading: string
    icon:JSX.Element
    class: string
    main: string
}
export const recentfile: recentfiles[]=[
    {id:1, heading:'Image', icon:<i className="fe fe-image fs-18 me-2"></i>, class:'Last Opened 32 mins ago', main:'14.2 mb'},
    {id:2, heading:'Document', icon:<i className="fe fe-file-text fs-18 me-2"></i>, class:'Last Opened 2 hrs ago', main:'34 mb'},
    {id:3, heading:'APK', icon:<i className="fe fe-smartphone fs-18 me-2"></i>, class:'Last Opened 22 mins ago ago', main:'550mb'},
    {id:4, heading:'Image', icon:<i className="fe fe-image fs-18 me-2"></i>, class:'Last Opened 12secs ago', main:'10.8 mb'},
    {id:5, heading:'Video', icon:<i className="fe fe-video fs-18 me-2"></i>, class:'Last Opened 22 hrs ago', main:'212 mb'},
    {id:6, heading:'Apk', icon:<i className="fe fe-smartphone fs-18 me-2"></i>, class:'Last Opened 2 hrs ago', main:'1.5 mb'},
    {id:7, heading:'Music', icon:<i className="fe fe-music fs-18 me-2"></i>, class:'Last Opened 25 mins ago', main:'15 mb'},

]
//FOLDERS
interface folder {
    id: number
    heading: string
    src1: any
    main: string
    icon1: string
   data: any
}
let png = <i className="fa fa-music text-secondary"></i>
export const folders : folder[]=[
    {id:1,data: "", heading:'document.pdf', src1:ImagesData('pngs2'), main:'23kb', icon1:"share"},
    {id:2,data: "", heading:'Images', src1:ImagesData('pngs4'), main:'1.23gb', icon1:"share"},
    {id:3,data: "", heading:'Music', src1:ImagesData('pngs4'), main:'897mb', icon1:"share"},
    {id:4,data: "", heading:'Downloads', src1:ImagesData('pngs4'), main:'453kb', icon1:"share"},
    {id:5,data: "", heading:'Videos', src1:ImagesData('pngs4'), main:'1.5gb', icon1:"share"},
    {id:6,data: "", heading:'Documents', src1:ImagesData('pngs4'), main:'234mb', icon1:"share"},
    {id:8,data: "", heading:'image.jpg', src1:ImagesData('media1'), main:'65kb', icon1:"share",},
    {id:9,data: "", heading:'File documents', src1:ImagesData('pngs4'), main:'1.23gb', icon1:"share",},
    {id:10,data: "", heading:'New folder', src1:ImagesData('pngs4'), main:'897mb', icon1:"share"},
    {id:11,data: "", heading:'Word document', src1:ImagesData('pngs6'), main:'23kb', icon1:"share"},
    {id:12,data: "", heading:'document.pdf', src1:ImagesData('pngs2'), main:'23kb', icon1:"share"},  
]
  //Circle
  export class ApexChart extends Component<{}, { options: any, series: any }>  {
    constructor(props) {
      super(props);
    this.state = {
          
      series: [85],
      options: {
        chart: {
          height: 10,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '55%',
              
            },
            dataLabels: {
              name: {
                fontSize: '22px',
                
              }, 
              value: {
                offsetY: -10,
                fontSize: '16px',
              },
              total: {
                show: false,
                label: 'Total',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 249
                }
              }
            }
          }
        },
        labels: [''],
        colors: ["#38cb89"],
      },
    
    
    };
  }

    render() {
      return (
        

  <div className="mx-auto chart-circle chart-circle-md  mt-sm-0 mb-0" id="chart8">
<ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={120} />

</div>
      )
    }
    };