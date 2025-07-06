import React from 'react';
import type { PatientData } from '../types';
import { CheckCircle, XCircle, HelpCircle } from './icons';

interface NintedanibIndicationProps {
  patientData: PatientData;
}

type IndicationStatus = 'indicated' | 'not-indicated' | 'unestablished';

interface IndicationDetails {
  status: IndicationStatus;
  title: string;
  explanation: string;
  icon: React.FC<{className?: string}>;
  colorClasses: string;
}

const NintedanibIndication: React.FC<NintedanibIndicationProps> = ({ patientData }) => {
  const { connectiviteType, pidStatus, hasPID } = patientData;

  if (!connectiviteType || !pidStatus || !hasPID) {
    return null;
  }

  const getIndicationDetails = (): IndicationDetails | null => {
    switch (pidStatus) {
      case 'stable': // First-line treatment
        switch (connectiviteType) {
          case 'SSc':
            return {
              status: 'indicated',
              title: 'Indication au Nintédanib',
              explanation: 'Le Nintédanib est une option recommandée en première ligne pour la PID associée à la Sclérodermie Systémique (ACR 2023).',
              icon: CheckCircle,
              colorClasses: 'bg-green-100 border-green-500 text-green-900'
            };
          case 'RA':
            return {
              status: 'unestablished',
              title: 'Indication du Nintédanib non établie',
              explanation: 'Il n\'y a pas de consensus pour recommander le Nintédanib en première ligne pour la PID associée à la PR. La décision doit être discutée au cas par cas (ACR 2023).',
              icon: HelpCircle,
              colorClasses: 'bg-yellow-100 border-yellow-500 text-yellow-900'
            };
          case 'IIM':
          case 'MCTD':
          case 'SjD':
            return {
              status: 'not-indicated',
              title: 'Pas d\'indication au Nintédanib en 1ère ligne',
              explanation: 'Le Nintédanib est déconseillé en première ligne pour la PID associée à cette connectivite (ACR 2023).',
              icon: XCircle,
              colorClasses: 'bg-red-100 border-red-500 text-red-900'
            };
          default:
            return null;
        }
      case 'progression':
         const sjdNote = connectiviteType === 'SjD' ? ' Pour le Sjögren, la décision dépend notamment de l\'importance de la fibrose au scanner.' : '';
         return {
              status: 'indicated',
              title: 'Indication au Nintédanib (en cas de progression)',
              explanation: `Le Nintédanib est une option recommandée pour les patients avec une PID progressive malgré un premier traitement.${sjdNote} (ACR 2023).`,
              icon: CheckCircle,
              colorClasses: 'bg-green-100 border-green-500 text-green-900'
         };
      case 'rapid-progressive':
        return {
          status: 'not-indicated',
          title: 'Pas d\'indication au Nintédanib',
          explanation: 'Le Nintédanib est déconseillé en première ligne pour les formes de PID rapidement progressives (ACR 2023).',
          icon: XCircle,
          colorClasses: 'bg-red-100 border-red-500 text-red-900'
        };
      default:
        return null;
    }
  };

  const details = getIndicationDetails();

  if (!details) {
    return null;
  }
  
  const { title, explanation, icon: Icon, colorClasses } = details;

  return (
    <div className={`p-4 mb-4 rounded-lg border-l-4 ${colorClasses}`}>
      <div className="flex items-start">
        <Icon className="w-6 h-6 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-bold">{title}</h4>
          <p className="text-base mt-1">{explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default NintedanibIndication;
