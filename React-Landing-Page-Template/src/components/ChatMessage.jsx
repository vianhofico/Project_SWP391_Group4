import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
    if (chat.hideInChat) return null;

    const isBot = chat.role === "model";
    const messageClass = `${isBot ? "bot-message" : "user-message"}${chat.isError ? " error" : ""}`;

    return (
        <div className={`message ${messageClass}`}>
            {isBot && <ChatbotIcon />}
            <p className="message-text">{chat.text}</p>
        </div>
    );
};

export default ChatMessage;
