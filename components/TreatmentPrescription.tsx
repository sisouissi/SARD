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
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">Erreur: Traitement primaire non trouvé ({recommendedTreatment.primary}).</div>;
    }
    
    const contraindications = checkContraindications(patientData, recommendedTreatment.primary);

    const UrgencyAlert = () => {
        if (!recommendedTreatment.urgency) return null;
        const messages = {
            extreme: { title: 'URGENCE VITALE', text: 'Pronostic vital engagé. Admission en réanimation et avis spécialisé immédiat sont requis.', iconColor: 'text-red-700' },
            critical: { title: 'URGENCE THÉRAPEUTIQUE CRITIQUE', text: 'Débuter immédiatement le traitement. Hospitalisation et référence pneumologique urgente sont recommandées.', iconColor: 'text-red-600' },
            high: { title: 'URGENCE THÉRAPEUTIQUE', text: 'Débuter rapidement le traitement. Une référence pneumologique urgente est recommandée.', iconColor: 'text-red-500' }
        };
        const level = recommendedTreatment.urgencyLevel || 'high';
        const { title, text, iconColor } = messages[level];

        return (
            <div className="mb-4 p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center">
                    <Zap className={`w-6 h-6 mr-3 flex-shrink-0 ${iconColor}`} />
                    <div>
                        <p className="text-md font-bold text-red-800">{title}</p>
                        <p className="text-sm text-red-700 mt-1">{text}</p>
                    </div>
                </div>
                {recommendedTreatment.antiMDA5Specific && (
                    <p className="text-sm text-red-800 mt-2 font-semibold border-t border-red-200 pt-2">
                        Contexte de Syndrome anti-MDA5 : Triple thérapie d'emblée fortement recommandée.
                    </p>
                )}
            </div>
        );
    };

    return (
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center text-lg">
          <Calculator className="w-5 h-5 mr-2" />
          Aide à la Prescription
        </h3>

        <UrgencyAlert />

        {recommendedTreatment.enhanced && (
          <div className="mb-4 p-3 bg-orange-100 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <p className="text-md font-semibold text-orange-800">Prise en charge renforcée : Patient anti-MDA5+</p>
                  <p className="text-sm text-orange-700 mt-1">Surveillance intensive requise en raison du risque d'évolution fulminante imprévisible.</p>
                </div>
              </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-bold text-xl text-gray-900 mb-4">
            Traitement de 1ère ligne : <span className="text-purple-700">{primaryTreatment.name}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex items-start"><Pill className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" /><div><h5 className="font-semibold text-gray-700 mb-1">Posologie</h5><p className="text-sm text-gray-600">{primaryTreatment.dosage}</p></div></div>
            <div className="flex items-start"><User className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" /><div><h5 className="font-semibold text-gray-700 mb-1">Administration</h5><p className="text-sm text-gray-600">{primaryTreatment.administration}</p></div></div>
            <div className="flex items-start"><Eye className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" /><div><h5 className="font-semibold text-gray-700 mb-1">Surveillance</h5><p className="text-sm text-gray-600">{primaryTreatment.surveillance}</p></div></div>
            <div className="flex items-start"><Shield className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" /><div><h5 className="font-semibold text-gray-700 mb-1">Effets secondaires majeurs</h5><p className="text-sm text-gray-600">{primaryTreatment.sideEffects}</p></div></div>
          </div>

          {contraindications.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"><h5 className="font-semibold text-red-800 mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />Contre-indications détectées</h5><ul className="list-disc list-inside text-sm text-red-700 space-y-1 pl-2">{contraindications.map(c => <li key={c}>{c}</li>)}</ul><p className="text-sm text-red-800 mt-2 font-semibold">Considérer un traitement alternatif.</p></div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"><h5 className="font-semibold text-blue-800 mb-1">Notes</h5><p className="text-sm text-blue-700">{primaryTreatment.notes}</p></div>

          {recommendedTreatment.combination && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200"><h5 className="font-semibold text-orange-800 mb-1">Thérapie combinée recommandée</h5><p className="text-sm text-orange-700">{recommendedTreatment.combination === 'triple' ? 'Triple thérapie fortement recommandée.' : 'Double thérapie recommandée.'}</p></div>
          )}

          {recommendedTreatment.monitoring === 'intensive' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">📊 Surveillance intensive (anti-MDA5)</h5>
                <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Hebdomadaire (4 premières semaines) :</strong> Bilan clinique, EFR, Gaz du sang, NFS, iono, créat, transaminases, Ferritine, LDH, CRP.</p>
                    <p><strong>Mensuelle ensuite (si stable) :</strong> Maintenir une surveillance rapprochée.</p>
                </div>
            </div>
          )}

        </div>

        {recommendedTreatment.alternatives && recommendedTreatment.alternatives.length > 0 && (
          <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Alternatives / Ligne suivante</h4>
            <div className="space-y-2">{recommendedTreatment.alternatives.map(alt => { const altT = TREATMENT_DATABASE[alt]; if (!altT) return null; return (<div key={alt} className="p-3 bg-gray-50 rounded-md border"><h5 className="font-semibold text-gray-800">{altT.name}</h5><p className="text-xs text-gray-500 mt-1">{altT.notes}</p></div>);})}</div>
          </div>
        )}
        
        {recommendedTreatment.contraindicated && recommendedTreatment.contraindicated.length > 0 && (
          <div className="mt-4 p-3 bg-red-100 rounded-lg border-l-4 border-red-500"><h5 className="font-bold text-red-800 mb-2">⚠️ CONTRE-INDICATIONS FORTES</h5><ul className="list-disc list-inside text-sm text-red-700">{recommendedTreatment.contraindicated.map(c => <li key={c}>{TREATMENT_DATABASE[c]?.name || c}</li>)}</ul></div>
        )}
      </div>
    );
};

export default TreatmentPrescription;