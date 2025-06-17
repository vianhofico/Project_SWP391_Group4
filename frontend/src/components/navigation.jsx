import React from "react";
import { Link } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";

export const Navigation = () => {
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          {/* <a className="navbar-brand page-scroll" href="#page-top">
            REACT LANDING PAGE
          </a> */}
          <Link to="/">
            REACT LANDING PAGE
          </Link>
        </div>
        <div className="navbar-collapse">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#features" className="page-scroll">Features</a></li>
            <li><a href="#about" className="page-scroll">About</a></li>
            <li><a href="#services" className="page-scroll">Services</a></li>
            <li>
              <Link to="/cart">
                <FaShoppingCart color="black" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// import React, { useContext } from "react";
// import { Link } from 'react-router-dom';
// import { FaShoppingCart } from "react-icons/fa";
// import { CartContext } from "./components/"; // Cập nhật đường dẫn phù hợp

// export const Navigation = () => {
//   const { cartItems } = useContext(CartContext);

//   return (
//     <nav className="navbar navbar-default navbar-fixed-top">
//       <div className="container">
//         <div className="navbar-header">
//           <Link to="/">REACT LANDING PAGE</Link>
//         </div>
//         <div className="navbar-collapse">
//           <ul className="nav navbar-nav navbar-right">
//             <li><a href="#features" className="page-scroll">Features</a></li>
//             <li><a href="#about" className="page-scroll">About</a></li>
//             <li><a href="#services" className="page-scroll">Services</a></li>
//             <li>
//               <Link to="/cart" className="cart-icon-wrapper">
//                 <FaShoppingCart color="black" size={20} />
//                 {cartItems.length > 0 && (
//                   <span className="cart-count">{cartItems.length}</span>
//                 )}
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };



