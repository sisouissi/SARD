
import React from 'react';
import type { PatientData, ConnectiviteValue, PIDStatus, AntiMDA5Status, HepaticFunction } from '../types';
import { CONNECTIVITE_TYPES, CONTRAINDICATIONS, CURRENT_MEDICATIONS, RISK_FACTORS, SYMPTOMS, ANTI_MDA5_MANIFESTATIONS } from '../constants';

interface PatientInfoFormProps {
  patientData: PatientData;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
  onGenerate: () => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ patientData, setPatientData, onGenerate }) => {

  const handleCheckboxChange = (field: 'contraindications' | 'currentMedications' | 'riskFactors' | 'currentSymptoms' | 'antiMDA5Manifestations', value: string) => {
    setPatientData(prevData => {
      const currentValues = prevData[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prevData, [field]: newValues };
    });
  };

  const handleSingleSelectChange = (field: keyof PatientData, value: any) => {
      setPatientData(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold text-2xl text-blue-900 mb-4">Informations Patient</h3>
        <div className="space-y-4">
           <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Nom du Patient</label>
              <input type="text" value={patientData.patientName} onChange={e => handleSingleSelectChange('patientName', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-base" placeholder="ex: Jean Dupont" />
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Âge (années)</label>
              <input type="number" value={patientData.age} onChange={e => handleSingleSelectChange('age', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-base" placeholder="ex: 65" />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Poids (kg)</label>
              <input type="number" value={patientData.weight} onChange={e => handleSingleSelectChange('weight', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-base" placeholder="ex: 70" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold text-2xl text-blue-900 mb-4">Diagnostic</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Type de connectivite</label>
            <select value={patientData.connectiviteType} onChange={e => handleSingleSelectChange('connectiviteType', e.target.value as ConnectiviteValue)} className="w-full p-3 border border-gray-300 rounded-md text-base">
              <option value="">Sélectionnez le type...</option>
              {CONNECTIVITE_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">PID déjà diagnostiquée ?</label>
            <div className="flex space-x-6">
              <label className="flex items-center text-base"><input type="radio" name="hasPID" checked={patientData.hasPID === true} onChange={() => handleSingleSelectChange('hasPID', true)} className="mr-2 h-4 w-4" /> Oui</label>
              <label className="flex items-center text-base"><input type="radio" name="hasPID" checked={patientData.hasPID === false} onChange={() => { handleSingleSelectChange('hasPID', false); handleSingleSelectChange('pidStatus', ''); }} className="mr-2 h-4 w-4" /> Non</label>
            </div>
          </div>
          {patientData.hasPID && (
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Évolution de la PID</label>
              <select value={patientData.pidStatus} onChange={e => handleSingleSelectChange('pidStatus', e.target.value as PIDStatus)} className="w-full p-3 border border-gray-300 rounded-md text-base">
                <option value="">Sélectionnez le statut...</option>
                <option value="stable">Stable / Nouveau diagnostic</option>
                <option value="progression">Progression</option>
                <option value="rapid-progressive">RP-ILD</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="font-bold text-2xl text-yellow-900 mb-4">Facteurs de Risque & Symptômes</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-lg">Facteurs de risque</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                      {RISK_FACTORS.map(factor => (
                          <label key={factor} className="flex items-center text-base"><input type="checkbox" checked={patientData.riskFactors.includes(factor)} onChange={() => handleCheckboxChange('riskFactors', factor)} className="mr-3 h-4 w-4" />{factor}</label>
                      ))}
                  </div>
              </div>
               <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-lg">Symptômes évocateurs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                      {SYMPTOMS.map(symptom => (
                          <label key={symptom} className="flex items-center text-base"><input type="checkbox" checked={patientData.currentSymptoms.includes(symptom)} onChange={() => handleCheckboxChange('currentSymptoms', symptom)} className="mr-3 h-4 w-4" />{symptom}</label>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {patientData.connectiviteType === 'IIM' && (
        <div className="bg-red-50 p-6 rounded-lg space-y-6">
          <h3 className="font-bold text-2xl text-red-900 mb-2">Spécifique Anti-MDA5 (Myosite)</h3>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Statut Anti-MDA5</label>
            <select value={patientData.antiMDA5Status} onChange={e => handleSingleSelectChange('antiMDA5Status', e.target.value as AntiMDA5Status)} className="w-full p-3 border border-gray-300 rounded-md text-base">
              <option value="">Sélectionnez...</option>
              <option value="confirmed">Confirmé positif</option>
              <option value="suspected">Suspecté</option>
              <option value="negative">Négatif</option>
              <option value="unknown">Inconnu</option>
            </select>
          </div>
          {(patientData.antiMDA5Status === 'confirmed' || patientData.antiMDA5Status === 'suspected') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div><label className="block text-base font-medium text-gray-700 mb-2">Ferritine (ng/mL)</label><input type="number" value={patientData.ferritin} onChange={e => handleSingleSelectChange('ferritin', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-base" placeholder="ex: 1500" /></div>
                <div><label className="block text-base font-medium text-gray-700 mb-2">LDH (UI/L)</label><input type="number" value={patientData.ldh} onChange={e => handleSingleSelectChange('ldh', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-base" placeholder="ex: 300" /></div>
                <div><label className="block text-base font-medium text-gray-700 mb-2">CRP (mg/L)</label><input type="number" value={patientData.crp} onChange={e => handleSingleSelectChange('crp', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-base" placeholder="ex: 50" /></div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Manifestations Cliniques</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                  {ANTI_MDA5_MANIFESTATIONS.map(manifestation => (
                    <label key={manifestation} className="flex items-center text-base"><input type="checkbox" checked={patientData.antiMDA5Manifestations.includes(manifestation)} onChange={() => handleCheckboxChange('antiMDA5Manifestations', manifestation)} className="mr-3 h-4 w-4" />{manifestation}</label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="font-bold text-2xl text-gray-800 mb-4">Comorbidités & Contre-indications</h3>
          <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Fonction hépatique</label>
                <select value={patientData.hepaticFunction} onChange={e => handleSingleSelectChange('hepaticFunction', e.target.value as HepaticFunction)} className="w-full p-3 border border-gray-300 rounded-md text-base">
                    <option value="normal">Normale</option><option value="mild">Insuffisance légère</option><option value="moderate">Insuffisance modérée</option><option value="severe">Insuffisance sévère</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Contre-indications</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                    {CONTRAINDICATIONS.map(c => <label key={c} className="flex items-center text-base"><input type="checkbox" checked={patientData.contraindications.includes(c)} onChange={() => handleCheckboxChange('contraindications', c)} className="mr-3 h-4 w-4" />{c}</label>)}
                </div>
              </div>
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="font-bold text-2xl text-gray-800 mb-4">Traitements Actuels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
            {CURRENT_MEDICATIONS.map(med => <label key={med} className="flex items-center text-base"><input type="checkbox" checked={patientData.currentMedications.includes(med)} onChange={() => handleCheckboxChange('currentMedications', med)} className="mr-3 h-4 w-4" />{med}</label>)}
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={!patientData.connectiviteType || (patientData.hasPID && !patientData.pidStatus)}
          className="w-full bg-blue-600 text-white p-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-xl"
        >
          Générer les recommandations
        </button>
      </div>
    </div>
  );
};

export default PatientInfoForm;