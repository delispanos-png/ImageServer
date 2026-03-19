
import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { Button, Table } from 'react-bootstrap';
import { ImagesData } from '../../../CommonComponents/Images/CommonImages';

export class ApexChartscontent extends React.Component<{}, { options: any, series: any,}> {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'Net Profit',
          data: [22, 34, 56, 37, 35, 21, 34, 60, 78,56,53,89]
        }, {
          name: 'Sales',
          data: [42, 50, 70, 57, 55, 58, 43, 80, 21,23,34,77]
        },],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '30%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          },
          yaxis: {
            title: {
              // text: '$ (thousands)'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands"
              }
            }
          }
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
</div>
      )
    }
};

//Spark 1
export class Spark1 extends Component <{}, { options: any, series: any }>{
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Total Revenue',
            data: [0, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46]
          }],
      options: {
        chart: {
          type: 'area',
          height: 60,
      width: 150,
          sparkline: {
            enabled: true
          },
      dropShadow: {
        enabled: true,
        blur: 3,
        opacity: 0,
        show:false,
      }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1.5,
        dashArray: 0,
      },
        fill: {
          gradient: {
            enabled: false
          }
        },
       
        yaxis: {
          min: 0
        },
        colors: ['#fff'],
  
      }

    }
  }
  render() {
    return (
      

<div id="spark1">
<ReactApexChart options={this.state.options} series={this.state.series} height={60} width={100}/>

</div>
    )
  }
};
 //spark2
 export class Spark2 extends Component <{}, { options: any, series: any }>{
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Unique Visitors',
            data: [0, 45, 93, 53, 61, 27, 54, 43, 19, 46, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, ]
          }],
      options: {
        chart: {
          type: 'area',
          height: 60,
      width: 160,
          sparkline: {
            enabled: true
          },
      dropShadow: {
        enabled: true,
        blur: 10,
        opacity: 0,
      }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1.5,
        dashArray: 0,
      },
      fill: {
          gradient: {
            enabled: false
          }
        },
        
        yaxis: {
          min: 0
        },
        colors: ['#fff'],
  
      }

    }
  }
  render() {
    return (
      

<div id="spark2">
<ReactApexChart options={this.state.options} series={this.state.series} height={60} width={100}/>

</div>
    )
  }
};
//spark3
export class Spark3 extends Component <{}, { options: any, series: any }>{
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Expenses',
            data: [0, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46,45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51]
          }],
      options: {
        chart: {
          type: 'area',
          height: 60,
      width: 160,
          sparkline: {
            enabled: true
          },
      dropShadow: {
        enabled: true,
        blur: 10,
        opacity: 0,
      }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1,
        dashArray: 0,
      },
      fill: {
          gradient: {
            enabled: false
          }
        },
        yaxis: {
          min: 0
        },
        colors: ['#fff'],
      }

    }
  }
  render() {
    return (
      

<div id="spark3">
<ReactApexChart options={this.state.options} series={this.state.series} height={60} width={150}/>

</div>
    )
  }
};
//spark4
export class Spark4 extends Component <{}, { options: any, series: any }>{
  constructor(props) {
    super(props);

    this.state = {
    
      series: [{
        name: 'Total Revenue',
        data: [0, 45, 54, 38, 56, 24, 55, 31, 37, 39, 62, 51, 35, 41, 48, 27, 93, 53, 52, 27, 54, 43, 19, 46]
      }],
      options: {
       
          chart: {
            type: 'area',
            height: 60,
            width: 160,
            sparkline: {
            enabled: true
            },
            dropShadow: {
              enabled: true,
              blur: 10,
              opacity: 0,
            }
            },
            stroke: {
              show: true,
              curve: 'smooth',
              lineCap: 'butt',
              colors: undefined,
              width: 1.5,
              dashArray: 0,
            },
          fill: {
            gradient: {
            enabled: false
            }
          },
         
          yaxis: {
            min: 0
          },
          colors: ['#fff'],
      }

    }
  }
  render() {
    return (
      

<div id="spark4">
<ReactApexChart options={this.state.options} series={this.state.series} height={60} width={100}/>

</div>
    )
  }
};
//RECENT ACTIVITY
interface Product {
  id: number
  main: string
  heading: string
  class: string
  class1: string
  class2: string
  color: string
  color1: string
}
export const products : Product[]=[
  {id:1, main:"1", heading:'New Products,', class:'52% New products', class1:'More than 200 new products are added', class2:'6:45pm', color:'primary', color1:'Info'},
  {id:2, main:"2", heading:'New Sale,', class:'76% Profit earned.', class1:'$2,546 income earned in today sale', class2:'1day ago', color:'success', color1:'danger'},
  {id:3, main:"3", heading:'New Customers,', class:'24% New customers', class1:'1.3k new customers reached us this year', class2:'7:45pm', color:'warning', color1:'success'},
  {id:4, main:"4", heading:'New Reviews,', class:'96% Positive reviews.', class1:'There are 500 plus new reviews', class2:'1 min ago', color:'info', color1:'warning'},
  {id:5, main:"5", heading:'New Visits,', class:'today33% target achieved.', class1:'daily 20 plus new customers visits us', class2:'today', color:'danger', color1:'primary'},
  {id:6, main:"6", heading:'New Consistency,', class:'90% growth.', class1:'More than 5 Sales happening every week', class2:'3 days ago', color:'teal', color1:'teal'},
]
//TOP PRODUCTS
interface Product1 {
  id: number
  main: string
  heading: string
  class: string
  class1: string
  class2: string
  class3: string
  src1: string
  color: string
}
export const products1: Product1[]=[
  {id:1, main:'1', heading:'Books', class:'Book', class1:'$1234', class2:'3 days ago', class3:'Regular', src1:ImagesData('products16'), color:'success'},
  {id:2, main:'2', heading:'Sports', class:'Shoes', class1:'$5436', class2:'1hr ago', class3:'Top Seller', src1:ImagesData('products14'), color:'info'},
  {id:3, main:'3', heading:'Accesories', class:'Watch', class1:'$540', class2:'1 week ago', class3:'Irregular', src1:ImagesData('products15'), color:'danger'},
  {id:4, main:'4', heading:'Watches', class:'Smart Watch', class1:'$1543', class2:'Today', class3:'Regular', src1:ImagesData('products13'), color:'success'},
  {id:5, main:'5', heading:'speakers', class:'Head set', class1:'$6427', class2:'Today', class3:'Top Pick', src1:ImagesData('products18'), color:'info'},
]
//RECENT TRANSACTION
interface transaction {
  id: number
  main: string
  color: string
  heading: string
  class: string
  class1: string
  color1: string
}
export const transactions : transaction[]=[
  {id:1, main:'AL', color:'primary', heading:'Alberto', class:'2 hours ago', class1:'&plus;$543.98', color1:'success'},
  {id:2, main:'HE', color:'danger', heading:'Herrouchi', class:'6 hours ago', class1:'&plus;$534.87', color1:'success'},
  {id:3, main:'AK', color:'warning', heading:'Alexandra kiso', class:'2 days ago', class1:'−$132', color1:'danger'},
  {id:4, main:'KW', color:'teal', heading:'Kate wiliam', class:'1 hours ago', class1:'&plus;$153.45', color1:'success'},
  {id:5, main:'JP', color:'success', heading:'Jean Powel', class:'5 hours ago', class1:'−$324.78', color1:'danger'},
  {id:6, main:'HC', color:'info', heading:'Hakino Chen', class:'21 hours ago', class1:'−$3277.78', color1:'danger'},

]
//revenue of this month
interface revenue {
  id: number
  heading: string
  main: string
  class: string
  color: string
  width: number
 
}
export const revenues: revenue[]=[
  {id: 1, heading:'Monthly Profit', main:'$25,854', width:50, color:'primary', class:'40% increase'},
  {id: 2, heading:'Monthly Orders', main:'8,654', width:80, color:'danger', class:'62% increase'},
  {id: 3, heading:'Monthly Revenur', main:'$98,654', width:60 ,color:'success', class:'38% increase'},
  {id: 4, heading:'Monthly Expenses', main:'$54,456', width:70, color:'pink', class:'20% increase'},
]

export const COLUMN= [
    {
        Header: "Invoice ID",
        accessor: "INVOICEID",
        className: "wd-15p border-bottom-0",
      },
      {
        Header: "Customer Name",
        accessor: "CUSTOMERNAME",
        className: "wd-15p border-bottom-0 ",
    
      },
      {
        Header: "Customer ID",
        accessor: "CUSTOMERID",
        className: "wd-15p border-bottom-0 ",
      },
      {
        Header: "Date",
        accessor: "DATE",
        className: "wd-15p border-bottom-0 ",
      },
      {
        Header: "Order Value",
        accessor: "ORDER",
        className: "wd-15p border-bottom-0 ",
      },
      {
        Header: "Status",
        accessor: "STATUS",
        className: "wd-15p border-bottom-0",
    
      }
];
interface data {
  id: number
  INVOICEID:string,
  CUSTOMERID:string,
  DATE:string, 
  CUSTOMERNAME:string,
  ORDER:string, 
  STATUS:JSX.Element,
  
}
const i = <span className={`badge bg-success-light  border-success fs-11`}>Paid</span>
const t = <span className={`badge bg-warning-light  border-warning fs-11`}>Pending</span>
const s = <span className={`badge bg-danger-light  border-danger fs-11`}>failed</span>

export const RESDATATABLE:data[] = [
    {
      id:1,
      INVOICEID:'00434567',
      CUSTOMERNAME:'Gabriel',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$230,540', 
      STATUS:i,
      
     
    },
    {
      id:2,
      INVOICEID:'004655445',
      CUSTOMERNAME:'Julian Kerr',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$55,300', 
      STATUS:t,
  
   },
    {
      id:3,
      INVOICEID:'004343455',
      CUSTOMERNAME:'Cedric Kelly',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$234,100', 
      STATUS:i,
  
   },
    {
      id:4,
      INVOICEID:'004345234',
      CUSTOMERNAME:'Mona matty',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$234,100', 
      STATUS:i,
  
   },
    {
      id:5,
      INVOICEID:'004345623',
      CUSTOMERNAME:'Zach efron',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$55,300', 
      STATUS:i,
  
   },
    {
      id:6,
      INVOICEID:'004567455',
      CUSTOMERNAME:'Samantha May',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$43,198', 
      STATUS:i,
          },
    {
      id:7,
      INVOICEID:'004641215',
      CUSTOMERNAME:'Gavin Gibson',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$230,540', 
      STATUS:s,

   },
    {
      id:8,
      INVOICEID:'004651234',
      CUSTOMERNAME:'Junior Sam',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$43,198', 
      STATUS:t,
  
   },
    {
      id:9,
      INVOICEID:'004655445',
      CUSTOMERNAME:'Julian Kerr',
      CUSTOMERID:'JoanPowell@gmail.com',
      DATE:'08/3/2021', 
      ORDER:'$55,300', 
      STATUS:i,
  
   },
      
    ];


export const ResponsiveDataTable = () => {

  const tableInstance = useTable(
    {
      columns: COLUMN,
      data: RESDATATABLE,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps, // table props from react-table
    headerGroups, // headerGroups, if your table has groupings
    getTableBodyProps, // table body props from react-table
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    state,
    setGlobalFilter,
    page, // use, page or rows
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,  
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <div className="e-table pb-5">
        <div className="d-flex">
          {/* <select 
            className="mb-4 me-1 text-dark bg-transparent"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
               {pageSize}
              </option>
            ))}
          </select> */}
          <GlobalResFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
        <div className='table-responsive table-bordered text-center'>  
        <Table
          {...getTableProps()}
          className="border-top-0  table-bordered text-nowrap border-bottom"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={column.className}
                  >
                    <span className="tabletitle">{column.render("Header")}</span>
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-angle-down"></i>
                        ) : (
                          <i className="fa fa-angle-up"></i>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr className="text-center" {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        </div>
        <div className="d-block d-sm-flex mt-4 ">
          <span className="">
          Showing 1 to 9 of 9 entries{" "}
          </span>
          <span className="ms-sm-auto ">
          </span>
        </div>
      </div>

    </>
  );
};
const GlobalResFilter = ({ filter, setFilter }) => {
  return (
    <span className="d-flex ms-auto">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-4"
        placeholder="Search..."
      />
    </span>
  );
};

