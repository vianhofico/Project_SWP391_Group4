// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export const Team = (props) => {
//   const [cartItem, setCartItem] = useState([]);
//   const [courseList, setCourseList] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   useEffect(() => {
//     fetchAllCourse();
//   }, []);

//   const handleAddToCart = async (id) => {
//     setLoadingId(id); // Bắt đầu hiệu ứng loading
//     try {
//       const response = await axios.post(`http://localhost:8080/api/add-course-to-cart/${id}`);
//       setCartItem(response.data ? Array.isArray(response.data) : []);
//     } catch (error) {
//       console.error("cannot add course to cart");
//     } finally {
//       setTimeout(() => {
//         setLoadingId(null); // Kết thúc hiệu ứng sau 0.5s
//       }, 500);
//     }

//     const fetchAllCourse = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/home`);
//         const courseList = response.data;

//         setCourseList(Array.isArray(courseList) ? courseList : []);
//       } catch (error) {
//         setCourseList([]);
//       }
//     }

//     return (
//       // <div id="team" className="text-center">
//       //   <div className="container">
//       //     <div className="col-md-8 col-md-offset-2 section-title">
//       //       <h2>Meet the Team</h2>
//       //       <p>
//       //         Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
//       //         dapibus leonec.
//       //       </p>
//       //     </div>
//       //     <div id="row">
//       //       {courseList.map((course) => (
//       //         <div className="card p-3 shadow-sm rounded text-center" key={course.courseId}>
//       //           <img
//       //             src={`http://localhost:8080/images/product/${course.image}`}
//       //             alt={course.title}
//       //             style={{ width: "100%", height: "200px", objectFit: "contain" }}
//       //           />
//       //           <h5 className="mt-3">{course.title}</h5>
//       //           <p>{course.price.toLocaleString()} đ</p>
//       //           <button className="btn btn-secondary" onClick={() => handleAddToCart(course.courseId)}>
//       //             <i className="bi bi-cart"></i> Thêm vào giỏ hàng
//       //           </button>
//       //         </div>
//       //       ))}
//       //     </div>
//       //   </div>
//       // </div>
//       <div id="row" className="row">
//         {courseList.map((course) => (
//           <div className="col-md-3 col-sm-6 team" key={course.courseId}>
//             <div className="thumbnail">
//               <img
//                 src={`http://localhost:8080/images/product/${course.image}`}
//                 alt={course.title}
//                 className="team-img"
//                 style={{ height: "200px", objectFit: "contain" }}
//               />
//               <div className="caption">
//                 <h5 className="mt-3">{course.title}</h5>
//                 <p>{course.price.toLocaleString()} đ</p>
//                 {/* <button
//                 className="btn btn-secondary"
//                 onClick={() => handleAddToCart(course.courseId)}
//               >
//                 <i className="bi bi-cart"></i> Thêm vào giỏ hàng
//               </button> */}
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => handleAddToCart(course.courseId)}
//                   disabled={loadingId === course.courseId}
//                   style={{
//                     opacity: loadingId === course.courseId ? 0.6 : 1,
//                     pointerEvents: loadingId === course.courseId ? "none" : "auto",
//                     transition: "all 0.2s ease",
//                   }}
//                 >
//                   {loadingId === course.courseId ? (
//                     <span>
//                       <i className="bi bi-arrow-repeat spin"></i> Đang thêm...
//                     </span>
//                   ) : (
//                     <span>
//                       <i className="bi bi-cart"></i> Thêm vào giỏ hàng
//                     </span>
//                   )}
//                 </button>

//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//     );
//   };
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Course = (props) => {
  const [cartItem, setCartItem] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchAllCourse();
  }, []);

  const handleAddToCart = async (id) => {
    setLoadingId(id);
    try {
      const response = await axios.post(`http://localhost:8080/api/add-course-to-cart/${id}`);
      setCartItem(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("cannot add course to cart");
    } finally {
      setTimeout(() => {
        setLoadingId(null);
      }, 500);
    }
  };

  // 👇 Đưa fetchAllCourse RA NGOÀI
  const fetchAllCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/home`);
      const courseList = response.data;
      setCourseList(Array.isArray(courseList) ? courseList : []);
    } catch (error) {
      setCourseList([]);
    }
  };

  // 👇 return JSX ở cấp cao nhất, không được nằm trong hàm khác
  return (
    <div className="container">
      <div id="row" className="row">
        {courseList.map((course) => (
          <div className="col-md-3 col-sm-6 team" key={course.courseId}>
            <div className="thumbnail">
              <img
                src={`http://localhost:8080/images/product/${course.image}`}
                alt={course.title}
                className="team-img"
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="caption">
                <h5 className="mt-3">{course.title}</h5>
                <p>{course.price.toLocaleString()} đ</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleAddToCart(course.courseId)}
                  disabled={loadingId === course.courseId}
                  style={{
                    opacity: loadingId === course.courseId ? 0.6 : 1,
                    pointerEvents: loadingId === course.courseId ? "none" : "auto",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loadingId === course.courseId ? (
                    <span>
                      <i className="bi bi-arrow-repeat spin"></i> Đang thêm...
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-cart"></i> Thêm vào giỏ hàng
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
