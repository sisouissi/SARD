import React, { useState, useCallback } from 'react';
import type { PatientData } from '../types';
import PatientInfoForm from './PatientInfoForm';
import RecommendationsView from './RecommendationsView';
import { INITIAL_PATIENT_DATA } from '../constants';
import { Stethoscope } from './icons';

type AppStep = 'patient-info' | 'recommendations';

const PIDConnectivitesDecisionApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('patient-info');
  const [patientData, setPatientData] = useState<PatientData>({...INITIAL_PATIENT_DATA});

  const handleGenerate = useCallback(() => {
    window.scrollTo(0, 0);
    setCurrentStep('recommendations');
  }, []);

  const handleBack = useCallback(() => {
    window.scrollTo(0, 0);
    setCurrentStep('patient-info');
  }, []);

  const handleReset = useCallback(() => {
    setPatientData({...INITIAL_PATIENT_DATA});
    window.scrollTo(0, 0);
    setCurrentStep('patient-info');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 text-gray-800">
             <Stethoscope className="w-8 h-8 text-blue-600" />
             <h1 className="text-2xl sm:text-3xl font-bold">
                Aide à la Décision : PID & Connectivites
             </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Outil d'aide basé sur les recommandations ACR 2023 pour le dépistage, suivi et traitement des PID, avec un focus sur le syndrome anti-MDA5.
          </p>
        </header>
        
        <nav className="mb-8">
          <div className="flex justify-center border border-gray-200 rounded-full p-1 max-w-md mx-auto bg-gray-50">
            <button
                onClick={handleBack}
                disabled={currentStep === 'patient-info'}
                className={`flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${
                currentStep === 'patient-info' 
                ? 'bg-blue-600 text-white shadow' 
                : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
            >
              1. Évaluation du Patient
            </button>
            <button
                onClick={handleGenerate}
                disabled={currentStep === 'recommendations' || !patientData.connectiviteType || (patientData.hasPID && !patientData.pidStatus)}
                className={`flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${
                currentStep === 'recommendations' 
                ? 'bg-blue-600 text-white shadow' 
                : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
            >
              2. Recommandations
            </button>
          </div>
        </nav>
        
        <main>
            {currentStep === 'patient-info' && (
              <PatientInfoForm 
                patientData={patientData} 
                setPatientData={setPatientData}
                onGenerate={handleGenerate} 
              />
            )}
            
            {currentStep === 'recommendations' && (
              <RecommendationsView 
                patientData={patientData}
                onBack={handleBack}
                onReset={handleReset}
              />
            )}
        </main>
      </div>
      <footer className="text-center text-xs text-gray-500 mt-6">
        Cet outil est un support à la décision et ne remplace pas le jugement clinique. La responsabilité finale incombe au médecin prescripteur.
      </footer>
    </div>
  );
};

export default PIDConnectivitesDecisionApp;