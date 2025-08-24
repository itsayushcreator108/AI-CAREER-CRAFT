import React, { useState, useRef, useEffect } from "react";

const SimpleWebcamToggle = ({ width = "100%", height = "100%" }) => {
  const [isOn, setIsOn] = useState(false);
  const videoRef = useRef(null);

  const toggleCamera = async () => {
    if (isOn) {
      // Turn off camera
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsOn(false);
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsOn(true);
      } catch (error) {
        console.error("Camera access error:", error);
        alert("कैमरा access नहीं मिला। Permission allow करें।");
      }
    }
  };

  // Cleanup on unmount
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
      {/* Video Element */}
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

      {/* Overlay when camera is off */}
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

      {/* Status indicator */}
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

export default SimpleWebcamToggle;