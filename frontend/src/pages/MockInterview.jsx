import React, { useState, useRef, useEffect } from "react";

const SimpleWebcamToggle = ({ width = "100%", height = "100%" }) => {
  const [isOn, setIsOn] = useState(false);
  const videoRef = useRef(null);

  const toggleCamera = async () => {
    if (isOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsOn(true);
      } catch (error) {
        console.error("Camera access error:", error);
        alert("Camera access denied. Please allow permission.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      onClick={toggleCamera}
      style={{
        width: width,
        height: height,
        cursor: "pointer",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: "24px",
        overflow: "hidden",
        minWidth: 0,
        minHeight: 0,
        maxWidth: "100%",
        maxHeight: "100%",
        flex: "none",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
      {!isOn && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            fontSize: "16px",
            textAlign: "center",
            borderRadius: "inherit",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📹</div>
          <div>Click to start camera</div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: isOn ? "#22c55e" : "#64748b",
          zIndex: 10,
        }}
      />
    </div>
  );
};

const MockInterview = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Enhanced refs for better voice control
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const messagesEndRef = useRef(null);
  const voiceMessagesEndRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const [silenceDetected, setSilenceDetected] = useState(false);

  // Auto-scroll function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
    if (voiceMessagesEndRef.current) {
      voiceMessagesEndRef.current.scrollTop = voiceMessagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Silence timer functions
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setSilenceDetected(false);
  };

  const startSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      setSilenceDetected(true);
      if (isRecording && transcript.trim()) {
        handleVoiceRecord(); // Auto-stop and process
      }
    }, 3000); // 3 seconds silence detection
  };

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US"; // You can change to "hi-IN" for Hindi

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            startSilenceTimer(); // Reset timer when final speech detected
          } else {
            interimTranscript += transcript;
            clearSilenceTimer(); // Clear timer during active speech
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
        clearSilenceTimer();
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setIsRecording(false);
        clearSilenceTimer();
      };
    }

    // Initialize Speech Synthesis
    if ("speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        const voices = synthesisRef.current.getVoices();
        console.log("Available voices:", voices);
      };
      
      synthesisRef.current.onvoiceschanged = loadVoices;
      loadVoices();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      clearSilenceTimer();
    };
  }, []);

  const selectInterviewType = (type) => {
    setSelectedInterview(type);
    // Initialize conversation with AI greeting
    if (type === "voice") {
      setTimeout(() => {
        const welcomeMessage = "Hello! Welcome to your AI mock interview. I'm your career coach. Please introduce yourself and tell me about your background.";
        setMessages([{ type: "ai", text: welcomeMessage }]);
        setConversationHistory([{ role: "assistant", content: welcomeMessage }]);
        speakText(welcomeMessage);
      }, 1000);
    }
  };

  const resetInterview = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    clearSilenceTimer();

    setSelectedInterview(null);
    setMessages([]);
    setInputText("");
    setIsRecording(false);
    setTranscript("");
    setIsListening(false);
    setIsSpeaking(false);
    setSilenceDetected(false);
    setConversationHistory([]);
  };

  // Enhanced Gemini AI API integration for text
  const generateAIResponse = async (userInput) => {
    try {
      const response = await fetch("http://localhost:4000/api/mockinterview/ai/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          mode: "text",
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("AI Response Error:", error);
      return "I apologize, but I'm experiencing technical difficulties. Could you please try again?";
    }
  };

  // Enhanced Gemini AI API integration for voice
  const generateAIResponseForVoice = async (userInput) => {
    try {
      const response = await fetch("http://localhost:4000/api/mockinterview/ai/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          mode: "voice",
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Voice AI Response Error:", error);
      return "I'm sorry, I'm having trouble processing that. Could you please repeat your response?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessages = [...messages, { type: "user", text: inputText }];
    setMessages(newMessages);
    
    // Update conversation history
    const updatedHistory = [...conversationHistory, { role: "user", content: inputText }];
    setConversationHistory(updatedHistory);
    
    setInputText("");
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputText);
      if (aiResponse) {
        const finalMessages = [...newMessages, { type: "ai", text: aiResponse }];
        setMessages(finalMessages);
        
        // Update conversation history with AI response
        setConversationHistory([...updatedHistory, { role: "assistant", content: aiResponse }]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages([
        ...newMessages,
        {
          type: "ai",
          text: "I apologize, but I'm having technical difficulties. Could you please try again?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Enhanced Voice Recording with proper error handling
  const handleVoiceRecord = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isRecording) {
      // Stop recording
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
      clearSilenceTimer();

      // Process the final transcript
      if (transcript.trim()) {
        processVoiceInput(transcript);
        setTranscript(""); // Clear transcript after processing
      }
    } else {
      // Start recording
      setIsRecording(true);
      setIsListening(true);
      setTranscript("");
      setSilenceDetected(false);
      
      try {
        recognitionRef.current.start();
        startSilenceTimer();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsRecording(false);
        setIsListening(false);
      }
    }
  };

  // Enhanced voice input processing
  const processVoiceInput = async (voiceText) => {
    if (!voiceText.trim()) return;

    const newMessages = [...messages, { type: "user", text: voiceText }];
    setMessages(newMessages);
    
    // Update conversation history
    const updatedHistory = [...conversationHistory, { role: "user", content: voiceText }];
    setConversationHistory(updatedHistory);
    
    setIsTyping(true);
    clearSilenceTimer();

    try {
      const aiResponse = await generateAIResponseForVoice(voiceText);
      if (aiResponse) {
        const finalMessages = [...newMessages, { type: "ai", text: aiResponse }];
        setMessages(finalMessages);
        
        // Update conversation history with AI response
        setConversationHistory([...updatedHistory, { role: "assistant", content: aiResponse }]);
        
        setIsTyping(false);

        // Speak the AI response
        setTimeout(() => {
          speakText(aiResponse);
        }, 500); // Small delay for better UX
      }
    } catch (error) {
      console.error("Error processing voice input:", error);
      const errorMessage = "I'm sorry, I'm having trouble processing that. Could you please repeat?";
      setMessages([...newMessages, { type: "ai", text: errorMessage }]);
      setIsTyping(false);
      speakText(errorMessage);
    }
  };

  // Enhanced Text-to-Speech function
  const speakText = (text) => {
    if (!synthesisRef.current) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    // Clean text for better speech
    const cleanText = text.replace(/[*#_`]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 0.9;

    // Get available voices and select the best English voice
    const voices = synthesisRef.current.getVoices();
    const preferredVoices = voices.filter(voice => 
      voice.lang.includes("en") && 
      (voice.name.includes("Google") || 
       voice.name.includes("Microsoft") || 
       voice.name.includes("Samantha") ||
       voice.name.includes("Karen") ||
       voice.name.includes("Daniel"))
    );

    const selectedVoice = preferredVoices[0] || 
                         voices.find(voice => voice.lang.includes("en")) || 
                         voices;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log("AI started speaking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log("AI finished speaking");
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
    };

    try {
      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      setIsSpeaking(false);
    }
  };

  // Interview Selection Screen
  if (!selectedInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              AI Mock Interview
            </h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Practice your interview skills with our AI-powered career coach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div
              onClick={() => selectInterviewType("text")}
              className="group cursor-pointer bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-white mb-3">Text Interview</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Type-based conversation with AI Career Coach. Perfect for detailed responses.
                </p>
                <div className="inline-flex items-center text-blue-400 font-medium">
                  Start Conversation <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => selectInterviewType("voice")}
              className="group cursor-pointer bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-green-500 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🎤</div>
                <h3 className="text-xl font-bold text-white mb-3">Voice Interview</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Natural speech conversation with AI. Voice-to-text conversion with AI responses via speaker.
                </p>
                <div className="inline-flex items-center text-green-400 font-medium">
                  Start Speaking <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => selectInterviewType("video")}
              className="group cursor-pointer bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🎥</div>
                <h3 className="text-xl font-bold text-white mb-3">Video Interview</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Full video simulation with webcam integration and voice interaction.
                </p>
                <div className="inline-flex items-center text-cyan-400 font-medium">
                  Start Video Call <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Text Interview View
  if (selectedInterview === "text") {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col">
        <div className="bg-gray-800 shadow-xl border-b border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl">💼</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Text Interview</h2>
                <p className="text-gray-400 text-sm">AI-Powered Career Coach</p>
              </div>
            </div>
            <button
              onClick={resetInterview}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              ← Back
            </button>
          </div>
        </div>

        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 rounded-xl bg-gray-800 border border-gray-700">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Welcome to Your Interview Session
                  </h3>
                  <p className="text-gray-400">
                    Start the conversation by introducing yourself
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xl px-4 py-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-100 border border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">{message.type === "user" ? "👤" : "🎯"}</span>
                        <p className="text-xs font-semibold opacity-70">
                          {message.type === "user" ? "You" : "Career Coach"}
                        </p>
                      </div>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">🎯</span>
                        <p className="text-xs font-semibold opacity-70">Career Coach</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <span className="ml-2 text-blue-400 text-sm">Analyzing your response...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSendMessage()}
                placeholder="Share your thoughts or ask a question..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <span>📤</span>
                {isTyping ? "..." : "Send"}
              </button>
            </div>
            <p className="text-center text-gray-500 text-xs mt-2">
              Press Enter to send • AI-Powered Career Assessment
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Voice Interview View with Enhanced Features
  if (selectedInterview === "voice") {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col overflow-hidden">
        <div className="bg-gray-800 shadow-xl border-b border-gray-700 p-4 flex-shrink-0">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl">🎤</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Voice Interview</h2>
                <p className="text-gray-400 text-sm">
                  {isSpeaking
                    ? "🔊 AI Coach Speaking..."
                    : isRecording
                    ? "🎙 Listening... (Auto-reply in 3s of silence)"
                    : "Ready for Voice Conversation"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isSpeaking && (
                <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm">AI Speaking</span>
                </div>
              )}
              {isRecording && (
                <div className="flex items-center gap-2 bg-orange-600/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-300 text-sm">Recording</span>
                </div>
              )}
              <button
                onClick={resetInterview}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex p-4 gap-4 max-w-7xl mx-auto w-full min-h-0 overflow-hidden">
          {/* Voice Controls Section */}
          <div
            className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 overflow-hidden flex flex-col"
            style={{
              width: "450px",
              minWidth: "450px",
              maxWidth: "450px",
              height: "calc(100vh - 200px)",
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className={`w-56 h-56 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 border-4 cursor-pointer mb-6 ${
                  isRecording || isListening
                    ? "bg-red-500 animate-pulse border-red-400 scale-110"
                    : "bg-green-600 hover:bg-green-700 border-green-500"
                }`}
                onClick={handleVoiceRecord}
              >
                <span className="text-8xl text-white">
                  {isRecording ? "🔴" : "🎤"}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-center mb-3">
                {isRecording ? "🎙 Listening..." : "Ready for Your Response"}
              </h3>

              <p className="text-gray-400 text-center mb-6 text-sm">
                {isRecording
                  ? "Speak naturally. Auto-reply after 3 seconds of silence."
                  : isSpeaking
                  ? "AI is speaking. Please wait..."
                  : "Click the microphone to start speaking."}
              </p>

              <button
                onClick={handleVoiceRecord}
                disabled={isSpeaking || isTyping}
                className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 mb-6 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700"
                    : isSpeaking || isTyping
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white shadow-lg`}
              >
                <span className="mr-2 text-xl">
                  {isRecording ? "⏹" : isSpeaking || isTyping ? "🔊" : "🎙"}
                </span>
                {isRecording
                  ? "Stop Recording"
                  : isSpeaking || isTyping
                  ? "Processing..."
                  : "Start Speaking"}
              </button>
            </div>

            {/* Live Transcript */}
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📝</span>
                <h4 className="text-sm font-semibold text-gray-300">Live Transcript</h4>
                {isListening && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="bg-gray-800/50 rounded p-3 max-h-[120px] overflow-y-auto">
                <p className="text-gray-100 text-sm">
                  {transcript || "Your speech will appear here as you speak..."}
                </p>
              </div>
            </div>

            {/* Browser Support Notice */}
            {!recognitionRef.current && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg flex-shrink-0">
                <p className="text-yellow-300 text-xs text-center">
                  ⚠ Voice recognition requires Chrome, Edge, or Safari
                </p>
              </div>
            )}
          </div>

          {/* Conversation Section */}
          <div
            className="flex-1 bg-gray-800 rounded-xl shadow-xl border border-gray-700 flex flex-col min-h-0"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div className="p-4 bg-gray-700/50 border-b border-gray-600/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm">💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Interview Conversation</h3>
                  <p className="text-xs text-gray-400">Voice ↔️ Text ↔️ AI Coach</p>
                </div>
              </div>
            </div>

            <div
              ref={voiceMessagesEndRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎙💼</div>
                    <h4 className="text-lg font-bold text-white mb-2">Voice Interview Session</h4>
                    <p className="text-gray-400 text-sm">Your conversation will appear here</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-xl ${
                          message.type === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-100 border border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{message.type === "user" ? "🎤" : "🎯"}</span>
                          <p className="text-xs font-semibold opacity-80">
                            {message.type === "user" ? "You (Voice)" : "AI Career Coach"}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  ))}

                  {(isTyping || isSpeaking) && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">🎯</span>
                          <p className="text-xs font-semibold opacity-80">AI Career Coach</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="ml-2 text-blue-400 text-sm">
                            {isSpeaking ? "Speaking response..." : "Analyzing your response..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-3 bg-gray-700/30 border-t border-gray-600/30 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Messages: {messages.length}</span>
                <span className="flex items-center gap-1">
                  {(isRecording || isListening) && (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Recording</span>
                    </>
                  )}
                  {isSpeaking && (
                    <>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>AI Speaking</span>
                    </>
                  )}
                  {!isRecording && !isSpeaking && !isTyping && <span>Ready</span>}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border-t border-gray-700/50 p-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-gray-500 text-xs">
              🎙 Voice Recognition • 🤖 Gemini AI • 🔊 Text-to-Speech • 3-Second Auto-Reply
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Video Interview View
  if (selectedInterview === "video") {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col">
        <div className="bg-gray-800 shadow-xl border-b border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl">🎥</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Video Interview</h2>
                <p className="text-gray-400 text-sm">Professional Assessment Mode</p>
              </div>
            </div>
            <button
              onClick={resetInterview}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 grid grid-cols-2 gap-4 max-w-6xl mx-auto w-full">
          <div className="bg-gray-800 rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden border border-gray-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Career Coach</h3>
              <p className="text-gray-400">Professional • Experienced • Insightful</p>
              <div className="flex items-center justify-center gap-2 mt-4 bg-cyan-600/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 text-sm">Ready to Interview</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-xl relative overflow-hidden border border-gray-700">
            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-lg font-bold text-white">Your Camera</h3>
              <p className="text-sm text-gray-300">Click to toggle</p>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-2 bg-gray-800/80 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-300 text-xs">Ready</span>
              </div>
            </div>
            <div className="absolute inset-0">
              <SimpleWebcamToggle width="100%" height="100%" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center">
              <button
                onClick={resetInterview}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-xl">⏹</span>
                End Interview Session
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-3">
              Professional Video Interview • AI Career Assessment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MockInterview;