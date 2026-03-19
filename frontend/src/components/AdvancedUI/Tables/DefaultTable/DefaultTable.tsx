import React, { FC, Fragment } from 'react';
import PageHeader from '../../../../layout/Header/pageheader';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { tables, colortables } from './Data/DefaultData';

interface DefaultTableProps { }

const DefaultTable: FC<DefaultTableProps> = () => (
	<Fragment>
		<PageHeader title="Tables" />
		<Row>
			<Col md={12} lg={12}>
				{tables.map((table) => (
					<Card key={Math.random()}>
						<Card.Header>
							<Card.Title>{table.heading}</Card.Title>
						</Card.Header>
						<div className="table-responsive">
							<Table className={`table ${table.data} card-table table-vcenter text-nowrap`}>
								<thead>
									<tr className={table.class}>
										<th>ID</th>
										<th>Name</th>
										<th>Position</th>
										<th>Salary</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th scope="row">1</th>
										<td>Joan Powell </td>
										<td>Associate Developer</td>
										<td>$450,870</td>
									</tr>
									<tr className={table.color}>
										<th scope="row">2</th>
										<td>Gavin Gibson</td>
										<td>Account manager</td>
										<td>$230,540</td>
									</tr>
									<tr>
										<th scope="row">3</th>
										<td>Julian Kerr</td>
										<td>Senior Javascript Developer</td>
										<td>$55,300</td>
									</tr>
									<tr className={table.color}>
										<th scope="row">4</th>
										<td>Cedric Kelly</td>
										<td>Accountant</td>
										<td>$234,100</td>
									</tr>
									<tr>
										<th scope="row">5</th>
										<td>Samantha May</td>
										<td>Junior Technical Author</td>
										<td>$43,198</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</Card>
				))}
				<Card>
					<Card.Header>
						<Card.Title>Hoverable Rows Table</Card.Title>
					</Card.Header>
					<Card.Body className="p-0">
						<div className="table-responsive">
							<Table className="table table-hover card-table table-vcenter text-nowrap">
								<thead>
									<tr>
										<th>ID</th>
										<th>Name</th>
										<th>Position</th>
										<th>Salary</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th scope="row">1</th>
										<td>Tiger Nixon</td>
										<td>System Architect</td>
										<td>$320,800</td>
									</tr>
									<tr>
										<th scope="row">2</th>
										<td>Garrett Winters</td>
										<td>Accountant</td>
										<td>$170,750</td>
									</tr>
									<tr>
										<th scope="row">3</th>
										<td>Ashton Cox</td>
										<td>Junior Technical Author</td>
										<td>$86,000</td>
									</tr>
									<tr>
										<th scope="row">4</th>
										<td>Cedric Kelly</td>
										<td>Senior Javascript Developer</td>
										<td>$433,060</td>
									</tr>
									<tr>
										<th scope="row">5</th>
										<td>Airi Satou</td>
										<td>Accountant</td>
										<td>$162,700</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</Card.Body>
				</Card>
				{colortables.map((colortable) => (
					<Card key={Math.random()}>
						<Card.Header>
							<Card.Title>{colortable.heading}</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="table-responsive">
								<Table className={`table table-bordered card-table table-${colortable.color} table-vcenter text-nowrap`}>
									<thead>
										<tr>
											<th>ID</th>
											<th>Name</th>
											<th>Position</th>
											<th>Salary</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th scope="row">1</th>
											<td>Joan Powell</td>
											<td>Associate Developer</td>
											<td>$450,870</td>
										</tr>
										<tr>
											<th scope="row">2</th>
											<td>Gavin Gibson</td>
											<td>Account manager</td>
											<td>$230,540</td>
										</tr>
										<tr>
											<th scope="row">3</th>
											<td>Julian Kerr</td>
											<td>Senior Javascript Developer</td>
											<td>$55,300</td>
										</tr>
										<tr>
											<th scope="row">4</th>
											<td>Cedric Kelly</td>
											<td>Accountant</td>
											<td>$234,100</td>
										</tr>
										<tr className="border-bottom">
											<th scope="row">5</th>
											<td>Samantha May</td>
											<td>Junior Technical Author</td>
											<td>$43,198</td>
										</tr>
									</tbody>
								</Table>
							</div>
						</Card.Body>
					</Card>
				))}
			</Col>
		</Row>
	</Fragment>
);

export default DefaultTable;
