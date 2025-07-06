
import React, { useState, useCallback } from 'react';
import type { PatientData } from '../types';
import PatientInfoForm from './PatientInfoForm';
import RecommendationsView from './RecommendationsView';
import { INITIAL_PATIENT_DATA, ABBREVIATIONS } from '../constants';
import { Stethoscope, BookOpen, X, HelpCircle, Printer } from './icons';

type AppStep = 'patient-info' | 'recommendations';

const SourcesModal: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center"><BookOpen className="w-6 h-6 mr-3" />Sources Scientifiques</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-lg">Dépistage et Suivi (ACR 2023)</h4>
                    <p className="text-gray-600 mt-1 text-base">Guideline for the Screening and Monitoring of Interstitial Lung Disease in People with Systemic Autoimmune Rheumatic Disease.</p>
                    <a href="https://assets.contentstack.io/v3/assets/bltee37abb6b278ab2c/bltffeaff36ede96636/interstitial-lung-disease-guideline-screening-monitoring-2023.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold block mt-2 text-base">Consulter la recommandation &rarr;</a>
                </div>
                 <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 text-lg">Traitement (ACR 2023)</h4>
                    <p className="text-gray-600 mt-1 text-base">Guideline for the Treatment of Interstitial Lung Disease in People with Systemic Autoimmune Rheumatic Disease.</p>
                    <a href="https://rheumatology.org/api/asset/bltaedebda97a351d47" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold block mt-2 text-base">Consulter la recommandation &rarr;</a>
                </div>
            </div>
        </div>
    </div>
);

const AbbreviationsModal: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
             <div className="p-5 border-b flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center"><HelpCircle className="w-6 h-6 mr-3" />Abréviations</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-base">
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
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
            {isSourcesModalOpen && <SourcesModal onClose={() => setIsSourcesModalOpen(false)} />}
            {isAbbreviationsModalOpen && <AbbreviationsModal onClose={() => setIsAbbreviationsModalOpen(false)} />}
            
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center mb-6 no-print">
                    <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
                        <Stethoscope className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Aide à la Décision PID-Connectivites</h1>
                    <p className="text-xl text-gray-600 mt-2 max-w-4xl mx-auto">
                        Outil d'aide au dépistage, suivi et traitement des PID associées aux connectivites, basé sur les recommandations ACR 2023.
                    </p>
                </div>

                <div className="flex justify-between items-center my-8 no-print">
                    <div className="flex justify-center items-center space-x-2 sm:space-x-4 flex-grow">
                         <div className={`flex items-center px-6 py-3 rounded-full font-semibold text-lg transition-all ${currentStep === 'patient-info' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                            <span className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center text-xl ${currentStep === 'patient-info' ? 'bg-white text-blue-600' : 'bg-gray-400 text-white'}`}>1</span>
                            Évaluation Patient
                        </div>
                        <div className="h-0.5 bg-gray-300 w-16"></div>
                        <div className={`flex items-center px-6 py-3 rounded-full font-semibold text-lg transition-all ${currentStep === 'recommendations' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                            <span className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center text-xl ${currentStep === 'recommendations' ? 'bg-white text-blue-600' : 'bg-gray-400 text-white'}`}>2</span>
                            Recommandations
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={() => setIsAbbreviationsModalOpen(true)} className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"><HelpCircle className="w-6 h-6"/></button>
                        <button onClick={() => setIsSourcesModalOpen(true)} className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"><BookOpen className="w-6 h-6"/></button>
                        {currentStep === 'recommendations' && (
                             <button onClick={handlePrint} className="p-3 bg-green-200 text-green-700 rounded-full hover:bg-green-300 transition-colors"><Printer className="w-6 h-6"/></button>
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

                <div className="mt-10 text-center text-base text-gray-500 no-print">
                     <p>
                        Cet outil est une aide à la décision et ne remplace pas le jugement clinique. La collaboration entre rhumatologues et pneumologues est essentielle.
                     </p>
                     <p className="mt-2 font-semibold">
                        © 2025 Conception Dr Zouhair Souissi
                     </p>
                </div>
            </div>
        </div>
    );
};

export default PIDConnectivitesDecisionApp;