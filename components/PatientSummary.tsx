
import React from 'react';
import type { PatientData } from '../types';
import { CONNECTIVITE_TYPES } from '../constants';
import { User, Stethoscope, Activity, Shield, AlertTriangle } from './icons';

interface PatientSummaryProps {
  patientData: PatientData;
}

const SummarySection: React.FC<{ title: string; children: React.ReactNode; icon: React.FC<{className?: string}> }> = ({ title, children, icon: Icon }) => (
    <div className="mb-4 break-inside-avoid">
        <h4 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 flex items-center">
            <Icon className="w-5 h-5 mr-2 text-gray-600" />
            {title}
        </h4>
        <div className="text-base space-y-1 pl-1">{children}</div>
    </div>
);

const SummaryItem: React.FC<{ label: string; value?: string | number | null; }> = ({ label, value }) => (
    value ? <p><strong className="font-semibold text-gray-700">{label}:</strong> {value}</p> : null
);

const SummaryList: React.FC<{ label: string; items: string[]; }> = ({ label, items }) => (
    items && items.length > 0 ? (
        <div>
            <strong className="font-semibold text-gray-700">{label}:</strong>
            <ul className="list-disc list-inside ml-2">
                {items.map(item => <li key={item}>{item}</li>)}
            </ul>
        </div>
    ) : null
);


const PatientSummary: React.FC<PatientSummaryProps> = ({ patientData }) => {
    const connectiviteLabel = CONNECTIVITE_TYPES.find(c => c.value === patientData.connectiviteType)?.label;

    const pidStatusLabels: { [key: string]: string } = {
        'stable': 'Stable / Nouveau diagnostic',
        'progression': 'Progression',
        'rapid-progressive': 'Rapidement progressive'
    };
    
    const antiMDA5StatusLabels: { [key: string]: string } = {
        'confirmed': 'Confirmé positif',
        'suspected': 'Suspecté',
        'negative': 'Négatif',
        'unknown': 'Inconnu'
    };

    return (
        <div className="bg-gray-50 p-5 rounded-lg border mb-6 break-inside-avoid">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Synthèse du Patient</h3>
            
            <div className="md:columns-2 gap-6">
                <SummarySection title="Informations Générales" icon={User}>
                    <SummaryItem label="Nom" value={patientData.patientName} />
                    <SummaryItem label="Âge" value={patientData.age ? `${patientData.age} ans` : null} />
                    <SummaryItem label="Poids" value={patientData.weight ? `${patientData.weight} kg` : null} />
                    <SummaryItem label="Fonction hépatique" value={patientData.hepaticFunction.charAt(0).toUpperCase() + patientData.hepaticFunction.slice(1)} />
                </SummarySection>

                <SummarySection title="Diagnostic" icon={Stethoscope}>
                    <SummaryItem label="Connectivite" value={connectiviteLabel} />
                    <SummaryItem label="PID diagnostiquée" value={patientData.hasPID ? 'Oui' : 'Non'} />
                    {patientData.hasPID && <SummaryItem label="Évolution PID" value={pidStatusLabels[patientData.pidStatus]} />}
                </SummarySection>

                {patientData.connectiviteType === 'IIM' && (patientData.antiMDA5Status === 'confirmed' || patientData.antiMDA5Status === 'suspected') &&
                    <SummarySection title="Spécifique Anti-MDA5" icon={AlertTriangle}>
                        <SummaryItem label="Statut Anti-MDA5" value={antiMDA5StatusLabels[patientData.antiMDA5Status]} />
                        <SummaryItem label="Ferritine" value={patientData.ferritin ? `${patientData.ferritin} ng/mL` : null} />
                        <SummaryItem label="LDH" value={patientData.ldh ? `${patientData.ldh} UI/L` : null} />
                        <SummaryItem label="CRP" value={patientData.crp ? `${patientData.crp} mg/L` : null} />
                        <SummaryList label="Manifestations" items={patientData.antiMDA5Manifestations} />
                    </SummarySection>
                }

                <SummarySection title="Facteurs de Risque & Symptômes" icon={Activity}>
                    <SummaryList label="Facteurs de risque" items={patientData.riskFactors} />
                    <SummaryList label="Symptômes" items={patientData.currentSymptoms} />
                </SummarySection>
                
                 <SummarySection title="Comorbidités & Traitements" icon={Shield}>
                    <SummaryList label="Contre-indications" items={patientData.contraindications} />
                    <SummaryList label="Traitements actuels" items={patientData.currentMedications} />
                </SummarySection>
            </div>
        </div>
    );
};

export default PatientSummary;