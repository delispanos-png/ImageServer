import React from 'react';
import ReactECharts from 'echarts-for-react';
//Line Chart
export function DataAttr() {
    const option = {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '25',
    
          },
          xAxis: {
            data: [ '2014', '2015', '2016', '2017', '2018'],
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          tooltip: {
              show: true,
              showContent: true,
              alwaysShowContent: true,
              triggerOn: 'mousemove',
              trigger: 'axis',
              axisPointer:
              {
                  label: {
                      show: false,
                  }
              }
      
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series: [
            {
                name: 'sales',
                type: 'bar',
                data: [10, 15, 9, 18, 10, 15]
              
              },
              {
                name: 'profit',
                type: 'line',
                smooth:true,
                data: [8, 5, 25, 10, 10]
              },
              {
                name: 'growth',
                type: 'bar',
                data: [10, 14, 10, 15, 9, 25]
              }
          ],
          color:[ '#664dc9','#38cb89', '#44c4fa',]
    };

    return (<ReactECharts className="chartsh " option={option} />);
};

//Combination of line and barchart
export function DataAttribute() {
    const option = {
      
 
    grid: {
      top: '6',
      right: '0',
      bottom: '17',
      left: '25',
    },
    xAxis: {
      data: [ '2014', '2015', '2016', '2017', '2018'],
      axisLine: {
        lineStyle: {
          color: 'rgba(67, 87, 133, .09)'
        }
      },
      axisLabel: {
        fontSize: 10,
        color: '#8e9cad'
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: 'rgba(67, 87, 133, .09)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(67, 87, 133, .09)'
        }
      },
      axisLabel: {
        fontSize: 10,
        color: '#8e9cad'
      }
    },
    series: [
        {
            name: 'sales',
            type: 'line',
            smooth: true,
            data: [12, 25, 12, 35, 12, 38],
            color:[ '#664dc9']
          },
          {
            name: 'Profit',
            type: 'line',
            smooth: true,
            size:10,
            data: [8, 12, 28, 10, 10, 12],
            color:[ '#44c4fa']
          }
    ],
    color:[ '#664dc9','#38cb89', '#44c4fa',]
  
    };


    return (<ReactECharts className="chartsh " option={option} />);
};
//Vertical Line chart

export function VerticalLineChart() {
    const option = {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '32',
          },
          xAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, 0.3)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          yAxis: {
            type: 'category',
            data: [ '2014', '2015', '2016', '2017', '2018'],
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c0dfd8'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series: [
            {
              name: 'sales',
              type: 'bar',
              data: [10, 15, 9, 18, 10, 15]
            },
            {
              name: 'profit',
              type: 'line',
              smooth:true,
              data: [8, 5, 25, 10, 10]
            },
            {
              name: 'growth',
              type: 'bar',
              data: [10, 14, 10, 15, 9, 25]
            }
          ],
          color:[ '#664dc9','#38cb89', '#44c4fa',]
    };

    return (<ReactECharts className="chartsh " option={option} />);
};


//Vertical Combination of line and barchart
export function LineChart() {
    const option =  {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '32',
          },
          xAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, 0.3)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          yAxis: {
            type: 'category',
            data: [ '2014', '2015', '2016', '2017', '2018'],
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series:  [{
            name: 'sales',
            type: 'line',
            smooth: true,
            data: [12, 25, 12, 35, 12, 38],
            color:[ '#664dc9']
          },
          {
            name: 'Profit',
            type: 'line',
            smooth: true,
            size:10,
            data: [8, 12, 28, 10, 10, 12],
            color:[ '#44c4fa']
          },
        ]
    
    };

    return (<ReactECharts className="chartsh " option={option}/>);
};
//Bar Chart

export function BarChart() {
    const option = {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '25',
          },
          xAxis: {
            data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series:  [
            {
              name: 'sales',
              type: 'bar',
              stack: 'Stack',
              data: [14, 18, 20, 14, 29, 21, 25, 14, 24]
            },
            {
              name: 'Profit',
              type: 'bar',
              stack: 'Stack',
              data: [12, 14, 15, 50, 24, 24, 10, 20 ,30]
            }
          ],
          color:[ '#664dc9', '#44c4fa']
    };

    return (<ReactECharts className="chartsh " option={option} />);
};
//Horizontal BarCharts
export function HorizontalBarChart() {
    const option = {
        grid: {
            top: '6',
            right: '10',
            bottom: '17',
            left: '32',
          },
          xAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, 0.3)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          yAxis: {
            type: 'category',
             data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series:  [
            {
              name: 'sales',
              type: 'bar',
              stack: 'Stack',
              data: [14, 18, 20, 14, 29, 21, 25, 14, 24]
            },
            {
              name: 'Profit',
              type: 'bar',
              stack: 'Stack',
              data: [12, 14, 15, 50, 24, 24, 10, 20 ,30]
            }
          ],
          color:[ '#664dc9', '#44c4fa']
    };

    return (<ReactECharts className="chartsh " option={option} />);
};
 //Single Line Chart
 
export function SingleLineChart() {
    const option = {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '25',
          },
          xAxis: {
            data: [ '2011', '2012', '2013', '2014', '2015', '2016','2017', '2018'],
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series:  [
            {
              name: 'data',
              type: 'line',
              data: [20, 20, 36, 18, 15, 20, 25, 20]
            }
          ],
          color:[ '#664dc9']
    };

    return (<ReactECharts className="chartsh " option={option} />);
};
//Single Smooth Line Chart
export function SmoothLineChart() {
    const option = {
        grid: {
            top: '6',
            right: '0',
            bottom: '17',
            left: '25',
          },
          xAxis: {
            data: [ '2011', '2012', '2013', '2014', '2015', '2016','2017', '2018'],
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(67, 87, 133, .09)'
              }
            },
            axisLabel: {
              fontSize: 10,
              color: '#8e9cad'
            }
          },
          series: [
            {
              name: 'data',
              type: 'line',
              smooth: true,
              data: [20, 20, 36, 18, 15, 20, 25, 20]
            }
          ],
          color:[ '#44c4fa']
    };

    return (<ReactECharts className="chartsh " option={option} />);
};
