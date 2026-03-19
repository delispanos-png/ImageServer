
import { Chart, ArcElement, Tooltip, Legend, registerables} from 'chart.js';

import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

Chart.register(...registerables, ArcElement, Tooltip, Legend);
//Barchart
export const StackOption:any = {
    tooltips: {
        displayColors: true,
        callbacks: {
            mode: 'x',
        },
    },
    plugins: {
        legend: {
            display: false,
            position: 'right',
        }
    },
    scales: {
        x: {
            stacked: true,
            gridLines: {
                display: false,
            }
        },
        y: {
            stacked: true,
            ticks: {
                beginAtZero: true,
            },
            type: 'linear',
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom', display: false },
};

export const StackData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Data1',
        backgroundColor: "#664dc9",
        data: [14, 12, 34, 25, 24, 20],
        barPercentage: 0.5,
        borderWidth: 1,
    }
],
  
};
export function StackedBarChart() {
    return <Bar className="h-300" options={StackOption} data={StackData} />;
}
//Transprency

export const BarOption2:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 10,
                max: 80
            }
        },
        x: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11
            }
        }
    },
    maintainAspectRatio: false,
    responsive: true,
    barPercentage: 0.5,
};

export const BarData2 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: '# of Votes',
        data: [14, 12, 34, 25, 24, 20],
        backgroundColor: '#44c4fa',

    }]
};
export function Transparency() {
    return <Bar className="h-300" options={BarOption2} data={BarData2} />;
};
//Gradient barchart
export const BarOption3:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            ticks: {
                color: '##664dc9',
                beginAtZero: true,
                fontSize: 10,
                max: 80
            }
        },
        x: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11
            }
        }
    },
    maintainAspectRatio: false,
    responsive: true,
    barPercentage: 0.5,
};

export const BarData3:any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: '# of Votes',
        data: [14, 12, 34, 25, 24, 20],
        backgroundColor: '#5760cb',
    }]
};
export function Gradient() {

    return <Bar className="h-300" options={BarOption3} data={BarData3} />;
};
//Horizontal barchart
export const HoriOption:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 10,
            }
        },
        x: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11,
                max: 80
            }
        }
    },
    maintainAspectRatio: false,
    indexAxis: 'y',
}

export const HoriData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: '# of Votes',
        data: [14, 12, 34, 25, 24, 20],
        backgroundColor: ['#664dc9', '#44c4fa', '#38cb89', '#3e80eb', '#ffab00', '#ef4b4b']
    }]
}
export function HoriStackedBarChart() {
    return <Bar className="h-300" options={HoriOption} data={HoriData}  />;
};
//Horizontal barchart style2
export const HoriOption1:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11,
            }
        },
        x: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11,
                max: 80
            }
        }
    },
    maintainAspectRatio: false,
    indexAxis: 'y',
}

export const HoriData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            data: [14, 12, 34, 25, 24, 20],
            backgroundColor: [ '#664dc9', '#38cb89', '#116e7c', '#ffab00', '#ef4b4b']
        }, {
            data: [22, 30, 25, 30, 20, 40],
            backgroundColor: '#44c4fa'
        }]
}
//Vertical stacked barchart
export function HoriStackedBarCharts() {
    return <Bar className="h-300" options={HoriOption1} data={HoriData1} />;
};
export const StackOption1:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            stacked: true,
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11
            }
        },
        x: {
            stacked: true,
            ticks: {
                color: '#9ba9bf',
                fontSize: 11
            }
        }
    },
    maintainAspectRatio: false,
    barPercentage: 0.5,
}

export const StackData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        data: [14, 12, 34, 25, 24, 20],
        backgroundColor: '#664dc9',
        borderWidth: 1,
        fill: true
    }, 
    {
        data: [14, 12, 34, 25, 24, 20],
        backgroundColor:  '#44c4fa',
        borderWidth: 1,
        fill: true
    }],
}
export function StackedBarCharts() {
    return <Bar className="h-300" options={StackOption1} data={StackData1}  />;
};
//Vertical stacked barchart
export const HoriOption2:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            stacked: true,
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 10,
                max: 80
            }
        },
        x: {
            stacked: true,
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11
            }
        }
    },
    maintainAspectRatio: false,
    indexAxis: 'y',
}

export const HoriData2 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            data: [14, 12, 34, 25, 24, 20],
            backgroundColor: '#664dc9',
            borderWidth: 1,
            fill: true
        }, {
            data: [14, 12, 34, 25, 24, 20],
            backgroundColor:  '#44c4fa',
            borderWidth: 1,
            fill: true
        }]
}
export function HoriStackedBarChart2() {
    return <Bar className="h-300" options={HoriOption2} data={HoriData2}  />;
};
//Linechart
export const LineOption:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 10,
                max: 80
            }
        },
        x: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11
            }
        }
    },
    maintainAspectRatio: false,
};

export const LineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        data: [14, 12, 34, 25, 44, 36, 35, 25, 30, 32, 20, 25 ],
        borderColor: '#664dc9',
        borderWidth: 1,
        fill: false,
        tension: 0.4
    }, {
        data: [5, 20, 15, 25, 20, 23, 35, 28, 15, 13, 27, 35],
        borderColor: '#44c4fa',
        borderWidth: 1,
        fill: false,
        tension: 0.4
    }]
};
export function LineChart() {
    return <Line  className="h-300" options={LineOption} data={LineData}  />;
};
//Areachart
export const AreaOptions:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    scales: {
        y: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 10,
                max: 80
            }
        },
        x: {
            ticks: {
                color: '#9ba9bf',
                beginAtZero: true,
                fontSize: 11
            }
        },
    },
    maintainAspectRatio: false,
};

export const AreaData:any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: [14, 12, 34, 25, 44, 36, 35, 25, 30, 32, 20, 25 ],
            borderColor: '#664dc9',
            borderWidth: 1,
            tension: 0.4,
            fill: {
                type: "gradient",
                gradient: {
                  shade: "gradient",
                  type: "horizontal",
                  shadeIntensity: .5,
                  gradientToColors: ['#c4b8f5'],
                  inverseColors: !0,
                  opacityFrom: 5,
                  opacityTo: 1,
                  stops: [0, 50]
                }
              },

        }, 
        {
            data: [35, 30, 45, 35, 55, 40, 35, 28, 45, 53, 47, 35],
            borderColor: '#44c4fa',
            borderWidth: 1,
            tension: 0.4,
            fill: {
                type: "gradient",
                gradient: {
                  shade: "gradient",
                  type: "horizontal",
                  shadeIntensity: .7,
                  gradientToColors: ['#c4b8f5'],
                  inverseColors: !0,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
              },
}]
};

export function AreaChart() {
    return <Line className="h-300" options={AreaOptions} data={AreaData} />;
};
//Donut chart
export const DoughnutOptions:any = {

    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    animation: {
        animateScale: true,
        animateRotate: true
    },
    maintainAspectRatio: false,
    responsive: true,
}
export const Doughnutdata = {

    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
        data: [35,24,20,15,8],
        backgroundColor: ['#664dc9', '#44c4fa', '#38cb89', '#3e80eb', '#ffab00', '#ef4b4b']
    }]
};

export function DoughnutChart() {
    return <Doughnut className="h-300" data={Doughnutdata} options={DoughnutOptions} />;
}
export const PieOptions:any = {
    plugins: {	
        legend: {	
            display: false,	
        }	
    },
    animation: {
        animateScale: true,
        animateRotate: true
    },
    maintainAspectRatio: false,
    responsive: true,
}

//Pie chart
export const PieData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
        data: [35,24,20,15,8],
        backgroundColor: ['#664dc9', '#44c4fa', '#38cb89', '#3e80eb', '#ffab00', '#ef4b4b']
    }]
};

export function PieChart() {
    return <Pie className="h-300" data={PieData} options={PieOptions} />;
}



  





