import { useState, useEffect, useReducer } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { db } from "./firebase";
import logo from "./assets/logo.png";
import phonehero from "./assets/phonehero.png";
import ph1 from "./assets/photo1.jpeg";
import ph2 from "./assets/photo2.png";
import ph3 from "./assets/photo3.jpeg";
import ph4 from "./assets/photo4.jpeg";
import ph5 from "./assets/photo5.jpeg";
import ph6 from "./assets/photo6.jpeg";
import ph7 from "./assets/photo7.jpeg";

import applelogo from "./assets/applelogo.png";

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "ahour_store";
const EMAILJS_TEMPLATE_ID = "template_tgtu565";
const EMAILJS_PUBLIC_KEY  = "VyofOTWQoyw8FfOa4";

const LOGO_SRC       = logo;
const apple_SRC      = applelogo;
const phonehero_SRC  = phonehero;
const ADMIN_PASSWORD = "ashour2026";
const CLOUD_NAME     = "diyv7423e";
const UPLOAD_PRESET  = "ashour_store";

const PRODUCTS = [
  { id:1, name:"iPhone 16",          brand:"Apple",   category:"New",  price:51499, oldPrice:null,  img:ph1, rating:4.9, reviews:312, inStock:true,  specs:{screen:'6.7"', camera:"48MP",  battery:"4422mAh", storage:"256GB"}},
  { id:2, name:"iPhone 17 pro max",  brand:"Apple",   category:"Used", price:66999, oldPrice:null,  img:ph2, rating:4.7, reviews:198, inStock:true,  specs:{screen:'6.1"', camera:"48MP",  battery:"3349mAh", storage:"128GB"}},
  { id:3, name:"iPhone 16 pro max",  brand:"Apple",   category:"New",  price:55299, oldPrice:null,  img:ph3, rating:4.8, reviews:276, inStock:true,  specs:{screen:'6.8"', camera:"200MP", battery:"5000mAh", storage:"512GB"}},
  { id:4, name:"iPhone 15 pro max",  brand:"Apple",   category:"Used", price:45599, oldPrice:null,  img:ph4, rating:4.5, reviews:143, inStock:true,  specs:{screen:'6.6"', camera:"50MP",  battery:"5000mAh", storage:"256GB"}},
  { id:5, name:"iPhone 13",          brand:"Apple",   category:"New",  price:39799, oldPrice:40199, img:ph5, rating:4.7, reviews:189, inStock:false, specs:{screen:'6.73"',camera:"50MP",  battery:"5000mAh", storage:"512GB"}},
  { id:6, name:"Samsung S24 ULTRA",  brand:"Samsung", category:"Used", price:5599,  oldPrice:null,  img:ph6, rating:4.3, reviews:97,  inStock:true,  specs:{screen:'6.79"',camera:"108MP", battery:"5030mAh", storage:"128GB"}},
  { id:7, name:"iPhone 17 pro max",  brand:"Apple",   category:"New",  price:74299, oldPrice:null,  img:ph7, rating:4.8, reviews:231, inStock:true,  specs:{screen:'6.3"', camera:"50MP",  battery:"4700mAh", storage:"256GB"}},
];

const BRANDS      = ["All","Apple","Samsung"];
const CATEGORIES  = ["All","New","Used"];
const CAT_OPTIONS = ["New","Used"];

const GOVERNORATES = [
  "القاهرة","الجيزة","الإسكندرية","الشرقية","الدقهلية","البحيرة",
  "المنوفية","القليوبية","الغربية","كفر الشيخ","دمياط","بورسعيد",
  "الإسماعيلية","السويس","شمال سيناء","جنوب سيناء","البحر الأحمر",
  "الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر",
  "أسوان","مطروح","الوادي الجديد",
];

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [barWidth, setBarWidth]   = useState(0);
  const [loadText, setLoadText]   = useState("Loading");
  const [fadeOut, setFadeOut]     = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left:  Math.random() * 100,
      delay: Math.random() * 3,
      dur:   3 + Math.random() * 3,
      dx:    (Math.random() - 0.5) * 100,
      size:  2 + Math.random() * 3,
    }));
    setParticles(pts);

    // Loading bar
    const barTimer = setInterval(() => {
      setBarWidth(w => {
        if (w >= 100) { clearInterval(barTimer); return 100; }
        return w + (w < 70 ? 2 : 0.8);
      });
    }, 40);

    // Rotating loading text
    const loadLabels = ["Loading", "جاري التحميل", "Welcome", "أهلاً بك"];
    let li = 0;
    const textTimer = setInterval(() => {
      li = (li + 1) % loadLabels.length;
      setLoadText(loadLabels[li]);
    }, 900);

    // Fade out and call onDone
    const fadeTimer = setTimeout(() => setFadeOut(true), 3600);
    const doneTimer = setTimeout(() => onDone(), 4100);

    return () => {
      clearInterval(barTimer);
      clearInterval(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;600;700;900&display=swap');

        @keyframes splashGridMove {
          from { background-position: 0 0; }
          to   { background-position: 48px 48px; }
        }
        @keyframes splashGlowPulse {
          0%,100% { transform: scale(1);    opacity: 0.7; }
          50%      { transform: scale(1.18); opacity: 1;   }
        }
        @keyframes splashRingExpand {
          0%   { transform: scale(0.6); opacity: 0; }
          25%  { opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes splashIconIn {
          from { transform: scale(0) rotate(-25deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes splashTextReveal {
          from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);    }
        }
        @keyframes splashLineGrow {
          from { width: 0;     opacity: 0; }
          to   { width: 200px; opacity: 1; }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes splashParticle {
          0%   { transform: translateY(0)     translateX(0);          opacity: 0;   }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-320px) translateX(var(--pdx)); opacity: 0; }
        }
        @keyframes splashBlink {
          0%,100% { opacity: 0.25; }
          50%     { opacity: 0.65; }
        }
        @keyframes splashFadeOut {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Cairo', sans-serif;
        }
        .splash-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(244,124,38,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244,124,38,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: splashGridMove 5s linear infinite;
          pointer-events: none;
        }
        .splash-glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,124,38,0.2) 0%, transparent 70%);
          animation: splashGlowPulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        .splash-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(244,124,38,0.18);
          pointer-events: none;
          animation: splashRingExpand 3s ease-out infinite;
        }
        .splash-corner {
          position: absolute;
          width: 28px;
          height: 28px;
          z-index: 5;
          opacity: 0.35;
        }
        .splash-corner::before,
        .splash-corner::after {
          content: '';
          position: absolute;
          background: #f47c26;
        }
        .splash-corner::before { width: 2px; height: 100%; top: 0; left: 0; }
        .splash-corner::after  { width: 100%; height: 2px; top: 0; left: 0; }

        .splash-icon {
          width: 76px;
          height: 76px;
          border-radius: 20px;
          background: linear-gradient(135deg, #f47c26, #ff9f0a);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          animation: splashIconIn 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
          box-shadow: 0 0 50px rgba(244,124,38,0.55), 0 0 100px rgba(244,124,38,0.2);
        }
        .splash-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 12vw, 72px);
          letter-spacing: 8px;
          color: #fff;
          line-height: 1;
          animation: splashTextReveal 0.9s ease 0.6s both;
        }
        .splash-sub {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(18px, 4vw, 24px);
          letter-spacing: 10px;
          color: rgba(255,255,255,0.3);
          animation: splashTextReveal 0.9s ease 0.75s both;
          margin-top: 2px;
        }
        .splash-tagline {
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          direction: rtl;
          margin-top: 10px;
          letter-spacing: 1px;
          animation: splashTextReveal 0.9s ease 0.9s both;
        }
        .splash-accent-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #f47c26, transparent);
          border-radius: 2px;
          margin: 20px auto 0;
          animation: splashLineGrow 0.9s ease 1.1s both;
        }
        .splash-loader {
          position: absolute;
          bottom: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: splashFadeUp 0.7s ease 1.3s both;
        }
        .splash-bar-bg {
          width: 200px;
          height: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .splash-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f47c26, #ff9f0a);
          border-radius: 2px;
          transition: width 0.04s linear;
        }
        .splash-load-text {
          font-size: 10px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          animation: splashBlink 1.4s ease-in-out 1.5s infinite;
        }
        .splash-particle {
          position: absolute;
          border-radius: 50%;
          background: #f47c26;
          pointer-events: none;
          bottom: -10px;
          animation: splashParticle linear infinite;
          opacity: 0;
        }
        .splash-fadeout {
          position: absolute;
          inset: 0;
          background: #000;
          z-index: 20;
          pointer-events: none;
          animation: splashFadeOut 0.55s ease forwards;
        }
        .splash-dots {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }
        .splash-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(244,124,38,0.5);
          animation: splashBlink 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="splash-root">
        {/* Background grid */}
        <div className="splash-grid" />

        {/* Central glow */}
        <div className="splash-glow" />

        {/* Expanding rings */}
        {[180, 300, 430].map((s, i) => (
          <div
            key={i}
            className="splash-ring"
            style={{ width: s, height: s, animationDelay: `${i * 0.9}s` }}
          />
        ))}

        {/* Corner accents */}
        <div className="splash-corner" style={{ top: 20, left: 20 }} />
        <div className="splash-corner" style={{ top: 20, right: 20, transform: "scaleX(-1)" }} />
        <div className="splash-corner" style={{ bottom: 20, left: 20, transform: "scaleY(-1)" }} />
        <div className="splash-corner" style={{ bottom: 20, right: 20, transform: "scale(-1)" }} />

        {/* Floating particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="splash-particle"
            style={{
              left:              `${p.left}%`,
              width:             p.size,
              height:            p.size,
              animationDuration: `${p.dur}s`,
              animationDelay:    `${p.delay}s`,
              "--pdx":           `${p.dx}px`,
            }}
          />
        ))}

        {/* Logo & name */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="splash-icon">
                 <img src={apple_SRC} alt="applelogo" style={{ width: 44, height: 44 }}></img>         
          </div>

          <div className="splash-name">
            <img src={LOGO_SRC} alt="logo" style={{width: "100px",height: "auto",transform: "scale(4)", transformOrigin: "center"} }></img>
          </div>
         
          <div className="splash-tagline">أحدث الهواتف الذكية · ضمان حقيقي · شحن سريع</div>

          <div className="splash-accent-line" style={{ width: 0 }} />

          <div className="splash-dots" style={{ marginTop: 18, animation: "splashFadeUp 0.7s ease 1.1s both", opacity: 0 }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} className="splash-dot" style={{ animationDelay: `${d + 1.5}s` }} />
            ))}
          </div>
        </div>

        {/* Loading bar */}
        <div className="splash-loader">
          <div className="splash-bar-bg">
            <div className="splash-bar-fill" style={{ width: `${barWidth}%` }} />
          </div>
          <div className="splash-load-text">{loadText}</div>
        </div>

        {/* Year badge */}
        <div style={{
          position: "absolute", top: 28, right: "43.8%", transform: "translateX(50%)",
          display: "flex", alignItems: "center", gap: 7,
          background: "rgba(244,124,38,0.12)",
          border: "1px solid rgba(244,124,38,0.3)",
          color: "#f47c26", padding: "5px 16px", borderRadius: 50,
          fontSize: 11, fontWeight: 600, letterSpacing: 1,
          animation: "splashFadeUp 0.7s ease 0.2s both", opacity: 0,
          zIndex: 10, fontFamily: "'Cairo', sans-serif",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#f47c26",
            animation: "splashBlink 1.4s ease-in-out infinite",
            display: "inline-block",
          }}/>
          Ashour Store — 2026
        </div>

        {/* Fade-out overlay */}
        {fadeOut && <div className="splash-fadeout" />}
      </div>
    </>
  );
}

// ─── CART REDUCER ─────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const ex = state.find(i => i.id === action.product.id);
      if (ex) return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "DECREASE": return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
    case "DELETE":   return state.filter(i => i.id !== action.id);
    case "CLEAR":    return [];
    default: return state;
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function compressImage(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const img    = new Image();
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX)  { height = (height * MAX) / width;  width  = MAX; }
      if (height > MAX) { width  = (width  * MAX) / height; height = MAX; }
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, "image/jpeg", 0.75);
    };
    img.src = URL.createObjectURL(file);
  });
}

async function uploadToCloudinary(file, onProgress) {
  const compressed = await compressImage(file);
  return new Promise((resolve, reject) => {
    const xhr      = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", compressed);
    formData.append("upload_preset", UPLOAD_PRESET);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) resolve(data.secure_url);
      else reject(new Error(data.error?.message || "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function ProductImg({ img, size = 72, style = {} }) {
  return (
    <img src={img} alt="" style={{ width: size, height: size, objectFit: "cover", borderRadius: 8, ...style }} />
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", color: "#fff",
      padding: "12px 28px", borderRadius: 50, fontSize: 13, fontWeight: 500, zIndex: 9999,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
    }}>
      {msg}
    </div>
  );
}

const Stars = ({ r }) => (
  <span style={{ color: "#f5a623", fontSize: 12 }}>
    {"★".repeat(Math.floor(r))}{"☆".repeat(5 - Math.floor(r))}
  </span>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ p, onView, onAdd, dark = false, isAr = true }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark ? "#1c1c1e" : "#fff", borderRadius: 18, overflow: "hidden", cursor: "pointer",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        transform: hov ? "translateY(-4px) scale(1.01)" : "none",
        boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", border: `1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"}`,
      }}
    >
      <div
        onClick={() => onView(p)}
        style={{
          background: dark ? "#2c2c2e" : "#ffffff", padding: "24px 16px", height: 180,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}
      >
        {p.oldPrice && (
          <span style={{
            position: "absolute", top: 12, right: 12, background: "#ff3b30", color: "#fff",
            fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, letterSpacing: .5,
          }}>SALE</span>
        )}
        {!p.inStock && (
          <span style={{
            position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)", color: "#ccc", fontSize: 10, fontWeight: 500,
            padding: "3px 8px", borderRadius: 20,
          }}>نفذ</span>
        )}
        <ProductImg img={p.img} size={120}
          style={{ width: "100%", height: 150, objectFit: "contain", background: "#fff", padding: 8, borderRadius: 12 }} />
      </div>
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ fontSize: 11, color: "#979799", fontWeight: 500 }}>{p.brand}</div>
        <h3
          onClick={() => onView(p)}
          style={{ margin: 0, fontSize: 14, fontWeight: 600, color: dark?"#f5f5f7":"#1d1d1f", lineHeight: 1.3 }}
        >
          {p.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Stars r={p.rating || 4.5} />
          <span style={{ fontSize: 11, color: "#949496" }}>({p.reviews || 0})</span>
        </div>
        <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", whiteSpace: "nowrap" }}>
              {Number(p.price).toLocaleString()} ج.م
            </div>
            {p.oldPrice && (
              <div style={{ fontSize: 11, color: "#86868b", textDecoration: "line-through" }}>
                {Number(p.oldPrice).toLocaleString()}
              </div>
            )}
          </div>
          <button
            onClick={() => p.inStock && onAdd(p)}
            style={{
              background: p.inStock ? "#f47c26" : "#e5e5ea",
              color: p.inStock ? "#fff" : "#86868b",
              border: "none", padding: "7px 14px", fontSize: 12, fontWeight: 500, flexShrink: 0,
              borderRadius: 50, cursor: p.inStock ? "pointer" : "not-allowed", transition: "all .2s",
            }}
          >
            {p.inStock ? (isAr ? "أضف" : "Add") : "N/A"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BANNER ───────────────────────────────────────────────────────────────────
function Banner({ onShop, dark = false, isAr = true }) {
  return (
    <div style={{
      background: "#000", color: "#fff", minHeight: 520, position: "relative",
      overflow: "hidden", width: "100%", boxSizing: "border-box",
      fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif",
    }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-18px) rotate(-5deg)}}
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.1)}}
        @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,25px) scale(0.95)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes pulseDot{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes scrollAnim{0%{top:-100%}100%{top:100%}}
        .fade-u{opacity:0;animation:fadeUp .7s ease forwards}
        .shimmer-txt{background:linear-gradient(90deg,#fff 0%,#f47c26 30%,#fff 60%,#f47c26 90%,#fff 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .hero-btn-primary{background:linear-gradient(135deg,#f47c26,#ff9f0a);color:#fff;border:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:500;cursor:pointer;transition:transform .2s,box-shadow .2s}
        .hero-btn-primary:hover{transform:scale(1.04);box-shadow:0 6px 24px rgba(244,124,38,.4)}
        .hero-btn-ghost{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15);padding:14px 28px;border-radius:50px;font-size:15px;font-weight:500;cursor:pointer;backdrop-filter:blur(10px);transition:background .2s}
        .hero-btn-ghost:hover{background:rgba(255,255,255,.14)}
        @media(max-width:640px){
          .hero-content{padding:60px 20px!important}
          .hero-stats{gap:16px!important}
          .hero-stats .stat-divider{display:none!important}
          .hero-btns{flex-direction:column!important;align-items:center!important}
          .hero-btns button{width:80%!important}
          .hero-phone{display:none!important}
        }
      `}</style>

      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,124,38,.18),transparent 70%)", top: -80, right: -60, animation: "orb1 8s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,113,227,.15),transparent 70%)", bottom: -60, left: "20%", animation: "orb2 11s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,159,10,.12),transparent 70%)", top: "40%", left: "55%", animation: "orb1 6s 2s ease-in-out infinite", pointerEvents: "none" }} />

      <div className="hero-phone" style={{ position: "absolute", right: "52%", top: "5%", animation: "floatA 8s ease-in-out infinite", opacity: .12, pointerEvents: "none", userSelect: "none", transform: "translateY(100px)" }}>
        <img src={phonehero_SRC} alt="phone" style={{ height: 750 }} />
      </div>

      <div className="hero-content" style={{
        position: "relative", zIndex: 2, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", minHeight: 520,
        textAlign: "center", padding: "80px 200px",
      }}>
        <div className="fade-u" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(244,124,38,0.15)", border: "1px solid rgba(244,124,38,.35)",
          color: "#f47c26", padding: "6px 16px", borderRadius: 50,
          fontSize: 12, fontWeight: 500, letterSpacing: .5, marginBottom: 20, animationDelay: ".1s",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f47c26", animation: "pulseDot 1.4s infinite" }} />
          Ashour Store — 2026
        </div>

        <h1 className="fade-u" style={{
          margin: "0 0 18px", fontSize: "clamp(34px,5.5vw,64px)", fontWeight: 700,
          lineHeight: 1.05, letterSpacing: -1, animationDelay: ".2s",
        }}>
          <span style={{ background: "linear-gradient(135deg,#fff,rgba(255,255,255,.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {isAr?"المستقبل.":"The Future."}<br />
          </span>
          <span style={{ background: "linear-gradient(135deg,#f47c26,#ff9f0a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {isAr?"في يدك.":"In Your Hand."}
          </span>
        </h1>

        <p className="fade-u" style={{ color: "rgba(255,255,255,.55)", maxWidth: 440, margin: "0 0 32px", lineHeight: 1.65, fontSize: 16, animationDelay: ".35s" }}>
          {isAr?"أحدث الهواتف الذكية بضمان حقيقي. مجموعة مختارة بعناية لأفضل تجربة.":"The latest smartphones with real warranty. Curated selection for the best experience."}
        </p>

        <div className="fade-u hero-stats" style={{ display: "flex", gap: 28, marginBottom: 36, justifyContent: "center", alignItems: "center", animationDelay: ".5s" }}>
          {[{ num: "+500", lbl: "منتج متوفر" }, { num: "24H", lbl: "شحن سريع" }, { num: "100%", lbl: "ضمان الجودة" }].map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {i > 0 && <div className="stat-divider" style={{ width: 1, height: 36, background: "rgba(255,255,255,.1)" }} />}
              <div>
                <div className="shimmer-txt" style={{ fontSize: 22, fontWeight: 700 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", letterSpacing: .5, marginTop: 2 }}>{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="fade-u hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", animationDelay: ".6s" }}>
          <button className="hero-btn-primary" onClick={onShop}>{isAr?"تسوق الآن":"Shop Now"}</button>
          <button className="hero-btn-ghost"   onClick={onShop}>{isAr?"اعرف أكثر":"Learn More"}</button>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: .4,
      }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: 1 }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,.4)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: "100%", height: "50%", background: "#fff", animation: "scrollAnim 1.4s infinite" }} />
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAILS ──────────────────────────────────────────────────────────
function ProductDetails({ p, onBack, onAdd, dark = false, isAr = true }) {
  const isUrl = typeof p.img === "string" && p.img.startsWith("http");
  return (
    <div style={{ padding: "clamp(24px,4vw,48px)", background: "inherit" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 500, marginBottom: 32, color: "#f47c26",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {isAr ? "‹ الرجوع للمتجر" : "‹ Back to Shop"}
        </button>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
          gap: "clamp(24px,4vw,60px)", alignItems: "start",
        }}>
          <div style={{
            background: dark?"#1c1c1e":"#ffffff", borderRadius: 24, padding: "clamp(24px,4vw,48px)",
            textAlign: "center", border: `1px solid ${dark?"rgba(255,255,255,0.1)":"#e5e5e7"}`,
            display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240, position: "relative",
          }}>
            {!p.inStock && (
              <div style={{
                position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)", color: "#fff", fontSize: 12, fontWeight: 500,
                padding: "5px 12px", borderRadius: 20,
              }}>{isAr?"نفذ من المخزون":"Out of Stock"}</div>
            )}
            <ProductImg img={p.img} size={isUrl ? 200 : 130} />
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 13, color: "#939393", marginBottom: 6, fontWeight: 500 }}>{p.brand}</div>
            <h1 style={{
              fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, margin: "0 0 12px",
              color: "#1d1d1f", letterSpacing: "-.5px", lineHeight: 1.1,
            }}>{p.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Stars r={p.rating || 4.5} />
              <span style={{ fontSize: 13, color: "#86868b" }}>({p.reviews || 0} تقييم)</span>
            </div>
            <div style={{ fontSize: "clamp(26px,4vw,34px)", fontWeight: 600, color: "#1d1d1f", marginBottom: 4 }}>
              {Number(p.price).toLocaleString()} ج.م
            </div>
            {p.oldPrice && (
              <div style={{ fontSize: 15, color: "#86868b", textDecoration: "line-through", marginBottom: 20 }}>
                {Number(p.oldPrice).toLocaleString()} ج.م
              </div>
            )}
            {p.specs && (
              <div style={{
                background: dark?"#2c2c2e":"#e3e3e3", borderRadius: 16, padding: "18px 20px",
                margin: "20px 0", display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 14,
              }}>
                {Object.entries(p.specs).map(([k, v]) => v ? (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: "#86868b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f" }}>{v}</div>
                  </div>
                ) : null)}
              </div>
            )}
            <button
              onClick={() => p.inStock && onAdd(p)}
              style={{
                width: "100%", padding: "15px",
                background: p.inStock ? "#f47c26" : "#e5e5ea",
                color: p.inStock ? "#fff" : "#86868b", border: "none", fontSize: 15, fontWeight: 500,
                borderRadius: 50, cursor: p.inStock ? "pointer" : "not-allowed", marginTop: 10,
                letterSpacing: "-.2px",
              }}
            >
              {p.inStock ? (isAr?"أضف إلى السلة":"Add to Cart") : (isAr?"نفذ من المخزون":"Out of Stock")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────
function CartPage({ cart, dispatch, onBack, onCheckout, dark = false, isAr = true }) {
  const total      = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <div style={{ padding: "clamp(24px,4vw,48px)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 500, marginBottom: 28, color: "#ff9f0a",
        }}>
          {isAr ? "‹ متابعة التسوق" : "‹ Continue Shopping"}
        </button>
        <h2 style={{
          fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, letterSpacing: "-.5px",
          marginBottom: 28, color: "#1d1d1f",
        }}>
          {isAr ? "سلة المشتريات" : "Cart"} ({totalItems})
        </h2>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#86868b" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>🛒</div>
            <div style={{ fontSize: 17, fontWeight: 500 }}>{isAr?"السلة فارغة":"Cart is empty"}</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>{isAr?"أضف بعض المنتجات":"Add some products"}</div>
          </div>
        ) : (
          <>
            <div style={{ background: "#f5f5f7", borderRadius: 18, overflow: "hidden" }}>
              {cart.map((item, idx) => {
                const isUrl = typeof item.img === "string" && item.img.startsWith("http");
                return (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 18px",
                    borderBottom: idx < cart.length - 1 ? `1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}` : "none",
                    background: dark?"#2c2c2e":"#fff", flexWrap: "wrap",
                  }}>
                    <div style={{
                      background: "#f5f5f7", minWidth: 64, height: 64, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <ProductImg img={item.img} size={isUrl ? 52 : 36} />
                    </div>
                    <div style={{ flex: 1, minWidth: 100 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1d1d1f" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#86868b", marginTop: 2 }}>{item.brand}</div>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      background: "#f5f5f7", borderRadius: 50, padding: "3px",
                    }}>
                      <button
                        onClick={() => dispatch({ type: "DECREASE", id: item.id })}
                        style={{
                          width: 26, height: 26, borderRadius: "50%", border: "none",
                          background: "#e5e5ea", cursor: "pointer", fontSize: 16, fontWeight: 500,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>−</button>
                      <span style={{ width: 26, textAlign: "center", fontWeight: 600, fontSize: 14 }}>{item.qty}</span>
                      <button
                        onClick={() => dispatch({ type: "ADD", product: item })}
                        style={{
                          width: 26, height: 26, borderRadius: "50%", border: "none",
                          background: "#f47c26", color: "#fff", cursor: "pointer", fontSize: 16,
                          fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center",
                        }}>+</button>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, minWidth: 90, textAlign: "right", color: "#1d1d1f" }}>
                      {(item.price * item.qty).toLocaleString()} ج.م
                    </div>
                    <button
                      onClick={() => dispatch({ type: "DELETE", id: item.id })}
                      style={{
                        background: "none", border: "none", color: "#86868b",
                        width: 30, height: 30, cursor: "pointer", fontSize: 16, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, background: dark?"#1c1c1e":"#f5f5f7", borderRadius: 18, padding: "20px 24px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: "#86868b", marginBottom: 4 }}>{isAr?"الإجمالي":"Total"}</div>
                  <div style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: "#1d1d1f" }}>
                    {total.toLocaleString()} ج.م
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => dispatch({ type: "CLEAR" })}
                    style={{
                      padding: "11px 20px", border: `1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)"}`, background: dark?"#2c2c2e":"#fff",
                      cursor: "pointer", fontWeight: 500, fontSize: 13, borderRadius: 50, color: dark?"#f5f5f7":"#1d1d1f",
                    }}>
                    {isAr?"إفراغ السلة":"Clear Cart"}
                  </button>
                  <button
                    onClick={onCheckout}
                    style={{
                      padding: "11px 24px", border: "none", background: "#f47c26",
                      color: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 13, borderRadius: 50,
                    }}>
                    {isAr?"الدفع →":"Checkout →"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ─────────────────────────────────────────────────────────────
function CheckoutPage({ cart, onBack, onSuccess, dark = false, isAr = true }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [form, setForm]     = useState({ name: "", phone: "", email: "", governorate: "", address: "", notes: "" });
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState("");

  const inp = (field) => ({
    value: form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value }),
    style: {
      width: "100%", padding: "11px 14px", marginTop: 5,
      border: `1px solid ${dark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.14)"}`, borderRadius: 12,
      outline: "none", fontSize: 14, fontFamily: "inherit",
      background: dark?"#2c2c2e":"#fff", color: dark?"#f5f5f7":"#1d1d1f", boxSizing: "border-box",
    },
  });

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.governorate) {
      setError(isAr?"⚠️ يرجى ملء الاسم والهاتف والمحافظة":"⚠️ Please fill in name, phone and governorate");
      return;
    }
    setError("");
    setSending(true);

    const productsText = cart
      .map(i => `• ${i.name} × ${i.qty} = ${(i.price * i.qty).toLocaleString()} ج.م`)
      .join("\n");

    const templateParams = {
      from_name:   form.name,
      phone:       form.phone,
      email:       form.email || "لم يُذكر",
      governorate: form.governorate,
      address:     form.address || "لم يُذكر",
      notes:       form.notes   || "لا يوجد",
      products:    productsText,
      total:       total.toLocaleString() + " ج.م",
    };

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id:      EMAILJS_SERVICE_ID,
          template_id:     EMAILJS_TEMPLATE_ID,
          user_id:         EMAILJS_PUBLIC_KEY,
          template_params: templateParams,
        }),
      });
      if (res.status === 200) {
        onSuccess(form.name);
      } else {
        throw new Error("فشل الإرسال");
      }
    } catch (err) {
      setError(isAr?"✕ حصل خطأ في الإرسال. حاول تاني.":"✕ Error sending. Please try again.");
    }
    setSending(false);
  };

  const lbl = { fontSize: 11, color: "#86868b", fontWeight: 500, letterSpacing: .4 };

  return (
    <div style={{ padding: "clamp(24px,4vw,48px)", background: dark?"#111":"#f5f5f7", minHeight: "60vh" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 500, marginBottom: 28, color: "#f47c26",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {isAr?"‹ الرجوع للسلة":"‹ Back to Cart"}
        </button>
        <div style={{
          background: dark?"#1c1c1e":"#fff", borderRadius: 24, padding: "clamp(20px,4vw,36px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-.5px" }}>
            {isAr?"إتمام الطلب":"Complete Order"}
          </h2>
          <p style={{ fontSize: 13, color: "#86868b", marginBottom: 28 }}>
            {isAr?"أدخل بياناتك وهيتواصل معاك فريقنا في أقرب وقت":"Enter your details and our team will contact you soon."}
          </p>

          <div style={{ background: "#f5f5f7", borderRadius: 16, padding: "16px", marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: "#86868b", fontWeight: 500, marginBottom: 10, letterSpacing: .4 }}>{isAr?"ملخص الطلب":"Order Summary"}</div>
            {cart.map(item => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", gap: 8,
              }}>
                <span style={{ fontSize: 13, color: "#1d1d1f", fontWeight: 500, flex: 1 }}>{item.name}</span>
                <span style={{ fontSize: 12, color: "#86868b" }}>× {item.qty}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f", minWidth: 80, textAlign: "right" }}>
                  {(item.price * item.qty).toLocaleString()} ج.م
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: dark?"#f5f5f7":"#1d1d1f" }}>{isAr?"الإجمالي":"Total"}</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#f47c26" }}>
                {total.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={lbl}>{isAr?"الاسم الكامل *":"Full Name *"}</div>
              <input {...inp("name")} placeholder="محمد أحمد" />
            </div>
            <div>
              <div style={lbl}>{isAr?"رقم الهاتف *":"Phone *"}</div>
              <input {...inp("phone")} placeholder="01xxxxxxxxx" type="tel" />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={lbl}>{isAr?"البريد الإلكتروني":"Email"}</div>
            <input {...inp("email")} placeholder="email@example.com" type="email" />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={lbl}>{isAr?"المحافظة *":"Governorate *"}</div>
            <select
              value={form.governorate}
              onChange={e => setForm({ ...form, governorate: e.target.value })}
              style={{ ...inp("governorate").style, marginTop: 5, cursor: "pointer" }}
            >
              <option value="">{isAr?"اختر المحافظة":"Choose Governorate"}</option>
              {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={lbl}>{isAr?"العنوان بالتفصيل":"Address"}</div>
            <input {...inp("address")} placeholder="الشارع، المنطقة، رقم المنزل" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={lbl}>{isAr?"ملاحظات إضافية":"Notes"}</div>
            <textarea {...inp("notes")} rows={3} placeholder="أي ملاحظات للتوصيل أو الطلب..."
              style={{ ...inp("notes").style, resize: "vertical", minHeight: 80 }} />
          </div>

          {error && (
            <div style={{
              background: "#fff1f1", border: "1px solid #fecaca", borderRadius: 10,
              padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{
              width: "100%", padding: "15px",
              background: sending ? "#86868b" : "#f47c26",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 500, borderRadius: 50,
              cursor: sending ? "wait" : "pointer", transition: "background .2s", letterSpacing: "-.2px",
            }}
          >
            {sending ? (isAr?"⏳ جاري الإرسال...":"⏳ Sending...") : (isAr?"✓ تأكيد الطلب وإرساله":"✓ Confirm Order")}
          </button>
          <p style={{ fontSize: 11, color: "#86868b", textAlign: "center", marginTop: 12 }}>
            {isAr?"سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الطلب":"Our team will contact you within 24 hours."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER SUCCESS ─────────────────────────────────────────────────────────────
function OrderSuccess({ name, onHome, dark = false, isAr = true }) {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: dark?"#111":"#f5f5f7", padding: "clamp(24px,4vw,48px)",
    }}>
      <div style={{
        maxWidth: 440, textAlign: "center", background: dark?"#1c1c1e":"#fff",
        borderRadius: 24, padding: "clamp(32px,6vw,60px) clamp(24px,5vw,48px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: 72, height: 72, background: "rgba(52,199,89,0.12)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 36,
        }}>✓</div>
        <h2 style={{
          fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, color: "#1d1d1f",
          marginBottom: 10, letterSpacing: "-.5px",
        }}>
          {isAr?"تم إرسال طلبك!":"Order Sent!"}
        </h2>
        <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.6, marginBottom: 28 }}>
          {isAr?"شكراً":"Thank you"} <strong style={{ color: dark?"#f5f5f7":"#1d1d1f" }}>{name}</strong>! {isAr?"وصل طلبك بنجاح وهيتواصل معاك فريقنا في أقرب وقت ممكن.":"Your order was received. Our team will contact you soon."}
        </p>
        <button
          onClick={onHome}
          style={{
            padding: "13px 32px", background: "#f47c26", color: "#fff", border: "none",
            fontSize: 14, fontWeight: 500, borderRadius: 50, cursor: "pointer",
          }}
        >
          {isAr?"الرجوع للمتجر":"Back to Store"}
        </button>
      </div>
    </div>
  );
}

// ─── ADD PRODUCT FORM ──────────────────────────────────────────────────────────
function AddProductForm({ onAdded, dark = false, isAr = true }) {
  const emptyForm = {
    name: "", brand: "", category: "New",
    price: "", oldPrice: "", inStock: true, rating: 4.5, reviews: 0,
    specs: { screen: "", camera: "", battery: "", storage: "" },
  };
  const [form, setForm]           = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [msg, setMsg]             = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.price) {
      setMsg("⚠️ الاسم والبراند والسعر مطلوبين");
      return;
    }
    setUploading(true);
    setMsg("");
    setProgress(0);
    try {
      let imgValue = "📱";
      if (imageFile) {
        imgValue = await uploadToCloudinary(imageFile, setProgress);
      }
      await addDoc(collection(db, "products"), {
        ...form,
        img:      imgValue,
        price:    Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        rating:   Number(form.rating),
        reviews:  Number(form.reviews),
      });
      setMsg("✓ تم إضافة المنتج بنجاح!");
      setForm(emptyForm);
      setImageFile(null);
      setPreview(null);
      setProgress(0);
      onAdded();
    } catch (err) {
      setMsg(`✕ خطأ: ${err.message}`);
    }
    setUploading(false);
  };

  const inputStyle = {
    display: "block", width: "100%", marginTop: 6,
    padding: "11px 14px", border: `1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)"}`,
    borderRadius: 10, outline: "none", fontSize: 14, fontFamily: "inherit",
    background: dark?"#1c1c1e":"#fff", color: dark?"#f5f5f7":"#1d1d1f", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, letterSpacing: .5, color: "#86868b", fontWeight: 500 };

  return (
    <div style={{ background: dark?"#2c2c2e":"#f5f5f7", borderRadius: 20, padding: 28, marginTop: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600, color: dark?"#f5f5f7":"#1d1d1f" }}>{isAr?"إضافة منتج جديد":"Add New Product"}</h3>
      <div style={{ marginBottom: 18 }}>
        <div style={labelStyle}>صورة المنتج</div>
        <div style={{
          marginTop: 8, border: "2px dashed rgba(0,113,227,0.3)", padding: 20, textAlign: "center",
          cursor: "pointer", position: "relative", background: "#fff", minHeight: 100, borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6,
        }}>
          {preview
            ? <img src={preview} alt="preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10 }} />
            : <>
                <div style={{ fontSize: 32 }}>📷</div>
                <div style={{ color: "#86868b", fontSize: 12 }}>اضغط لاختيار صورة</div>
              </>
          }
          <input type="file" accept="image/*" onChange={handleImageChange}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>
        {preview && (
          <button
            onClick={() => { setImageFile(null); setPreview(null); }}
            style={{
              marginTop: 6, background: "none", border: "1px solid rgba(0,0,0,0.12)",
              color: "#86868b", padding: "3px 12px", fontSize: 11, cursor: "pointer", borderRadius: 50,
            }}>
            ✕ إزالة الصورة
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={labelStyle}>اسم المنتج *</div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: iPhone 16 Pro" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>البراند *</div>
          <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
            placeholder="Apple" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>السعر (ج.م) *</div>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
            placeholder="5499" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>السعر القديم (ج.م)</div>
          <input type="number" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })}
            placeholder="اتركه فاضي" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>الفئة</div>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            style={{ ...inputStyle, marginTop: 6 }}>
            {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={labelStyle}>الحالة</div>
          <button
            onClick={() => setForm({ ...form, inStock: !form.inStock })}
            style={{
              marginTop: 6, padding: "11px 20px", width: "100%",
              background: form.inStock ? "#34c759" : "#ff3b30",
              color: "#fff", border: "none", fontWeight: 500, fontSize: 13, borderRadius: 10, cursor: "pointer",
            }}>
            {form.inStock ? "✓ متاح" : "✕ غير متاح"}
          </button>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 18, marginBottom: 14 }}>
        <div style={{ ...labelStyle, marginBottom: 10 }}>المواصفات</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
          {[{ key: "screen", ph: '6.1"' }, { key: "camera", ph: "48MP" }, { key: "battery", ph: "4000mAh" }, { key: "storage", ph: "128GB" }].map(({ key, ph }) => (
            <div key={key}>
              <div style={{ ...labelStyle, fontSize: 10 }}>{key.toUpperCase()}</div>
              <input value={form.specs[key]}
                onChange={e => setForm({ ...form, specs: { ...form.specs, [key]: e.target.value } })}
                placeholder={ph} style={inputStyle} />
            </div>
          ))}
        </div>
      </div>
      {uploading && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ background: "rgba(0,0,0,0.08)", height: 4, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ background: "#f47c26", height: "100%", width: `${progress}%`, transition: "width .3s", borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 12, color: "#86868b", marginTop: 4, textAlign: "center" }}>
            {progress < 100 ? `جاري الرفع... ${progress}%` : "✓ اكتمل الرفع"}
          </div>
        </div>
      )}
      {msg && (
        <div style={{
          padding: "11px 14px", marginBottom: 14, borderRadius: 10,
          background: msg.startsWith("✓") ? "#f0fdf4" : "#fff1f1",
          border: `1px solid ${msg.startsWith("✓") ? "#bbf7d0" : "#fecaca"}`,
          color: msg.startsWith("✓") ? "#166534" : "#dc2626", fontSize: 13, fontWeight: 500,
        }}>
          {msg}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={uploading}
        style={{
          width: "100%", padding: 14, background: uploading ? "#86868b" : "#0071e3", color: "#fff",
          border: "none", fontSize: 14, fontWeight: 500, borderRadius: 50,
          cursor: uploading ? "wait" : "pointer", transition: "background .2s",
        }}>
        {uploading ? `⏳ ${progress}%` : "إضافة المنتج"}
      </button>
    </div>
  );
}

// ─── ADMIN LOGIN ───────────────────────────────────────────────────────────────
function AdminLogin({ onSuccess, onBack, dark = false, isAr = true }) {
  const [pass, setPass]   = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      onSuccess();
    } else {
      setError(true); setShake(true); setPass("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: dark?"#111":"#f5f5f7", padding: 16,
    }}>
      <div style={{
        width: "100%", maxWidth: 380, background: dark?"#1c1c1e":"#fff", borderRadius: 24,
        padding: "clamp(32px,6vw,48px) clamp(20px,5vw,40px)", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        animation: shake ? "shake .4s ease" : "none",
      }}>
        <div style={{
          width: 56, height: 56, background: "#1d1d1f", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 20,
        }}>🔒</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#1d1d1f" }}>Admin Panel</h2>
        <p style={{ fontSize: 13, color: "#86868b", marginBottom: 28 }}>{isAr?"أدخل كلمة المرور للمتابعة":"Enter password to continue"}</p>
        <input
          type="password"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder={isAr?"كلمة المرور":"Password"}
          autoFocus
          style={{
            width: "100%", padding: "13px 14px", marginBottom: 6,
            border: `1.5px solid ${error ? "#ff3b30" : "rgba(0,0,0,0.12)"}`,
            borderRadius: 12, outline: "none", fontSize: 14, fontFamily: "inherit",
            textAlign: "center", color: dark?"#f5f5f7":"#1d1d1f", background: dark?"#2c2c2e":"#fff", boxSizing: "border-box",
          }}
        />
        {error && <div style={{ color: "#ff3b30", fontSize: 13, fontWeight: 500, marginBottom: 10 }}>{isAr?"كلمة المرور غلط ✕":"Wrong password ✕"}</div>}
        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "13px", background: "#ff9f0a", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 500, borderRadius: 50, cursor: "pointer",
            marginBottom: 10, marginTop: 6,
          }}>
          {isAr?"دخول":"Login"}
        </button>
        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "13px", background: "transparent", color: "#ff9f0a",
            border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
          {isAr?" الرجوع للمتجر":" Back to Store"}
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage({ products, onLogout, onBack, onRefresh, dark = false, isAr = true }) {
  const [tab, setTab] = useState("products");

  const handleDelete = async (id) => {
    if (!window.confirm("مسح المنتج ده؟")) return;
    try { await deleteDoc(doc(db, "products", id)); onRefresh(); }
    catch (e) { alert("خطأ في المسح"); }
  };

  const toggleStock = async (p) => {
    try { await updateDoc(doc(db, "products", p.id), { inStock: !p.inStock }); onRefresh(); }
    catch (e) { alert("خطأ في التعديل"); }
  };

  return (
    <div style={{ padding: "clamp(24px,4vw,48px)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#f47c26" }}> الرجوع للمتجر</button>
          <button onClick={onLogout} style={{ background: "#f5f5f7", border: "none", padding: "7px 18px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#86868b" }}>
            🔓 خروج
          </button>
        </div>
        <h2 style={{ margin: "0 0 28px", fontSize: "clamp(26px,4vw,34px)", fontWeight: 700, letterSpacing: "-.5px", color: "#1d1d1f" }}>Admin Panel</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "إجمالي المنتجات", value: products.length,                               color: "#0071e3" },
            { label: "متاح",             value: products.filter(p => p.inStock).length,          color: "#34c759" },
            { label: "نفذ",              value: products.filter(p => !p.inStock).length,         color: "#ff3b30" },
            { label: "البراندات",         value: [...new Set(products.map(p => p.brand))].length, color: "#ff9f0a" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: 14, padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: "#86868b", marginBottom: 6, fontWeight: 500 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#f5f5f7", borderRadius: 12, padding: 4 }}>
          {[{ key: "products", label: "📋 المنتجات" }, { key: "add", label: "➕ إضافة" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "9px 16px", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500, borderRadius: 10,
              background: tab === t.key ? "#fff" : "transparent",
              color: tab === t.key ? "#1d1d1f" : "#86868b",
              boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              transition: "all .2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === "products" && (
          <div style={{ background: dark?"#1c1c1e":"#fff", borderRadius: 14, overflow: "auto", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
              <thead>
                <tr style={{ background: dark?"#2c2c2e":"#f5f5f7", textAlign: "right" }}>
                  {["#", "صورة", "الاسم", "البراند", "الفئة", "السعر", "الحالة", "إجراءات"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", fontSize: 11, letterSpacing: .4, fontWeight: 600, color: "#86868b", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const isUrl = typeof p.img === "string" && p.img.startsWith("http");
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}` }}>
                      <td style={{ padding: "12px 14px", color: "#86868b" }}>{i + 1}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ width: 44, height: 44, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                          <ProductImg img={p.img} size={isUrl ? 44 : 26} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: dark?"#f5f5f7":"#1d1d1f" }}>{p.name}</td>
                      <td style={{ padding: "12px 14px", color: "#86868b" }}>{p.brand}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ background: "#f5f5f7", padding: "3px 8px", borderRadius: 50, fontSize: 11, fontWeight: 500, color: "#86868b" }}>{p.category}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: dark?"#f5f5f7":"#1d1d1f", whiteSpace: "nowrap" }}>
                        {Number(p.price).toLocaleString()} ج.م
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button onClick={() => toggleStock(p)} style={{
                          padding: "4px 12px", border: "none", cursor: "pointer", borderRadius: 50,
                          fontWeight: 500, fontSize: 11,
                          background: p.inStock ? "rgba(52,199,89,0.12)" : "rgba(255,59,48,0.12)",
                          color: p.inStock ? "#34c759" : "#ff3b30", whiteSpace: "nowrap",
                        }}>
                          {p.inStock ? (isAr?"✓ متاح":"✓ In Stock") : (isAr?"✕ نفذ":"✕ Sold Out")}
                        </button>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button onClick={() => handleDelete(p.id)} style={{
                          padding: "4px 12px", border: "none", borderRadius: 50,
                          background: "rgba(255,59,48,0.1)", color: "#ff3b30", cursor: "pointer",
                          fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
                        }}>
                          {isAr?"🗑 مسح":"🗑 Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {products.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#86868b", fontSize: 13 }}>
                {isAr?"لا توجد منتجات بعد":"No products yet"}
              </div>
            )}
          </div>
        )}
        {tab === "add" && (
          <AddProductForm onAdded={() => { onRefresh(); setTab("products"); }} dark={dark} isAr={isAr} />
        )}
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ isAr = true }) {
  return (
    <footer style={{
      background: "#0a0a0a", color: "#888", fontFamily: "sans-serif",
      direction: "rtl", width: "100%", boxSizing: "border-box"
    }}>

      {/* ── Stats ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        textAlign: "center",
        padding: "clamp(28px,4vw,48px) clamp(16px,4vw,40px)",
        borderBottom: "0.5px solid #222", gap: 16,
      }}>
        {[
          { num: "+500", label: "منتج متوفر" },
          { num: "24H",  label: "شحن سريع"   },
          { num: "100%", label: "ضمان الجودة" },
        ].map(s => (
          <div key={s.num}>
            <div style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 700, color: "#fff", letterSpacing: -1 }}>{s.num}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main columns ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 32,
        padding: "clamp(28px,4vw,48px) clamp(16px,4vw,40px)",
        borderBottom: "0.5px solid #222",
        alignItems: "start",
      }}>

{/* Brand */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  {/* Logo */}
  <div
    style={{
      width: 360,
      height: 100,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={LOGO_SRC}
      alt="Ashour Store"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
      }}
    />
  </div>

  {/* Text */}
  <p
    style={{
      fontSize: 13,
      color: "#555",
      lineHeight: 1.8,
      marginTop: 12,
      textAlign: "center",
      maxWidth: 290,
    }}
  >
    متجرك الأول للمنتجات التقنية والإلكترونية بأعلى جودة وأفضل أسعار.
  </p>
</div>
        {/* Nav links */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 14, letterSpacing: 1 }}>
            {isAr ? "روابط" : "Links"}
          </div>
          {(isAr
            ? ["الرئيسية", "المتجر", "السلة", "من نحن"]
            : ["Home", "Shop", "Cart", "About"]
          ).map(link => (
            <div key={link} style={{ fontSize: 13, color: "#666", marginBottom: 8, cursor: "pointer" }}>
              {link}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <FiPhone color="#ff9c2a" size={16} />
            <span dir="ltr" style={{ fontSize: 13 }}>0109 760 7401</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <FiMail color="#ff9c2a" size={16} />
            <span style={{ fontSize: 13 }}>ashourstore12@gmail.com</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <FiMapPin color="#ff9c2a" size={16} />
            <span style={{ fontSize: 13 }}>الغردقة — الدهار — أمام المحكمة</span>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px clamp(16px,4vw,40px)", flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ fontSize: 11, color: "#444" }}>
          {isAr ? "© ASHOUR STORE 2024 جميع الحقوق محفوظة" : "© ASHOUR STORE 2024 All rights reserved"}
        </div>
        <div style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase" }}>
          BUILT WITH REACT.JS
        </div>
      </div>

    </footer>
  );
}
// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function AshourStore() {
  // ── Splash state ──
  const [splashDone, setSplashDone] = useState(false);

  // ── Theme & Language ──
  const [dark, setDark] = useState(() => localStorage.getItem("ash_dark") === "1");
  const [lang, setLang] = useState(() => localStorage.getItem("ash_lang") || "ar");
  const isAr = lang === "ar";

  // ── Store state ──
  const [products, setProducts]       = useState(PRODUCTS);
  const [page, setPage]               = useState("home");
  const [selected, setSelected]       = useState(null);
  const [brand, setBrand]             = useState("All");
  const [category, setCat]            = useState("All");
  const [search, setSearch]           = useState("");
  const [toastMsg, setToastMsg]       = useState("");
  const [loading, setLoading]         = useState(true);
  const [cart, dispatch]              = useReducer(cartReducer, []);
  const [adminAuth, setAdminAuth]     = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [scrolled, setScrolled]       = useState(false);
  const [successName, setSuccessName] = useState("");
  const [menuOpen, setMenuOpen]       = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { localStorage.setItem("ash_dark", dark ? "1" : "0"); }, [dark]);
  useEffect(() => { localStorage.setItem("ash_lang", lang); }, [lang]);

  const fetchProducts = async () => {
    try {
      const snap = await getDocs(collection(db, "products"));
      if (!snap.empty) {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setProducts(PRODUCTS);
      }
    } catch (e) {
      console.error("Firestore:", e);
      setProducts(PRODUCTS);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const cartCount   = cart.reduce((s, i) => s + i.qty, 0);
  const addToCart   = (p) => { dispatch({ type: "ADD", product: p }); setToastMsg(`✓ ${p.name} ${isAr?"أُضيف للسلة":"added to cart"}`); };
  const viewProduct = (p) => { setSelected(p); setPage("details"); window.scrollTo(0, 0); };

  const handleAdminClick   = () => { adminAuth ? setPage("admin") : setPage("adminLogin"); setMenuOpen(false); };
  const handleAdminSuccess = () => { setAdminAuth(true); setPage("admin"); };
  const handleAdminLogout  = () => { sessionStorage.removeItem("adminAuth"); setAdminAuth(false); setPage("home"); };

  const handleOrderSuccess = (name) => {
    setSuccessName(name);
    dispatch({ type: "CLEAR" });
    setPage("success");
    window.scrollTo(0, 0);
  };

  const filtered = products.filter(p => {
    const bOk = brand === "All" || p.brand === brand;
    const cOk = category === "All" || p.category === category;
    const sOk = p.name?.toLowerCase().includes(search.toLowerCase())
             || p.brand?.toLowerCase().includes(search.toLowerCase());
    return bOk && cOk && sOk;
  });

  // ── Show splash until done ──
  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  const D = {
    bg:      dark ? "#0a0a0a" : "#fff",
    fg:      dark ? "#f5f5f7" : "#1d1d1f",
    bg2:     dark ? "#1c1c1e" : "#f5f5f7",
    bg3:     dark ? "#2c2c2e" : "#fff",
    border:  dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    sub:     "#86868b",
  };

  return (
    <div style={{
      minHeight: "100vh", background: D.bg, color: D.fg,
      fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',sans-serif",
      direction: isAr ? "rtl" : "ltr", width: "100%", overflowX: "hidden", margin: 0, padding: 0,
      transition: "background .3s,color .3s",
    }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-8px)}80%{transform:translateX(8px)}}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{margin:0!important;padding:0!important;width:100%;overflow-x:hidden}
        button:focus{outline:none}
        input:focus,select:focus,textarea:focus{border-color:#f47c26!important;outline:none}
        @media(max-width:640px){
          .nav-links{display:none!important}
          .nav-search-desktop{display:none!important}
          .hamburger{display:flex!important}
        }
        @media(min-width:641px){
          .hamburger{display:none!important}
          .mobile-menu{display:none!important}
        }
      `}</style>

      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg("")} />}

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000, background: dark ? "#000" : "#111",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "all .3s ease",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 56, padding: "0 clamp(12px,3vw,24px)", width: "100%",
        }}>
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}
            onClick={() => { setPage("home"); setMenuOpen(false); }}
          >
            <img src={LOGO_SRC} alt="Ashour Store" style={{
              height: "clamp(140px,18vw,200px)", width: "clamp(160px,20vw,240px)",
              objectFit: "contain", display: "block",
            }} />
          </div>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[{ label: isAr?"الرئيسية":"Home", key: "home" }, { label: isAr?"المتجر":"Shop", key: "shop" }].map(n => (
              <button key={n.key} onClick={() => setPage(n.key)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                color: page === n.key ? "#ff9f0a" : "#fff", transition: "color .2s", padding: 0,
              }}>
                {n.label}
              </button>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="nav-search-desktop" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "5px 12px",
            }}>
              <svg width="12" height="12" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isAr?"بحث...":"Search..."}
                style={{
                  border: "none", outline: "none", fontSize: 12, width: 110,
                  fontFamily: "inherit", background: "transparent", color: "#fff",
                }}
              />
            </div>
            <button onClick={handleAdminClick} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 12,
              fontWeight: 500, color: adminAuth ? "#34c759" : "#86868b", padding: 0,
            }}>
              {adminAuth ? "🔓" : "🔒"} Admin
            </button>
            <button onClick={() => setDark(d => !d)} title={dark ? (isAr ? "وضع النهار" : "Light Mode") : (isAr ? "وضع الليل" : "Dark Mode")} style={{
              background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
              borderRadius: "50%", width: 30, height: 30, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setLang(l => l === "ar" ? "en" : "ar")} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 50, padding: "3px 10px", cursor: "pointer",
              fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1,
            }}>
              {isAr ? "EN" : "ع"}
            </button>
            <button onClick={() => setPage("cart")} style={{
              position: "relative", background: "#ff9f0a", color: "#fff",
              border: "none", padding: "6px 16px", cursor: "pointer", borderRadius: 50,
              fontWeight: 500, fontSize: 12, display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
            }}>
              🛒 السلة
              {cartCount > 0 && (
                <span style={{
                  background: "#fff", color: "#ff9f0a", borderRadius: "50%",
                  width: 16, height: 16, fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile right side */}
          <div className="hamburger" style={{ display: "none", alignItems: "center", gap: 10 }}>
            <button onClick={() => setPage("cart")} style={{
              position: "relative", background: "#ff9f0a", color: "#fff",
              border: "none", padding: "6px 14px", cursor: "pointer", borderRadius: 50,
              fontWeight: 500, fontSize: 12, display: "flex", alignItems: "center", gap: 4,
            }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  background: "#fff", color: "#ff9f0a", borderRadius: "50%",
                  width: 16, height: 16, fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#fff", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36,
            }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            background: "#111", borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "16px clamp(16px,4vw,24px) 20px", display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", marginBottom: 8,
            }}>
              <svg width="13" height="13" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isAr?"بحث عن منتج...":"Search products..."}
                style={{
                  border: "none", outline: "none", fontSize: 14, flex: 1,
                  fontFamily: "inherit", background: "transparent", color: "#fff",
                }}
              />
            </div>
            {[{ label: isAr?"الرئيسية":"Home", key: "home" }, { label: isAr?"المتجر":"Shop", key: "shop" }].map(n => (
              <button key={n.key} onClick={() => { setPage(n.key); setMenuOpen(false); }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 500, color: page === n.key ? "#ff9f0a" : "#ccc",
                textAlign: "right", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                {n.label}
              </button>
            ))}
            <button onClick={handleAdminClick} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 15, fontWeight: 500, color: adminAuth ? "#34c759" : "#888",
              textAlign: "right", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {adminAuth ? (isAr?"🔓 Admin (مسجل دخول)":"🔓 Admin (Logged In)") : "🔒 Admin"}
            </button>
            <div style={{ display: "flex", gap: 8, paddingTop: 10 }}>
              <button onClick={() => setDark(d => !d)} style={{
                flex: 1, padding: "9px 0", background: "rgba(255,255,255,0.08)", border: "none",
                borderRadius: 10, cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 500,
              }}>
                {dark ? (isAr ? "☀️ نهاري" : "☀️ Light") : (isAr ? "🌙 ليلي" : "🌙 Dark")}
              </button>
              <button onClick={() => setLang(l => l === "ar" ? "en" : "ar")} style={{
                flex: 1, padding: "9px 0", background: "rgba(255,255,255,0.08)", border: "none",
                borderRadius: 10, cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 500,
              }}>
                🌐 {isAr ? "English" : "عربي"}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── PAGES ── */}
      {page === "home" && (
        <>
          <Banner onShop={() => setPage("shop")} dark={dark} isAr={isAr} />
          <div style={{ padding: "clamp(32px,5vw,70px) clamp(16px,4vw,48px) clamp(32px,4vw,60px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(20px,4vw,28px)", fontWeight: 700, letterSpacing: "-.5px", color: D.fg }}>
                {isAr ? "المنتجات المميزة" : "Featured Products"}
              </h2>
              <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 500, color: "#ff9f0a" }}>
                {isAr ? "عرض الكل" : "View All "}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 20 }}>
              {products.slice(0, 4).map(p => <ProductCard key={p.id} p={p} onView={viewProduct} onAdd={addToCart} dark={dark} isAr={isAr} />)}
            </div>
          </div>
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "shop" && (
        <>
          <div style={{ padding: "clamp(24px,4vw,48px)" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: "#86868b", letterSpacing: .5, marginBottom: 6, fontWeight: 500 }}>ASHOUR STORE</div>
              <h2 style={{ margin: "0 0 6px", fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, letterSpacing: "-.5px", color: D.fg }}>
                {isAr ? "كل المنتجات" : "All Products"}
              </h2>
              <div style={{ fontSize: 13, color: "#86868b" }}>{filtered.length} {isAr ? "منتج" : "products"}</div>
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: "#86868b", marginBottom: 8, fontWeight: 500, letterSpacing: .5 }}>{isAr ? "البراند" : "Brand"}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {BRANDS.map(b => (
                    <button key={b} onClick={() => setBrand(b)} style={{
                      padding: "6px 16px", borderRadius: 50, border: "none",
                      background: brand === b ? (dark?"#fff":"#1d1d1f") : (dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.06)"),
                      color: brand === b ? (dark?"#000":"#fff") : D.fg,
                      fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .2s",
                    }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#86868b", marginBottom: 8, fontWeight: 500, letterSpacing: .5 }}>{isAr ? "الفئة" : "Category"}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCat(c)} style={{
                      padding: "6px 16px", borderRadius: 50, border: "none",
                      background: category === c ? (dark?"#fff":"#1d1d1f") : (dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.06)"),
                      color: category === c ? (dark?"#000":"#fff") : D.fg,
                      fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .2s",
                    }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 20 }}>
              {filtered.length === 0
                ? <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#86868b" }}>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{isAr ? "لا توجد منتجات" : "No products found"}</div>
                  </div>
                : filtered.map(p => <ProductCard key={p.id} p={p} onView={viewProduct} onAdd={addToCart} dark={dark} isAr={isAr} />)
              }
            </div>
          </div>
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "details" && selected && (
        <>
          <ProductDetails p={selected} onBack={() => setPage("shop")} onAdd={addToCart} dark={dark} isAr={isAr} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "cart" && (
        <>
          <CartPage cart={cart} dispatch={dispatch} dark={dark} isAr={isAr}
            onBack={() => setPage("shop")}
            onCheckout={() => { if (cart.length > 0) { setPage("checkout"); window.scrollTo(0, 0); } }} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "checkout" && (
        <>
          <CheckoutPage cart={cart} onBack={() => setPage("cart")} onSuccess={handleOrderSuccess} dark={dark} isAr={isAr} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "success" && (
        <>
          <OrderSuccess name={successName} onHome={() => setPage("home")} dark={dark} isAr={isAr} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "adminLogin" && (
        <>
          <AdminLogin onSuccess={handleAdminSuccess} onBack={() => setPage("home")} dark={dark} isAr={isAr} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "admin" && adminAuth && (
        <>
          <AdminPage products={products} onLogout={handleAdminLogout} dark={dark} isAr={isAr}
            onBack={() => setPage("home")} onRefresh={fetchProducts} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}

      {page === "admin" && !adminAuth && (
        <>
          <AdminLogin onSuccess={handleAdminSuccess} onBack={() => setPage("home")} dark={dark} isAr={isAr} />
          <Footer dark={dark} isAr={isAr} />
        </>
      )}
    </div>
  );
}