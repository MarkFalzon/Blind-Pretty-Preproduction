import React, { useState, useRef } from "react";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
// Replace with your Formspree endpoint after creating a form at formspree.io
const FORMSPREE_URL = "https://formspree.io/f/REPLACE_WITH_YOUR_ENDPOINT";

// Studio details — update these
const STUDIO_NAME = "Jesse Falzon Studio";
const STUDIO_TAGLINE = "Pre-production questionnaire";
const STUDIO_EMAIL = "jesse@yourstudio.com.au"; // shown on confirmation screen

// Brand colours — update to match studio branding
const BRAND = {
  headerBg: "#0f1923",
  headerAccent: "#1a2e3d",
  accent: "#2a9d7c",
  accentLight: "#e6f5f0",
  accentDark: "#1e7a5e",
  sectionTag: "#2a9d7c",
  pageBackground: "#f5f5f3",
  cardBackground: "#ffffff",
  textPrimary: "#1a1a1a",
  textSecondary: "#555555",
  textMuted: "#888888",
  border: "#e0e0de",
  inputBorder: "#ccccca",
  starActive: "#e8a020",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const gFonts = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${BRAND.pageBackground}; font-family: 'DM Sans', sans-serif; color: ${BRAND.textPrimary}; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
  input[type=text], input[type=email], input[type=tel], input[type=number], select, textarea {
    width: 100%; padding: 10px 12px; border: 1px solid ${BRAND.inputBorder};
    border-radius: 8px; font-size: 14px; color: ${BRAND.textPrimary};
    background: #fff; outline: none; transition: border-color 0.15s;
  }
  input:focus, select:focus, textarea:focus { border-color: ${BRAND.accent}; }
  textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  label { display: block; font-size: 13px; font-weight: 500; color: ${BRAND.textPrimary}; margin-bottom: 5px; }
`;

const S = {
  page: { maxWidth: 700, margin: "0 auto", padding: "0 16px 60px" },
  header: {
    background: BRAND.headerBg,
    padding: "32px 24px 28px",
    textAlign: "center",
    marginBottom: 0,
  },
  headerInner: { maxWidth: 700, margin: "0 auto" },
  studioName: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 26,
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "-0.5px",
    marginBottom: 6,
  },
  studioAccent: { color: BRAND.accent },
  tagline: { fontSize: 14, color: "#aaaaaa", marginBottom: 0 },
  progressWrap: {
    background: BRAND.headerAccent,
    padding: "16px 24px",
    marginBottom: 24,
  },
  progressInner: { maxWidth: 700, margin: "0 auto" },
  stepLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepLabel: (active, done) => ({
    fontSize: 11,
    fontWeight: active ? 600 : 400,
    color: done ? BRAND.accent : active ? "#ffffff" : "#777777",
    flex: 1,
    textAlign: "center",
  }),
  progressTrack: {
    height: 3,
    background: "#2a3a4a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: pct + "%",
    background: BRAND.accent,
    borderRadius: 4,
    transition: "width 0.4s ease",
  }),
  card: {
    background: BRAND.cardBackground,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
  },
  sectionIntro: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 22,
    fontWeight: 600,
    color: BRAND.textPrimary,
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 14,
    color: BRAND.textSecondary,
    lineHeight: 1.6,
  },
  sectionTag: {
    display: "inline-block",
    background: BRAND.accentLight,
    color: BRAND.accentDark,
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  field: { marginBottom: 18 },
  fieldLast: { marginBottom: 0 },
  hint: {
    fontSize: 12,
    color: BRAND.textMuted,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  required: { color: "#e05555", marginLeft: 2 },
  radioItem: (selected) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "11px 14px",
    border: `1px solid ${selected ? BRAND.accent : BRAND.border}`,
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 8,
    background: selected ? BRAND.accentLight : "#fff",
    transition: "border-color 0.15s, background 0.15s",
  }),
  radioInput: { marginTop: 2, flexShrink: 0, accentColor: BRAND.accent },
  radioLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: BRAND.textPrimary,
    lineHeight: 1.4,
  },
  radioSub: { fontSize: 12, color: BRAND.textSecondary, marginTop: 2 },
  cbItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 8,
    cursor: "pointer",
  },
  cbInput: { marginTop: 2, flexShrink: 0, accentColor: BRAND.accent },
  cbLabel: { fontSize: 14, color: BRAND.textPrimary, lineHeight: 1.4 },
  cbSub: { fontSize: 12, color: BRAND.textMuted, display: "block", marginTop: 1 },
  textAreaWrap: { position: "relative" },
  micBtn: (active) => ({
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: `1px solid ${active ? BRAND.accent : BRAND.inputBorder}`,
    background: active ? BRAND.accentLight : "#f9f9f9",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    transition: "all 0.15s",
  }),
  songRow: {
    background: "#fafafa",
    border: `1px solid ${BRAND.border}`,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  songRowHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  songNum: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: BRAND.accentLight,
    color: BRAND.accentDark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  addBtn: {
    background: "none",
    border: "none",
    color: BRAND.accent,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    padding: "4px 0",
    marginTop: 4,
  },
  infoBanner: {
    background: BRAND.accentLight,
    border: `1px solid ${BRAND.accent}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: BRAND.accentDark,
    marginBottom: 16,
    lineHeight: 1.6,
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  btnPrimary: {
    padding: "11px 28px",
    background: BRAND.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "11px 24px",
    background: "transparent",
    color: BRAND.textSecondary,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  summarySection: { marginBottom: 20 },
  summaryHeading: {
    fontSize: 11,
    fontWeight: 600,
    color: BRAND.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 8,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "6px 0",
    borderBottom: `1px solid ${BRAND.border}`,
  },
  summaryKey: { color: BRAND.textSecondary },
  summaryVal: {
    color: BRAND.textPrimary,
    fontWeight: 500,
    textAlign: "right",
    maxWidth: "60%",
  },
  confirmScreen: {
    textAlign: "center",
    padding: "48px 24px",
    background: BRAND.cardBackground,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 12,
    marginTop: 24,
  },
  confirmIcon: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: BRAND.accentLight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: 28,
  },
  confirmTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 12,
  },
  confirmSub: {
    fontSize: 15,
    color: BRAND.textSecondary,
    lineHeight: 1.7,
    maxWidth: 460,
    margin: "0 auto",
  },
  errorMsg: {
    background: "#fff5f5",
    border: "1px solid #ffcccc",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#c0392b",
    marginTop: 12,
  },
};

// ─── VOICE INPUT HOOK ─────────────────────────────────────────────────────────
function useMic(fieldSetter) {
  const recRef = useRef(null);
  const [active, setActive] = useState(false);

  const toggle = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input works in Chrome only."); return; }
    if (active) {
      recRef.current && recRef.current.stop();
      setActive(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-AU";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      fieldSetter((prev) => (prev ? prev + " " + transcript : transcript));
    };
    rec.onend = () => setActive(false);
    rec.start();
    recRef.current = rec;
    setActive(true);
  };

  return { active, toggle };
}

// ─── VOICE TEXTAREA COMPONENT ─────────────────────────────────────────────────
function VoiceTextarea({ value, onChange, placeholder, rows = 4 }) {
  const { active, toggle } = useMic(onChange);
  return (
    <div style={S.textAreaWrap}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={toggle}
        style={S.micBtn(active)}
        title={active ? "Stop recording" : "Tap to dictate"}
      >
        🎙
      </button>
    </div>
  );
}

// ─── RADIO GROUP COMPONENT ────────────────────────────────────────────────────
function RadioGroup({ name, options, value, onChange }) {
  return (
    <div>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={S.radioItem(value === opt.value)}
          onClick={() => onChange(opt.value)}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={S.radioInput}
          />
          <div>
            <div style={S.radioLabel}>{opt.label}</div>
            {opt.sub && <div style={S.radioSub}>{opt.sub}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}

// ─── CHECKBOX GROUP COMPONENT ─────────────────────────────────────────────────
function CheckboxGroup({ options, value = [], onChange }) {
  const toggle = (v) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange(next);
  };
  return (
    <div>
      {options.map((opt) => (
        <label key={opt.value} style={S.cbItem}>
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            style={S.cbInput}
          />
          <span>
            <span style={S.cbLabel}>{opt.label}</span>
            {opt.sub && <span style={S.cbSub}>{opt.sub}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

// ─── SONG ROWS COMPONENT ──────────────────────────────────────────────────────
function SongRows({ songs, onChange }) {
  const update = (i, key, val) => {
    const next = songs.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    onChange(next);
  };
  const add = () =>
    onChange([...songs, { title: "", lyrics: "", arrangement: "" }]);

  return (
    <div>
      {songs.map((song, i) => (
        <div key={i} style={S.songRow}>
          <div style={S.songRowHeader}>
            <div style={S.songNum}>{i + 1}</div>
            <input
              type="text"
              placeholder="Song title or working title"
              value={song.title}
              onChange={(e) => update(i, "title", e.target.value)}
            />
          </div>
          <div style={S.row2}>
            <select
              value={song.lyrics}
              onChange={(e) => update(i, "lyrics", e.target.value)}
            >
              <option value="">Lyric status...</option>
              <option>Lyrics complete</option>
              <option>Mostly written</option>
              <option>Partially written</option>
              <option>Not written yet</option>
            </select>
            <select
              value={song.arrangement}
              onChange={(e) => update(i, "arrangement", e.target.value)}
            >
              <option value="">Arrangement...</option>
              <option>Fully arranged</option>
              <option>Mostly arranged</option>
              <option>Partially arranged</option>
              <option>Not arranged yet</option>
            </select>
          </div>
        </div>
      ))}
      <button type="button" style={S.addBtn} onClick={add}>
        + Add another song
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: About You
  const [artistName, setArtistName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");
  const [referralPerson, setReferralPerson] = useState("");
  const [projectType, setProjectType] = useState("");
  const [numSongs, setNumSongs] = useState("");
  const [numPerformers, setNumPerformers] = useState("");
  const [targetRelease, setTargetRelease] = useState("");

  // ── Step 2: Your Songs
  const [songs, setSongs] = useState([
    { title: "", lyrics: "", arrangement: "" },
  ]);
  const [overallLyrics, setOverallLyrics] = useState("");
  const [writingHelp, setWritingHelp] = useState([]);
  const [rehearsalStatus, setRehearsalStatus] = useState("");
  const [songNotes, setSongNotes] = useState("");

  // ── Step 3: Sound & Vision
  const [genre, setGenre] = useState("");
  const [subGenre, setSubGenre] = useState("");
  const [refTracks, setRefTracks] = useState("");
  const [antiRef, setAntiRef] = useState("");
  const [instruments, setInstruments] = useState([]);
  const [performersReady, setPerformersReady] = useState("");
  const [vocalSetup, setVocalSetup] = useState("");
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState("");

  // ── Step 4: Your Demo
  const [demoLink, setDemoLink] = useState("");
  const [demoNotes, setDemoNotes] = useState("");
  const [studioExp, setStudioExp] = useState("");

  // ── Step 5: Legal & Admin
  const [apraStatus, setApraStatus] = useState("");
  const [ipiNumber, setIpiNumber] = useState("");
  const [labelStatus, setLabelStatus] = useState("");
  const [publishingStatus, setPublishingStatus] = useState("");
  const [hasManager, setHasManager] = useState("");
  const [managerDetails, setManagerDetails] = useState("");
  const [performanceDeal, setPerformanceDeal] = useState("");
  const [writingDeal, setWritingDeal] = useState("");
  const [otherNotes, setOtherNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const TOTAL_STEPS = 6; // 0–4 = form, 5 = review
  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);
  const stepLabels = ["About you", "Your songs", "Sound & vision", "Your demo", "Legal & admin", "Review"];

  const go = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const songSummary = songs
      .filter((s) => s.title)
      .map(
        (s, i) =>
          `Song ${i + 1}: ${s.title} | Lyrics: ${s.lyrics || "not specified"} | Arrangement: ${s.arrangement || "not specified"}`
      )
      .join("\n");

    const payload = {
      _subject: `Pre-production enquiry — ${artistName || "New artist"} (${new Date().toLocaleDateString("en-AU")})`,
      "01 Artist name": artistName,
      "02 Contact name": contactName,
      "03 Email": email,
      "04 Phone": phone,
      "05 Referral source": referral,
      "06 Referred by": referralPerson,
      "07 Project type": projectType,
      "08 Number of songs": numSongs,
      "09 Number of performers": numPerformers,
      "10 Target release": targetRelease,
      "11 Songs breakdown": songSummary,
      "12 Overall lyric status": overallLyrics,
      "13 Writing help needed": writingHelp.join(", "),
      "14 Rehearsal status": rehearsalStatus,
      "15 Song notes": songNotes,
      "16 Genre": genre,
      "17 Sub-genre / style": subGenre,
      "18 Reference tracks": refTracks,
      "19 Anti-references": antiRef,
      "20 Instruments": instruments.join(", "),
      "21 Performers studio ready": performersReady,
      "22 Vocal setup": vocalSetup,
      "23 Services required": services.join(", "),
      "24 Budget range": budget,
      "25 Demo link": demoLink,
      "26 Demo notes": demoNotes,
      "27 Prior studio experience": studioExp,
      "28 APRA status": apraStatus,
      "29 IPI number": ipiNumber,
      "30 Label status": labelStatus,
      "31 Publishing status": publishingStatus,
      "32 Has manager": hasManager,
      "33 Manager details": managerDetails,
      "34 Performance deal preference": performanceDeal,
      "35 Co-writing deal preference": writingDeal,
      "36 Other notes": otherNotes,
    };

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    }
    setSubmitting(false);
  };

  // ── Confirmation screen
  if (submitted) {
    return (
      <>
        <style>{gFonts}</style>
        <div style={S.header}>
          <div style={S.headerInner}>
            <div style={S.studioName}>
              <span style={S.studioAccent}>/</span> {STUDIO_NAME}
            </div>
          </div>
        </div>
        <div style={S.page}>
          <div style={S.confirmScreen}>
            <div style={S.confirmIcon}>✓</div>
            <div style={S.confirmTitle}>Questionnaire received</div>
            <p style={S.confirmSub}>
              Thanks for taking the time to fill this in. We'll review your
              answers and any demos you've shared, and we'll be in touch within
              2 business days to discuss your project and put together a quote.
              <br />
              <br />
              In the meantime, keep writing.
              <br />
              <br />
              <span style={{ color: BRAND.textMuted, fontSize: 13 }}>
                Questions? Email us at{" "}
                <strong style={{ color: BRAND.accent }}>{STUDIO_EMAIL}</strong>
              </span>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{gFonts}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={S.studioName}>
            <span style={S.studioAccent}>/</span> {STUDIO_NAME}
          </div>
          <div style={S.tagline}>{STUDIO_TAGLINE}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={S.progressWrap}>
        <div style={S.progressInner}>
          <div style={S.stepLabels}>
            {stepLabels.map((l, i) => (
              <div key={i} style={S.stepLabel(i === step, i < step)}>
                {l}
              </div>
            ))}
          </div>
          <div style={S.progressTrack}>
            <div style={S.progressFill(progress)} />
          </div>
        </div>
      </div>

      <div style={S.page}>

        {/* ── STEP 0: ABOUT YOU ──────────────────────────────────────────── */}
        {step === 0 && (
          <>
            <div style={S.sectionIntro}>
              <div style={S.sectionTag}>Step 1 of 5</div>
              <div style={S.sectionTitle}>About you</div>
              <p style={S.sectionDesc}>
                Tell us a bit about yourself and what you're working on. This
                helps us understand who you are before we meet.
              </p>
            </div>

            <div style={S.card}>
              <div style={S.row2}>
                <div style={S.field}>
                  <label>Artist or band name <span style={S.required}>*</span></label>
                  <input type="text" placeholder="e.g. Blind Pretty" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
                </div>
                <div style={S.field}>
                  <label>Your name <span style={S.required}>*</span></label>
                  <input type="text" placeholder="First and last name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
              </div>
              <div style={S.row2}>
                <div style={S.field}>
                  <label>Email address <span style={S.required}>*</span></label>
                  <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div style={S.field}>
                  <label>Phone number</label>
                  <input type="tel" placeholder="+61 400 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div style={S.row2}>
                <div style={S.fieldLast}>
                  <label>How did you hear about us?</label>
                  <select value={referral} onChange={(e) => setReferral(e.target.value)}>
                    <option value="">Select...</option>
                    <option>Referral from another artist</option>
                    <option>Instagram / social media</option>
                    <option>Google search</option>
                    <option>Word of mouth</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={S.fieldLast}>
                  <label>Who referred you? (if applicable)</label>
                  <input type="text" placeholder="Name of person" value={referralPerson} onChange={(e) => setReferralPerson(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>What type of project are you working on? <span style={S.required}>*</span></label>
                <RadioGroup
                  name="projType"
                  value={projectType}
                  onChange={setProjectType}
                  options={[
                    { value: "Single", label: "Single — 1 song" },
                    { value: "EP", label: "EP — 2 to 6 songs" },
                    { value: "LP / Album", label: "LP / Album — 7 or more songs" },
                    { value: "Not sure", label: "Not sure yet — let's talk it through" },
                  ]}
                />
              </div>
              <div style={S.row3}>
                <div style={S.field}>
                  <label>Number of songs <span style={S.required}>*</span></label>
                  <input type="number" min="1" max="30" placeholder="e.g. 4" value={numSongs} onChange={(e) => setNumSongs(e.target.value)} />
                </div>
                <div style={S.field}>
                  <label>Number of performers</label>
                  <input type="number" min="1" max="20" placeholder="e.g. 4" value={numPerformers} onChange={(e) => setNumPerformers(e.target.value)} />
                </div>
                <div style={S.fieldLast}>
                  <label>Target release timeframe</label>
                  <select value={targetRelease} onChange={(e) => setTargetRelease(e.target.value)}>
                    <option value="">Select...</option>
                    <option>Flexible — no deadline</option>
                    <option>Within 3 months</option>
                    <option>3 to 6 months</option>
                    <option>6 to 12 months</option>
                    <option>Date already locked in</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={S.navButtons}>
              <div />
              <button style={S.btnPrimary} onClick={() => go(1)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 1: YOUR SONGS ──────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <div style={S.sectionIntro}>
              <div style={S.sectionTag}>Step 2 of 5</div>
              <div style={S.sectionTitle}>Your songs</div>
              <p style={S.sectionDesc}>
                Help us understand where your songs are at. Be honest — there
                are no wrong answers, and it helps us plan the sessions
                properly.
              </p>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>Song titles</label>
                <p style={S.hint}>Add one row per song. Working titles or descriptions are fine if you don't have final names yet.</p>
                <SongRows songs={songs} onChange={setSongs} />
              </div>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>Overall lyric status across all songs</label>
                <RadioGroup
                  name="overallLyrics"
                  value={overallLyrics}
                  onChange={setOverallLyrics}
                  options={[
                    { value: "All lyrics complete", label: "All lyrics are complete and finalised" },
                    { value: "Mostly written", label: "Most lyrics written — some lines to polish" },
                    { value: "Partial — significant gaps", label: "Partial — I have the main ideas but significant gaps remain" },
                    { value: "Need co-writing support", label: "I need help writing the lyrics — co-writing support needed" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>Do you need help with any of the following?</label>
                <CheckboxGroup
                  value={writingHelp}
                  onChange={setWritingHelp}
                  options={[
                    { value: "Finishing or polishing lyrics", label: "Finishing or polishing lyrics" },
                    { value: "Melody and vocal phrasing", label: "Melody and vocal phrasing" },
                    { value: "Song structure", label: "Song structure (verse, chorus, bridge)" },
                    { value: "Arrangement", label: "Arrangement — how all the parts fit together" },
                    { value: "Finding the right sound", label: "Finding the right sound or genre direction" },
                    { value: "Not sure yet", label: "Not sure yet — happy to discuss in a pre-production session" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>Have all performers rehearsed the songs?</label>
                <select value={rehearsalStatus} onChange={(e) => setRehearsalStatus(e.target.value)}>
                  <option value="">Select...</option>
                  <option>Yes — we're well rehearsed and studio ready</option>
                  <option>Mostly — a couple more rehearsals needed</option>
                  <option>Not really — we'll need pre-production sessions before tracking</option>
                  <option>Solo project — just me</option>
                </select>
              </div>
              <div style={S.fieldLast}>
                <label>Any other notes about your songs?</label>
                <p style={S.hint}>e.g. one song is mostly done, another is just an idea, specific challenges you're aware of.</p>
                <VoiceTextarea value={songNotes} onChange={setSongNotes} placeholder="Notes on individual songs, problem areas, anything useful for us to know before we meet..." />
              </div>
            </div>

            <div style={S.navButtons}>
              <button style={S.btnSecondary} onClick={() => go(0)}>← Back</button>
              <button style={S.btnPrimary} onClick={() => go(2)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 2: SOUND & VISION ──────────────────────────────────────── */}
        {step === 2 && (
          <>
            <div style={S.sectionIntro}>
              <div style={S.sectionTag}>Step 3 of 5</div>
              <div style={S.sectionTitle}>Sound &amp; vision</div>
              <p style={S.sectionDesc}>
                Help us understand the sound you're going for and what you need
                from the studio.
              </p>
            </div>

            <div style={S.card}>
              <div style={S.row2}>
                <div style={S.field}>
                  <label>Genre <span style={S.required}>*</span></label>
                  <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="">Select...</option>
                    <option>Pop</option>
                    <option>Rock</option>
                    <option>Indie / alternative</option>
                    <option>Hip-hop / R&B</option>
                    <option>Folk / acoustic</option>
                    <option>Electronic / synth</option>
                    <option>Country</option>
                    <option>Jazz</option>
                    <option>Soul / funk</option>
                    <option>Metal / hardcore</option>
                    <option>Classical</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={S.field}>
                  <label>Sub-genre or style</label>
                  <input type="text" placeholder="e.g. dream pop, lo-fi, indie folk" value={subGenre} onChange={(e) => setSubGenre(e.target.value)} />
                </div>
              </div>
              <div style={S.field}>
                <label>Reference tracks</label>
                <p style={S.hint}>List up to 5 songs that capture the sound you're going for. Artist — Song Title format.</p>
                <VoiceTextarea
                  value={refTracks}
                  onChange={setRefTracks}
                  placeholder={"e.g.\nFleetwood Mac — The Chain\nPhoebe Bridgers — Motion Sickness\nboygenius — Not Strong Enough"}
                  rows={4}
                />
              </div>
              <div style={S.fieldLast}>
                <label>Is there anything you specifically do NOT want your music to sound like?</label>
                <VoiceTextarea value={antiRef} onChange={setAntiRef} placeholder="e.g. overly produced, too much reverb, certain sonic references to avoid..." rows={3} />
              </div>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>Instruments to be recorded</label>
                <p style={S.hint}>Check all that will feature in the final recording.</p>
                <CheckboxGroup
                  value={instruments}
                  onChange={setInstruments}
                  options={[
                    { value: "Acoustic guitar", label: "Acoustic guitar" },
                    { value: "Electric guitar", label: "Electric guitar" },
                    { value: "Bass guitar", label: "Bass guitar" },
                    { value: "Drums and percussion", label: "Drums and percussion" },
                    { value: "Keys or piano", label: "Keys or piano" },
                    { value: "Strings (violin, cello etc.)", label: "Strings (violin, cello etc.)" },
                    { value: "Brass or horns", label: "Brass or horns" },
                    { value: "Programmed beats or electronic elements", label: "Programmed beats or electronic elements" },
                    { value: "Other", label: "Other — please describe in notes below" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>Can all performers play their parts to a studio standard?</label>
                <RadioGroup
                  name="performersReady"
                  value={performersReady}
                  onChange={setPerformersReady}
                  options={[
                    { value: "Yes — all studio ready", label: "Yes — everyone is confident and studio ready" },
                    { value: "Mostly — one or two parts need support", label: "Mostly — one or two parts may need support" },
                    { value: "Some can — need session musicians for some parts", label: "Some can — we'll need session musician support for some parts" },
                    { value: "Solo project — need session musicians for most parts", label: "Solo project — I need session musicians for most parts" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>Vocal setup</label>
                <select value={vocalSetup} onChange={(e) => setVocalSetup(e.target.value)}>
                  <option value="">Select...</option>
                  <option>Lead vocals only</option>
                  <option>Lead vocals + minimal backing (chorus stacks)</option>
                  <option>Lead vocals + full backing harmonies</option>
                  <option>Multiple lead vocalists</option>
                  <option>No live vocals — programmed or sampled</option>
                </select>
              </div>
              <div style={S.field}>
                <label>Which services are you looking for?</label>
                <p style={S.hint}>Check everything you need — we'll build a quote based on your selections.</p>
                <CheckboxGroup
                  value={services}
                  onChange={setServices}
                  options={[
                    { value: "Recording & engineering", label: "Recording & engineering", sub: "Tracking your performances in the studio" },
                    { value: "Mixing", label: "Mixing", sub: "Balancing and processing the recorded tracks" },
                    { value: "Mastering", label: "Mastering", sub: "Final polish and preparation for release" },
                    { value: "Production", label: "Production", sub: "Creative direction, arrangement, pre-production sessions" },
                    { value: "Session performance", label: "Session performance", sub: "Jesse plays instruments on your recording" },
                    { value: "Co-writing or lyric assistance", label: "Co-writing or lyric assistance", sub: "Collaborative songwriting support" },
                    { value: "Not sure yet", label: "Not sure yet — let's discuss" },
                  ]}
                />
              </div>
              <div style={S.fieldLast}>
                <label>Approximate budget for this project</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="">Select...</option>
                  <option>Under $1,000</option>
                  <option>$1,000 – $3,000</option>
                  <option>$3,000 – $6,000</option>
                  <option>$6,000 – $15,000</option>
                  <option>$15,000+</option>
                  <option>I'd prefer a quote before committing to a budget</option>
                </select>
              </div>
            </div>

            <div style={S.navButtons}>
              <button style={S.btnSecondary} onClick={() => go(1)}>← Back</button>
              <button style={S.btnPrimary} onClick={() => go(3)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 3: YOUR DEMO ───────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <div style={S.sectionIntro}>
              <div style={S.sectionTag}>Step 4 of 5</div>
              <div style={S.sectionTitle}>Your demo</div>
              <p style={S.sectionDesc}>
                A rough recording goes a long way — even a voice memo on your
                phone is incredibly helpful. It lets us hear your songs before
                we meet and means we can hit the ground running.
              </p>
            </div>

            <div style={S.infoBanner}>
              Share a link to your demos using Google Drive, Dropbox,
              WeTransfer, SoundCloud, or any file-sharing service. The rougher
              the better — we just want to hear the ideas. If you only have
              demos for some songs, that's completely fine.
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>Demo link</label>
                <p style={S.hint}>
                  Paste a shareable link to your demos. Make sure sharing is
                  set to "anyone with the link can view." You can share the
                  link after submitting if you don't have it handy right now.
                </p>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... or https://we.tl/... or similar"
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                />
              </div>
              <div style={S.field}>
                <label>Notes on your demos</label>
                <p style={S.hint}>
                  Tell us anything useful — which files match which songs,
                  what's a placeholder vs. a final idea, recording conditions.
                </p>
                <VoiceTextarea
                  value={demoNotes}
                  onChange={setDemoNotes}
                  placeholder="e.g. Track 1 is a phone recording of Song A — the chorus melody is a placeholder. Track 2 is a GarageBand demo of Song B, the arrangement is mostly final..."
                  rows={4}
                />
              </div>
              <div style={S.fieldLast}>
                <label>Have you recorded in a professional studio before?</label>
                <RadioGroup
                  name="studioExp"
                  value={studioExp}
                  onChange={setStudioExp}
                  options={[
                    { value: "Yes — comfortable in a studio", label: "Yes — I'm comfortable in a studio environment" },
                    { value: "A little — one or two sessions", label: "A little — I've done one or two sessions before" },
                    { value: "No — first time", label: "No — this will be my first time in a professional studio" },
                  ]}
                />
              </div>
            </div>

            <div style={S.navButtons}>
              <button style={S.btnSecondary} onClick={() => go(2)}>← Back</button>
              <button style={S.btnPrimary} onClick={() => go(4)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 4: LEGAL & ADMIN ───────────────────────────────────────── */}
        {step === 4 && (
          <>
            <div style={S.sectionIntro}>
              <div style={S.sectionTag}>Step 5 of 5</div>
              <div style={S.sectionTitle}>Legal &amp; admin</div>
              <p style={S.sectionDesc}>
                A few quick questions that help us set things up correctly from
                a publishing and credit perspective.
              </p>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>Are you registered with APRA AMCOS?</label>
                <RadioGroup
                  name="apraStatus"
                  value={apraStatus}
                  onChange={setApraStatus}
                  options={[
                    { value: "Yes — registered APRA member", label: "Yes — I am a registered APRA member", sub: "Please provide your IPI number in the field below if you have it" },
                    { value: "No — not yet registered", label: "No — I haven't registered yet", sub: "We can help point you in the right direction" },
                    { value: "Not sure", label: "Not sure" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>APRA IPI number (if known)</label>
                <input type="text" placeholder="e.g. 00123456789" value={ipiNumber} onChange={(e) => setIpiNumber(e.target.value)} />
              </div>
              <div style={S.row2}>
                <div style={S.field}>
                  <label>Are you signed to a record label?</label>
                  <select value={labelStatus} onChange={(e) => setLabelStatus(e.target.value)}>
                    <option value="">Select...</option>
                    <option>No — fully independent</option>
                    <option>Yes — major label</option>
                    <option>Yes — independent label</option>
                    <option>Distribution deal only (DistroKid, TuneCore etc.)</option>
                    <option>In negotiations</option>
                  </select>
                </div>
                <div style={S.field}>
                  <label>Do you have a publishing deal?</label>
                  <select value={publishingStatus} onChange={(e) => setPublishingStatus(e.target.value)}>
                    <option value="">Select...</option>
                    <option>No — I own my own publishing</option>
                    <option>Yes — full publishing deal</option>
                    <option>Yes — co-publishing arrangement</option>
                    <option>Not sure</option>
                  </select>
                </div>
              </div>
              <div style={S.row2}>
                <div style={S.field}>
                  <label>Do you have a manager?</label>
                  <select value={hasManager} onChange={(e) => setHasManager(e.target.value)}>
                    <option value="">Select...</option>
                    <option>No</option>
                    <option>Yes — see details below</option>
                    <option>Looking for management</option>
                  </select>
                </div>
                <div style={S.fieldLast}>
                  <label>Manager contact details</label>
                  <input type="text" placeholder="Name, email and phone" value={managerDetails} onChange={(e) => setManagerDetails(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.field}>
                <label>If Jesse performs on your recording, how would you like to handle that?</label>
                <p style={S.hint}>This helps us prepare the right agreement before sessions begin.</p>
                <RadioGroup
                  name="performanceDeal"
                  value={performanceDeal}
                  onChange={setPerformanceDeal}
                  options={[
                    { value: "Session fee only", label: "Session fee only — Jesse plays for a flat fee, no ongoing royalties" },
                    { value: "Open to fee + points", label: "I'm open to discussing a combination of session fee and producer points" },
                    { value: "Not sure — happy to be guided", label: "Not sure — happy to be guided on what's standard" },
                    { value: "Jesse won't be performing", label: "Jesse won't be performing on this project" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>If Jesse contributes to co-writing or lyrics, how would you like to handle publishing?</label>
                <RadioGroup
                  name="writingDeal"
                  value={writingDeal}
                  onChange={setWritingDeal}
                  options={[
                    { value: "Open to co-writer credit and publishing split", label: "Open to a co-writer credit and publishing split reflecting the contribution" },
                    { value: "Prefer to pay a session fee instead", label: "I'd prefer to pay a session fee for any writing assistance instead" },
                    { value: "Don't anticipate needing co-writing help", label: "I don't anticipate needing co-writing help" },
                    { value: "Not sure — let's discuss", label: "Not sure — let's discuss when we meet" },
                  ]}
                />
              </div>
              <div style={S.field}>
                <label>Anything else we should know before your first session?</label>
                <VoiceTextarea
                  value={otherNotes}
                  onChange={setOtherNotes}
                  placeholder="e.g. specific gear requests, accessibility requirements, scheduling constraints, previous recordings you want to build on..."
                  rows={3}
                />
              </div>
              <div style={S.fieldLast}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    style={{ marginTop: 2, flexShrink: 0, accentColor: BRAND.accent }}
                  />
                  <span style={{ fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.5 }}>
                    I confirm that all information provided is accurate to the best of my knowledge. I understand this questionnaire will be used to plan sessions and prepare a quote.
                  </span>
                </label>
              </div>
            </div>

            <div style={S.navButtons}>
              <button style={S.btnSecondary} onClick={() => go(3)}>← Back</button>
              <button style={S.btnPrimary} onClick={() => go(5)}>Review & submit →</button>
            </div>
          </>
        )}

        {/* ── STEP 5: REVIEW ──────────────────────────────────────────────── */}
        {step === 5 && (
          <>
            <div style={S.sectionIntro}>
              <div style={S.sectionTag}>Review</div>
              <div style={S.sectionTitle}>Review your submission</div>
              <p style={S.sectionDesc}>
                Check everything looks right before you send it through. Go
                back to any section to make changes.
              </p>
            </div>

            <div style={S.card}>
              <div style={S.summarySection}>
                <div style={S.summaryHeading}>Artist &amp; contact</div>
                {[
                  ["Artist name", artistName],
                  ["Contact name", contactName],
                  ["Email", email],
                  ["Phone", phone],
                  ["How they heard", referral],
                ].filter(r => r[1]).map(([k, v]) => (
                  <div style={S.summaryRow} key={k}>
                    <span style={S.summaryKey}>{k}</span>
                    <span style={S.summaryVal}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={S.summarySection}>
                <div style={S.summaryHeading}>Project</div>
                {[
                  ["Type", projectType],
                  ["Songs", numSongs],
                  ["Performers", numPerformers],
                  ["Target release", targetRelease],
                ].filter(r => r[1]).map(([k, v]) => (
                  <div style={S.summaryRow} key={k}>
                    <span style={S.summaryKey}>{k}</span>
                    <span style={S.summaryVal}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={S.summarySection}>
                <div style={S.summaryHeading}>Songs</div>
                {songs.filter(s => s.title).map((s, i) => (
                  <div style={S.summaryRow} key={i}>
                    <span style={S.summaryKey}>Song {i + 1}</span>
                    <span style={S.summaryVal}>{s.title}{s.lyrics ? ` — ${s.lyrics}` : ""}</span>
                  </div>
                ))}
                {overallLyrics && (
                  <div style={S.summaryRow}>
                    <span style={S.summaryKey}>Lyric status</span>
                    <span style={S.summaryVal}>{overallLyrics}</span>
                  </div>
                )}
              </div>

              <div style={S.summarySection}>
                <div style={S.summaryHeading}>Sound &amp; services</div>
                {[
                  ["Genre", genre + (subGenre ? ` / ${subGenre}` : "")],
                  ["Services", services.join(", ")],
                  ["Instruments", instruments.join(", ")],
                  ["Budget", budget],
                ].filter(r => r[1]).map(([k, v]) => (
                  <div style={S.summaryRow} key={k}>
                    <span style={S.summaryKey}>{k}</span>
                    <span style={S.summaryVal}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={S.summarySection}>
                <div style={S.summaryHeading}>Demo &amp; legal</div>
                {[
                  ["Demo link", demoLink],
                  ["Studio experience", studioExp],
                  ["APRA status", apraStatus],
                  ["Label status", labelStatus],
                  ["Performance deal", performanceDeal],
                  ["Publishing / co-write", writingDeal],
                ].filter(r => r[1]).map(([k, v]) => (
                  <div style={S.summaryRow} key={k}>
                    <span style={S.summaryKey}>{k}</span>
                    <span style={S.summaryVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <p style={{ fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.7 }}>
                By submitting this questionnaire you agree that the information
                provided will be used by {STUDIO_NAME} to plan your sessions
                and prepare a quote. A member of the team will be in touch
                within 2 business days.
              </p>
            </div>

            {error && <div style={S.errorMsg}>{error}</div>}

            <div style={S.navButtons}>
              <button style={S.btnSecondary} onClick={() => go(4)}>← Back</button>
              <button
                style={{ ...S.btnPrimary, opacity: submitting ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit questionnaire →"}
              </button>
            </div>
          </>
        )}

      </div>
    </>
  );
}
