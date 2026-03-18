import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Moon, Flag, ShieldCheck, AlertTriangle, Stethoscope, RotateCcw,
  ChevronRight, Share2, Check, Award, BookOpen, Phone, Mail, MapPin,
  Heart, Wind, Activity, GraduationCap, Briefcase, ChevronDown,
  Menu, X, Clock, Users, Star, ExternalLink
} from 'lucide-react';

/* ─── STOP-BANG Questions ─── */
const questions = [
  { id: 'S', clueEn: "Clue #1: The Nightly Rumble", clueTa: "தடயம் #1: இரவு சத்தம்", textEn: "Snoring: Do you snore loudly?", textTa: "நீங்கள் சத்தமாக குறட்டை விடுவீர்களா?" },
  { id: 'T', clueEn: "Clue #2: The Daylight Drain", clueTa: "தடயம் #2: பகல் சோர்வு", textEn: "Tired: Do you often feel tired, fatigued, or sleepy during the daytime?", textTa: "பகலில் அடிக்கடி சோர்வாகவோ அல்லது தூக்கமாகவோ உணர்கிறீர்களா?" },
  { id: 'O', clueEn: "Clue #3: The Silent Pause", clueTa: "தடயம் #3: அமைதியான இடைவெளி", textEn: "Observed: Has anyone observed you stop breathing during your sleep?", textTa: "நீங்கள் தூங்கும்போது மூச்சு விடுவதை நிறுத்துவதை யாராவது கவனித்திருக்கிறார்களா?" },
  { id: 'P', clueEn: "Clue #4: The Pressure Point", clueTa: "தடயம் #4: அழுத்தப் புள்ளி", textEn: "Blood Pressure: Do you have or are you being treated for high blood pressure?", textTa: "உங்களுக்கு உயர் இரத்த அழுத்தம் உள்ளதா அல்லது அதற்காக சிகிச்சை பெறுகிறீர்களா?" },
  { id: 'B', clueEn: "Clue #5: The Body Metric", clueTa: "தடயம் #5: உடல் அளவீடு", textEn: "BMI: Is your BMI over 35 kg/m²?", textTa: "உங்கள் பிஎம்ஐ 35-க்கு மேல் உள்ளதா?" },
  { id: 'A', clueEn: "Clue #6: The Milestone", clueTa: "தடயம் #6: மைல்கல்", textEn: "Age: Are you older than 50?", textTa: "உங்கள் வயது 50-க்கு மேல் உள்ளதா?" },
  { id: 'N', clueEn: "Clue #7: The Collar Measure", clueTa: "தடயம் #7: கழுத்து அளவீடு", textEn: "Neck Circumference: Is your neck circumference greater than 40 cm or 16 inches?", textTa: "உங்கள் கழுத்தின் சுற்றளவு 40 செ.மீ அல்லது 16 அங்குலத்திற்கு மேல் உள்ளதா?" },
  { id: 'G', clueEn: "Clue #8: The Demographic", clueTa: "தடயம் #8: பாலினம்", textEn: "Gender: Are you male?", textTa: "நீங்கள் ஆணா?" }
];

/* ─── Navigation Links ─── */
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Sleep Detective', href: '#sleep-detective' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

/* ─── Services Data ─── */
const services = [
  { icon: Wind, title: 'Pulmonology', desc: 'Expert diagnosis and management of respiratory diseases including asthma, COPD, ILD, and pneumonia.' },
  { icon: Moon, title: 'Sleep Medicine', desc: 'Comprehensive sleep disorder evaluation — from OSA screening to polysomnography and CPAP management.' },
  { icon: Activity, title: 'Critical Care', desc: 'ICU management of respiratory failure, ventilator support, and acute pulmonary emergencies.' },
  { icon: Stethoscope, title: 'Interventional Pulmonology', desc: 'Bronchoscopy, thoracentesis, pleural biopsy, and other advanced diagnostic & therapeutic procedures.' },
  { icon: Heart, title: 'Allergy & Immunology', desc: 'Assessment and treatment of allergic respiratory conditions, including allergic rhinitis and occupational lung disease.' },
  { icon: Briefcase, title: 'TB & Infectious Disease', desc: 'Tuberculosis management, drug-resistant TB treatment, and pulmonary infectious disease care.' },
];

/* ─── Achievements/Stats ─── */
const stats = [
  { icon: Users, value: '10,000+', label: 'Patients Treated' },
  { icon: Clock, value: '15+', label: 'Years Experience' },
  { icon: Award, value: '20+', label: 'Publications' },
  { icon: Star, value: '4.9', label: 'Patient Rating' },
];

/* ─── Section Wrapper ─── */
function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function SectionHeading({ subtitle, title }) {
  return (
    <div className="text-center mb-16">
      <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-2">{subtitle}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SLEEP DETECTIVE COMPONENT (Self-contained)
   ════════════════════════════════════════════════════════ */
function SleepDetective() {
  const [language, setLanguage] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [redFlags, setRedFlags] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const startGame = (lang) => { setLanguage(lang); setCurrentStep(0); setRedFlags(0); };

  const handleAnswer = (isYes) => {
    if (isTransitioning) return;
    if (isYes) setRedFlags(prev => prev + 1);
    setIsTransitioning(true);
    setTimeout(() => { setCurrentStep(prev => prev + 1); setIsTransitioning(false); }, 400);
  };

  const resetGame = () => { setLanguage(null); setCurrentStep(-1); setRedFlags(0); };

  const handleShare = async () => {
    const isEn = language === 'en';
    const prob = Math.round((redFlags / 8) * 100);
    const txt = isEn
      ? `I completed "The Case of the Stolen Sleep" with Dr. Arularasu! ${redFlags}/8 Red Flags (OSA Probability: ${prob}%). Take the quest!`
      : `டாக்டர் அருளரசு "தூக்கத் திருடன்" விசாரணை முடிந்தது! ${redFlags}/8 அபாயக் கொடிகள் (OSA: ${prob}%).`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: isEn ? 'The Case of the Stolen Sleep' : 'தூக்கத் திருடன் வழக்கு', text: txt, url }); }
      catch (err) { if (err.name !== 'AbortError') fallbackCopy(`${txt}\n\n${url}`); }
    } else { fallbackCopy(`${txt}\n\n${url}`); }
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "top:0;left:0;position:fixed";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); setShowToast(true); setTimeout(() => setShowToast(false), 3000); } catch {}
    document.body.removeChild(ta);
  };

  /* Language Selection */
  if (currentStep === -1) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="bg-slate-800/80 backdrop-blur p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-cyan-400" />
          <Moon className="w-16 h-16 mx-auto text-indigo-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Welcome, Detective.</h3>
          <p className="text-slate-400 mb-8">Choose your language to begin the investigation into the stolen sleep.</p>
          <div className="space-y-4">
            <button onClick={() => startGame('en')} className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-between group">
              <span>English</span><ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => startGame('ta')} className="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-between group">
              <span className="text-lg font-tamil">தமிழ் (Tamil)</span><ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Questions */
  if (currentStep >= 0 && currentStep < 8) {
    const q = questions[currentStep];
    const isEn = language === 'en';
    return (
      <div className={`flex flex-col items-center w-full max-w-lg transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${isEn ? '' : 'font-tamil'}`}>
        <div className="w-full mb-6 flex justify-between items-center px-4">
          <span className="text-indigo-400 font-mono text-sm tracking-wider">{isEn ? `CLUE ${currentStep + 1}/8` : `தடயம் ${currentStep + 1}/8`}</span>
          <div className="flex space-x-1">{[...Array(8)].map((_, i) => <div key={i} className={`h-2 w-8 rounded-full ${i <= currentStep ? 'bg-indigo-500' : 'bg-slate-700'}`} />)}</div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur p-8 rounded-2xl shadow-2xl border border-slate-700 w-full relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-indigo-500 rounded-full p-3 shadow-lg"><Search className="w-6 h-6 text-indigo-400" /></div>
          <div className="mt-6 text-center">
            <h4 className="text-indigo-300 font-bold mb-4 uppercase tracking-widest text-sm">{isEn ? q.clueEn : q.clueTa}</h4>
            <p className={`text-2xl font-medium text-white mb-8 ${isEn ? 'leading-relaxed' : 'leading-[1.7]'}`}>{isEn ? q.textEn : q.textTa}</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAnswer(true)} className="py-4 bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 text-red-200 rounded-xl font-bold transition-all transform hover:-translate-y-1">{isEn ? "YES" : "ஆம்"}</button>
              <button onClick={() => handleAnswer(false)} className="py-4 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 rounded-xl font-bold transition-all transform hover:-translate-y-1">{isEn ? "NO" : "இல்லை"}</button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full"><Flag className="w-4 h-4 text-red-500" /><span className="text-sm font-mono text-slate-300">Flags: {redFlags}</span></div>
      </div>
    );
  }

  /* Results */
  const isEn = language === 'en';
  const prob = Math.round((redFlags / 8) * 100);
  let verdictTitle, verdictText, VerdictIcon, iconColor;
  if (redFlags <= 2) { verdictTitle = isEn ? "Low Probability" : "குறைந்த சாத்தியக்கூறு"; verdictText = isEn ? "Low probability of moderate-to-severe OSA. Your sleep seems relatively secure!" : "மிதமான முதல் தீவிரமான OSA-க்கான சாத்தியக்கூறு குறைவு."; VerdictIcon = ShieldCheck; iconColor = "text-emerald-400"; }
  else if (redFlags <= 4) { verdictTitle = isEn ? "Intermediate Probability" : "நடுத்தர சாத்தியக்கூறு"; verdictText = isEn ? "Intermediate probability of moderate-to-severe OSA. The Sleep Thief might be lurking." : "மிதமான முதல் தீவிரமான OSA-க்கான சாத்தியக்கூறு நடுத்தரமானது."; VerdictIcon = AlertTriangle; iconColor = "text-amber-400"; }
  else { verdictTitle = isEn ? "High Probability" : "அதிக சாத்தியக்கூறு"; verdictText = isEn ? "High probability of moderate-to-severe OSA. We have found the culprit!" : "மிதமான முதல் தீவிரமான OSA-க்கான அதிக சாத்தியக்கூறு."; VerdictIcon = AlertTriangle; iconColor = "text-red-500"; }

  return (
    <div className={`w-full max-w-2xl space-y-6 pb-8 ${isEn ? '' : 'font-tamil'}`}>
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-900/80 p-6 flex flex-col items-center border-b border-slate-700">
          <VerdictIcon className={`w-16 h-16 ${iconColor} mb-4`} />
          <h3 className="text-3xl font-bold text-white mb-2">{isEn ? "The Verdict" : "தீர்ப்பு"}</h3>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700"><Flag className="w-5 h-5 text-red-500" /><span className="text-slate-300 font-mono text-sm">{isEn ? "Red Flags:" : "அபாயக் கொடிகள்:"} <strong className="text-white text-lg">{redFlags}/8</strong></span></div>
            <div className={`flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 ${iconColor}`}><span className="font-mono text-sm">{isEn ? "OSA Probability:" : "OSA:"} <strong className="text-lg">{prob}%</strong></span></div>
          </div>
        </div>
        <div className="p-8 text-center"><p className={`text-2xl font-medium ${iconColor} ${isEn ? '' : 'leading-[1.7]'}`}>{verdictText}</p></div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-slate-700">
        <h4 className="flex items-center text-xl font-bold text-indigo-400 mb-4 border-b border-slate-700 pb-2"><Stethoscope className="w-6 h-6 mr-2" />{isEn ? "Clinical Fact Check" : "மருத்துவ உண்மை சரிபார்ப்பு"}</h4>
        <ul className={`space-y-4 text-slate-300 ${isEn ? '' : 'leading-[1.8]'}`}>
          <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span><span><strong>{isEn ? "Sensitivity:" : "உணர்திறன்:"}</strong> {isEn ? "A STOP-BANG score of >= 3 has ~93% sensitivity for detecting moderate-to-severe OSA." : "STOP-BANG மதிப்பெண் >= 3 சுமார் 93% உணர்திறனை கொண்டுள்ளது."}</span></li>
          <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span><span><strong>{isEn ? "Guidelines:" : "வழிகாட்டுதல்கள்:"}</strong> {isEn ? "Current guidelines recommend pairing screening tools with objective testing." : "ஸ்கிரீனிங் கருவிகளுடன் புறநிலை சோதனைகளை இணைக்க பரிந்துரைக்கப்படுகிறது."}</span></li>
          <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span><span><strong>{isEn ? "Gold Standard:" : "தங்க தரநிலை:"}</strong> {isEn ? "Polysomnography (in-lab sleep study) or Home Sleep Apnea Test (HSAT)." : "பாலிசோம்னோகிராபி அல்லது வீட்டு தூக்க மூச்சுத்திணறல் சோதனை (HSAT)."}</span></li>
        </ul>
      </div>

      {redFlags >= 3 && (
        <div className="bg-red-900/20 p-6 rounded-xl border border-red-900/50 flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
          <div><h4 className="text-red-400 font-bold text-lg mb-1">{isEn ? "Doctor's Orders" : "மருத்துவரின் அறிவுரைகள்"}</h4><p className="text-red-200">{isEn ? "Since you have a higher probability of OSA, please consult a pulmonologist and plan for a sleep study." : "உங்களுக்கு OSA சாத்தியக்கூறு அதிகம் — நுரையீரல் மருத்துவரை அணுகி தூக்கப் பரிசோதனைக்கு திட்டமிடுங்கள்."}</p></div>
        </div>
      )}

      <p className="text-xs text-slate-500 uppercase tracking-widest text-center">{isEn ? "Disclaimer: This is a screening questionnaire and does not constitute a medical diagnosis." : "பொறுப்புத்துறப்பு: இது ஒரு ஸ்கிரீனிங் கேள்வித்தாள் மட்டுமே."}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={handleShare} className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-lg"><Share2 className="w-5 h-5" /><span className="text-sm uppercase tracking-wider">{isEn ? "Share" : "பகிரவும்"}</span></button>
        <button onClick={resetGame} className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 py-3 px-6 rounded-xl font-semibold transition-all border border-slate-700"><RotateCcw className="w-5 h-5" /><span className="text-sm uppercase tracking-wider">{isEn ? "Restart" : "மீண்டும்"}</span></button>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 z-50"><Check className="w-5 h-5" /><span className="font-medium">{language === 'en' ? "Copied to clipboard!" : "நகலெடுக்கப்பட்டது!"}</span></div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PORTFOLIO APP
   ════════════════════════════════════════════════════════ */
export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        .font-tamil { font-family: 'Noto Sans Tamil', system-ui, sans-serif; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.6)} }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}} />

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg shadow-lg shadow-slate-950/50 border-b border-slate-800/50' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#home" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg"><Wind className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-white text-lg">Dr. Arularasu</span>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</a>)}
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-slate-400 hover:text-white">
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
            {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenu(false)} className="block px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">{l.label}</a>)}
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 pt-24 pb-16">
          {/* Text Side */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-4">Pulmonologist & Sleep Specialist</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Dr. Arularasu<br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">MD Pulmonology</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Dedicated to helping you breathe easier and sleep better. Specializing in respiratory medicine, sleep disorders, critical care, and interventional pulmonology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#sleep-detective" className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-8 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-500/25">
                <Search className="w-5 h-5" /><span>Try Sleep Detective</span>
              </a>
              <a href="#contact" className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-3 px-8 rounded-xl font-semibold transition-all border border-slate-700 hover:-translate-y-1">
                <Phone className="w-5 h-5" /><span>Book Appointment</span>
              </a>
            </div>
          </div>

          {/* Avatar / Visual Side */}
          <div className="flex-shrink-0 relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 p-1 animate-pulse-glow">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Stethoscope className="w-20 h-20 text-indigo-400 mx-auto mb-3 animate-float" />
                  <p className="text-white font-bold text-xl">Dr. Arularasu</p>
                  <p className="text-indigo-300 text-sm">MD Pulmonology</p>
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-2 -right-2 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl animate-float" style={{animationDelay: '1s'}}>
              <Wind className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl animate-float" style={{animationDelay: '2s'}}>
              <Moon className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </div>

        <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-indigo-400 transition-colors animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </a>
      </section>

      {/* ── About Section ── */}
      <Section id="about" className="bg-slate-900/50">
        <SectionHeading subtitle="About" title="Meet Dr. Arularasu" />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Dr. Arularasu is a highly skilled <strong className="text-white">MD Pulmonologist</strong> with extensive experience in respiratory medicine, sleep disorders, and critical care. With a passion for patient-centered care, he combines clinical expertise with innovative tools to improve respiratory health outcomes.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              He is committed to raising awareness about <strong className="text-white">Obstructive Sleep Apnea (OSA)</strong> and other sleep disorders through community education, digital health initiatives, and evidence-based screening tools like the <em>Sleep Detective Quest</em>.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">MD in Pulmonary Medicine</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">Fellowship in Sleep Medicine</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">Published Researcher in Respiratory Sciences</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">Consultant Pulmonologist & Critical Care Specialist</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-colors group">
                <s.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Services Section ── */}
      <Section id="services">
        <SectionHeading subtitle="Expertise" title="Services Offered" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 hover:-translate-y-1 transition-all group">
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3 w-fit mb-4 group-hover:bg-indigo-600/20 transition-colors">
                <s.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Sleep Detective Section ── */}
      <Section id="sleep-detective" className="bg-slate-900/50">
        <SectionHeading subtitle="Interactive Tool" title="The Case of the Stolen Sleep" />
        <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12 -mt-8">
          An interactive STOP-BANG screening questionnaire designed by Dr. Arularasu to help you assess your risk for Obstructive Sleep Apnea (OSA). Available in English and Tamil.
        </p>
        <div className="flex justify-center">
          <SleepDetective />
        </div>
      </Section>

      {/* ── Achievements Section ── */}
      <Section id="achievements">
        <SectionHeading subtitle="Recognition" title="Achievements & Contributions" />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Clinical Research', desc: 'Published research in national and international journals on respiratory diseases, sleep medicine, and critical care outcomes.' },
            { title: 'Community Outreach', desc: 'Conducts regular health camps, awareness programs, and free screening drives for respiratory and sleep disorders in underserved communities.' },
            { title: 'Digital Health Innovation', desc: 'Creator of the "Sleep Detective Quest" — an interactive bilingual OSA screening tool making sleep health accessible to Tamil-speaking populations.' },
            { title: 'Medical Education', desc: 'Active mentor for postgraduate medical students and conducts CME programs and workshops on pulmonology and sleep medicine.' },
          ].map((a, i) => (
            <div key={i} className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-full p-2 mt-1 flex-shrink-0">
                  <Award className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Contact Section ── */}
      <Section id="contact" className="bg-slate-900/50">
        <SectionHeading subtitle="Get in Touch" title="Book an Appointment" />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed">
              If you're experiencing respiratory issues or suspect a sleep disorder, don't wait. Reach out to Dr. Arularasu for a consultation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-lg p-2"><Phone className="w-5 h-5 text-indigo-400" /></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p><p className="text-white font-medium">+91 XXXXX XXXXX</p></div>
              </div>
              <div className="flex items-center space-x-4 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-lg p-2"><Mail className="w-5 h-5 text-indigo-400" /></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">Email</p><p className="text-white font-medium">dr.arularasu@example.com</p></div>
              </div>
              <div className="flex items-center space-x-4 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-lg p-2"><MapPin className="w-5 h-5 text-indigo-400" /></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">Location</p><p className="text-white font-medium">Tamil Nadu, India</p></div>
              </div>
              <div className="flex items-center space-x-4 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-lg p-2"><Clock className="w-5 h-5 text-indigo-400" /></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">Consultation Hours</p><p className="text-white font-medium">Mon - Sat: 9:00 AM - 6:00 PM</p></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Send a Message</h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Full Name</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Email</label>
                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Phone</label>
                <input type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Message</label>
                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Describe your concern..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/25">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg"><Wind className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white">Dr. Arularasu</span>
            <span className="text-slate-500 text-sm">— MD Pulmonology</span>
          </div>
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Dr. Arularasu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
