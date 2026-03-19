import React from "react";
import { Form, Table } from "react-bootstrap";

//Emailinbox
interface email {
  id: number
  heading: string
  icon: string
  text: string
 color: string
}
export const emails: email[]=[
  {id:1,heading:'Inbox', icon:'inbox',text:'14', color:'info'},
  {id:2,heading:'Sent mail', icon:'mail',text:'', color:''},
  {id:3, heading:'Important', text:'03', icon:'alert-octagon',color:'danger'},
  {id:4,heading:'Starred', icon:'star',text:'', color:''},
  {id:5,heading:'Drafts', icon:'briefcase',text:'', color:''},
  {id:6,heading:'Tags', icon:'tag',text:'', color:''},
  {id:7,heading:'Trash', icon:'trash-2',text:'', color:''},

]
//Emailcolor
interface emailcolor {
  id: number
  heading: string
  color: string
}
export const emailcolors: emailcolor[]=[
  {id:1, heading:'Friends', color:'primary'},
  {id:2, heading:'Family', color:'secondary'},
  {id:3, heading:'Social', color:'success'},
  {id:4, heading:'Office', color:'info'},
  {id:5, heading:'Work', color:'warning'},
  {id:6, heading:'Settings', color:'danger'},
]

//EmailInboxdata
export function EmailInboxdata() {
  const mailInboxdata = [
    {
      star: "warning",
      semibold: "Tim Reid, S P N",
      message: "Boost Your Website Traffic",
      month: "April 01",
    },
    {
      star: "warning",
      semibold: "Freelancer.com",
      message: "Stop wasting your visitors",
      month: "May 23",
    },
    {
      star1: "danger",
      semibold: "PHPClass",
      message: "Added a new className: Login className Fast Site",
      month: "9:27 AM",
      UNEAD: "unread",
    },
    {
      star: "",
      star1: "",
      semibold: "Facebook",
      message: "Somebody requested a new password",
      month: "June 13",
    },
    {
      star: "warning",
      star1: "",
      semibold: "Skype",
      message: "Password successfully changed",
      month: "March 24",
    },
    {
      star: "warning",
      star1: "",
      semibold: "Google+",
      message: "alireza, do you know",
      month: "March 09",
    },
    {
      star: "warning",
      star1: "",
      semibold: "WOW Slider",
      message: "New WOW Slider v7.8 - 67% off",
      month: "March 14",
    },
    {
      star: "warning",
      star1: "",
      semibold: "LinkedIn Pulse",
      message: "The One Sign Your Co-Worker Will Stab",
      month: "Feb 19",
    },
    {
      star: "",
      star1: "",
      semibold: "Google Webmaster",
      message: "Improve the search presence of WebSite",
      month: "March 15",
      UNEAD: "unread",
    },
    {
      star: "",
      star1: "",
      semibold: "JW Player",
      message: "Last Chance: Upgrade to Pro for",
      month: "March 15",
    },
    {
      star: "",
      star1: "",
      semibold: "Drupal Community",
      message: "Welcome to the Drupal Community",
      month: "March 04",
    },
    {
      star: "warning",
      star1: "",
      semibold: "Zoosk",
      message: "7 new singles we think you'll like",
      month: "May 14",
    },
    {
      star: "",
      star1: "danger",
      semibold: "LinkedIn",
      message: "Alireza: Nokia Networks, System Group and",
      month: "February 25",
    },
    {
      star: "",
      star1: "",
      semibold: "Facebook",
      message: "Your account was recently logged into",
      month: "April 07",
    },
    {
      star: "",
      star1: "",
      semibold: "Twitter",
      message: "Your Twitter password has been changed",
      month: "March 04",
    },
    {
      star: "",
      star1: "",
      semibold: "InternetSeer",
      message: "Performance Report",
      month: "July 14",
    },
    {
      star: "",
      star1: "danger",
      semibold: "Bertina",
      message: "IMPORTANT: Don't lose your domains!",
      month: "June 16",
    },
    {
      star: "warning",
      star1: "danger",
      semibold: "Laura Gaffin, S P N",
      message: "Your Website On Google (Higher Rankings Are Better)",
      month: "August 10",
    },
    {
      star: "",
      star1: "",
      semibold: "Facebook",
      message: "Alireza Zare Login faild",
      month: "feb 14",
    },
    {
      star: "warning",
      star1: "",
      semibold: "AddMe.com",
      message: "Submit Your Website to the AddMe Business Directory",
      month: "August 10",
    },
    {
      star: "",
      star1: "",
      semibold: "Terri Rexer, S P N",
      message: "Forget Google AdWords: Un-Limited Clicks fo",
      month: "April 14",
    },
  ];
  return (
   
    <Table className="table table-inbox table-hover text-nowrap mb-0 ">
     
        <tbody>
        {mailInboxdata.map((playerData, k) => (
          <tr className={`${playerData.UNEAD}`}  key={k}>
            <td className="inbox-small-cells">
             
              <Form.Check type="checkbox"  />
              
            </td>
            <td className="inbox-small-cells">
              <i className={`fa fa-star text-${playerData.star}`}></i>
            </td>
            <td className="inbox-small-cells">
              <i className={`fa fa-bookmark text-${playerData.star1}`}></i>
            </td>
            <td className="view-message dont-show fw-semibold">
              {playerData.semibold}
            </td>
            <td className="view-message">{playerData.message}</td>
            <td className="view-message text-end fw-semibold">
              {playerData.month}
            </td>
          </tr>
      ))}
        </tbody>
    </Table>

  );
}
