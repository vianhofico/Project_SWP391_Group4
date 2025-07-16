import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Learn More
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
//
// export const Header = (props) => {
//   return (
//       <header id="header" className="bg-light" style={{ height: "100vh" }}>
//         <div className="d-flex align-items-center justify-content-center h-100">
//           {/*<div className="text-center px-3">*/}
//           {/*  <h1 className="display-4 fw-bold mb-3">*/}
//           {/*    {props.data ? props.data.title : "Loading"}*/}
//           {/*  </h1>*/}
//           {/*  <p className="lead">*/}
//           {/*    {props.data ? props.data.paragraph : "Loading"}*/}
//           {/*  </p>*/}
//           {/*  <a href="#features" className="btn btn-primary btn-lg mt-3">*/}
//           {/*    Learn More*/}
//           {/*  </a>*/}
//           {/*</div>*/}
//         </div>
//       </header>
//   );
// };
