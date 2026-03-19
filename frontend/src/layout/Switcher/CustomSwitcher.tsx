import React, { FC, Fragment, useEffect } from 'react';
import * as CustomSwitcherData from './Data/CustomswitcherData'
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from 'react-router-dom';
interface SwitcherProps { }

const Switcher: FC<SwitcherProps> = () => {
	useEffect(() => {
		CustomSwitcherData.localStorageBackup1();
	})
	return (
		<Fragment>
			<div className="switcher-wrapper">
				<div className="demo_changer">
					<div className="form_holder sidebar-right1">
						<PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
							<div className="row">

								<div className="predefined_styles">

									<div className="swichermainleft text-center">
										<div className="p-3">
											<Link to="https://react.spruko.com/azea-ts/" target='_blank'
												className="btn btn-block ripple btn-primary mt-0">View
												Demo</Link>
											<Link className="btn btn-block ripple btn-secondary"  to="https://themeforest.net/item/azea-react-typescript-dashboard-template/46364300" target='_blank'>Buy Now</Link>
											<Link to="https://themeforest.net/user/spruko/portfolio" target='_blank'
												className="btn btn-block ripple btn-pink">Our
												Portfolio</Link>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>LTR and RTL VERSIONS</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex">
													<span className="me-auto">LTR Version</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch7" onClick={() => CustomSwitcherData.Ltr()}
														id="myonoffswitch54" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch54" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2">
													<span className="me-auto">RTL Version</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch7" onClick={() => CustomSwitcherData.Rtl()}
														id="myonoffswitch55" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch55" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>Light Theme Style</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex" onClick={() => CustomSwitcherData.lighttheme()}>
													<span className="me-auto">Light Theme</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch1"
														id="myonoffswitch1" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch1" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => CustomSwitcherData.darkmode()}>
													<span className="me-auto">Dark Theme</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch1"
														id="myonoffswitch2" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch2" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft" >
										<h4>Reset All Styles</h4>
										<div className="skin-body">
											<div className="switch_section my-4">
												<button className="btn btn-danger btn-block" onClick={() => { localStorage.clear(); CustomSwitcherData.Reset1(); }}
													type="button">Reset All
												</button>
											</div>
										</div>
									</div>
								</div>

							</div>
						</PerfectScrollbar>
					</div>
				</div>
			</div>
		</Fragment>
	)
};

export default Switcher;
