import { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";
import { socket } from "./socket";
import "./App.css";

const SECRET_KEY = "CYBER_SECURE_KEY_999";

const encryptMessage = (text) =>
  CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

const decryptMessage = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "[DECRYPTION FAILED - DATA CORRUPT]";
  }
};

const BOOT_LOGS = [
  "> WAKING UP KERNEL v4.2.1...",
  "> LOADING CRYPTO ENGINE (AES-256-CBC)...",
  "> BYPASSING MAINFRAME FIREWALLS....... [OK]",
  "> INJECTING DECRYPTION PAYLOAD INTO SOCKET...",
  "> MOUNTING SIDEBAR DIAGNOSTICS...",
  "> ANONYMOUS MASKING PROTOCOL INITIATED...",
  "> GENERATING SECURE ROOM SIGNATURE...",
  "> TERMINAL ACCESS GRANTED_",
];

const THEMES = {
  matrix: {
    '--main-color': '#00ff41',
    '--bright-color': '#00ffaa',
    '--dark-color': '#003300',
    '--bg-color': '#010101',
    '--system-color': '#ff003c',
    '--other-color': '#00d9ff'
  },
  blood: {
    '--main-color': '#ff003c',
    '--bright-color': '#ff3366',
    '--dark-color': '#440011',
    '--bg-color': '#050000',
    '--system-color': '#00ff41',
    '--other-color': '#ffaa00'
  },
  ice: {
    '--main-color': '#00d9ff',
    '--bright-color': '#00ffff',
    '--dark-color': '#002244',
    '--bg-color': '#000511',
    '--system-color': '#ff003c',
    '--other-color': '#00ff41'
  }
};

// --- Web Audio API Synth Effects ---
const playCyberBeep = (type = 'keypress') => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'keypress') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.005, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.03);
    } else if (type === 'receive') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1500, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'error') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'click') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'hover') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.003, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.03);
    }
  } catch (e) {}
};

// --- Decryption Component ---
const DecryptedText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  
  useEffect(() => {
    let iteration = 0;
    
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if(index < iteration) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if(iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

// --- Background Components ---
const SVGglobe = () => (
  <div className="svg-globe" style={{margin: '20px 0', opacity: 0.8}}>
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1">
      <circle cx="100" cy="100" r="90" strokeDasharray="5 5" />
      <ellipse cx="100" cy="100" rx="90" ry="30" />
      <ellipse cx="100" cy="100" rx="90" ry="60" />
      <ellipse cx="100" cy="100" rx="30" ry="90" />
      <ellipse cx="100" cy="100" rx="60" ry="90" />
      <path d="M10 100 L190 100 M100 10 L100 190" strokeDasharray="2 4" />
    </svg>
  </div>
);

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/\\~アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    // Use current css var color
    const style = getComputedStyle(document.documentElement);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = style.getPropertyValue('--main-color').trim() || '#00ff41';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} className="matrix-bg" />;
};

// --- Helper for Code Blocks ---
const renderMessageBody = (text) => {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).trim();
      return (
        <pre key={index} className="code-block">
          <code>{code}</code>
        </pre>
      );
    }
    return <DecryptedText key={index} text={part} />;
  });
};

// ─── MAIN APP ─────────────────────────
function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState([]);
  const bootEndRef = useRef(null);

  const [screen, setScreen] = useState("lobby");
  const [myUsername, setMyUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [partnerName, setPartnerName] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [themeName, setThemeName] = useState("matrix");
  
  // Timer State
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  
  // Sidebar Logs
  const [sidebarLogs, setSidebarLogs] = useState([]);
  const chatEndRef = useRef(null);
  const sidebarEndRef = useRef(null);

  // Apply Theme
  useEffect(() => {
    const themeVars = THEMES[themeName] || THEMES.matrix;
    Object.keys(themeVars).forEach(key => {
      document.documentElement.style.setProperty(key, themeVars[key]);
    });
  }, [themeName]);

  // Sidebar Spammer
  useEffect(() => {
    const types = ['ok', 'warn', 'err', 'data'];
    const msgs = [
      'ROUTING TRAFFIC...', 'DECRYPTING RSA PACKET[0x44]', 'PING LATENCY: 24ms',
      'FIREWALL BYPASS ACTIVE', 'ALLOCATING MEMORY BLOCKS', 'IP MASK ROTATED',
      'PEER HANDSHAKE STABLE', 'AWAITING SOCKET STREAM'
    ];
    
    const interval = setInterval(() => {
      if(Math.random() > 0.3) {
        const str = `> ${msgs[Math.floor(Math.random() * msgs.length)]} [${Math.random().toString(16).substring(2,8).toUpperCase()}]`;
        const t = types[Math.floor(Math.random() * types.length)];
        
        setSidebarLogs(prev => {
          const next = [...prev, { text: str, type: `sniff-${t}` }];
          if (next.length > 30) return next.slice(next.length - 30);
          return next;
        });
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { sidebarEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [sidebarLogs]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        setBootText((prev) => [...prev, BOOT_LOGS[index]]);
        index++;
        bootEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        clearInterval(interval);
        setTimeout(() => setIsBooting(false), 900);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("assign_username", (name) => { setMyUsername(name); });
    socket.on("room_created", ({ code }) => {
      playCyberBeep('success'); setRoomCode(code); setSessionStartTime(Date.now());
      setScreen("room"); setPartnerName(null); setChat([]);
    });
    socket.on("room_joined", ({ code, partnerName: pName }) => {
      playCyberBeep('success'); setRoomCode(code); setSessionStartTime(Date.now());
      setScreen("room"); setPartnerName(pName); setChat([]);
    });
    socket.on("partner_joined", ({ partnerName: pName }) => {
      playCyberBeep('success'); setPartnerName(pName);
    });
    socket.on("room_error", ({ text }) => {
      playCyberBeep('error'); setError(text); setTimeout(() => setError(""), 4000);
    });
    socket.on("receive_message", (data) => {
      let text = data.text;
      if (data.type === "other" || data.type === "me") text = decryptMessage(data.text);
      if (data.type === 'other') playCyberBeep('receive');
      setChat((prev) => [...prev, { ...data, text }]);
      setIsTyping(false);
    });
    socket.on("partner_typing", (status) => setIsTyping(status));
    socket.on("partner_disconnected", () => {
      playCyberBeep('error'); setPartnerName(null); setIsTyping(false);
    });
    return () => {
      socket.off("assign_username"); socket.off("room_created"); socket.off("room_joined");
      socket.off("partner_joined"); socket.off("room_error"); socket.off("receive_message");
      socket.off("partner_typing"); socket.off("partner_disconnected");
    };
  }, []);

  useEffect(() => {
    let timer;
    if (screen === 'room' && sessionStartTime) {
       timer = setInterval(() => {
         const now = Date.now();
         const diffSecs = Math.floor((now - sessionStartTime) / 1000);
         const hrs = String(Math.floor(diffSecs / 3600)).padStart(2, '0');
         const mins = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
         const secs = String(diffSecs % 60).padStart(2, '0');
         setElapsedTime(`${hrs}:${mins}:${secs}`);
       }, 1000);
    } else { setElapsedTime("00:00:00"); }
    return () => clearInterval(timer);
  }, [screen, sessionStartTime]);

  useEffect(() => {
    if (!isWiping) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping, isWiping]);

  // Audio Handlers
  const wrapClick = (fn) => () => { playCyberBeep('click'); fn(); };
  const handleHover = () => playCyberBeep('hover');

  const createRoom = wrapClick(() => socket.emit("create_room"));
  const joinRoom = wrapClick(() => {
    if (joinCode.trim() !== "") socket.emit("join_room", joinCode.trim());
  });

  const sendMessage = wrapClick(() => {
    if (message.trim() === "" || !partnerName) return;
    
    // Check Theme Command System Override
    if (message.trim().startsWith('/theme ')) {
      const chosenTheme = message.trim().split(' ')[1];
      if (THEMES[chosenTheme]) {
        setThemeName(chosenTheme);
        setChat(p => [...p, { user: "SYSTEM", text: `THEME UPDATED TO [${chosenTheme.toUpperCase()}]`, type: "system"}]);
        setMessage("");
        return;
      }
    }

    const encrypted = encryptMessage(message);
    socket.emit("send_message", encrypted);
    setMessage("");
    socket.emit("typing", false);
  });

  const handleTyping = (e) => {
    playCyberBeep('keypress');
    setMessage(e.target.value);
    socket.emit("typing", e.target.value.trim() !== "");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };
  
  const leaveRoom = wrapClick(() => {
    socket.emit("leave_room"); setScreen("lobby"); setRoomCode("");
    setPartnerName(null); setChat([]); setIsTyping(false); setSessionStartTime(null);
  });

  const copyCode = wrapClick(() => {
    navigator.clipboard.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 2000);
  });
  
  const incinerateChat = wrapClick(() => {
    playCyberBeep('error'); setIsWiping(true);
    setTimeout(() => { setChat([]); setIsWiping(false); }, 1500);
  });

  // ─── BOOT SCREEN ─────────────────────────────
  if (isBooting) {
    return (
      <div className="crt boot-screen">
        <MatrixRain />
        <div className="terminal-content">
          <div className="boot-sequence">
            {bootText.map((line, i) => (<div key={i} className="boot-text type-writer-effect">{line}</div>))}
            <div ref={bootEndRef} className="blink-cursor-block"></div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN OR LOBBY SCREEN ──────────────────
  return (
    <div className="crt app-wrapper screen-flicker">
      <MatrixRain />
      
      {/* ─── SIDEBAR (PACKET SNIFFER) ─── */}
      <div className="sidebar-column">
         <div className="sidebar-header">LOCAL_NET DIAGNOSTICS</div>
         <div className="sniffer-log">
            {sidebarLogs.map((log, i) => (
              <div key={i} className={`sniff-line ${log.type}`}>{log.text}</div>
            ))}
            <div ref={sidebarEndRef} />
         </div>
      </div>

      <div className="main-column">
        {screen === "lobby" ? (
          <div className="overlay-glass">
            <div className="header glitch" data-text="ANONYMOUS TERMINAL">ANONYMOUS TERMINAL</div>
            <div className="lobby">
              <SVGglobe />
              
              <div className="identity-tag">
                IDENTITY SIGNATURE: <span className="highlight neon-text">{myUsername}</span>
              </div>
              <button className="action-btn create-btn cyber-hover" onClick={createRoom} onMouseEnter={handleHover}>
                [ INITIALIZE SECURE ROOM ]
              </button>
              <div className="join-area">
                <input
                  className="console-input"
                  value={joinCode}
                  onChange={(e) => { playCyberBeep('keypress'); setJoinCode(e.target.value.toUpperCase()); }}
                  onKeyDown={(e) => { if (e.key === "Enter") joinRoom(); }}
                  placeholder="ENTER ID..."
                  maxLength={6}
                  onMouseEnter={handleHover}
                />
                <button className="action-btn join-btn cyber-hover" onClick={joinRoom} onMouseEnter={handleHover}>
                  <span className="glitch-icon">⚡</span> CONNECT
                </button>
              </div>
              {error && <div className="error-msg glitch-error">⚠ ACCESS DENIED: {error}</div>}
            </div>
          </div>
        ) : (
          <div className="room-glass">
            <div className="header cyber-header">
              <div className="header-left">
                <button className="back-btn alert-hover" onClick={leaveRoom} onMouseEnter={handleHover}>[X] TERMINATE</button>
              </div>
              <div className="header-center">
                ROOM ID: <span className="room-id-pulse">{roomCode}</span>
                {partnerName ? <span className="status-online"> ● SECURED</span> : <span className="status-waiting blink"> ◌ SCANNING...</span>}
              </div>
              <div className="header-right header-actions">
                <button className="wipe-btn alert-hover" onClick={incinerateChat} disabled={chat.length===0} onMouseEnter={handleHover}>🔥 INCINERATE</button>
                <button className="copy-btn cyber-hover" onClick={copyCode} onMouseEnter={handleHover}>{copied ? "COPIED" : "CLONE CODE"}</button>
              </div>
            </div>

            <div className={`chat-box crt-monitor ${isWiping ? 'melting-effect' : ''}`}>
              <div className="bg-room-clock">{elapsedTime}</div>
              <div className="chat-messages-layer">
                {!partnerName && (
                  <div className="waiting-overlay hacker-scanning">
                    <div className="radar-spinner"></div>
                    <p style={{marginTop: 15}}>SCANNING LOCALHOST...</p>
                    <p>SHARE CHID: <span className="glitch-box">{roomCode}</span></p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`message-wrapper ${msg.type} slide-in-bottom`}>
                    <span className="user-label">{msg.user}_&gt;</span>{" "}
                    <span className="msg-text hacker-text">
                      {msg.type === "system" ? msg.text : renderMessageBody(msg.text)}
                    </span>
                  </div>
                ))}
                {isTyping && partnerName && (
                  <div className="message-wrapper system typing-indicator slide-in-bottom">
                    <span className="user-label">SYS_&gt;</span> {partnerName} IS INJECTING PAYLOAD
                    <span className="dot-animation">...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="cyber-input-area">
              <span className="glow-text">{myUsername}@root:~#</span>
              <input
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                placeholder={partnerName ? "ENTER PAYLOAD OR /theme blood..." : "AWAITING TARGET..."}
                disabled={!partnerName}
                autoFocus
                className="terminal-input"
                onMouseEnter={handleHover}
              />
              <button onClick={sendMessage} disabled={!partnerName} className="send-btn cyber-hover" onMouseEnter={handleHover}>EXECUTE()</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
