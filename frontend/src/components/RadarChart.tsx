import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalysisMetrics } from '../hooks/useDevAnalyzer';

interface RadarChartProps {
  data?: AnalysisMetrics;
  compareData?: {
    name1: string;
    name2: string;
    metrics1: AnalysisMetrics;
    metrics2: AnalysisMetrics;
    color1: string;
    color2: string;
  };
}

interface ChartDataPoint {
  subject: string;
  A: number;
  B?: number;
  fullMark: number;
}

export const DevRadarChart: React.FC<RadarChartProps> = ({ data, compareData }) => {
  let chartData: ChartDataPoint[] = [];

  if (compareData) {
    const metricOrder = ['Logic', 'Security', 'Architecture', 'Testing', 'Dependencies', 'Production', 'Documentation', 'Popularity'];
    chartData = metricOrder
      .filter((metric) => compareData.metrics1[metric] !== undefined || compareData.metrics2[metric] !== undefined)
      .map((metric) => ({
        subject: metric === 'Documentation' ? 'Docs' : metric,
        A: compareData.metrics1[metric] || 0,
        B: compareData.metrics2[metric] || 0,
        fullMark: 100,
      }));
  } else if (data) {
    const metricOrder = ['Logic', 'Security', 'Architecture', 'Testing', 'Dependencies', 'Production', 'Documentation', 'Popularity'];
    chartData = metricOrder
      .filter((metric) => data[metric] !== undefined)
      .map((metric) => ({
        subject: metric === 'Documentation' ? 'Docs' : metric,
        A: data[metric] || 0,
        fullMark: 100,
      }));
  }

  return (
    <div className="w-full h-[400px] bg-[#0f172a]/50 backdrop-blur-md rounded-3xl p-6 border border-sky-500/10 shadow-2xl shadow-sky-900/20 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-purple-500/5 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '12px', color: '#f8fafc', backdropFilter: 'blur(8px)' }}
            itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
          />
          {compareData ? (
            <>
              <Legend wrapperStyle={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500', paddingTop: '20px' }} />
              <Radar name={compareData.name1} dataKey="A" stroke={compareData.color1} strokeWidth={3} fill={compareData.color1} fillOpacity={0.4} />
              <Radar name={compareData.name2} dataKey="B" stroke={compareData.color2} strokeWidth={3} fill={compareData.color2} fillOpacity={0.4} />
            </>
          ) : (
            <Radar name="Dev Profile" dataKey="A" stroke="#38bdf8" strokeWidth={3} fill="url(#colorUv)" fillOpacity={0.5} />
          )}
          {!compareData && (
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
