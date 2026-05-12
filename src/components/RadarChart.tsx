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

export const DevRadarChart: React.FC<RadarChartProps> = ({ data, compareData }) => {
  let chartData: any[] = [];

  if (compareData) {
    chartData = [
      { subject: 'Logic', A: compareData.metrics1.Logic, B: compareData.metrics2.Logic, fullMark: 100 },
      { subject: 'Docs', A: compareData.metrics1.Documentation, B: compareData.metrics2.Documentation, fullMark: 100 },
      { subject: 'Versatility', A: compareData.metrics1.Versatility, B: compareData.metrics2.Versatility, fullMark: 100 },
      { subject: 'Popularity', A: compareData.metrics1.Popularity, B: compareData.metrics2.Popularity, fullMark: 100 },
    ];
  } else if (data) {
    chartData = [
      { subject: 'Logic', A: data.Logic, fullMark: 100 },
      { subject: 'Docs', A: data.Documentation, fullMark: 100 },
      { subject: 'Versatility', A: data.Versatility, fullMark: 100 },
      { subject: 'Popularity', A: data.Popularity, fullMark: 100 },
    ];
  }

  return (
    <div className="w-full h-64 md:h-80 bg-surface rounded-2xl p-4 border border-slate-700/50 shadow-xl shadow-black/20">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#38bdf8' }}
          />
          {compareData ? (
            <>
              <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              <Radar name={compareData.name1} dataKey="A" stroke={compareData.color1} fill={compareData.color1} fillOpacity={0.4} />
              <Radar name={compareData.name2} dataKey="B" stroke={compareData.color2} fill={compareData.color2} fillOpacity={0.4} />
            </>
          ) : (
            <Radar name="Dev Profile" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
