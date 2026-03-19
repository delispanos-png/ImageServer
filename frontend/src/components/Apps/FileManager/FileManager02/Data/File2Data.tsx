
import media1 from '../../../../../assets/images/media/1.jpg';
import ReactApexChart from 'react-apexcharts';
import { Component } from 'react';
import { ImagesData } from '../../../../../CommonComponents/Images/CommonImages';



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
//ALL FILES
interface allfiles {
    id: number
    heading: string
    src1: string
    main: string
    class: string
    class1: string
}
export const allfile: allfiles[]=[
    {id:1, heading:'document.pdf', class:'10 Jan 2021', class1:'pdf', main:'453kb', src1:ImagesData('pngs2')},
    {id:2, heading:'Images', class:'09 Feb 2021', class1:'', main:'3.45gb', src1:ImagesData('pngs4')},
    {id:3, heading:'Videos', class:'01 Mar 2021', class1:'', main:'1.23gb', src1:ImagesData('pngs4')},
    {id:4, heading:'Documents', class:'03 Mar 2021', class1:'', main:'1.65gb', src1:ImagesData('pngs4')},
    {id:5, heading:'Music', class:'	09 Mar 2021', class1:'', main:'890mb', src1:ImagesData('pngs4')},
    {id:5, heading:'Downloads', class:'	09 Mar 2021', class1:'', main:'1.45gb', src1:ImagesData('pngs4')},
    {id:6, heading:'Image', class:'11 Apr 2021', class1:'jpg', main:'1gb', src1:media1},
    {id:7, heading:'Fiel document', class:'11 Apr 2021', class1:'', main:'11gb', src1:ImagesData('pngs4')},
    {id:8, heading:'New folder', class:'12 Apr 2021', class1:'', main:'1.24gb', src1:ImagesData('pngs4')},
    {id:9, heading:'Word Document', class:'09 May 2021', class1:'	Ms Word Document', main:'54kb', src1:ImagesData('pngs6')},
    {id:10, heading:'Pdfdocument', class:'09 May 2021', class1:'pdf', main:'34kb', src1:ImagesData('pngs2')},

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