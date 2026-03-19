import React from 'react';
import { Button, Table } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
        let ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
}

const Export = ({ onExport }) => (
    <Button onClick={(e:any) => onExport(e.target.value)}>Export</Button>
);
const data = [
    {
        id: "1",
        NAME: "Airi Satou",
        POSITION: "Accountant",
        OFFICE:'Tokyo',
        AGE:'33',
       STARTDATE:'2008/11/28',
       SALARY:'$162,700',
    },
    {
        id: "2",
        NAME: "Angelica Ramos",
        POSITION: "Chief Executive Officer (CEO)",
        OFFICE:'London',
       AGE:'47',
       STARTDATE:'2009/10/09',
       SALARY:'$1,200,000',
    }, 
    {
        id: "3",
        NAME: "Ashton Cox",
        POSITION: "Junior Technical Author",
        OFFICE:'San Francisco',
         AGE:'66',
       STARTDATE:'2009/01/12',
       SALARY:'$86,000',
    },
     {
        id: "4",
        NAME: "Bradley Greer",
        POSITION: "Software Engineer",
        OFFICE:'London',
       
       AGE:'41',
       STARTDATE:'2012/10/13',
       SALARY:'$132,000',
    }, 
    {
        id: "5",
        NAME: "Brielle Williamson",
        POSITION: "Integration Specialist",
        OFFICE:'New York',
       
       AGE:'61',
       STARTDATE:'2012/12/02',
       SALARY:'$372,000',
    }, 
    {
        id: "7",
        NAME: "Brrighten Wagner",
        POSITION: "Software Engineer",
        OFFICE:'San Francisco',
       
       AGE:'28',
       STARTDATE:'2011/06/07',
       SALARY:'$206,850',
    }, 
    {
        id: "8",
        NAME: "Bruno Nash",
        POSITION: "Software Engineer",
        OFFICE:'London',
       
       AGE:'38',
       STARTDATE:'2011/05/03',
       SALARY:'$163,500',
    },
     {
        id: "9",
        NAME: "Caesar Vance",
        POSITION: "Pre-Sales Support",
        OFFICE:'New York',
       
       AGE:'21',
       STARTDATE:'2011/12/12',
       SALARY:'$106,450',
    },
     {
        id: "10",
        NAME: "Cara Stevens",
        POSITION: "Sales Assistant",
        OFFICE:'New York',
       
       AGE:'46',
       STARTDATE:'2011/12/068',
       SALARY:'$145,600',
    },
     {
        id: "11",
        NAME: "Cedric Kelly",
        POSITION: "Senior Javascript Developer",
        OFFICE:'Edinburgh',
       
       AGE:'22',
       STARTDATE:'2012/03/29',
       SALARY:'$433,060',
    }, 
    {
        id: "12",
        NAME: "Charde Marshall",
        POSITION: "Regional Director",
        OFFICE:'San Francisco',
       
       AGE:'36',
       STARTDATE:'2008/10/16',
       SALARY:'$470,600',
    },
    {
        id: "13",
        NAME: "Colleen Hurst",
        POSITION: "Javascript Developer",
        OFFICE:'San Francisco',
       
       AGE:'39',
       STARTDATE:'2009/09/15',
       SALARY:'$205,500',
    },
    {
        id: "14",
        NAME: "Dai Rios",
        POSITION: "Personnel Lead",
        OFFICE:'Edinburgh',
       
       AGE:'35',
       STARTDATE:'2012/09/26',
       SALARY:'$217,500',
    },
    {
        id: "15",
        NAME: "Donna Snider",
        POSITION: "Customer Support",
        OFFICE:'New York',
       
       AGE:'27',
       STARTDATE:'2011/01/25',
       SALARY:'$112,000',
    },
    {
        id: "16",
        NAME: "Doris Wilder",
        POSITION: "Sales Assistant",
        OFFICE:'Sidney',
       
       AGE:'23',
       STARTDATE:'2010/09/20',
       SALARY:'$85,600',
    },
    {
        id: "17",
        NAME: "Finn Camacho",
        POSITION: "Support Engineer",
        OFFICE:'San Francisco',
       
       AGE:'47',
       STARTDATE:'2009/07/07',
       SALARY:'$87,500',
    },
    {
        id: "18",
        NAME: "Fiona Green",
        POSITION: "Chief Operating Officer (COO)",
        OFFICE:'San Francisco',
       
       AGE:'48',
       STARTDATE:'2010/03/11',
       SALARY:'$850,000',
    },
    {
        id: "19",
        NAME: "Garrett Winters",
        POSITION: "Accountant",
        OFFICE:'Tokyo',
       
       AGE:'63',
       STARTDATE:'2011/07/25',
       SALARY:'$170,750',
    },
    {
        id: "20",
        NAME: "Gavin Cortez",
        POSITION: "Team Leader",
        OFFICE:'San Francisco',
       
       AGE:'22',
       STARTDATE:'2008/10/26',
       SALARY:'$235,500',
    },
    {
        id: "21",
        NAME: "Gavin Joyce",
        POSITION: "Developer",
        OFFICE:'Edinburgh',
       
       AGE:'42',
       STARTDATE:'2010/12/22',
       SALARY:'$92,575',
    },
    {
        id: "22",
        NAME: "Gloria Little",
        POSITION: "Systems Administrator",
        OFFICE:'New York',
       
       AGE:'59',
       STARTDATE:'2009/04/10',
       SALARY:'$237,500',
    },
    {
        id: "23",
        NAME: "Haley Kennedy",
        POSITION: "Senior Marketing Designer",
        OFFICE:'London',
       
       AGE:'43',
       STARTDATE:'2012/12/18',
       SALARY:'$313,500',
    },
    {
        id: "24",
        NAME: "Hermione Butler",
        POSITION: "Regional Director",
        OFFICE:'London',
       
       AGE:'47',
       STARTDATE:'2011/03/21',
       SALARY:'$356,250',
    },
    {
        id: "25",
        NAME: "Herrod Chandler",
        POSITION: "Sales Assistant",
        OFFICE:'San Francisco',
       
       AGE:'59',
       STARTDATE:'2012/08/06',
       SALARY:'$137,500',
    },
    {
        id: "26",
        NAME: "Hope Fuentes",
        POSITION: "Secretary",
        OFFICE:'San Francisco',
       
       AGE:'41',
       STARTDATE:'2010/02/12',
       SALARY:'$109,850',
    },
    {
        id: "27",
        NAME: "Howard Hatfield",
        POSITION: "Office Manager",
        OFFICE:'San Francisco',
       
       AGE:'51',
       STARTDATE:'2008/12/16',
       SALARY:'$164,500',
    },
    {
        id: "28",
        NAME: "Jackson Bradshaw",
        POSITION: "Director",
        OFFICE:'New York',
       
       AGE:'65',
       STARTDATE:'2008/09/26',
       SALARY:'$645,750',
    },
    {
        id: "29",
        NAME: "Jena Gaines",
        POSITION: "Office Manager",
        OFFICE:'London',
       
       AGE:'30',
       STARTDATE:'2008/12/19',
       SALARY:'$90,560',
    },
    {
        id: "30",
        NAME: "Jenette Caldwell",
        POSITION: "Development Lead",
        OFFICE:'New York',
       
       AGE:'30',
       STARTDATE:'2011/09/03',
       SALARY:'$345,000',
    },
    {
        id: "31",
        NAME: "Jennifer Acosta",
        POSITION: "Junior Javascript Developer",
        OFFICE:'Edinburgh',
       
       AGE:'43',
       STARTDATE:'2013/02/01',
       SALARY:'$75,650',
    },
    {
      id: "32",
      NAME: "Jennifer Chang",
      POSITION: "Regional Director",
      OFFICE:'Singapore',
     
     AGE:'28',
     STARTDATE:'2010/11/14',
     SALARY:'$357,650',
    },
    {
      id: "33",
      NAME: "Jonas Alexander",
      POSITION: "Developer",
      OFFICE:'San Francisco',
     
     AGE:'30',
     STARTDATE:'2010/07/14',
     SALARY:'$86,500',
    },
    {
      id: "34",
      NAME: "Lael Greer",
      POSITION: "Systems Administrator",
      OFFICE:'London',
     
     AGE:'21',
     STARTDATE:'2009/02/27',
     SALARY:'$103,500',
    },
    {
      id: "35",
      NAME: "Martena Mccray",
      POSITION: "Post-Sales support",
      OFFICE:'Edinburgh',
     
     AGE:'46',
     STARTDATE:'2011/03/09',
     SALARY:'$324,050',
    },
    {
      id: "36",
      NAME: "Michael Bruce",
      POSITION: "Javascript Developer",
      OFFICE:'Singapore',
     
     AGE:'29',
     STARTDATE:'2011/06/27',
     SALARY:'$183,000',
    },
    {
      id: "37",
      NAME: "Michael Silva",
      POSITION: "Marketing Designer",
      OFFICE:'London',
     
     AGE:'66',
     STARTDATE:'2012/11/27',
     SALARY:'$198,500',
    },
    {
      id: "38",
      NAME: "Michelle House",
      POSITION: "Integration Specialist",
      OFFICE:'Sidney',
     
     AGE:'37',
     STARTDATE:'2011/06/02',
     SALARY:'$95,400',
    },
    {
      id: "39",
      NAME: "Olivia Liang",
      POSITION: "Support Enginee",
      OFFICE:'Singapore',
     
     AGE:'64',
     STARTDATE:'2011/02/03',
     SALARY:'$234,500',
    },
    {
      id: "40",
      NAME: "Paul Byrd",
      POSITION: "Chief Financial Officer (CFO)",
      OFFICE:'New York',
     
     AGE:'64',
     STARTDATE:'2010/06/09',
     SALARY:'$725,000',
    },
    {
      id: "41",
      NAME: "Prescott Bartlett",
      POSITION: "Technical Author",
      OFFICE:'London',
     
     AGE:'27',
     STARTDATE:'2011/05/07',
     SALARY:'$145,000',
    },
    {
      id: "42",
      NAME: "Quinn Flynn",
      POSITION: "Support Lead",
      OFFICE:'Edinburgh',
     
     AGE:'22',
     STARTDATE:'2013/03/03',
     SALARY:'$342,000',
    },
    {
      id: "43",
      NAME: "Rhona Davidson",
      POSITION: "Integration Specialist",
      OFFICE:'Tokyo',
     
     AGE:'55',
     STARTDATE:'2010/10/14',
     SALARY:'$327,900',
    },
    {
      id: "44",
      NAME: "Sakura Yamamoto",
      POSITION: "Support Engineer",
      OFFICE:'Tokyo',
     
     AGE:'37',
     STARTDATE:'2009/08/19',
     SALARY:'$139,575',
    },
    {
      id: "45",
      NAME: "Serge Baldwin",
      POSITION: "Data Coordinator",
      OFFICE:'Singapore',
     
     AGE:'64',
     STARTDATE:'2012/04/09',
     SALARY:'$138,575',
    },
    {
      id: "46",
      NAME: "Shad Decker",
      POSITION: "Regional Director",
      OFFICE:'Edinburgh',
     
     AGE:'51',
     STARTDATE:'2008/11/13',
     SALARY:'$183,000',
    },
    {
      id: "47",
      NAME: "Shou Itou",
      POSITION: "Regional Marketing",
      OFFICE:'Tokyo',
     
     AGE:'20',
     STARTDATE:'2011/08/14',
     SALARY:'$163,000',
    },
    {
      id: "48",
      NAME: "Sonya Frost",
      POSITION: "Software Engineer",
      OFFICE:'London',
     
     AGE:'19',
     STARTDATE:'2010/03/17',
     SALARY:'$385,750',
    },
    {
      id: "49",
      NAME: "Thor Walton",
      POSITION: "DevelopER",
      OFFICE:'New York',
     
     AGE:'61',
     STARTDATE:'2013/08/11',
     SALARY:'$98,540',
    },
    {
      id: "50",
      NAME: "Tiger Nixon",
      POSITION: "System Architect",
      OFFICE:'Edinburgh',
     
     AGE:'61',
     STARTDATE:'2011/04/25',
     SALARY:'$320,800',
    },
    

    

];
const columns:any = [
 
    {
        name: "Name",
        selector: (row) => [row.NAME],
        sortable: true,
    },
    {
        name: "Position",
        selector: (row) => [row.POSITION],
        sortable: true,
    },
    {
        name: "Office",
        selector: (row) => [row.OFFICE],
        sortable: true,
    },
   
    {
        name: " Age",
        selector: (row) => [row.AGE],
        sortable: true,
    },
    {
        name: "Startdate",
        selector: (row) => [row.STARTDATE],
        sortable: true,
    },
    {
        name: "Salary",
        selector: (row) => [row.SALARY],
        sortable: true,
    },
];

export const ExportCSV = () => {
    const actionsMemo = React.useMemo(() => <Export onExport={() => { downloadCSV(data) }} />, []);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    let selectdata:any = [];
    const handleRowSelected = React.useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);
    const contextActions = React.useMemo(() => {
        const Selectdata = () => {
            if (window.confirm(`download:\r ${selectedRows.map((r:any) => r.SNO)}?`)) {
                setToggleCleared(!toggleCleared);
                data.map((e) => {
                    selectedRows.map((sr:any) => {
                        if (e.id === sr.id) {
                            selectdata.push(e);
                        }
                        return selectedRows;
                    });
                    return data;
                });
                downloadCSV(selectdata);
            }
        };

        return <Export onExport={() => Selectdata()}  />;
    }, [data, selectdata, selectedRows]);
    const [allData, setAllData] = React.useState(data)

    let allElement2:any = [];

    let myfunction = (InputData) => {
        for (let allElement of data) {
            if (allElement.NAME.toLowerCase().includes(InputData.toLowerCase())) {
                if (allElement.NAME.toLowerCase().startsWith(InputData.toLowerCase())) {
                    allElement2.push(allElement)
                }
            }
        }
        setAllData(allElement2)
    }



    return (
        
        <span className="datatable">
            
            <label className="float-end">
                <input type="text" placeholder="Search..." className="form-control-sm form-control" onChange={(ele) => { myfunction(ele.target.value) }} />
            </label>

            <DataTable
                columns={columns}
                data={allData}
                actions={actionsMemo}
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                selectableRows
                pagination
            />
        </span>
    );
};