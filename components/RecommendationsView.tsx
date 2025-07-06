import React from 'react';
import type { PatientData } from '../types';
import { getScreeningRecommendations, getMonitoringRecommendations, getRiskLevel, getRecommendedTreatment, getAntiMDA5PrognosticAssessment } from '../services/recommendationService';
import TreatmentPrescription from './TreatmentPrescription';
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
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h3 className="font-bold text-red-900 mb-3 flex items-center text-lg">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Évaluation Pronostique : Syndrome Anti-MDA5
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h4 className="font-semibold text-red-800 mb-1">Score de Risque: <span className="font-bold text-xl">{assessment.riskScore}</span></h4>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${assessment.prognosticColor}`}><AlertTriangle className="w-4 h-4 mr-2" />Pronostic {assessment.prognosticLevel}</div>
                </div>
                <div>
                    <h4 className="font-semibold text-red-800 mb-1">Risque de mortalité à 1 an</h4>
                    <p className="text-2xl font-bold text-red-900">{assessment.mortalityRisk}</p>
                </div>
            </div>
            {assessment.riskFactors.length > 0 && (
                <div className="mb-4"><h4 className="font-semibold text-red-800 mb-2">Facteurs de mauvais pronostic identifiés :</h4><ul className="list-disc list-inside text-sm text-red-700 space-y-1">{assessment.riskFactors.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
            )}
            <div><h4 className="font-semibold text-red-800 mb-2">Recommandations prioritaires :</h4><ul className="list-disc list-inside text-sm text-red-700 space-y-1 font-medium">{assessment.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
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
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Évaluation du Risque de PID</h3>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-md font-semibold ${risk.color}`}>
            <risk.icon className="w-5 h-5 mr-2" />
            Risque {risk.level}
          </div>
        </div>
        
        <AntiMDA5PrognosticView patientData={patientData} />

        {!patientData.hasPID && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center text-lg"><Stethoscope className="w-5 h-5 mr-2" />Recommandations de Dépistage de PID</h3>
            <div className="space-y-3">{screeningRecs.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-md border shadow-sm"><div className="p-2 rounded-full bg-green-100 mt-1"><rec.icon className="w-5 h-5 text-green-600" /></div><div className="flex-1"><h4 className="font-semibold text-gray-900">{rec.test}</h4><p className="text-sm text-gray-600">{rec.recommendation}</p><p className="text-xs text-gray-500 mt-1">{rec.description}</p></div></div>
            ))}</div>
          </div>
        )}
        
        {patientData.hasPID && patientData.pidStatus !== 'rapid-progressive' && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center text-lg"><Clock className="w-5 h-5 mr-2" />Recommandations de Suivi de PID</h3>
            <div className="space-y-3">{monitoringRecs.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-md border shadow-sm"><div className="p-2 rounded-full bg-orange-100 mt-1"><rec.icon className="w-5 h-5 text-orange-600" /></div><div className="flex-1"><h4 className="font-semibold text-gray-900">{rec.test}</h4><p className="text-sm text-gray-600">{rec.recommendation}</p>{rec.frequency && <p className="text-sm font-semibold text-orange-700 mt-1">Fréquence: {rec.frequency}</p>}</div></div>
            ))}</div>
          </div>
        )}

        {patientData.hasPID && recommendedTreatment ? (
          <TreatmentPrescription recommendedTreatment={recommendedTreatment} patientData={patientData} />
        ) : patientData.hasPID && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800">Aucune recommandation de traitement spécifique ne peut être générée avec les informations fournies. Veuillez compléter le statut de la PID.</div>
        )}
        
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200"><h3 className="font-semibold text-gray-900 mb-2">Note importante</h3><p className="text-sm text-gray-700">Ces recommandations sont basées sur les guidelines ACR 2023 et la littérature récente. Elles ne remplacent pas le jugement clinique et doivent être adaptées à chaque patient. La collaboration rhumatologue-pneumologue est essentielle.</p></div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button onClick={onBack} className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-md font-semibold hover:bg-gray-300 transition-colors">Retour</button>
          <button onClick={onReset} className="flex-1 bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">Nouveau Patient</button>
        </div>
      </div>
    );
};

export default RecommendationsView;