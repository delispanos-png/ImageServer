import React from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { Button, Table } from 'react-bootstrap';

export const COLUMNS: any = [
  {
    Header: "First Name",
    accessor: "NAME",
    className: "wd-15p border-bottom-0",
  },
  {
    Header: "Last Name",
    accessor: "LASTNAME",
    className: "wd-15p border-bottom-0 ",

  },
  {
    Header: "Position",
    accessor: "POSITION",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Office",
    accessor: "OFFICE",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Age",
    accessor: "AGE",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Start Date",
    accessor: "STARTDATE",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Salary",
    accessor: "SALARY",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "Extn.",
    accessor: "EXTN",
    className: "wd-15p border-bottom-0 ",
  },
  {
    Header: "E-Mail",
    accessor: "EMAIL",
    className: "wd-15p border-bottom-0 ",
  }
];

export const DATATABLE: any = [
  {
    id: "1",
    NAME: "Airi ",
    LASTNAME: 'Satou',
    POSITION: "Accountant",
    OFFICE: 'Tokyo',
    AGE: '33',
    STARTDATE: '2008/11/28',
    SALARY: '$162,700',
    EXTN: '5407',
    EMAIL: 'a.satou@datatables.net',
},
{
  id: "2",
    NAME: "Angelica ",
    LASTNAME:'Ramos',
      POSITION: "Chief Executive Officer (CEO)",
        OFFICE: 'London',
          AGE: '47',
            STARTDATE: '2009/10/09',
              SALARY: '$1,200,000',
              EXTN: '5957',
              EMAIL: 'a.ramos@datatables.net',
},
{
  id: "3",
    NAME: "Ashton ",
    LASTNAME:'Cox',
      POSITION: "Junior Technical Author",
        OFFICE: 'San Francisco',
          AGE: '66',
            STARTDATE: '2009/01/12',
              SALARY: '$86,000',
              EXTN: '5957',
              EMAIL: 'a.ramos@datatables.net',
},
{
  id: "4",
    NAME: "Bradley ",
    LASTNAME:'Greer',
      POSITION: "Software Engineer",
        OFFICE: 'London',

          AGE: '41',
            STARTDATE: '2012/10/13',
              SALARY: '$132,000', 
               EXTN: '1562',
              EMAIL: 'a.cox@datatables.net',
},
{
  id: "5",
    NAME: "Brielle ",
    LASTNAME:'Williamson',
      POSITION: "Integration Specialist",
        OFFICE: 'New York',

          AGE: '61',
            STARTDATE: '2012/12/02',
              SALARY: '$372,000',
              EXTN: '2558',
              EMAIL: 'b.greer@datatables.net',
},
{
  id: "7",
    NAME: "Brrighten ",
    LASTNAME:'Wagner',
      POSITION: "Software Engineer",
        OFFICE: 'San Francisco',

          AGE: '28',
            STARTDATE: '2011/06/07',
              SALARY: '$206,850',
              EXTN: '4804',
              EMAIL: 'b.williamson@datatables.net',
},
{
  id: "8",
    NAME: "Bruno ",
    LASTNAME:'Nash',
      POSITION: "Software Engineer",
        OFFICE: 'London',

          AGE: '38',
            STARTDATE: '2011/05/03',
              SALARY: '$163,500',
              EXTN: '1314',
              EMAIL: 'b.wagner@datatables.net',
},
{
  id: "9",
    NAME: "Caesar ",
    LASTNAME:'Vance',
      POSITION: "Pre-Sales Support",
        OFFICE: 'New York',

          AGE: '21',
            STARTDATE: '2011/12/12',
              SALARY: '$106,450',
              EXTN: '6222',
              EMAIL: 'b.nash@datatables.net',
},
{
  id: "10",
    NAME: "Cara ",
    LASTNAME:'Stevens',
      POSITION: "Sales Assistant",
        OFFICE: 'New York',

          AGE: '46',
            STARTDATE: '2011/12/068',
              SALARY: '$145,600',
              EXTN: '8330',
              EMAIL: 'c.vance@datatables.net',
},
{
  id: "11",
    NAME: "Cedric ",
    LASTNAME:'Kelly',
      POSITION: "Senior Javascript Developer",
        OFFICE: 'Edinburgh',

          AGE: '22',
            STARTDATE: '2012/03/29',
              SALARY: '$433,060',
              EXTN: '3990',
              EMAIL: 'c.stevens@datatables.net',
},
{
  id: "12",
    NAME: "Charde ",
    LASTNAME:'Marshall',
      POSITION: "Regional Director",
        OFFICE: 'San Francisco',

          AGE: '36',
            STARTDATE: '2008/10/16',
              SALARY: '$470,600',
              EXTN: '6741',
              EMAIL: 'c.marshall@datatables.net',
},
{
  id: "13",
    NAME: "Colleen ",
    LASTNAME:'Hurst',
      POSITION: "Javascript Developer",
        OFFICE: 'San Francisco',

          AGE: '39',
            STARTDATE: '2009/09/15',
              SALARY: '$205,500',
              EXTN: '2630',
              EMAIL: 'c.hurst@datatables.net',
},
{
  id: "14",
    NAME: "Dai ",
    LASTNAME:'Rios',
      POSITION: "Personnel Lead",
        OFFICE: 'Edinburgh',

          AGE: '35',
            STARTDATE: '2012/09/26',
              SALARY: '$217,500',
              EXTN: '2290',
              EMAIL: 'd.rios@datatables.net',
},
{
  id: "15",
    NAME: "Donna ",
    LASTNAME:'Snider',
      POSITION: "Customer Support",
        OFFICE: 'New York',

          AGE: '27',
            STARTDATE: '2011/01/25',
              SALARY: '$112,000',
              EXTN: '4226',
              EMAIL: 'd.snider@datatables.net',
},
{
  id: "16",
    NAME: "Doris",
    LASTNAME:'Wilder',
      POSITION: "Sales Assistant",
        OFFICE: 'Sidney',

          AGE: '23',
            STARTDATE: '2010/09/20',
              SALARY: '$85,600',
              EXTN: '3023',
              EMAIL: 'd.wilder@datatables.net',
},
{
  id: "17",
    NAME: "Finn ",
    LASTNAME:'Camacho',
      POSITION: "Support Engineer",
        OFFICE: 'San Francisco',

          AGE: '47',
            STARTDATE: '2009/07/07',
              SALARY: '$87,500',
              EXTN: '2927',
              EMAIL: 'f.camacho@datatables.net',
},
{
  id: "18",
    NAME: "Fiona ",
    LASTNAME:'Green',
      POSITION: "Chief Operating Officer (COO)",
        OFFICE: 'San Francisco',

          AGE: '48',
            STARTDATE: '2010/03/11',
              SALARY: '$850,000',
              EXTN: '2947',
              EMAIL: 'f.green@datatables.net',
},
{
  id: "19",
    NAME: "Garrett ",
    LASTNAME:'Winters',
      POSITION: "Accountant",
        OFFICE: 'Tokyo',

          AGE: '63',
            STARTDATE: '2011/07/25',
              SALARY: '$170,750',
              EXTN: '8422',
              EMAIL: 'g.winters@datatables.net',
},
{
  id: "20",
    NAME: "Gavin ",
    LASTNAME:'Cortez',
      POSITION: "Team Leader",
        OFFICE: 'San Francisco',

          AGE: '22',
            STARTDATE: '2008/10/26',
              SALARY: '$235,500',
              EXTN: '8822',
              EMAIL: 'g.joyce@datatables.net',
},
{
  id: "21",
    NAME: "Gavin ",
    LASTNAME:'Joyce',
      POSITION: "Developer",
        OFFICE: 'Edinburgh',

          AGE: '42',
            STARTDATE: '2010/12/22',
              SALARY: '$92,575',
              EXTN: '2860',
              EMAIL: 'g.cortez@datatables.net',
},
{
  id: "22",
    NAME: "Gloria ",
    LASTNAME:'Little',
      POSITION: "Systems Administrator",
        OFFICE: 'New York',

          AGE: '59',
            STARTDATE: '2009/04/10',
              SALARY: '$237,500',
              EXTN: '1721',
              EMAIL: 'g.little@datatables.net',
},
{
  id: "23",
    NAME: "Haley ",
    LASTNAME:'Kennedy',
      POSITION: "Senior Marketing Designer",
        OFFICE: 'London',

          AGE: '43',
            STARTDATE: '2012/12/18',
              SALARY: '$313,500',
              EXTN: '3597',
              EMAIL: 'h.kennedy@datatables.net',
},
{
  id: "24",
    NAME: "Hermione ",
    LASTNAME:'Butler',
      POSITION: "Regional Director",
        OFFICE: 'London',

          AGE: '47',
            STARTDATE: '2011/03/21',
              SALARY: '$356,250',
              EXTN: '1016',
              EMAIL: 'h.butler@datatables.net',
},
{
  id: "25",
    NAME: "Herrod ",
    LASTNAME:'Chandler',
      POSITION: "Sales Assistant",
        OFFICE: 'San Francisco',

          AGE: '59',
            STARTDATE: '2012/08/06',
              SALARY: '$137,500',
              EXTN: '9608',
              EMAIL: 'h.chandler@datatables.net',
},
{
  id: "26",
    NAME: "Hope ",
    LASTNAME:'Fuentes',
      POSITION: "Secretary",
        OFFICE: 'San Francisco',

          AGE: '41',
            STARTDATE: '2010/02/12',
              SALARY: '$109,850',
              EXTN: '6318',
              EMAIL: 'h.fuentes@datatables.net',
},
{
  id: "27",
    NAME: "Howard ",
    LASTNAME:'Hatfield',
      POSITION: "Office Manager",
        OFFICE: 'San Francisco',

          AGE: '51',
            STARTDATE: '2008/12/16',
              SALARY: '$164,500',
              EXTN: '7031',
              EMAIL: 'h.hatfield@datatables.net',
},
{
  id: "28",
    NAME: "Jackson ",
    LASTNAME:'Bradshaw',
      POSITION: "Director",
        OFFICE: 'New York',

          AGE: '65',
            STARTDATE: '2008/09/26',
              SALARY: '$645,750',
              EXTN: '1041',
              EMAIL: 'j.bradshaw@datatables.net',
},
{
  id: "29",
    NAME: "Jena ",
    LASTNAME:'Gaines',
      POSITION: "Office Manager",
        OFFICE: 'London',

          AGE: '30',
            STARTDATE: '2008/12/19',
              SALARY: '$90,560',
              EXTN: '3814',
              EMAIL: 'j.gaines@datatables.net',
},
{
  id: "30",
    NAME: "Jenette ",
    LASTNAME:'Caldwell',
      POSITION: "Development Lead",
        OFFICE: 'New York',

          AGE: '30',
            STARTDATE: '2011/09/03',
              SALARY: '$345,000',
              EXTN: '1937',
              EMAIL: 'j.caldwell@datatables.net',
},
{
  id: "31",
  NAME: "Jennifer ",
  LASTNAME:'Acosta',
  POSITION: "Junior Javascript Developer",
  OFFICE:'Edinburgh',
  EXTN: '3431',
  EMAIL: 'j.acosta@datatables.net',
 
 AGE:'43',
 STARTDATE:'2013/02/01',
 SALARY:'$75,650',
},
{
id: "32",
NAME: "Jennifer ",
LASTNAME:'Chang',
POSITION: "Regional Director",
OFFICE:'Singapore',

AGE:'28',
STARTDATE:'2010/11/14',
SALARY:'$357,650',
EXTN: '8196',
EMAIL: 'j.alexander@datatables.net',
},
{
id: "33",
NAME: "Jonas",
LASTNAME:'Alexander',
POSITION: "Developer",
OFFICE:'San Francisco',

AGE:'30',
STARTDATE:'2010/07/14',
SALARY:'$86,500',
EXTN: '8196',
EMAIL: 'j.alexander@datatables.net',
},
{
id: "34",
NAME: "Lael ",
LASTNAME:'Greer',
POSITION: "Systems Administrator",
OFFICE:'London',

AGE:'21',
STARTDATE:'2009/02/27',
SALARY:'$103,500',
EXTN: '8240',
EMAIL: 	'l.gr eer@datatables.net',
},
{
id: "35",
NAME: "Martena",
LASTNAME:'Mccray',
POSITION: "Post-Sales support",
OFFICE:'Edinburgh',

AGE:'46',
STARTDATE:'2011/03/09',
SALARY:'$324,050',
EXTN: '1589',
EMAIL: 'm.mccray@datatables.net',
},
{
id: "36",
NAME: "Michael ",
LASTNAME:'Bruce',
POSITION: "Javascript Developer",
OFFICE:'Singapore',

AGE:'29',
STARTDATE:'2011/06/27',
SALARY:'$183,000',
EXTN: '5384',
EMAIL: 'm.bruce@datatables.net',
},
{
id: "37",
NAME: "Michael ",
LASTNAME:'Silva',
POSITION: "Marketing Designer",
OFFICE:'London',

AGE:'66',
STARTDATE:'2012/11/27',
SALARY:'$198,500',
EXTN: '1589',
EMAIL: 'm.silva@datatables.net',
},
{
id: "38",
NAME: "Michelle ",
LASTNAME:'House',
POSITION: "Integration Specialist",
OFFICE:'Sidney',

AGE:'37',
STARTDATE:'2011/06/02',
SALARY:'$95,400',
EXTN: '2769',
EMAIL: 'm.house@datatables.net',
},
{
id: "39",
NAME: "Olivia ",
LASTNAME:'Liang',
POSITION: "Support Enginee",
OFFICE:'Singapore',

AGE:'64',
STARTDATE:'2011/02/03',
SALARY:'$234,500',
EXTN: '2120',
EMAIL: 'o.liang@datatables.net',
},
{
id: "40",
NAME: "Paul ",
LASTNAME:'Byrd',
POSITION: "Chief Financial Officer (CFO)",
OFFICE:'New York',

AGE:'64',
STARTDATE:'2010/06/09',
SALARY:'$725,000',
EXTN: '3059',
EMAIL: 'p.byrd@datatables.net',
},
{
id: "41",
NAME: "Prescott",
LASTNAME:'Bartlett',
POSITION: "Technical Author",
OFFICE:'London',

AGE:'27',
STARTDATE:'2011/05/07',
SALARY:'$145,000',
EXTN: '3606',
EMAIL: 'p.bartlett@datatables.net',
},
{
id: "42",
NAME: "Quinn",
LASTNAME:'Flynn',
POSITION: "Support Lead",
OFFICE:'Edinburgh',

AGE:'22',
STARTDATE:'2013/03/03',
SALARY:'$342,000',
EXTN: '9497',
EMAIL: 'q.flynn@datatables.net',
},
{
id: "43",
NAME: "Rhona ",
LASTNAME:'Davidson',
POSITION: "Integration Specialist",
OFFICE:'Tokyo',

AGE:'55',
STARTDATE:'2010/10/14',
SALARY:'$327,900',
EXTN: '6200',
EMAIL: 'r.davidson@datatables.net',
},
{
id: "44",
NAME: "Sakura ",
LASTNAME:'Yamamoto',
POSITION: "Support Engineer",
OFFICE:'Tokyo',

AGE:'37',
STARTDATE:'2009/08/19',
SALARY:'$139,575',
EXTN: '9383',
EMAIL: 's.yamamoto@datatables.net',
},
{
id: "45",
NAME: "Serge ",
LASTNAME:'Baldwin',
POSITION: "Data Coordinator",
OFFICE:'Singapore',

AGE:'64',
STARTDATE:'2012/04/09',
SALARY:'$138,575',
EXTN: '8352',
EMAIL: 's.baldwin@datatables.net',
},
{
id: "46",
NAME: "Shad ",
LASTNAME:'Decker',
POSITION: "Regional Director",
OFFICE:'Edinburgh',

AGE:'51',
STARTDATE:'2008/11/13',
SALARY:'$183,000',
EXTN: '6373',
EMAIL: 's.decker@datatables.net',
},
{
id: "47",
NAME: "Shou ",
LASTNAME:'Itou',
POSITION: "Regional Marketing",
OFFICE:'Tokyo',

AGE:'20',
STARTDATE:'2011/08/14',
SALARY:'$163,000',
EXTN: '8899',
EMAIL: 's.itou@datatables.net',
},
{
id: "48",
NAME: "Sonya ",
LASTNAME:'Frost',
POSITION: "Software Engineer",
OFFICE:'London',

AGE:'19',
STARTDATE:'2010/03/17',
SALARY:'$385,750',
EXTN: '1667',
EMAIL: 's.frost@datatables.net',
},
{
id: "49",
NAME: "Thor ",
LASTNAME:'Walton',
POSITION: "DevelopER",
OFFICE:'New York',

AGE:'61',
STARTDATE:'2013/08/11',
SALARY:'$98,540',
EXTN: '6832',
EMAIL: 's.burks@datatables.net',
},
{
id: "50",
NAME: "Tiger",
LASTNAME:'Nixon',
POSITION: "System Architect",
OFFICE:'Edinburgh',

AGE:'61',
STARTDATE:'2011/04/25',
SALARY:'$320,800',
EXTN: '1965',
EMAIL: 't.fitzpatrick@datatables.net',
},

  
];
export const DisplayTable = () => {

  const tableInstance: any = useTable(
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
          {/* <select
            className="mb-4 border me-1 text-dark bg-transparent"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((pageSize) => (
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
