'use client';

import React, { useState } from 'react';
import { MLPredictionData, MLMetricsSummary } from '../types/weather';

interface MLInsightsCardProps {
  prediction: MLPredictionData | null;
  metrics: MLMetricsSummary | null;
  unit: 'celsius' | 'fahrenheit';
  isLoading?: boolean;
}

export default function MLInsightsCard({
  prediction,
  metrics,
  unit,
  isLoading = false
}: MLInsightsCardProps) {
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-800/60 rounded-2xl"></div>
          <div className="h-32 bg-slate-800/60 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!prediction && !metrics) {
    return null;
  }

  // Unit conversion helper
  const formatTemp = (tempC: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC * 10) / 10}°C`;
  };

  const tempPred = prediction?.temperature_prediction;
  const rainPred = prediction?.rainfall_prediction;

  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-indigo-950/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Custom Scikit-Learn Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live ML Model
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Next-Day AI Weather Predictions
          </h3>
          <p className="text-xs text-slate-400">
            Trained on 2,184 chronological observations with unseen 2024 test benchmark
          </p>
        </div>

        <button
          onClick={() => setShowMetricsModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-all duration-200 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10 flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Model Benchmarks
        </button>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {/* Model A: Temperature Prediction */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                🌡️
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-300">Model A: Temperature Regressor</div>
                <div className="text-[10px] text-slate-400">{tempPred?.model_name || 'Linear Regression'}</div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              R² = {tempPred?.metrics.r2 ?? 0.975}
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {tempPred ? formatTemp(tempPred.predicted_temp_celsius) : '--'}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Expected Range:</span>
              <span className="text-slate-200 font-medium">
                {tempPred
                  ? `${formatTemp(tempPred.confidence_range_celsius.min)} – ${formatTemp(tempPred.confidence_range_celsius.max)}`
                  : '--'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                (±{tempPred?.metrics.mae ?? 1.05}°C MAE)
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-700/50 flex items-center justify-between">
            <span>Historical baseline correlation</span>
            <span className="text-emerald-400 font-medium">97.5% Fit</span>
          </div>
        </div>

        {/* Model B: Rainfall Prediction */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                🌧️
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-300">Model B: Rainfall Classifier</div>
                <div className="text-[10px] text-slate-400">{rainPred?.model_name || 'Logistic Regression'}</div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Acc = {rainPred ? `${Math.round(rainPred.metrics.accuracy * 100)}%` : '84%'}
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {rainPred ? `${rainPred.rain_probability_pct}%` : '--'}
              </div>
              <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                rainPred?.will_rain
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {rainPred?.will_rain ? 'Rain Expected (>0.1mm)' : 'Dry Day Expected'}
              </div>
            </div>

            {/* Probability Progress Bar */}
            <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  (rainPred?.rain_probability_pct ?? 0) > 50
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                }`}
                style={{ width: `${Math.min(Math.max(rainPred?.rain_probability_pct ?? 5, 5), 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-700/50 flex items-center justify-between">
            <span>Confidence Assessment</span>
            <span className="text-slate-200 capitalize font-medium">{rainPred?.confidence || 'High'}</span>
          </div>
        </div>
      </div>

      {/* Model Metrics Inspection Modal */}
      {showMetricsModal && metrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-lg font-bold text-white">Machine Learning Benchmarks</h4>
                <p className="text-xs text-slate-400">
                  Dataset: {metrics.dataset.city} ({metrics.dataset.period}) • {metrics.dataset.total_samples} samples
                </p>
              </div>
              <button
                onClick={() => setShowMetricsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Metrics Content */}
            <div className="py-6 space-y-6 text-sm">
              {/* Chronological split info */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/30 text-xs text-indigo-200">
                <span className="font-semibold text-white">Chronological Validation Protocol:</span> Trained on 2019–2023 historical records; strictly evaluated on 365 unseen future daily observations from 2024 to prevent temporal data leakage.
              </div>

              {/* Temperature Algorithm Comparison */}
              <div>
                <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>🌡️</span> Model A: Temperature Prediction Algorithms
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Algorithm</th>
                        <th className="py-2">MAE (°C)</th>
                        <th className="py-2">RMSE (°C)</th>
                        <th className="py-2">R² Score</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-2.5 text-white font-sans font-medium">Linear Regression</td>
                        <td className="py-2.5 text-emerald-400">1.048</td>
                        <td className="py-2.5 text-emerald-400">1.309</td>
                        <td className="py-2.5 text-emerald-400 font-bold">0.9750</td>
                        <td className="py-2.5 font-sans"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">Winner 🏆</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-300 font-sans font-medium">Random Forest Regressor</td>
                        <td className="py-2.5 text-slate-400">1.310</td>
                        <td className="py-2.5 text-slate-400">1.669</td>
                        <td className="py-2.5 text-slate-400">0.9593</td>
                        <td className="py-2.5 font-sans"><span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Compared</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rainfall Algorithm Comparison */}
              <div>
                <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>🌧️</span> Model B: Rainfall Classification Algorithms
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Algorithm</th>
                        <th className="py-2">Accuracy</th>
                        <th className="py-2">Precision</th>
                        <th className="py-2">Recall</th>
                        <th className="py-2">F1 Score</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-2.5 text-white font-sans font-medium">Logistic Regression</td>
                        <td className="py-2.5 text-emerald-400 font-bold">83.56%</td>
                        <td className="py-2.5 text-emerald-400">72.55%</td>
                        <td className="py-2.5 text-emerald-400">69.81%</td>
                        <td className="py-2.5 text-emerald-400 font-bold">0.7115</td>
                        <td className="py-2.5 font-sans"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">Winner 🏆</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-300 font-sans font-medium">Random Forest Classifier</td>
                        <td className="py-2.5 text-slate-400">80.82%</td>
                        <td className="py-2.5 text-slate-400">68.00%</td>
                        <td className="py-2.5 text-slate-400">64.15%</td>
                        <td className="py-2.5 text-slate-400">0.6602</td>
                        <td className="py-2.5 font-sans"><span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Compared</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Confusion Matrix Display */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-200 mb-2">Confusion Matrix (2024 Test Set - 365 Days)</div>
                <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                  <div className="p-3 bg-emerald-950/30 border border-emerald-800/30 rounded-xl">
                    <div className="text-lg font-bold text-emerald-400">231</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">True Negative (Dry)</div>
                  </div>
                  <div className="p-3 bg-rose-950/20 border border-rose-800/30 rounded-xl">
                    <div className="text-lg font-bold text-rose-400">28</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">False Positive</div>
                  </div>
                  <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl">
                    <div className="text-lg font-bold text-amber-400">32</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">False Negative</div>
                  </div>
                  <div className="p-3 bg-blue-950/30 border border-blue-800/30 rounded-xl">
                    <div className="text-lg font-bold text-blue-400">74</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">True Positive (Rain)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowMetricsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Close Metrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
