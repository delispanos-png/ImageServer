import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { BasicDataTable } from './Data/BasicData';
import { ResponsiveDataTable } from './Data/ResponsiveData';
import { ExportCSV } from './Data/ExportData';
import { DataTabless } from './Data/DeleteData';
import { DisplayTable } from './Data/DisplayData';

interface DataTableProps { }

const DataTable: FC<DataTableProps> = () => (
	<Fragment>
		<PageHeader title="Data Tables" />
		<Row>
			<Col className="col-12">
				<Card>
					<Card.Header>
						<Card.Title>Basic DataTable</Card.Title>
					</Card.Header>
					<Card.Body>
						<BasicDataTable />
					</Card.Body>
				</Card>
				<Card>
					<Card.Header>
						<Card.Title>Responsive DataTable</Card.Title>
					</Card.Header>
					<Card.Body>
						<ResponsiveDataTable />
					</Card.Body>
				</Card>
				<Card>
					<Card.Header>
						<Card.Title>File Export</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className='file-export-datatable'>
							<ExportCSV />
						</div>
					</Card.Body>
				</Card>
				<Row className="row row-sm">
					<Col lg={12}>
						<Card>
							<Card.Header>
								<Card.Title>Deleted Row DataTable</Card.Title>
							</Card.Header>
							<Card.Body>
								<div className='deleted-row-table'>
									<DataTabless />
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Card>
					<Card.Header>
						<Card.Title>Details Display DataTable</Card.Title>
					</Card.Header>
					<Card.Body>
						<DisplayTable />
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Fragment>
);

export default DataTable;
