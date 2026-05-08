import { motion } from 'framer-motion';
import { Users, FileCheck, XCircle, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Candidates', value: '142', change: '+12%', icon: Users, trend: 'up' },
  { name: 'Shortlisted', value: '28', change: '+4%', icon: FileCheck, trend: 'up' },
  { name: 'Rejected', value: '104', change: '-2%', icon: XCircle, trend: 'down' },
  { name: 'Avg. Match Score', value: '76%', change: '+5%', icon: TrendingUp, trend: 'up' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your recruitment pipeline.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6"
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.name}</h3>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border bg-card text-card-foreground shadow-sm col-span-4 p-6"
        >
          <div className="flex flex-col space-y-1.5 pb-4">
            <h3 className="font-semibold leading-none tracking-tight">Top Candidates</h3>
            <p className="text-sm text-muted-foreground">Recent highest matching applicants</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium mr-4">
                  C{i}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Candidate {i}</p>
                  <p className="text-sm text-muted-foreground">Frontend Engineer</p>
                </div>
                <div className="ml-auto font-medium text-green-500">9{i}% Match</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-border bg-card text-card-foreground shadow-sm col-span-3 p-6 flex flex-col justify-center items-center text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">AI Pipeline Active</h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            Your LangGraph agents are continuously evaluating new incoming resumes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
