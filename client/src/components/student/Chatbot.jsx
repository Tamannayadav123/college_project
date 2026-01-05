import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2, Bot, Image as ImageIcon } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      // Call your backend proxy API
      const response = await axios.post("http://localhost:5000/api/gemini/generate", {
        input: userInput,
      });

      let aiText = response.data.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/^\*/gm, "•"); // Replace * bullets with •

      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error reaching AI. Check your backend server." },
      ]);
    }

    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-3xl p-4 border rounded-xl shadow bg-white mt-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-600">
        <Bot /> Course Assistant
      </h2>
      <div className="h-[300px] overflow-y-auto bg-blue-50 p-3 rounded mb-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-200 text-right ml-auto"
                : "bg-blue-100 text-left mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-blue-500 text-sm flex items-center gap-2">
            <Loader2 className="animate-spin" /> Gemini is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer p-2 hover:bg-blue-100 rounded"
        >
          <ImageIcon />
        </label>

        <input
          className="flex-grow border border-blue-300 rounded-lg px-4 py-2 focus:outline-none"
          type="text"
          placeholder="Ask something about this course..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
