import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Briefcase, GraduationCap, Edit3, Save, MessageSquare } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const mockData = {
  id: 1,
  name: "Alice Johnson",
  role: "Senior React Developer",
  match: 94,
  scores: [
    { subject: 'Skills', A: 95, fullMark: 100 },
    { subject: 'Experience', A: 90, fullMark: 100 },
    { subject: 'Education', A: 85, fullMark: 100 },
    { subject: 'Projects', A: 92, fullMark: 100 },
    { subject: 'Communication', A: 88, fullMark: 100 },
  ],
  aiReasoning: "Candidate demonstrates exceptionally strong React and Node.js expertise with 4 years of relevant SaaS experience. The portfolio shows highly relevant projects matching the JD. However, Kubernetes and AWS DevOps exposure mentioned in the JD are missing, which slightly lowered the Experience score.",
  status: "Strong Match"
};

export default function CandidateDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [overrideScore, setOverrideScore] = useState(mockData.match);
  const [overrideReason, setOverrideReason] = useState("");

  const handleOverrideSave = () => {
    // Implement API call to save override
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <Link to="/candidates" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Rankings
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Overview & AI Reasoning */}
        <div className="flex-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
                  {mockData.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{mockData.name}</h1>
                  <p className="text-muted-foreground">{mockData.role}</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                {mockData.status}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              Explainable AI Reasoning
            </h2>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-sm leading-relaxed">
              {mockData.aiReasoning}
            </div>
          </motion.div>

          {/* Human-in-the-Loop Override */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-primary" />
                Human Override
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Adjust Score
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Match Score (%)</label>
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={overrideScore}
                      onChange={(e) => setOverrideScore(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Override</label>
                  <textarea 
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="E.g., Interview showed stronger soft skills than resume implied."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleOverrideSave}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Override
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input hover:bg-accent h-10 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="font-medium text-foreground mr-2">Current Score:</span> {overrideScore}% 
                <span className="mx-2">|</span>
                <span className="font-medium text-foreground mr-2">AI Score:</span> {mockData.match}%
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Charts & Details */}
        <div className="w-full md:w-80 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-xl shadow-sm p-6"
          >
            <h3 className="font-semibold mb-4 text-center">Score Breakdown</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockData.scores}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Candidate" dataKey="A" stroke="#0f172a" fill="#0f172a" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center items-center">
              <div className="text-4xl font-bold">{overrideScore}</div>
              <div className="text-muted-foreground ml-1 mb-2">%</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4"
          >
            <h3 className="font-semibold border-b border-border pb-2">Quick Stats</h3>
            <div className="flex items-center space-x-3 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span>4 Years Experience</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span>B.S. Computer Science</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
