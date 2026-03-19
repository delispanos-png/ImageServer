import React, { FC, Fragment, useEffect } from 'react';
import * as SwitcherData from './Data/SwitcherData';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from 'react-router-dom';
interface SwitcherProps { }

const Switcher: FC<SwitcherProps> = () => {
	useEffect(() => {
		SwitcherData.localStorageBackup();
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
											<Link className="btn btn-block ripple btn-secondary" target='_blank' to="https://themeforest.net/item/azea-react-typescript-dashboard-template/46364300">Buy Now</Link>
											<Link to="https://themeforest.net/user/spruko/portfolio" target='_blank'
												className="btn btn-block ripple btn-pink">Our
												Portfolio</Link>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>Navigation Style</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex"
													onClick={() => SwitcherData.vertical()}
												>
													<span className="me-auto">Vertical Menu</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch15"
														id="myonoffswitch34" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch34" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => SwitcherData.horizontal()}>
													<span className="me-auto">Horizontal Click Menu</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch15"
														id="myonoffswitch35" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch35" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => SwitcherData.horizontalhover()}>
													<span className="me-auto">Horizontal Hover Menu</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch15"
														id="myonoffswitch111" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch111" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>LTR and RTL VERSIONS</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex">
													<span className="me-auto">LTR Version</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch7" onClick={() => SwitcherData.Ltr()}
														id="myonoffswitch54" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch54" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2">
													<span className="me-auto">RTL Version</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch7" onClick={() => SwitcherData.Rtl()}
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
												<div className="switch-toggle d-flex" onClick={() => SwitcherData.lighttheme()}>
													<span className="me-auto">Light Theme</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch1"
														id="myonoffswitch1" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch1" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => SwitcherData.darktheme()}>
													<span className="me-auto">Dark Theme</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch1"
														id="myonoffswitch2" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch2" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft horizontal-switcher">
										<h4>Horizontal layout Styles</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex" onClick={() => SwitcherData.defaultlogo()}>
													<span className="me-auto">Default Logo</span>
													<p className="onoffswitch2 my-0"><input type="radio" name="onoffswitch16" id="switchbtn-defaultlogo" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="switchbtn-defaultlogo" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => SwitcherData.centerlogo()}>
													<span className="me-auto">Center Logo</span>
													<p className="onoffswitch2 my-0"><input type="radio" name="onoffswitch16" id="switchbtn-centerlogo" className="onoffswitch2-checkbox" />
														<label htmlFor="switchbtn-centerlogo" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>Theme Color</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex mt-2" >
													<span className="me-auto">Primary Color</span>
													<div>
														<SwitcherData.ThemePrimaryColor />
													</div>
												</div>
												<div className="switch-toggle d-flex mt-2">
													<span className="me-auto">Custom Background</span>
													<div>
														<SwitcherData.Backgroundcolor />
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft menu-styles">
										<h4>Menu Styles</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle lightMenu d-flex">
													<span className="me-auto">Light Menu</span>
													<p className="onoffswitch2">
														<input type="radio" name="onoffswitch2" onClick={() => SwitcherData.lightmenu()}
															id="myonoffswitch3" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch3" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle colorMenu d-flex mt-2" onClick={() => SwitcherData.colormenu()}>
													<span className="me-auto">Color Menu</span>
													<p className="onoffswitch2">
														<input type="radio" name="onoffswitch2"
															id="myonoffswitch4" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch4" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle darkMenu d-flex mt-2" onClick={() => SwitcherData.darkmenu()}>
													<span className="me-auto">Dark Menu</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch2"
														id="myonoffswitch5" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch5" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle gradientMenu d-flex mt-2" onClick={() => SwitcherData.gradientmenu()}>
													<span className="me-auto">Gradient Menu</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch2"
														id="myonoffswitch25" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch25" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft header-styles">
										<h4>Header Styles</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle lightHeader d-flex" onClick={() => SwitcherData.lightheader()}>
													<span className="me-auto">Light Header</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch3"
														id="myonoffswitch6" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch6" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle  colorHeader d-flex mt-2" onClick={() => SwitcherData.colorheader()}>
													<span className="me-auto">Color Header</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch3"
														id="myonoffswitch7" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch7" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle darkHeader d-flex mt-2" onClick={() => SwitcherData.darkheader()}>
													<span className="me-auto">Dark Header</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch3"
														id="myonoffswitch8" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch8" className="onoffswitch2-label"></label>
													</p>
												</div>

												<div className="switch-toggle darkHeader d-flex mt-2" onClick={() => SwitcherData.gradientheader()}>
													<span className="me-auto">Gradient Header</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch3"
														id="myonoffswitch26" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch26" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>Layout Width Styles</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex" onClick={() => SwitcherData.fullwidth()}>
													<span className="me-auto">Full Width</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch4"
														id="myonoffswitch9" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch9" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => SwitcherData.boxwidth()}>
													<span className="me-auto">Boxed</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch4"
														id="myonoffswitch10" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch10" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft">
										<h4>Layout Positions</h4>
										<div className="skin-body">
											<div className="switch_section">
												<div className="switch-toggle d-flex" onClick={() => SwitcherData.fixed()}>
													<span className="me-auto">Fixed</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch5"
														id="myonoffswitch11" className="onoffswitch2-checkbox" defaultChecked />
														<label htmlFor="myonoffswitch11" className="onoffswitch2-label"></label>
													</p>
												</div>
												<div className="switch-toggle d-flex mt-2" onClick={() => SwitcherData.scrollable()}>
													<span className="me-auto">Scrollable</span>
													<p className="onoffswitch2"><input type="radio" name="onoffswitch5"
														id="myonoffswitch12" className="onoffswitch2-checkbox" />
														<label htmlFor="myonoffswitch12" className="onoffswitch2-label"></label>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className="swichermainleft" >
										<h4>Reset All Styles</h4>
										<div className="skin-body">
											<div className="switch_section my-4">
												<button className="btn btn-danger btn-block" onClick={() => { localStorage.clear(); SwitcherData.Reset(); }}
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
