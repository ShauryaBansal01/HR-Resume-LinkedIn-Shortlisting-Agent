import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const mockCandidates = [
  { id: 1, name: "Alice Johnson", match: 94, skills: 95, exp: 90, port: 92, status: "Strong Match" },
  { id: 2, name: "Bob Smith", match: 82, skills: 80, exp: 85, port: 70, status: "Moderate Match" },
  { id: 3, name: "Charlie Davis", match: 45, skills: 40, exp: 50, port: 40, status: "Weak Match" },
  { id: 4, name: "Diana Prince", match: 98, skills: 99, exp: 95, port: 100, status: "Strong Match" },
  { id: 5, name: "Evan Wright", match: 20, skills: 15, exp: 10, port: 30, status: "Rejected" },
];

export default function CandidateTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="h-12 px-4 align-middle font-medium">Candidate Name</th>
              <th className="h-12 px-4 align-middle font-medium">Match %</th>
              <th className="h-12 px-4 align-middle font-medium">Skills</th>
              <th className="h-12 px-4 align-middle font-medium">Experience</th>
              <th className="h-12 px-4 align-middle font-medium">Portfolio</th>
              <th className="h-12 px-4 align-middle font-medium">Recommendation</th>
              <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCandidates.map((c, i) => (
              <motion.tr 
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-4 align-middle font-medium">{c.name}</td>
                <td className="p-4 align-middle font-bold text-primary">{c.match}%</td>
                <td className="p-4 align-middle">{c.skills}%</td>
                <td className="p-4 align-middle">{c.exp}%</td>
                <td className="p-4 align-middle">{c.port}%</td>
                <td className="p-4 align-middle">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                    ${c.status === 'Strong Match' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                      c.status === 'Moderate Match' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      c.status === 'Weak Match' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                  >
                    {c.status === 'Strong Match' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {c.status === 'Moderate Match' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {c.status === 'Weak Match' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {c.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {c.status}
                  </div>
                </td>
                <td className="p-4 align-middle text-right">
                  <button className="p-2 hover:bg-secondary rounded-md">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
