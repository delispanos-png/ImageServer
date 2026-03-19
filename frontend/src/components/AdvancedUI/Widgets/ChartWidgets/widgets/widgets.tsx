import { color } from "@uiw/react-color";
import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
//CryptoChart
 export class ApexChart1 extends Component<{}, {options1:any, series1:any}> {
    constructor(props) {
      super(props);

      this.state = {
      
        series1: [{
          data: [30, 70, 30, 100, 50, 130, 100, 140],
          color: '#664dc9'
        }],
        options1: {
          chart: {
            type: 'line',
            width: 100,
            height: 35,
            sparkline: {
              enabled: true,
             
            }
          },
          stroke: {
            curve: 'smooth'
          }, 
           xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          },
          tooltip: {
            fixed: {
              enabled: false
            },
            x: {
              show: true
            },
            marker: {
              show: false
            }
          }
        },
      };
    }

  

    render() {
      return (
        

  <div>

        <div className="pt-0 pb-5 border-top-0 overflow-hidden h-50">
<ReactApexChart className='chart-dropshadow-primary' options={this.state.options1} series={this.state.series1} type="line" height={50} />
</div>
  
</div>


      );
    }
  };
  //CryptoChart1
  export class ApexChart2 extends Component<{}, {options1:any, series1:any}> {
    constructor(props) {
      super(props);

      this.state = {
      
        series1: [{
          data: [30, 70, 30, 100, 50, 130, 100, 140],
          color: '#664dc9'
        }],
        options1: {
          chart: {
            type: 'line',
            width: 100,
            height: 35,
            sparkline: {
              enabled: true
            }
          },
          stroke: {
            curve: 'smooth'
          },
          tooltip: {
            fixed: {
              enabled: false
            },
            x: {
              show: false
            },
            marker: {
              show: false
            }
          }
        },
      };
    }

  

    render() {
      return (
        

  <div>

        <div className="pt-0 pb-5 border-top-0 overflow-hidden h-50">
<ReactApexChart className='chart-dropshadow-primary' options={this.state.options1} series={this.state.series1} type="line" height={50} />
</div>
  
</div>


      );
    }
  };
  //CryptoChart2
  export class ApexChart3 extends Component<{}, {options1:any, series1:any}> {
    constructor(props) {
      super(props);

      this.state = {
      
        series1: [{
          data: [30, 70, 30, 100, 50, 130, 100, 140],
          color: '#664dc9'
        }],
        options1: {
          chart: {
            type: 'line',
            width: 100,
            height: 35,
            sparkline: {
              enabled: true
            }
          },
          stroke: {
            curve: 'smooth'
          },
          tooltip: {
            fixed: {
              enabled: false
            },
            x: {
              show: false
            },
            marker: {
              show: false
            }
          }
        },
      };
    }

  

    render() {
      return (
        

  <div>

        <div className="pt-0 pb-5 border-top-0 overflow-hidden h-50">
<ReactApexChart className='chart-dropshadow-primary' options={this.state.options1} series={this.state.series1} type="line" height={50} />
</div>
  
</div>


      );
    }
  };
  //CryptoChart3
  export class ApexChart4 extends Component<{}, {options1:any, series1:any}> {
    constructor(props) {
      super(props);

      this.state = {
      
        series1: [{
          data: [30, 70, 30, 100, 50, 130, 100, 140],
          color: '#664dc9'
        }],
        options1: {
          chart: {
            type: 'line',
            width: 100,
            height: 35,
            sparkline: {
              enabled: true
            }
          },
          stroke: {
            curve: 'smooth'
          },
          tooltip: {
            fixed: {
              enabled: false
            },
            x: {
              show: false
            },
            marker: {
              show: false
            }
          }
        },
      };
    }

  

    render() {
      return (
        

  <div>

        <div className="pt-0 pb-5 border-top-0 overflow-hidden h-50">
<ReactApexChart className='chart-dropshadow-primary' options={this.state.options1} series={this.state.series1} type="line" height={50} />
</div>
  
</div>


      );
    }
  };
  //Circle1
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
              size: '60%',
              
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
                  return 
                }
              }
            }
          }
        },
        labels: [''],
        colors: ["#4422c9"],
      },
    
    
    };
  }

    render() {
      return (
        

  <div className="mx-auto chart-circle chart-circle-md " id="chart8">
<ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={150} />

</div>
      )
    }
    };
    //Circle2
    export class ApexChart5 extends Component<{}, { options: any, series: any }>  {
      constructor(props) {
        super(props);
      this.state = {
            
        series: [60],
        options: {
          chart: {
            height: 10,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '60%',
                
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
          colors: ['#eb2323'],
        },
      
      
      };
    }
  
      render() {
        return (
          
  
    <div className="mx-auto chart-circle chart-circle-md mt-sm-0 mb-0">
  <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={150} />
  
  </div>
        )
      }
      };
      //Circle3
      export class ApexChart6 extends Component<{}, { options: any, series: any }>  {
        constructor(props) {
          super(props);
        this.state = {
              
          series: [25], 
          options: {
            chart: {
              height: 10,
              type: 'radialBar',
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '60%',
                  
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
            colors: ['#008a4c'],
          },
        
        
        };
      }
    
        render() {
          return (
            
    
      <div className="mx-auto chart-circle chart-circle-md mt-sm-0 mb-0">
    <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={150} />
    
    </div>
          )
        }
        };
        //Circle4
        export class ApexChart7 extends Component<{}, { options: any, series: any }>  {
          constructor(props) {
            super(props);
          this.state = {
                
            series: [25], 
            options: {
              chart: {
                height: 10,
                type: 'radialBar',
              },
              plotOptions: {
                radialBar: {
                  hollow: {
                    size: '60%',
                    
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
              colors: ['#d18d02'],
            },
          
          
          };
        }
      
          render() {
            return (
              
      
        <div className="mx-auto chart-circle chart-circle-md mt-sm-0 mb-0">
      <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={150} />
      
      </div>
            )
          }
          };
      //spark1   
  export class ApexChart8 extends Component <{}, { options: any, series: any }>{
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
                width: 160,
                    sparkline: {
                      enabled: true
                    },
                dropShadow: {
                  enabled: true,
                  blur: 3,
                  opacity: 0.2,
                  show:false,
                }
                },
                stroke: {
                  show: true,
                  curve: 'smooth',
                  lineCap: 'butt',
                  colors: undefined,
                  width: 2,
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
                  colors: ['#38cb89'],
            
                }
      
              }
            }
            render() {
              return (
                
        
          <div id="spark1">
        <ReactApexChart options={this.state.options} series={this.state.series} height={60} width={150}/>
        
        </div>
              )
            }
          };
          //spark2
          export class ApexChart9 extends Component <{}, { options: any, series: any }>{
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
                  blur: 3,
                  opacity: 0.2,
                }
                },
                stroke: {
                  show: true,
                  curve: 'smooth',
                  lineCap: 'butt',
                  colors: undefined,
                  width: 2,
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
                  colors: ['#664dc9'],
            
                }
      
              }
            }
            render() {
              return (
                
        
          <div id="spark1">
        <ReactApexChart options={this.state.options} series={this.state.series} height={60} width={150}/>
        
        </div>
              )
            }
          };
          //spark3
          export class ApexChart10 extends Component <{}, { options: any, series: any }>{
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
                  blur: 3,
                  opacity: 0.2,
                }
                },
                stroke: {
                  show: true,
                  curve: 'smooth',
                  lineCap: 'butt',
                  colors: undefined,
                  width: 2,
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
                  colors: ['#2bcbba'],
                }
      
              }
            }
            render() {
              return (
                
        
          <div id="spark1">
        <ReactApexChart options={this.state.options} series={this.state.series} height={60} width={150}/>
        
        </div>
              )
            }
          };
          //spark4
          export class ApexChart11 extends Component <{}, { options: any, series: any }>{
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
                        blur: 3,
                        opacity: 0.2,
                      }
                      },
                      stroke: {
                        show: true,
                        curve: 'smooth',
                        lineCap: 'butt',
                        colors: undefined,
                        width: 2,
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
                    colors: ['#ef4b4b'],
                }
      
              }
            }
            render() {
              return (
                
        
          <div id="spark1">
        <ReactApexChart options={this.state.options} series={this.state.series} height={60} width={150}/>
        
        </div>
              )
            }
          };
          //Bar
          export class ApexChart12 extends Component <{}, { options6: any, series6: any }> {
            constructor(props) {
              super(props);
            this.state ={
          
              series6: [{
                data: [50, 30, 90, 60, 50, 90, 70, 30, 50, 25]
              }],
              options6: {
                chart: {
                  type: 'bar',
                  width: 0,
                  height: 50,
                  colors:'#fff',
                  sparkline: {
                    enabled: true
                  }
                },
                plotOptions: {
                  bar: {
                    columnWidth: '80%'
                  }
                },
                labels: [5,3,6,5,10,7,3,5,2],
                xaxis: {
                  crosshairs: {
                    width: 1
                  },
                },
                tooltip: {
                  fixed: {
                    enabled: false
                  },
                  x: {
                    show: false
                  },
                  y: {
                    title: {
                      formatter: function (seriesName) {
                        return ''
                      }
                    }
                  },
                  marker: {
                    show: false
                  }
                },
                colors:['#664dc9'],
                colors1:['#e3dff5']
              },
             
          };
        }
            render() {
              return (
                
        
                <div id="chart-6">
                <ReactApexChart options={this.state.options6} series={this.state.series6} type="bar" height={100} width={130} />
              </div>
              )
            }
            };
            //Bar2
            export class ApexChart14 extends Component <{}, { options6: any, series6: any }> {
              constructor(props) {
                super(props);
              this.state ={
            
                series6: [{
                  data: [-5,-9,-6,-8,-6,-10,-5,-7,-8,-3]
                
                }],
                options6: {
                  chart: {
                    type: 'bar',
                    width: 0,
                    height: 50,
                    sparkline: {
                      enabled: true
                    }
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: '80%'  
                    }
                  },
                  labels: [5,3,6,5,10,7,3,5,2],
                  
                  xaxis: {
                    crosshairs: {
                      width: 1
                    },
                  },
                  tooltip: {
                    fixed: {
                      enabled: false
                    },
                    x: {
                      show: false
                    },
                    y: {
                      title: {
                        formatter: function (seriesName) {
                          return ''
                        }
                      }
                    },
                    marker: {
                      show: false
                    }
                  },
                  colors:['#ffab00']
                },
            
            };
          }
              render() {
                return (
                  
          
                  <div id="chart-6">
                  <ReactApexChart options={this.state.options6} series={this.state.series6} type="bar" height={100} width={130} />
                </div>
                )
              }
              };
              //Bar3
              export class ApexChart19 extends Component <{}, { options6: any, series6: any }> {
                constructor(props) {
                  super(props);
                this.state ={
              
                  series6: [{
                    data: [5,3,2,-1,-3,-2,2,3,5,2],
                  }],
                  options6: {
                    chart: {
                      type: 'bar',
                      width: 0,
                      height: 50,
                      sparkline: {
                        enabled: true
                      }
                    },
                    plotOptions: {
                      bar: {
                        columnWidth: '80%'
                      }
                    },
                    labels: [5,3,6,5,10,7,3,5,2],
                    
                    xaxis: {
                      crosshairs: {
                        width: 1
                      },
                    },
                    tooltip: {
                      fixed: {
                        enabled: false
                      },
                      x: {
                        show: false
                      },
                      y: {
                        title: {
                          formatter: function (seriesName) {
                            return ''
                          }
                        }
                      },
                      marker: {
                        show: false
                      }
                    },
                    colors:['#38cb89', '#aeeacf']
                  },
              
              };
            }
                render() {
                  return (
                    
            
                    <div id="chart-6">
                    <ReactApexChart options={this.state.options6} series={this.state.series6} type="bar" height={100} width={130} />
                  </div>
                  )
                }
                };
                //Bar4
                export class ApexChart20 extends Component <{}, { options6: any, series6: any }> {
                  constructor(props) {
                    super(props);
                  this.state ={
                
                    series6: [{
                      data: [5,3,2,-1,-3,-2,2,3,5,2]
                    
                    }],
                    options6: {
                      chart: {
                        type: 'bar',
                        width: 0,
                        height: 50,
                        sparkline: {
                          enabled: true
                        }
                      },
                      plotOptions: {
                        bar: {
                          columnWidth: '80%'
                        }
                      },
                      labels: [5,3,6,5,10,7,3,5,2],
                      
                      xaxis: {
                        crosshairs: {
                          width: 1
                        },
                      },
                      tooltip: {
                        fixed: {
                          enabled: false
                        },
                        x: {
                          show: false
                        },
                        y: {
                          title: {
                            formatter: function (seriesName) {
                              return ''
                            }
                          }
                        },
                        marker: {
                          show: false
                        }
                      },
                      colors:['#ef4b4b']
                    },
                
                };
              }
                  render() {
                    return (
                      
              
                      <div id="chart-6">
                      <ReactApexChart options={this.state.options6} series={this.state.series6} type="bar" height={100} width={130} />
                    </div>
                    )
                  }
                  };
        //Donutchart1
        export class ApexChart15 extends Component <{}, { options: any, series: any, data:any }> {
          constructor(props) {
            super(props);
          this.state ={
        series: [36,22,42],
        data: [{
          label: 'Google',
          value: 42
        }, {
          label: 'Firefox',
          value: 22
        }, {
          label: 'IE',
          value: 36
        }],
            options: {
              chart: {
                type: 'donut',
                width: 40,
                height: 40,
                sparkline: {
                  enabled: true
                },
              },
              stroke: {
                width: 1
              },
              tooltip: {
                fixed: {
                  enabled: false,
                  resize: true,
                },
              },
              colors:['#5b73e8','#92a3f5','#657ced']
            },
            
        };
        
      }
          render() {
            return (
              
      
              <div className="morris-donut-wrapper-demo">
  <ReactApexChart options={this.state.options} series={this.state.series} data={this.state.data} type="donut" height={130} width={200} />
</div>
            )
          }
          }; 
             //Donutchart1
        export class ApexChart16 extends Component <{}, { options: any, series: any, data:any }> {
          constructor(props) {
            super(props);
          this.state ={
        series: [25,40,35],
        data: [{
          label: 'Google',
          value: 42,
         
        }, {
          label: 'Firefox',
          value: 22
        }, {
          label: 'IE',
          value: 36
        }],
            options: {
              chart: {
                type: 'donut',
                width: 40,
                height: 40,
                sparkline: {
                  enabled: true
                },
              },
              stroke: {
                width: 1
              },
              tooltip: {
                fixed: {
                  enabled: false,
                  resize: true,
                },
              },
              colors: ['#5dd59f',  '#38cb89','#85e0b7',],
             
            },
          
        };
        
      }
          render() {
            return (
              
      
              <div className="morris-donut-wrapper-demo">
  <ReactApexChart options={this.state.options} series={this.state.series} data={this.state.data} type="donut" height={130} width={200} />
</div>
            )
          }
          }; 
             
          //Donutchart1
        export class ApexChart17 extends Component <{}, { options: any, series: any, data:any }> {
          constructor(props) {
            super(props);
          this.state ={
        series: [20,42,38],
        data: [{
          label: 'Google',
          value: 42
        }, {
          label: 'Firefox',
          value: 22
        }, {
          label: 'IE',
          value: 36
        }],
            options: {
              chart: {
                type: 'donut',
                width: 40,
                height: 40,
                sparkline: {
                  enabled: true
                },
              },
              stroke: {
                width: 1
              },
              tooltip: {
                fixed: {
                  enabled: false,
                  resize: true,
                },
              },
              colors:['#ffab00', '#ffbb33','#ffcc66']
            },
            
        };
        
      }
          render() {
            return (
              
      
              <div className="morris-donut-wrapper-demo">
  <ReactApexChart options={this.state.options} series={this.state.series} data={this.state.data} type="donut" height={130} width={200} />
</div>
            )
          }
          }; 
             
          //Donutchart1
        export class ApexChart18 extends Component <{}, { options: any, series: any, data:any }> {
          constructor(props) {
            super(props);
          this.state ={
        series: [32,34,34],
        data: [{
          label: 'Google',
          value: 42
        }, {
          label: 'Firefox',
          value: 22
        }, {
          label: 'IE',
          value: 36
        }],
            options: {
              chart: {
                type: 'donut',
                width: 40,
                height: 40,
                sparkline: {
                  enabled: true
                },
              },
              stroke: {
                width: 1
              },
              tooltip: {
                fixed: {
                  enabled: false,
                  resize: true,
                },
              },
              colors:['#ef4b4b','#f7a1a1','#db7377']
            },
            
        };
        
      }
          render() {
            return (
              
      
              <div className="morris-donut-wrapper-demo">
  <ReactApexChart options={this.state.options} series={this.state.series} data={this.state.data} type="donut" height={130} width={200} />
</div>
            )
          }
          }; 
             