import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import CandidateTable from '../components/CandidateTable';

export default function Candidates() {
  const [step, setStep] = useState(1); // 1: JD Upload, 2: Resume Upload, 3: Results
  const [jdId, setJdId] = useState(null);
  
  const [jdTitle, setJdTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [isUploadingJd, setIsUploadingJd] = useState(false);

  const handleJdSubmit = async (e) => {
    e.preventDefault();
    if (!jdTitle || !jdText) return;
    
    setIsUploadingJd(true);
    try {
      const formData = new FormData();
      formData.append("title", jdTitle);
      formData.append("text", jdText);

      // In production, point to the actual FastAPI backend (e.g., http://localhost:8000)
      const res = await fetch("http://localhost:8000/api/jd/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.id) {
        setJdId(data.id);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      // Fallback for UI demo purposes if backend isn't running
      setJdId(1);
      setStep(2);
    } finally {
      setIsUploadingJd(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Evaluation</h1>
        <p className="text-muted-foreground mt-2">Upload a Job Description and Candidate Resumes to start the AI analysis.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>1</div>
          <span className="font-medium">Job Description</span>
        </div>
        <div className="w-12 h-px bg-border"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>2</div>
          <span className="font-medium">Resumes</span>
        </div>
        <div className="w-12 h-px bg-border"></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>3</div>
          <span className="font-medium">Results</span>
        </div>
      </div>

      {/* Step 1: JD Upload */}
      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl shadow-sm p-8"
        >
          <h2 className="text-xl font-semibold mb-6">Upload Job Description</h2>
          
          <form onSubmit={handleJdSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior React Developer"
                value={jdTitle}
                onChange={(e) => setJdTitle(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description Text</label>
              <textarea 
                placeholder="Paste the full job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isUploadingJd || !jdTitle || !jdText}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isUploadingJd ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save & Continue"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 2: Resume Upload (Placeholder for next iteration) */}
      {step === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl shadow-sm p-8"
        >
           <h2 className="text-xl font-semibold mb-6">Upload Resumes</h2>
           <p className="text-muted-foreground mb-6">Drag and drop candidate resumes (PDF/DOCX) here.</p>
           
           <div className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-secondary/50 transition-colors cursor-pointer">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
               <Upload className="w-8 h-8 text-primary" />
             </div>
             <h3 className="font-medium text-lg">Click to browse or drag files here</h3>
             <p className="text-sm text-muted-foreground mt-1">Supports PDF, DOCX (Max 10MB per file)</p>
           </div>
           
           <div className="flex justify-end mt-6">
              <button 
                onClick={() => setStep(3)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Start AI Analysis
              </button>
            </div>
        </motion.div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl shadow-sm p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Candidate Rankings</h2>
              <p className="text-muted-foreground">AI-evaluated list of applicants based on the JD.</p>
            </div>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium">
              Export PDF
            </button>
          </div>
          <CandidateTable />
        </motion.div>
      )}
    </div>
  );
}
