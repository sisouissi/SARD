import React from 'react';
import type { PatientData, RecommendedTreatment } from '../types';
import { getScreeningRecommendations, getMonitoringRecommendations, getRiskLevel, getRecommendedTreatment, getAntiMDA5PrognosticAssessment } from '../services/recommendationService';
import TreatmentPrescription from './TreatmentPrescription';
import PatientSummary from './PatientSummary';
import { Stethoscope, Clock, AlertTriangle } from './icons';

interface RecommendationsViewProps {
  patientData: PatientData;
  onBack: () => void;
  onReset: () => void;
}

const AntiMDA5PrognosticView: React.FC<{patientData: PatientData}> = ({ patientData }) => {
    const assessment = getAntiMDA5PrognosticAssessment(patientData);
    if (!assessment) return null;

    return (
        <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500 break-inside-avoid">
            <h3 className="font-bold text-xl text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Évaluation Pronostique : Anti-MDA5
            </h3>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-base text-gray-600">Score de Risque</div>
                        <div className="text-3xl font-bold text-red-700">{assessment.riskScore}</div>
                    </div>
                     <div>
                        <div className="text-base text-gray-600">Pronostic</div>
                        <div className={`mt-1 inline-block px-3 py-1 rounded-full text-base font-semibold ${assessment.prognosticColor}`}>{assessment.prognosticLevel}</div>
                    </div>
                    <div>
                        <div className="text-base text-gray-600">Mortalité (1 an)</div>
                        <div className="text-3xl font-bold text-red-700">{assessment.mortalityRisk}</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-red-200">
                    {assessment.riskFactors.length > 0 && (
                        <div><h4 className="font-semibold text-gray-800 text-base mb-2">Facteurs de mauvais pronostic :</h4><ul className="list-disc list-inside text-base text-red-700 space-y-1">{assessment.riskFactors.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
                    )}
                    <div><h4 className="font-semibold text-gray-800 text-base mb-2">Recommandations clés :</h4><ul className="list-disc list-inside text-base text-red-700 space-y-1 font-medium">{assessment.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                </div>
            </div>
        </div>
    );
};

const RecommendationsView: React.FC<RecommendationsViewProps> = ({ patientData, onBack, onReset }) => {
    const risk = getRiskLevel(patientData);
    const screeningRecs = getScreeningRecommendations(patientData);
    const monitoringRecs = getMonitoringRecommendations(patientData);
    const recommendedTreatment = getRecommendedTreatment(patientData);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
            Fiche de Recommandation
        </h2>

        <PatientSummary patientData={patientData} />
      
        <div className="bg-white p-4 rounded-lg border flex justify-between items-center break-inside-avoid">
          <h3 className="font-bold text-xl text-gray-900">Évaluation du Risque de PID</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-base font-bold ${risk.color}`}>
            <risk.icon className="w-4 h-4 mr-2" />
            Risque {risk.level}
          </div>
        </div>
        
        <AntiMDA5PrognosticView patientData={patientData} />

        {!patientData.hasPID && (
          <div className="bg-green-50 p-5 rounded-lg break-inside-avoid">
            <h3 className="font-bold text-xl text-green-900 mb-3 flex items-center"><Stethoscope className="w-5 h-5 mr-2" />Dépistage de PID</h3>
            <div className="space-y-3">
                {screeningRecs.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                      <div className="p-1.5 rounded-full bg-green-100"><rec.icon className="w-5 h-5 text-green-600" /></div>
                      <div><h4 className="font-semibold text-gray-800 text-lg">{rec.test}</h4><p className="text-base text-gray-600">{rec.recommendation}</p></div>
                    </div>
                ))}
            </div>
          </div>
        )}
        
        {patientData.hasPID && patientData.pidStatus !== 'rapid-progressive' && (
          <div className="bg-orange-50 p-5 rounded-lg break-inside-avoid">
             <h3 className="font-bold text-xl text-orange-900 mb-3 flex items-center"><Clock className="w-5 h-5 mr-2" />Suivi de PID</h3>
            <div className="space-y-3">{monitoringRecs.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                  <div className="p-1.5 rounded-full bg-orange-100"><rec.icon className="w-5 h-5 text-orange-600" /></div>
                  <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{rec.test}</h4>
                      <p className="text-base text-gray-600">{rec.recommendation}</p>
                      {rec.frequency && <p className="text-base font-semibold text-orange-700 mt-1">Fréquence: {rec.frequency}</p>}
                  </div>
                </div>
            ))}</div>
          </div>
        )}

        {patientData.hasPID && recommendedTreatment ? (
          <TreatmentPrescription recommendedTreatment={recommendedTreatment} patientData={patientData} />
        ) : patientData.hasPID && (
          <div className="bg-white p-5 rounded-lg border text-center text-gray-500 text-base break-inside-avoid">Aucune recommandation de traitement ne peut être générée. Veuillez compléter le statut de la PID.</div>
        )}
        
        <div className="flex space-x-4 pt-4 no-print">
          <button onClick={onBack} className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-md font-semibold hover:bg-gray-400 transition-colors text-lg">Retour</button>
          <button onClick={onReset} className="flex-1 bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors text-lg">Nouveau Patient</button>
        </div>
      </div>
    );
};

export default RecommendationsView;