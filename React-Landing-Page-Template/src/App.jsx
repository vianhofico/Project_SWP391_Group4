// import React, { useEffect, useRef, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Navigation } from "./components/navigation";
// import JsonData from "./data/data.json";
// import CartDetail from "./components/CartDetail";
// import OrderHistory from "./components/OrderHistory";
// import CheckoutPage from "./components/CheckoutPage";
// import Home from "./components/Home";
// import SignIn from "./components/sign-in";
// import SignUp from "./components/sign-up";
// import MyCourses from "./components/MyCourse";
// import OrderItems from "@/components/OrderItems";
// import { AllCourses } from "./components/AllCourses";
// import ChatbotIcon from "./components/ChatbotIcon";
// import ChatForm from "./components/ChatForm";
// import ChatMessage from "./components/ChatMessage";
// import { companyInfo } from "./companyInfo";
// import "./App.css";
//
// const App = () => {
//     const chatBodyRef = useRef();
//     const [landingPageData, setLandingPageData] = useState({});
//     const [showChatbot, setShowChatbot] = useState(true);
//
//     // Khởi tạo userId từ sessionStorage khi app load
//     const [userId, setUserId] = useState(() => {
//         const currentUser = JSON.parse(sessionStorage.getItem("user"));
//         return currentUser?.user_id || "guest";
//     });
//
//     // Lắng nghe loginSuccess để cập nhật userId và bật chatbot
//     useEffect(() => {
//         const handleLoginSuccess = () => {
//             const currentUser = JSON.parse(sessionStorage.getItem("user"));
//             setUserId(currentUser?.user_id || "guest");
//             setShowChatbot(true);
//         };
//         window.addEventListener("loginSuccess", handleLoginSuccess);
//         return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
//     }, []);
//
//     // Lắng nghe thay đổi sessionStorage (userId) từ tab khác
//     useEffect(() => {
//         const handleStorageChange = () => {
//             const currentUser = JSON.parse(sessionStorage.getItem("user"));
//             setUserId(currentUser?.user_id || "guest");
//         };
//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, []);
//
//     // Load lịch sử chat theo userId
//     const loadChatHistory = (uid) => {
//         const saved = localStorage.getItem(`chatHistory_${uid}`);
//         try {
//             return saved
//                 ? JSON.parse(saved)
//                 : [{ hideInChat: true, role: "model", text: companyInfo }];
//         } catch {
//             return [{ hideInChat: true, role: "model", text: companyInfo }];
//         }
//     };
//
//     const [chatHistory, setChatHistory] = useState(() => loadChatHistory(userId));
//
//     // Reload chat khi userId thay đổi
//     useEffect(() => {
//         setChatHistory(loadChatHistory(userId));
//     }, [userId]);
//
//     // Lưu lịch sử chat khi chatHistory hoặc userId thay đổi
//     useEffect(() => {
//         localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(chatHistory));
//     }, [chatHistory, userId]);
//
//     // Load dữ liệu landing page
//     useEffect(() => {
//         setLandingPageData(JsonData);
//     }, []);
//
//     // Scroll chat xuống dưới khi chatHistory thay đổi
//     useEffect(() => {
//         if (chatBodyRef.current) {
//             chatBodyRef.current.scrollTo({
//                 top: chatBodyRef.current.scrollHeight,
//                 behavior: "smooth",
//             });
//         }
//     }, [chatHistory]);
//
//     // Gọi API Gemini để trả lời chatbot
//     const generateBotResponse = async (history) => {
//         const updateHistory = (text, isError = false) => {
//             setChatHistory((prev) => [
//                 ...prev.filter((msg) => msg.text !== "Thinking..."),
//                 { role: "model", text, isError },
//             ]);
//         };
//
//         const formattedHistory = history.map(({ role, text }) => ({
//             role,
//             parts: [{ text }],
//         }));
//
//         try {
//             const apiUrl =
//                 "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCATg9_c-BHyGPCvo9FUiUHQohJZHwo90w";
//
//             const response = await fetch(apiUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ contents: formattedHistory }),
//             });
//
//             const data = await response.json();
//             if (!response.ok) throw new Error(data?.error?.message || "Something went wrong!");
//
//             const botReply = data.candidates[0].content.parts[0].text
//                 .replace(/\*\*(.*?)\*\*/g, "$1")
//                 .trim();
//
//             updateHistory(botReply);
//         } catch (error) {
//             updateHistory(error.message, true);
//         }
//     };
//
//     return (
//         <BrowserRouter>
//             <Navigation />
//             <Routes>
//                 <Route path="/" element={<Home landingPageData={landingPageData} />} />
//                 <Route path="/cart" element={<CartDetail />} />
//                 <Route path="/confirm-checkout" element={<CheckoutPage />} />
//                 <Route path="/order-history" element={<OrderHistory />} />
//                 <Route path="/order-items" element={<OrderItems />} />
//                 <Route path="/login" element={<SignIn />} />
//                 <Route path="/sign-up" element={<SignUp />} />
//                 <Route path="/my-courses" element={<MyCourses />} />
//                 <Route path="/courses" element={<AllCourses />} />
//                 <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//
//             {/* Chatbot toggle + hiển thị */}
//             <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
//                 <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
//                     <span className="material-symbols-rounded">mode_comment</span>
//                     <span className="material-symbols-rounded">close</span>
//                 </button>
//
//                 {showChatbot && (
//                     <div className="chatbot-popup">
//                         <div className="chat-header">
//                             <div className="header-info">
//                                 <ChatbotIcon />
//                                 <h2 className="logo-text">Chatbot</h2>
//                             </div>
//                             <button
//                                 onClick={() => setShowChatbot(false)}
//                                 className="material-symbols-rounded"
//                                 aria-label="Minimize Chatbot"
//                             >
//                                 keyboard_arrow_down
//                             </button>
//                         </div>
//
//                         <div ref={chatBodyRef} className="chat-body">
//                             <div className="message bot-message">
//                                 <ChatbotIcon />
//                                 <p className="message-text">
//                                     Hey there! <br />
//                                     How can I help you today?
//                                 </p>
//                             </div>
//                             {chatHistory.map((chat, index) => (
//                                 <ChatMessage key={index} chat={chat} />
//                             ))}
//                         </div>
//
//                         <div className="chat-footer">
//                             <ChatForm
//                                 chatHistory={chatHistory}
//                                 setChatHistory={setChatHistory}
//                                 generateBotResponse={generateBotResponse}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </BrowserRouter>
//     );
// };
//
// export default App;

import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/navigation";
import JsonData from "./data/data.json";
import CartDetail from "./components/CartDetail";
import OrderHistory from "./components/OrderHistory";
import CheckoutPage from "./components/CheckoutPage";
import Home from "./components/Home";
import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
import MyCourses from "./components/MyCourse";
import OrderItems from "@/components/OrderItems";
import { AllCourses } from "./components/AllCourses";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
import "./App.css";

const App = () => {
    const chatBodyRef = useRef();
    const [landingPageData, setLandingPageData] = useState({});
    const [showChatbot, setShowChatbot] = useState(true);

    // Lấy userId duy nhất (email hoặc userId nếu có)
    const getCurrentUserId = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        return user?.email || "guest"; // dùng email làm định danh riêng
    };

    const [userId, setUserId] = useState(getCurrentUserId());

    // Load lịch sử chat
    const loadChatHistory = (uid) => {
        try {
            const saved = localStorage.getItem(`chatHistory_${uid}`);
            return saved
                ? JSON.parse(saved)
                : [{ hideInChat: true, role: "model", text: companyInfo }];
        } catch {
            return [{ hideInChat: true, role: "model", text: companyInfo }];
        }
    };

    const [chatHistory, setChatHistory] = useState(() => loadChatHistory(userId));

    // Khi đăng nhập xong hoặc chuyển tài khoản
    useEffect(() => {
        const handleLoginSuccess = () => {
            const newUserId = getCurrentUserId();
            setUserId(newUserId);
            setShowChatbot(true);
            setChatHistory(loadChatHistory(newUserId));
        };
        window.addEventListener("loginSuccess", handleLoginSuccess);
        return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
    }, []);

    // Khi userId đổi thì load lại chat
    useEffect(() => {
        setChatHistory(loadChatHistory(userId));
    }, [userId]);

    // Lưu lịch sử mỗi khi chat thay đổi
    useEffect(() => {
        localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(chatHistory));
    }, [chatHistory, userId]);

    // Scroll chat xuống dưới cùng
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [chatHistory]);

    // Tải landing page data
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    // Gọi API Gemini
    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => [
                ...prev.filter((msg) => msg.text !== "Thinking..."),
                { role: "model", text, isError },
            ]);
        };

        const formattedHistory = history.map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));

        try {
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCATg9_c-BHyGPCvo9FUiUHQohJZHwo90w",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: formattedHistory }),
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data?.error?.message || "Lỗi không xác định!");

            const botReply = data.candidates[0].content.parts[0].text
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .trim();

            updateHistory(botReply);
        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home landingPageData={landingPageData} />} />
                <Route path="/cart" element={<CartDetail />} />
                <Route path="/confirm-checkout" element={<CheckoutPage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order-items" element={<OrderItems />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/courses" element={<AllCourses />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Chatbot UI */}
            <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
                <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
                    <span className="material-symbols-rounded">mode_comment</span>
                    <span className="material-symbols-rounded">close</span>
                </button>

                {showChatbot && (
                    <div className="chatbot-popup">
                        <div className="chat-header">
                            <div className="header-info">
                                <ChatbotIcon />
                                <h2 className="logo-text">Chatbot</h2>
                            </div>
                            <button
                                onClick={() => setShowChatbot(false)}
                                className="material-symbols-rounded"
                                aria-label="Minimize Chatbot"
                            >
                                keyboard_arrow_down
                            </button>
                        </div>

                        <div ref={chatBodyRef} className="chat-body">
                            <div className="message bot-message">
                                <ChatbotIcon />
                                <p className="message-text">
                                    Hey there! <br />
                                    How can I help you today?
                                </p>
                            </div>
                            {chatHistory.map((chat, index) => (
                                <ChatMessage key={index} chat={chat} />
                            ))}
                        </div>

                        <div className="chat-footer">
                            <ChatForm
                                chatHistory={chatHistory}
                                setChatHistory={setChatHistory}
                                generateBotResponse={generateBotResponse}
                            />
                        </div>
                    </div>
                )}
            </div>
        </BrowserRouter>
    );
};

export default App;





