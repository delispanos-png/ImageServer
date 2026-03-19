import React, { FC, Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { ApexChart, ApexChartbar, BasicAreaChart, BasicBarChart, DateTime, StackedBar, } from './chartdata2/Mainchart';
import PageHeader from '../../../../layout/Header/pageheader';
interface ApexChartsProps { }

const ApexChartsdata: FC<ApexChartsProps> = () => (

	<Fragment>
		<PageHeader title="Apex Charts" />
		<Row className="row-deck">
			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Area Chart With Random data</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="chartjs-wrapper-demo">
							<DateTime />
						</div>
					</Card.Body>
				</Card>
			</Col>

			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Area Chart</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="chartjs-wrapper-demo">
							<BasicAreaChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			{/* <!-- col-6 --> */}
			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Horizontal Bar Chart</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="chartjs-wrapper-demo">
							<BasicBarChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Horizontal Stacked Bar Chart</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="chartjs-wrapper-demo">
							<StackedBar />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Radial Bar circle Chart</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="chartjs-wrapper-demo">
							<ApexChart />

						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col sm={12} lg={6}>
				<Card>
					<Card.Header>
						<Card.Title>Radial Bar circle Chart Multiple</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="chartjs-wrapper-demo">
							<ApexChartbar />
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	</Fragment>
);

export default ApexChartsdata;
