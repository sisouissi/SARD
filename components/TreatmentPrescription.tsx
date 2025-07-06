import React from 'react';
import type { RecommendedTreatment, PatientData } from '../types';
import { TREATMENT_DATABASE } from '../constants';
import { checkContraindications } from '../services/recommendationService';
import { Calculator, Zap, Pill, User, Eye, Shield, AlertTriangle } from './icons';

interface TreatmentPrescriptionProps {
  recommendedTreatment: RecommendedTreatment;
  patientData: PatientData;
}

const TreatmentPrescription: React.FC<TreatmentPrescriptionProps> = ({ recommendedTreatment, patientData }) => {
    const primaryTreatment = TREATMENT_DATABASE[recommendedTreatment.primary];
    if (!primaryTreatment) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg text-base break-inside-avoid">Erreur: Traitement primaire non trouvé ({recommendedTreatment.primary}).</div>;
    }
    
    const contraindications = checkContraindications(patientData, recommendedTreatment.primary);

    const UrgencyAlert = () => {
        if (!recommendedTreatment.urgency) return null;
        const messages = {
            extreme: { title: 'URGENCE VITALE', text: 'Pronostic vital engagé. Admission en réanimation et avis spécialisé immédiat sont requis.' },
            critical: { title: 'URGENCE CRITIQUE', text: 'Débuter immédiatement le traitement. Hospitalisation et référence pneumologique urgente sont recommandées.' },
            high: { title: 'URGENCE THÉRAPEUTIQUE', text: 'Débuter rapidement le traitement. Une référence pneumologique urgente est recommandée.' }
        };
        const level = recommendedTreatment.urgencyLevel || 'high';
        const { title, text } = messages[level];

        return (
            <div className="p-4 mb-4 bg-red-100 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center">
                    <Zap className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" />
                    <div>
                        <p className="text-lg font-bold text-red-800">{title}</p>
                        <p className="text-base text-red-700 mt-1">{text}</p>
                    </div>
                </div>
                {recommendedTreatment.antiMDA5Specific && (
                    <p className="text-base text-red-800 mt-2 font-semibold pt-2 border-t border-red-200">
                        Contexte Anti-MDA5 : Triple thérapie d'emblée fortement recommandée.
                    </p>
                )}
            </div>
        );
    };

    return (
      <div className="bg-purple-50 p-5 rounded-lg break-inside-avoid">
        <h3 className="font-bold text-xl text-purple-900 mb-4 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Aide à la Prescription
        </h3>
        
        <UrgencyAlert />

        {recommendedTreatment.enhanced && (
          <div className="p-3 mb-4 bg-orange-100 rounded-lg border-l-4 border-orange-500 flex items-center">
            <AlertTriangle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-lg font-semibold text-orange-800">Prise en charge renforcée : Patient anti-MDA5+</p>
              <p className="text-base text-orange-700 mt-1">Surveillance intensive requise en raison du risque d'évolution fulminante.</p>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-bold text-xl text-gray-800 mb-3">
            1ère Ligne : <span className="text-purple-600">{primaryTreatment.name}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-base">
            <div className="flex items-start"><Pill className="w-5 h-5 mr-2 mt-1 text-gray-400 flex-shrink-0" /><div><strong className="text-gray-600">Posologie:</strong><br/>{primaryTreatment.dosage}</div></div>
            <div className="flex items-start"><User className="w-5 h-5 mr-2 mt-1 text-gray-400 flex-shrink-0" /><div><strong className="text-gray-600">Administration:</strong><br/>{primaryTreatment.administration}</div></div>
            <div className="flex items-start"><Eye className="w-5 h-5 mr-2 mt-1 text-gray-400 flex-shrink-0" /><div><strong className="text-gray-600">Surveillance:</strong><br/>{primaryTreatment.surveillance}</div></div>
            <div className="flex items-start"><Shield className="w-5 h-5 mr-2 mt-1 text-gray-400 flex-shrink-0" /><div><strong className="text-gray-600">Effets secondaires:</strong><br/>{primaryTreatment.sideEffects}</div></div>
          </div>

          {contraindications.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <h5 className="font-semibold text-red-800 mb-1 flex items-center text-base"><AlertTriangle className="w-4 h-4 mr-2" />Contre-indications détectées</h5>
              <ul className="list-disc list-inside text-base text-red-700">{contraindications.map(c => <li key={c}>{c}</li>)}</ul>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-1 text-base">Notes</h5>
            <p className="text-base text-blue-700">{primaryTreatment.notes}</p>
          </div>
        </div>

        {recommendedTreatment.alternatives && recommendedTreatment.alternatives.length > 0 && (
          <div className="mt-5 bg-white p-4 rounded-lg border">
            <h4 className="font-bold text-lg text-gray-800 mb-3">Alternatives Thérapeutiques</h4>
            <div className="space-y-2">
                {recommendedTreatment.alternatives.map(alt => {
                    const altTreatment = TREATMENT_DATABASE[alt];
                    if (!altTreatment) return null;
                    return (
                        <div key={alt} className="p-2 bg-gray-50 rounded">
                            <p className="font-semibold text-gray-700 text-base">{altTreatment.name}</p>
                            <p className="text-sm text-gray-600">{altTreatment.notes}</p>
                        </div>
                    );
                })}
            </div>
          </div>
        )}
        
        {recommendedTreatment.contraindicated && recommendedTreatment.contraindicated.length > 0 && (
            <div className="mt-5 p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
                <h4 className="font-bold text-lg text-red-800 mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />Contre-indications (SSc-ILD)</h4>
                 <ul className="list-disc list-inside text-base text-red-700">
                    {recommendedTreatment.contraindicated.map(contra => <li key={contra}>{TREATMENT_DATABASE[contra]?.name || contra}</li>)}
                </ul>
            </div>
        )}
      </div>
    );
};

export default TreatmentPrescription;