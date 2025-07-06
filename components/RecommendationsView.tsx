
import React, { useState } from 'react';
import type { PatientData, RecommendedTreatment } from '../types';
import { getScreeningRecommendations, getMonitoringRecommendations, getRiskLevel, getRecommendedTreatment, getAntiMDA5PrognosticAssessment } from '../services/recommendationService';
import TreatmentPrescription from './TreatmentPrescription';
import { Stethoscope, Clock, AlertTriangle, Bot } from './icons';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RecommendationsViewProps {
  patientData: PatientData;
  onBack: () => void;
  onReset: () => void;
}

const AntiMDA5PrognosticView: React.FC<{patientData: PatientData}> = ({ patientData }) => {
    const assessment = getAntiMDA5PrognosticAssessment(patientData);
    if (!assessment) return null;

    return (
        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="font-bold text-2xl text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Évaluation Pronostique : Anti-MDA5
            </h3>
            <div className="space-y-5">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg text-gray-600">Score de Risque</div>
                        <div className="text-4xl font-bold text-red-700">{assessment.riskScore}</div>
                    </div>
                     <div>
                        <div className="text-lg text-gray-600">Pronostic</div>
                        <div className={`mt-1 inline-block px-4 py-1.5 rounded-full text-lg font-semibold ${assessment.prognosticColor}`}>{assessment.prognosticLevel}</div>
                    </div>
                    <div>
                        <div className="text-lg text-gray-600">Mortalité (1 an)</div>
                        <div className="text-4xl font-bold text-red-700">{assessment.mortalityRisk}</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-red-200">
                    {assessment.riskFactors.length > 0 && (
                        <div><h4 className="font-semibold text-gray-800 text-lg mb-2">Facteurs de mauvais pronostic :</h4><ul className="list-disc list-inside text-lg text-red-700 space-y-1">{assessment.riskFactors.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
                    )}
                    <div><h4 className="font-semibold text-gray-800 text-lg mb-2">Recommandations clés :</h4><ul className="list-disc list-inside text-lg text-red-700 space-y-1 font-medium">{assessment.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                </div>
            </div>
        </div>
    );
};

const AiSummary: React.FC<{ patientData: PatientData, recommendedTreatment: RecommendedTreatment | null }> = ({ patientData, recommendedTreatment }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setError('');
        setSummary('');

        const prompt = `
            En tant qu'expert médical spécialisé en rhumatologie et pneumologie, veuillez fournir une synthèse concise et structurée en français pour un confrère, basée sur les données patient et les recommandations suivantes.

            La sortie doit être au format Markdown et inclure :
            1. **Profil Patient :** Un résumé du patient (nom, âge, sexe si disponible, type de connectivite).
            2. **Problématique Principale :** Le statut de la PID et les éléments clés du diagnostic.
            3. **Évaluation Pronostique :** Les facteurs de risque et les éléments pronostiques majeurs (en particulier pour l'anti-MDA5, si applicable).
            4. **Stratégie Thérapeutique :** Un résumé du plan de traitement recommandé.
            5. **Conclusion :** Une phrase sur l'importance du suivi.

            Ne pas inclure d'introduction ou de clause de non-responsabilité. Commencez directement par le profil du patient.

            **Données du Patient et Recommandations :**
            \`\`\`json
            ${JSON.stringify({
              patient: patientData,
              risk: getRiskLevel(patientData),
              antiMDA5Assessment: getAntiMDA5PrognosticAssessment(patientData),
              treatment: recommendedTreatment,
            }, null, 2)}
            \`\`\`
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: prompt,
            });
            setSummary(response.text);
        } catch (e) {
            console.error(e);
            setError('Une erreur est survenue lors de la génération de la synthèse. Veuillez vérifier votre clé API et réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg no-print">
            <h3 className="font-bold text-2xl text-gray-900 mb-4 flex items-center">
                <Bot className="w-6 h-6 mr-3 text-blue-600" />
                Synthèse par IA (Gemini)
            </h3>
            {!summary && !isLoading && (
                <button 
                    onClick={handleGenerateSummary}
                    className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-lg"
                    disabled={isLoading}
                >
                    Générer une Synthèse
                </button>
            )}
            {isLoading && <div className="text-center text-gray-500 py-4 text-lg">Génération en cours...</div>}
            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md text-lg">{error}</div>}
            {summary && (
                <div className="bg-white p-4 rounded-md border">
                    <ReactMarkdown className="prose prose-lg max-w-none" remarkPlugins={[remarkGfm]}>
                        {summary}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

const RecommendationsView: React.FC<RecommendationsViewProps> = ({ patientData, onBack, onReset }) => {
    const risk = getRiskLevel(patientData);
    const screeningRecs = getScreeningRecommendations(patientData);
    const monitoringRecs = getMonitoringRecommendations(patientData);
    const recommendedTreatment = getRecommendedTreatment(patientData);

    return (
      <div className="space-y-8">
        {patientData.patientName && (
            <h2 className="text-3xl font-bold text-center text-gray-800">Fiche Patient : {patientData.patientName}</h2>
        )}
      
        <div className="bg-white p-5 rounded-lg border flex justify-between items-center">
          <h3 className="font-bold text-2xl text-gray-900">Évaluation du Risque de PID</h3>
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-lg font-bold ${risk.color}`}>
            <risk.icon className="w-5 h-5 mr-2" />
            Risque {risk.level}
          </div>
        </div>
        
        <AntiMDA5PrognosticView patientData={patientData} />

        {!patientData.hasPID && (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold text-2xl text-green-900 mb-4 flex items-center"><Stethoscope className="w-6 h-6 mr-3" />Dépistage de PID</h3>
            <div className="space-y-4">
                {screeningRecs.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                      <div className="p-2 rounded-full bg-green-100"><rec.icon className="w-6 h-6 text-green-600" /></div>
                      <div><h4 className="font-semibold text-gray-800 text-xl">{rec.test}</h4><p className="text-lg text-gray-600">{rec.recommendation}</p></div>
                    </div>
                ))}
            </div>
          </div>
        )}
        
        {patientData.hasPID && patientData.pidStatus !== 'rapid-progressive' && (
          <div className="bg-orange-50 p-6 rounded-lg">
             <h3 className="font-bold text-2xl text-orange-900 mb-4 flex items-center"><Clock className="w-6 h-6 mr-3" />Suivi de PID</h3>
            <div className="space-y-4">{monitoringRecs.map((rec, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <div className="p-2 rounded-full bg-orange-100"><rec.icon className="w-6 h-6 text-orange-600" /></div>
                  <div>
                      <h4 className="font-semibold text-gray-800 text-xl">{rec.test}</h4>
                      <p className="text-lg text-gray-600">{rec.recommendation}</p>
                      {rec.frequency && <p className="text-lg font-semibold text-orange-700 mt-1">Fréquence: {rec.frequency}</p>}
                  </div>
                </div>
            ))}</div>
          </div>
        )}

        {patientData.hasPID && recommendedTreatment ? (
          <TreatmentPrescription recommendedTreatment={recommendedTreatment} patientData={patientData} />
        ) : patientData.hasPID && (
          <div className="bg-white p-6 rounded-lg border text-center text-gray-500 text-lg">Aucune recommandation de traitement ne peut être générée. Veuillez compléter le statut de la PID.</div>
        )}

        <AiSummary patientData={patientData} recommendedTreatment={recommendedTreatment} />
        
        <div className="flex space-x-4 pt-4 no-print">
          <button onClick={onBack} className="flex-1 bg-gray-300 text-gray-700 p-4 rounded-md font-semibold hover:bg-gray-400 transition-colors text-xl">Retour</button>
          <button onClick={onReset} className="flex-1 bg-blue-600 text-white p-4 rounded-md font-semibold hover:bg-blue-700 transition-colors text-xl">Nouveau Patient</button>
        </div>
      </div>
    );
};

export default RecommendationsView;