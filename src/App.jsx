import React, { useState } from 'react';
import { Search, Moon, Flag, ShieldCheck, AlertTriangle, Stethoscope, RotateCcw, ChevronRight, Share2, Check } from 'lucide-react';

const questions = [
  {
    id: 'S',
    clueEn: "Clue #1: The Nightly Rumble",
    clueTa: "தடயம் #1: இரவு சத்தம்",
    textEn: "Snoring: Do you snore loudly?",
    textTa: "நீங்கள் சத்தமாக குறட்டை விடுவீர்களா?",
  },
  {
    id: 'T',
    clueEn: "Clue #2: The Daylight Drain",
    clueTa: "தடயம் #2: பகல் சோர்வு",
    textEn: "Tired: Do you often feel tired, fatigued, or sleepy during the daytime?",
    textTa: "பகலில் அடிக்கடி சோர்வாகவோ அல்லது தூக்கமாகவோ உணர்கிறீர்களா?",
  },
  {
    id: 'O',
    clueEn: "Clue #3: The Silent Pause",
    clueTa: "தடயம் #3: அமைதியான இடைவெளி",
    textEn: "Observed: Has anyone observed you stop breathing during your sleep?",
    textTa: "நீங்கள் தூங்கும்போது மூச்சு விடுவதை நிறுத்துவதை யாராவது கவனித்திருக்கிறார்களா?",
  },
  {
    id: 'P',
    clueEn: "Clue #4: The Pressure Point",
    clueTa: "தடயம் #4: அழுத்தப் புள்ளி",
    textEn: "Blood Pressure: Do you have or are you being treated for high blood pressure?",
    textTa: "உங்களுக்கு உயர் இரத்த அழுத்தம் உள்ளதா அல்லது அதற்காக சிகிச்சை பெறுகிறீர்களா?",
  },
  {
    id: 'B',
    clueEn: "Clue #5: The Body Metric",
    clueTa: "தடயம் #5: உடல் அளவீடு",
    textEn: "BMI: Is your BMI over 35 kg/m²?",
    textTa: "உங்கள் பிஎம்ஐ 35-க்கு மேல் உள்ளதா?",
  },
  {
    id: 'A',
    clueEn: "Clue #6: The Milestone",
    clueTa: "தடயம் #6: மைல்கல்",
    textEn: "Age: Are you older than 50?",
    textTa: "உங்கள் வயது 50-க்கு மேல் உள்ளதா?",
  },
  {
    id: 'N',
    clueEn: "Clue #7: The Collar Measure",
    clueTa: "தடயம் #7: கழுத்து அளவீடு",
    textEn: "Neck Circumference: Is your neck circumference greater than 40 cm or 16 inches?",
    textTa: "உங்கள் கழுத்தின் சுற்றளவு 40 செ.மீ அல்லது 16 அங்குலத்திற்கு மேல் உள்ளதா?",
  },
  {
    id: 'G',
    clueEn: "Clue #8: The Demographic",
    clueTa: "தடயம் #8: பாலினம்",
    textEn: "Gender: Are you male?",
    textTa: "நீங்கள் ஆணா?",
  }
];

export default function App() {
  const [language, setLanguage] = useState(null); // 'en' or 'ta'
  const [currentStep, setCurrentStep] = useState(-1); // -1: Lang Selection, 0-7: Questions, 8: Results
  const [redFlags, setRedFlags] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const startGame = (lang) => {
    setLanguage(lang);
    setCurrentStep(0);
    setRedFlags(0);
  };

  const handleAnswer = (isYes) => {
    if (isTransitioning) return;
    
    if (isYes) {
      setRedFlags(prev => prev + 1);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 400); // Small delay for animation feel
  };

  const resetGame = () => {
    setLanguage(null);
    setCurrentStep(-1);
    setRedFlags(0);
  };

  const handleShare = async () => {
    const isEn = language === 'en';
    const probabilityScore = Math.round((redFlags / 8) * 100);
    
    const shareTextEn = `I just completed "The Case of the Stolen Sleep" with Dr. Arularasu! I found ${redFlags}/8 Red Flags (OSA Probability: ${probabilityScore}%). Take the quest to find your sleep thief!`;
    const shareTextTa = `டாக்டர் அருளரசு அவர்களின் "தூக்கத் திருடன்" விசாரணையை நான் முடித்துவிட்டேன்! நான் ${redFlags}/8 அபாயக் கொடிகளை கண்டுபிடித்தேன் (OSA சாத்தியக்கூறு: ${probabilityScore}%). உங்கள் தூக்கத் திருடனைக் கண்டுபிடிக்க நீங்களும் பரிசோதிக்கவும்!`;
    
    const textToShare = isEn ? shareTextEn : shareTextTa;
    const urlToShare = window.location.href;
    const fullText = `${textToShare}\n\n${urlToShare}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: isEn ? 'The Case of the Stolen Sleep' : 'தூக்கத் திருடன் வழக்கு',
          text: textToShare,
          url: urlToShare,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackCopy(fullText);
        }
      }
    } else {
      fallbackCopy(fullText);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const renderLanguageSelection = () => (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <Moon className="w-16 h-16 mx-auto text-indigo-400 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Welcome, Detective.</h2>
        <p className="text-slate-400 mb-8">Choose your preferred language to begin the investigation into the stolen sleep.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => startGame('en')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-between group"
          >
            <span>English</span>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={() => startGame('ta')}
            className="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-between group font-tamil"
          >
            <span className="text-lg">தமிழ் (Tamil)</span>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestion = () => {
    const question = questions[currentStep];
    const isEn = language === 'en';

    return (
      <div className={`flex flex-col items-center justify-center w-full max-w-lg transition-opacity duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="w-full mb-6 flex justify-between items-center px-4">
          <span className="text-indigo-400 font-mono text-sm tracking-wider">
            {isEn ? `INVESTIGATION: ${currentStep + 1}/8` : `விசாரணை: ${currentStep + 1}/8`}
          </span>
          <div className="flex space-x-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-2 w-8 rounded-full ${i <= currentStep ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-900 border-2 border-indigo-500 rounded-full p-3 shadow-lg">
            <Search className="w-6 h-6 text-indigo-400" />
          </div>
          
          <div className="mt-6 text-center">
            <h3 className="text-indigo-300 font-bold mb-4 uppercase tracking-widest text-sm">
              {isEn ? question.clueEn : question.clueTa}
            </h3>
            <p className={`text-2xl font-medium text-white mb-8 ${isEn ? 'leading-relaxed' : 'leading-[1.7] tracking-wide'}`}>
              {isEn ? question.textEn : question.textTa}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleAnswer(true)}
                className={`py-4 bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 text-red-200 rounded-xl font-bold transition-all transform hover:-translate-y-1 ${isEn ? '' : 'text-lg'}`}
              >
                {isEn ? "YES" : "ஆம்"}
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                className={`py-4 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 rounded-xl font-bold transition-all transform hover:-translate-y-1 ${isEn ? '' : 'text-lg'}`}
              >
                {isEn ? "NO" : "இல்லை"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const isEn = language === 'en';
    let verdictTitle, verdictText, VerdictIcon, iconColor;
    
    // Calculate a rough gamified probability percentage
    const probabilityScore = Math.round((redFlags / 8) * 100);

    if (redFlags <= 2) {
      verdictTitle = isEn ? "Low Probability" : "குறைந்த சாத்தியக்கூறு";
      verdictText = isEn 
        ? "Low probability of moderate-to-severe OSA. Your sleep seems relatively secure!" 
        : "மிதமான முதல் தீவிரமான OSA-க்கான சாத்தியக்கூறு குறைவு. உங்கள் தூக்கம் பாதுகாப்பாக உள்ளது!";
      VerdictIcon = ShieldCheck;
      iconColor = "text-emerald-400";
    } else if (redFlags <= 4) {
      verdictTitle = isEn ? "Intermediate Probability" : "நடுத்தர சாத்தியக்கூறு";
      verdictText = isEn 
        ? "Intermediate probability of moderate-to-severe OSA. The Sleep Thief might be lurking." 
        : "மிதமான முதல் தீவிரமான OSA-க்கான சாத்தியக்கூறு நடுத்தரமானது. தூக்கத் திருடன் பதுங்கியிருக்கலாம்.";
      VerdictIcon = AlertTriangle;
      iconColor = "text-amber-400";
    } else {
      verdictTitle = isEn ? "High Probability" : "அதிக சாத்தியக்கூறு";
      verdictText = isEn 
        ? "High probability of moderate-to-severe OSA. We have found the culprit!" 
        : "மிதமான முதல் தீவிரமான OSA-க்கான அதிக சாத்தியக்கூறு. குற்றவாளியை நாங்கள் கண்டுபிடித்துவிட்டோம்!";
      VerdictIcon = AlertTriangle;
      iconColor = "text-red-500";
    }

    return (
      <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-700 fade-in space-y-6 pb-12">
        {/* The Verdict Section */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-900 p-6 flex flex-col items-center border-b border-slate-700">
            <VerdictIcon className={`w-16 h-16 ${iconColor} mb-4`} />
            <h2 className="text-3xl font-bold text-white mb-2">
              {isEn ? "The Verdict" : "தீர்ப்பு"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                <Flag className="w-5 h-5 text-red-500" />
                <span className="text-slate-300 font-mono text-sm sm:text-base">
                  {isEn ? "Red Flags:" : "அபாயக் கொடிகள்:"} <strong className="text-white text-lg">{redFlags}/8</strong>
                </span>
              </div>
              <div className={`flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 ${iconColor}`}>
                <span className="font-mono text-sm sm:text-base">
                  {isEn ? "OSA Probability:" : "OSA சாத்தியக்கூறு:"} <strong className="text-lg">{probabilityScore}%</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-slate-800/50">
            <p className={`text-2xl font-medium ${iconColor} ${isEn ? '' : 'leading-[1.7]'}`}>
              {verdictText}
            </p>
          </div>
        </div>

        {/* Clinical Fact Check Section */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
          <h3 className="flex items-center text-xl font-bold text-indigo-400 mb-4 border-b border-slate-700 pb-2">
            <Stethoscope className="w-6 h-6 mr-2" />
            {isEn ? "Clinical Fact Check (The Science)" : "மருத்துவ உண்மை சரிபார்ப்பு (அறிவியல்)"}
          </h3>
          <ul className={`space-y-4 text-slate-300 ${isEn ? '' : 'leading-[1.8]'}`}>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>
                <strong>{isEn ? "Sensitivity:" : "உணர்திறன்:"}</strong> {isEn 
                  ? "Collecting 3 or more Red Flags (a STOP-BANG score of ≥ 3) has a high sensitivity (around 93%) for detecting moderate-to-severe OSA." 
                  : "3 அல்லது அதற்கு மேற்பட்ட அபாயக் கொடிகளை சேகரிப்பது (STOP-BANG மதிப்பெண் ≥ 3) மிதமான முதல் தீவிரமான OSA-ஐக் கண்டறிவதில் அதிக உணர்திறனை (சுமார் 93%) கொண்டுள்ளது."}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>
                <strong>{isEn ? "Recent Guidelines:" : "சமீபத்திய வழிகாட்டுதல்கள்:"}</strong> {isEn 
                  ? "Current clinical guidelines recommend pairing clinical screening tools with objective testing for confirmation."
                  : "தற்போதைய மருத்துவ வழிகாட்டுதல்கள், ஸ்கிரீனிங் கருவிகளுடன் புறநிலை சோதனைகளை (objective testing) இணைத்து உறுதிப்படுத்த பரிந்துரைக்கின்றன."}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>
                <strong>{isEn ? "Diagnostic Tests:" : "கண்டறியும் சோதனைகள்:"}</strong> {isEn 
                  ? "The gold standard diagnostic test is a Polysomnography (in-lab sleep study) or a Home Sleep Apnea Test (HSAT)."
                  : "பாலிசோம்னோகிராபி (ஆய்வக தூக்க ஆய்வு) அல்லது வீட்டு தூக்க மூச்சுத்திணறல் சோதனை (HSAT) ஆகியவை சிறந்த கண்டறியும் சோதனைகளாகும்."}
              </span>
            </li>
          </ul>
        </div>

        {/* Conditional Doctor's Orders */}
        {redFlags >= 3 && (
          <div className="bg-red-900/20 p-6 rounded-xl border border-red-900/50 flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-red-400 font-bold text-lg mb-1">
                {isEn ? "Doctor's Orders" : "மருத்துவரின் அறிவுரைகள்"}
              </h4>
              <p className={`text-red-200 ${isEn ? '' : 'leading-relaxed'}`}>
                {isEn 
                  ? "Since you have a higher probability of OSA, please consult a pulmonologist and plan for a sleep study."
                  : "உங்களுக்கு OSA-க்கான அதிக சாத்தியக்கூறு இருப்பதால், தயவுசெய்து ஒரு நுரையீரல் மருத்துவரை அணுகி தூக்கப் பரிசோதனைக்கு திட்டமிடுங்கள்."}
              </p>
            </div>
          </div>
        )}

        {/* Disclaimers & Sign-off */}
        <div className="space-y-6 pt-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest text-center">
            {isEn 
              ? "Disclaimer: This tool is strictly a screening questionnaire and does not constitute a formal medical diagnosis."
              : "பொறுப்புத்துறப்பு: இந்த கருவி கண்டிப்பாக ஒரு ஸ்கிரீனிங் கேள்வித்தாள் மட்டுமே மற்றும் முறையான மருத்துவ நோயறிதலை உருவாக்காது."}
          </p>
          
          <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-800">
            <p className="text-lg text-slate-400 italic font-serif">
              — Dr. Arularasu, MD Pulmonologist
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  {isEn ? "Share Results" : "முடிவுகளைப் பகிரவும்"}
                </span>
              </button>
              <button 
                onClick={resetGame}
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 py-3 px-6 rounded-xl font-semibold transition-all border border-slate-700"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  {isEn ? "Start New Investigation" : "புதிய விசாரணை"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30 p-4 md:p-8 flex flex-col items-center ${language === 'ta' ? 'font-tamil' : ''}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');
        .font-tamil {
          font-family: 'Noto Sans Tamil', system-ui, -apple-system, sans-serif;
        }
      `}} />
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">The Case of the Stolen Sleep</h1>
            <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase mt-1">Virtual Sleep Detective</p>
          </div>
        </div>
        {currentStep > -1 && currentStep < 8 && (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full shadow-inner hidden md:flex">
            <Flag className="w-4 h-4 text-red-500" />
            <span className="text-sm font-mono text-slate-300">Flags: {redFlags}</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center mt-[-4rem]">
        {currentStep === -1 && renderLanguageSelection()}
        {currentStep >= 0 && currentStep < 8 && renderQuestion()}
        {currentStep === 8 && renderResults()}
      </main>

      {/* Toast Notification for Clipboard Copy */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium">
            {language === 'en' ? "Results copied to clipboard!" : "முடிவுகள் கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டன!"}
          </span>
        </div>
      )}
    </div>
  );
}
