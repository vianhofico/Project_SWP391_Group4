import { useState } from "react";
import emailjs from "emailjs-com";
// import React from "react";
//
// const initialState = {
//   name: "",
//   email: "",
//   message: "",
// };
// export const Contact = (props) => {
//   const [{ name, email, message }, setState] = useState(initialState);
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setState((prevState) => ({ ...prevState, [name]: value }));
//   };
//   const clearState = () => setState({ ...initialState });
//
//
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(name, email, message);
//
//     {/* replace below with your own Service ID, Template ID and Public Key from your EmailJS account */ }
//
//     emailjs
//       .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_PUBLIC_KEY")
//       .then(
//         (result) => {
//           console.log(result.text);
//           clearState();
//         },
//         (error) => {
//           console.log(error.text);
//         }
//       );
//   };
//   return (
//     <div>
//       <div id="contact">
//         <div className="container">
//           <div className="col-md-8">
//             <div className="row">
//               <div className="section-title">
//                 <h2>Get In Touch</h2>
//                 <p>
//                   Please fill out the form below to send us an email and we will
//                   get back to you as soon as possible.
//                 </p>
//               </div>
//               <form name="sentMessage" validate onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         className="form-control"
//                         placeholder="Name"
//                         required
//                         onChange={handleChange}
//                       />
//                       <p className="help-block text-danger"></p>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         className="form-control"
//                         placeholder="Email"
//                         required
//                         onChange={handleChange}
//                       />
//                       <p className="help-block text-danger"></p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <textarea
//                     name="message"
//                     id="message"
//                     className="form-control"
//                     rows="4"
//                     placeholder="Message"
//                     required
//                     onChange={handleChange}
//                   ></textarea>
//                   <p className="help-block text-danger"></p>
//                 </div>
//                 <div id="success"></div>
//                 <button type="submit" className="btn btn-custom btn-lg">
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//           <div className="col-md-3 col-md-offset-1 contact-info">
//             <div className="contact-item">
//               <h3>Contact Info</h3>
//               <p>
//                 <span>
//                   <i className="fa fa-map-marker"></i> Address
//                 </span>
//                 {props.data ? props.data.address : "loading"}
//               </p>
//             </div>
//             <div className="contact-item">
//               <p>
//                 <span>
//                   <i className="fa fa-phone"></i> Phone
//                 </span>{" "}
//                 {props.data ? props.data.phone : "loading"}
//               </p>
//             </div>
//             <div className="contact-item">
//               <p>
//                 <span>
//                   <i className="fa fa-envelope-o"></i> Email
//                 </span>{" "}
//                 {props.data ? props.data.email : "loading"}
//               </p>
//             </div>
//           </div>
//           <div className="col-md-12">
//             <div className="row">
//               <div className="social">
//                 <ul>
//                   <li>
//                     <a href={props.data ? props.data.facebook : "/"}>
//                       <i className="fa fa-facebook"></i>
//                     </a>
//                   </li>
//                   <li>
//                     <a href={props.data ? props.data.twitter : "/"}>
//                       <i className="fa fa-twitter"></i>
//                     </a>
//                   </li>
//                   <li>
//                     <a href={props.data ? props.data.youtube : "/"}>
//                       <i className="fa fa-youtube"></i>
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div id="footer">
//         <div className="container text-center">
//           <p>
//             &copy; 2023 Issaaf Kattan React Land Page Template. Design by{" "}
//             <a href="http://www.templatewire.com" rel="nofollow">
//               TemplateWire
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";

export const Contact = (props) => {
  return (
      <footer className="bg-light mt-5 pt-5 border-top">
        <div className="container pb-4">
          {/* Logo + bản quyền + social cuối */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="text-muted small text-center text-md-start mb-2 mb-md-0">
              Copyright © 2025.
              Made with <span className="text-danger">❤</span> in VietNam (Powered by React & MUI)
            </div>
            <div className="d-flex gap-3 fs-5">
              <a href="#"><i className="fa fa-youtube"></i></a>
              <a href="#"><i className="fa fa-facebook"></i></a>
              <a href="#"><i className="fa fa-tiktok"></i></a>
              <a href="#"><i className="fa fa-udemy">U</i></a>
            </div>
          </div>
        </div>
      </footer>
  );
};
