import React, { useState, useCallback } from 'react';
import type { PatientData } from '../types';
import PatientInfoForm from './PatientInfoForm';
import RecommendationsView from './RecommendationsView';
import { INITIAL_PATIENT_DATA, ABBREVIATIONS } from '../constants';
import { Stethoscope, BookOpen, X, HelpCircle, Printer } from './icons';

type AppStep = 'patient-info' | 'recommendations';

const SourcesModal: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center"><BookOpen className="w-5 h-5 mr-2" />Sources Scientifiques</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-base">Dépistage et Suivi (ACR 2023)</h4>
                    <p className="text-gray-600 mt-1 text-sm">Guideline for the Screening and Monitoring of Interstitial Lung Disease in People with Systemic Autoimmune Rheumatic Disease.</p>
                    <a href="https://assets.contentstack.io/v3/assets/bltee37abb6b278ab2c/bltffeaff36ede96636/interstitial-lung-disease-guideline-screening-monitoring-2023.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold block mt-1 text-sm">Consulter la recommandation &rarr;</a>
                </div>
                 <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-base">Traitement (ACR 2023)</h4>
                    <p className="text-gray-600 mt-1 text-sm">Guideline for the Treatment of Interstitial Lung Disease in People with Systemic Autoimmune Rheumatic Disease.</p>
                    <a href="https://rheumatology.org/api/asset/bltaedebda97a351d47" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold block mt-1 text-sm">Consulter la recommandation &rarr;</a>
                </div>
            </div>
        </div>
    </div>
);

const AbbreviationsModal: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
             <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center"><HelpCircle className="w-5 h-5 mr-2" />Abréviations</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto">
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    {Object.entries(ABBREVIATIONS).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <dt className="font-semibold text-gray-800">{key}</dt>
                            <dd className="text-gray-600">{value}</dd>
                        </React.Fragment>
                    ))}
                </dl>
            </div>
        </div>
    </div>
);


const PIDConnectivitesDecisionApp = () => {
    const [currentStep, setCurrentStep] = useState<AppStep>('patient-info');
    const [patientData, setPatientData] = useState<PatientData>(INITIAL_PATIENT_DATA);
    const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
    const [isAbbreviationsModalOpen, setIsAbbreviationsModalOpen] = useState(false);

    const handleGenerate = useCallback(() => {
        setCurrentStep('recommendations');
        window.scrollTo(0, 0);
    }, []);

    const handleBack = useCallback(() => {
        setCurrentStep('patient-info');
        window.scrollTo(0, 0);
    }, []);

    const handleReset = useCallback(() => {
        setPatientData(INITIAL_PATIENT_DATA);
        setCurrentStep('patient-info');
        window.scrollTo(0, 0);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6 bg-gray-100 min-h-screen">
            {isSourcesModalOpen && <SourcesModal onClose={() => setIsSourcesModalOpen(false)} />}
            {isAbbreviationsModalOpen && <AbbreviationsModal onClose={() => setIsAbbreviationsModalOpen(false)} />}
            
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="text-center mb-6 no-print">
                    <div className="inline-block bg-blue-100 p-3 rounded-full mb-3">
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Aide à la Décision PID-Connectivites</h1>
                    <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                        Outil d'aide au dépistage, suivi et traitement des PID associées aux connectivites, basé sur les recommandations ACR 2023.
                    </p>
                </div>

                <div className="flex justify-between items-center my-6 no-print">
                    <div className="flex justify-center items-center space-x-2 sm:space-x-3 flex-grow">
                         <div className={`flex items-center px-4 py-2 rounded-full font-semibold text-base transition-all ${currentStep === 'patient-info' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                            <span className={`w-7 h-7 rounded-full mr-2 flex items-center justify-center text-lg ${currentStep === 'patient-info' ? 'bg-white text-blue-600' : 'bg-gray-400 text-white'}`}>1</span>
                            Évaluation Patient
                        </div>
                        <div className="h-0.5 bg-gray-300 w-12"></div>
                        <div className={`flex items-center px-4 py-2 rounded-full font-semibold text-base transition-all ${currentStep === 'recommendations' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                            <span className={`w-7 h-7 rounded-full mr-2 flex items-center justify-center text-lg ${currentStep === 'recommendations' ? 'bg-white text-blue-600' : 'bg-gray-400 text-white'}`}>2</span>
                            Recommandations
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsAbbreviationsModalOpen(true)} className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"><HelpCircle className="w-5 h-5"/></button>
                        <button onClick={() => setIsSourcesModalOpen(true)} className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"><BookOpen className="w-5 h-5"/></button>
                        {currentStep === 'recommendations' && (
                             <button onClick={handlePrint} className="p-2 bg-green-200 text-green-700 rounded-full hover:bg-green-300 transition-colors"><Printer className="w-5 h-5"/></button>
                        )}
                    </div>
                </div>

                {currentStep === 'patient-info' && (
                    <PatientInfoForm patientData={patientData} setPatientData={setPatientData} onGenerate={handleGenerate} />
                )}
                <div id="printable-area">
                    {currentStep === 'recommendations' && (
                        <RecommendationsView patientData={patientData} onBack={handleBack} onReset={handleReset} />
                    )}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 no-print">
                     <p>
                        Cet outil est une aide à la décision et ne remplace pas le jugement clinique. La collaboration entre rhumatologues et pneumologues est essentielle.
                     </p>
                     <p className="mt-1 font-semibold">
                        © 2025 Conception Dr Zouhair Souissi
                     </p>
                </div>
            </div>
        </div>
    );
};

export default PIDConnectivitesDecisionApp;