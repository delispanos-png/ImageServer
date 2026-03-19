import React from 'react';
import { Button, Table } from 'react-bootstrap';
import differenceBy from "lodash/differenceBy";
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable from 'react-data-table-component';
import "react-data-table-component-extensions/dist/index.css";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";

const tableDataItems = [
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

export const DataTabless = () => {
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const [data, setData] = React.useState(tableDataItems);

    const handleRowSelected = React.useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

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
    const contextActions = React.useMemo(() => {
        const handleDelete = (SNO) => {

            setToggleCleared(!toggleCleared);
            setData(differenceBy(data, selectedRows, "SNO"));

        };

        return (
            <Button variant="" className="btn btn-primary mt-2" key="delete" onClick={handleDelete}>
                Delete
            </Button>
        );
    }, [data, selectedRows, toggleCleared]);
    const tableDatas = {
        columns,
        data,
    };
    return (
        <span className="datatable">
            <DataTableExtensions {...tableDatas}>
                <DataTable
                    title
                    columns={columns}
                    data={data}
                    selectableRows
                    contextActions={contextActions}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    pagination
                />
            </DataTableExtensions>
        </span>
    );
};

interface column {
  Header:string,
  accessor: string,
  className: string,
}
export const COLUMNS: column[]= [
  {
    Header: "First Name",
    accessor: "FNAME",
    className: "wd-15p border-bottom-0",
  },
  {
    Header: "Last Name",
    accessor: "LNAME",
    className: "wd-15p border-bottom-0 ",

  },
  {
    Header: "Position",
    accessor: "POSITION",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Start Date",
    accessor: "START",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Salary",
    accessor: "SALARY",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "E-Mail",
    accessor: "MAIL",
    className: "wd-15p border-bottom-0 ",
  }
];
interface datatable {
  FNAME: string,
  LNAME: string,
  POSITION:string,
  START:string,
  SALARY:string,
  MAIL: string,
}
export const DATATABLE:datatable[]= [
  {
    FNAME: 'Adrian',
    LNAME: 'Terry',
    POSITION: 'Marketing Officer',
    START: '2013/04/21',
    SALARY: '$543,769',
    MAIL: 'a.terry@datatables.net',
  },
  {
    FNAME: 'Angelica',
    LNAME: 'Ramos',
    POSITION: 'Chief Executive Officer',
    START: '2017/10/15',
    SALARY: '$6,234,000',
    MAIL: 'a.ramos@datatables.net',
  },
  {
    FNAME: 'Bella',
    LNAME: 'Chloe',
    POSITION: 'System Developer',                   
    START: '2018/03/12',
    SALARY: '$654,765',
    MAIL: 'b.Chloe@datatables.net',
  },
  {
    FNAME: 'Brrighten',
    LNAME: 'Wagner',                                        
    POSITION: 'Software Engineer',
    START: '2013/07/14',
    SALARY: '$206,850',
    MAIL: 'b.wagner@datatables.net',
  },
  {
    FNAME: 'Bruno',
    LNAME: 'Nash',
    POSITION: 'Software Engineer',
    START: '2015/05/03',
    SALARY: '$163,500',
    MAIL: 'b.nash@datatables.net',
  },
  {
    FNAME: 'Cameron',
    LNAME: 'Watson',
    POSITION: 'Software Designer',
    START: '2013/9/7',
    SALARY: '$675,876',
    MAIL: 'c.watson@datatables.net',
  },
  {
    FNAME: 'Connor',
    LNAME: 'Johne',
    POSITION: 'Web Developer',
    START: '2011/1/25',
    SALARY: '$92,575',
    MAIL: 'C.johne@datatables.net',
  },
  {
    FNAME: 'Dominic',
    LNAME: 'Hudson',
    POSITION: 'Sales Assistant',
    START: '2015/10/16',
    SALARY: '$654,300',
    MAIL: 'd.hudson@datatables.net',
  },
  {
    FNAME: "Donna",
    LNAME: "Terry",
    POSITION: "Sales Manager",
    START: "2013/10/26",
    SALARY: "$66,340",
    MAIL: "d.terry@datatables.net",
  },
  {
    FNAME: "Finn",
    LNAME: "Camacho",
    POSITION: "Support Engineer",
    START: "2016/07/07",
    SALARY: "$87,500",
    MAIL: "f.camacho@datatables.net",
  },
  {
    FNAME: "Fiona",
    LNAME: "Green",
    POSITION: "Chief Operating Officer",
    START: "2015/06/23",
    SALARY: "$345,789",
    MAIL: "f.green@datatables.net",
  },
  {
    FNAME: 'Gavin',
    LNAME: 'Cortez',
    POSITION: 'Team Leader',
    START: '2015/1/19',
    SALARY: '$345,890',
    MAIL: 'g.cortez@datatables.net',
  },
  {
    FNAME: "Harry",
    LNAME: "Carr",
    POSITION: "Technical Manager",
    START: "20211/02/87",
    SALARY: "$86,000",
    MAIL: "h.carr@datatables.net",
  },
  {
    FNAME: "Herrod",
    LNAME: "Chandler",
    POSITION: "Integration Specialist",
    START: "2012/08/06",
    SALARY: "$137,500",
    MAIL: "h.chandler@datatables.net",
  },
  {
    FNAME: "Hope",
    LNAME: "Fuentes",
    POSITION: "Secretary",
    START: "2015/07/28",
    SALARY: "$78,879",
    MAIL: "h.fuentes@datatables.net",
  },
  {
    FNAME: "Howard",
    LNAME: "Hatfield",
    POSITION: "Office Manager",
    START: "2013/8/19",
    SALARY: "$98,000",
    MAIL: "h.hatfield@datatables.net",
  },
  {
    FNAME: "Jackson",
    LNAME: "Bradshaw",
    POSITION: "Director",
    START: "2011/09/26",
    SALARY: "$645,750",
    MAIL: "j.bradshaw@datatables.net",
  },
  {
    FNAME: "Jennifer",
    LNAME: "Chang",
    POSITION: "Regional Director",
    START: "2012/17/11",
    SALARY: "$546,890",
    MAIL: "j.chang@datatables.net",
  },
  {
    FNAME: "Jennifer",
    LNAME: "Acosta",
    POSITION: "Junior Javascript Developer",
    START: "2017/02/01",
    SALARY: "$75,650",
    MAIL: "j.acosta@datatables.net",
  },
  {
    FNAME: "Jonathan",
    LNAME: "Ince",
    POSITION: "junior Manager",
    START: "2012/11/23",
    SALARY: "$345,789",
    MAIL: "j.ince@datatables.net",
  },
  {
    FNAME: "Justin",
    LNAME: "Peters",
    POSITION: "Development lead",
    START: "2013/10/23",
    SALARY: "$765,654",
    MAIL: "j.peters@datatables.net",
  },
  {
    FNAME: "Karen",
    LNAME: "Hill",
    POSITION: "Sales Manager",
    START: "2010/7/14",
    SALARY: "$432,230",
    MAIL: "k.hill@datatables.net",
  },
  {
    FNAME: "Karen",
    LNAME: "Miller",
    POSITION: "Office Director",
    START: "2012/9/25",
    SALARY: "$87,654",
    MAIL: "k.miller@datatables.net",
  },
  {
    FNAME: "Leonard",
    LNAME: "Ellison",
    POSITION: "Junior Javascript Developer",
    START: "2010/03/19",
    SALARY: "$205,500",
    MAIL: "l.ellison@datatables.net",
  },
  {
    FNAME: "Lisa",
    LNAME: "Smith",
    POSITION: "Support Lead",
    START: "2011/05/21",
    SALARY: "$342,000",
    MAIL: "l.simth@datatables.net",
  },
  {
    FNAME: "Lucas",
    LNAME: "Dyer",
    POSITION: "Javascript Developer",
    START: "2014/08/23",
    SALARY: "$456,123",
    MAIL: "l.dyer@datatables.net",
  },
  
  {
    FNAME: "Madeleine",
    LNAME: "Lee",
    POSITION: "Software Developer",
    START: "20015/8/23",
    SALARY: "$456,890",
    MAIL: "m.lee@datatables.net",
  },
  {
    FNAME: "Martena",
    LNAME: "Mccray",
    POSITION: "Post-Sales support",
    START: "2011/03/09",
    SALARY: "$324,050",
    MAIL: "m.mccray@datatables.net",
  },
  {
    FNAME: "Michelle",
    LNAME: "House",
    POSITION: "Integration Specialist",
    START: "2016/07/18",
    SALARY: "$76,890",
    MAIL: "m.house@datatables.net",
  },
  {
    FNAME: "Morgan",
    LNAME: "Keith",
    POSITION: "Accountant",
    START: "2012/11/27",
    SALARY: "$675,245",
    MAIL: "m.keith@datatables.net",
  },
  {
    FNAME: "Nathan",
    LNAME: "Mills",
    POSITION: "Senior Marketing Designer",
    START: "2014/10/8",
    SALARY: "$765,980",
    MAIL: "n.mills@datatables.net",
  },
  {
    FNAME: "Olivia",
    LNAME: "Liang",
    POSITION: "Support Engineer",
    START: "2014/02/03",
    SALARY: "$234,500",
    MAIL: "o.liang@datatables.net",
  },
  {
    FNAME: "Penelope",
    LNAME: "Ogden",
    POSITION: "Marketing Manager",
    START: "2013/5/22",
    SALARY: "$345,510",
    MAIL: "p.ogden@datatables.net",
  },
  {
    FNAME: "Prescott",
    LNAME: "Bartlett",
    POSITION: "Technical Author",
    START: "2014/12/25",
    SALARY: "$789,100",
    MAIL: "p.bartlett@datatables.net",
  },
  {
    FNAME: "Ruth",
    LNAME: "May",
    POSITION: "office Manager",
    START: "2010/03/17",
    SALARY: "$654,765",
    MAIL: "r.may@datatables.net",
  },
  {
    FNAME: "Sakura",
    LNAME: "Yamamoto",
    POSITION: "Support Engineer",
    START: "2010/08/19",
    SALARY: "$139,575",
    MAIL: "s.yamamoto@datatables.net",
  },
  {
    FNAME: "Sean",
    LNAME: "Piper",
    POSITION: "Financial Officer",
    START: "2014/06/11",
    SALARY: "$725,000",
    MAIL: "s.piper@datatables.net",
  },
  {
    FNAME: "Serge",
    LNAME: "Baldwin",
    POSITION: "Data Coordinator",
    START: "2017/04/09",
    SALARY: "$138,575",
    MAIL: "s.baldwin@datatables.net",
  },
  {
    FNAME: "Shou",
    LNAME: "Itou",
    POSITION: "Regional Marketing",
    START: "2013/07/19",
    SALARY: "$335,300",
    MAIL: "s.itou@datatables.net",
  },
  {
    FNAME: "Suki",
    LNAME: "Burks",
    POSITION: "Developer",
    START: "2010/11/45",
    SALARY: "$678,890",
    MAIL: "s.burks@datatables.net",
  },
  {
    FNAME: "Thor",
    LNAME: "Walton",
    POSITION: "Developer",
    START: "2012/08/11",
    SALARY: "$98,540",
    MAIL: "t.walton@datatables.net",
  },
  {
    FNAME: "Timothy",
    LNAME: "Mooney",
    POSITION: "Office Manager",
    START: "20016/12/11",
    SALARY: "$136,200",
    MAIL: "t.mooney@datatables.net",
  },
  {
    FNAME: "Trevor",
    LNAME: "Ross",
    POSITION: "Systems Administrator",
    START: "2011/05/23",
    SALARY: "$237,500",
    MAIL: "t.ross@datatables.net",
  },
  {
    FNAME: "Una",
    LNAME: "Richard",
    POSITION: "Personnel Manager",
    START: "2014/5/22",
    SALARY: "$765,290",
    MAIL: "u.richard@datatables.net",
  },
  {
    FNAME: "Unity",
    LNAME: "Butler",
    POSITION: "Marketing Designer",
    START: "2014/7/28",
    SALARY: "$34,983",
    MAIL: "u.butler@datatables.net",
  },
  {
    FNAME: "Vanessa",
    LNAME: "Robertson",
    POSITION: "Software Designer",
    START: "2014/6/23",
    SALARY: "$765,654",
    MAIL: "v.robertson@datatables.net",
  },
  {
    FNAME: "Vivian",
    LNAME: "Harrell",
    POSITION: "Financial Controller",
    START: "2010/02/14",
    SALARY: "$452,500",
    MAIL: "v.harrell@datatables.net",
  },
  {
    FNAME: "Zenaida",
    LNAME: "Frank",
    POSITION: "Software Engineer",
    START: "2018/01/04",
    SALARY: "$125,250",
    MAIL: "z.frank@datatables.net",
  },
  {
    FNAME: "Zorita",
    LNAME: "Serrano",
    POSITION: "Software Engineer",
    START: "2017/06/01",
    SALARY: "$115,000",
    MAIL: "z.serrano@datatables.net",
  },
  
];
export const BasicDataTable = () => {

 
    const tableInstance:any = useTable(
        {
          columns: COLUMNS,
          data: DATATABLE,
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
        <div className="d-block">
          <select
            className="mb-4 border me-1 text-dark bg-transparent"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <GlobalResFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>

        <div className='table-responsive text-center'>   
          <Table
            {...getTableProps()}
            className="border-top-0 table-bordered text-nowrap border-bottom">
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
          Showing 11 to 19 of 19 entries (filtered from 50 total entries){" "}
            <strong>
              {/* {pageIndex + 1} of {pageOptions.length} */}
            </strong>{" "}
          </span>
          <span className="ms-sm-auto">
            <Button
              variant=""
              className="btn-default tablebutton d-sm-inline d-block me-2 my-2"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {" Previous "}
            </Button>
            <Button
              variant="primary"
              className="btn-default tablebutton me-2 my-2"
              onClick={() => {
                previousPage();
              }}
              disabled={!canNextPage}
            >
              {" 1 "}
            </Button>
            <Button
              variant=""
              className="btn-default tablebutton me-2 my-2"
              onClick={() => {
                nextPage();
              }}
              disabled={!canNextPage}
            >
              {" 2 "}
            </Button>
            <Button
              variant=""
              className="btn-default tablebutton me-2 my-2"
              onClick={() => {
                nextPage();
              }}
              disabled={!canNextPage}
            >
                {" 3 "}
            </Button>
            <Button
              variant=""
              className="btn-default tablebutton me-2 my-2"
              onClick={() => {
                nextPage();
              }}
              disabled={!canNextPage}
            >
            
            {" 4 "}
            </Button>
            <Button
              variant=""
              className="btn-default tablebutton me-2 my-2"
              onClick={() => {
                nextPage();
              }}
              disabled={!canNextPage}
            >
              {" 5 "}
            </Button>
            <Button
              variant=""
              className="btn-default tablebutton me-2 my-2"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {" Next "}
            </Button>
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

