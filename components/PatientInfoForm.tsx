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
      setPatientData(prev => {
        const newData = { ...prev, [field]: value };
        
        if (field === 'hepaticFunction' && value === 'severe') {
            const contraindication = 'Insuffisance hépatique sévère';
            if (!newData.contraindications.includes(contraindication)) {
                newData.contraindications = [...newData.contraindications, contraindication];
            }
        }

        return newData;
      });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-5 rounded-lg">
        <h3 className="font-bold text-xl text-blue-900 mb-4">Informations Patient</h3>
        <div className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Patient</label>
              <input type="text" value={patientData.patientName} onChange={e => handleSingleSelectChange('patientName', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="ex: Jean Dupont" />
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge (années)</label>
              <input type="number" value={patientData.age} onChange={e => handleSingleSelectChange('age', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="ex: 65" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <input type="number" value={patientData.weight} onChange={e => handleSingleSelectChange('weight', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="ex: 70" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-5 rounded-lg">
        <h3 className="font-bold text-xl text-blue-900 mb-4">Diagnostic</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de connectivite</label>
            <select value={patientData.connectiviteType} onChange={e => handleSingleSelectChange('connectiviteType', e.target.value as ConnectiviteValue)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
              <option value="">Sélectionnez le type...</option>
              {CONNECTIVITE_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PID déjà diagnostiquée ?</label>
            <div className="flex space-x-4">
              <label className="flex items-center text-sm"><input type="radio" name="hasPID" checked={patientData.hasPID === true} onChange={() => handleSingleSelectChange('hasPID', true)} className="mr-2 h-4 w-4" /> Oui</label>
              <label className="flex items-center text-sm"><input type="radio" name="hasPID" checked={patientData.hasPID === false} onChange={() => { handleSingleSelectChange('hasPID', false); handleSingleSelectChange('pidStatus', ''); }} className="mr-2 h-4 w-4" /> Non</label>
            </div>
          </div>
          {patientData.hasPID && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Évolution de la PID</label>
              <select value={patientData.pidStatus} onChange={e => handleSingleSelectChange('pidStatus', e.target.value as PIDStatus)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option value="">Sélectionnez le statut...</option>
                <option value="stable">Stable / Nouveau diagnostic</option>
                <option value="progression">Progression</option>
                <option value="rapid-progressive">Rapidement progressive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-5 rounded-lg">
          <h3 className="font-bold text-xl text-yellow-900 mb-4">Facteurs de Risque & Symptômes</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-base">Facteurs de risque</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                      {RISK_FACTORS.map(factor => (
                          <label key={factor} className="flex items-center text-sm"><input type="checkbox" checked={patientData.riskFactors.includes(factor)} onChange={() => handleCheckboxChange('riskFactors', factor)} className="mr-2 h-4 w-4" />{factor}</label>
                      ))}
                  </div>
              </div>
               <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-base">Symptômes évocateurs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                      {SYMPTOMS.map(symptom => (
                          <label key={symptom} className="flex items-center text-sm"><input type="checkbox" checked={patientData.currentSymptoms.includes(symptom)} onChange={() => handleCheckboxChange('currentSymptoms', symptom)} className="mr-2 h-4 w-4" />{symptom}</label>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {patientData.connectiviteType === 'IIM' && (
        <div className="bg-red-50 p-5 rounded-lg space-y-4">
          <h3 className="font-bold text-xl text-red-900 mb-2">Spécifique Anti-MDA5 (Myosite)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut Anti-MDA5</label>
            <select value={patientData.antiMDA5Status} onChange={e => handleSingleSelectChange('antiMDA5Status', e.target.value as AntiMDA5Status)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
              <option value="">Sélectionnez...</option>
              <option value="confirmed">Confirmé positif</option>
              <option value="suspected">Suspecté</option>
              <option value="negative">Négatif</option>
              <option value="unknown">Inconnu</option>
            </select>
          </div>
          {(patientData.antiMDA5Status === 'confirmed' || patientData.antiMDA5Status === 'suspected') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Ferritine (ng/mL)</label><input type="number" value={patientData.ferritin} onChange={e => handleSingleSelectChange('ferritin', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="ex: 1500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">LDH (UI/L)</label><input type="number" value={patientData.ldh} onChange={e => handleSingleSelectChange('ldh', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="ex: 300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">CRP (mg/L)</label><input type="number" value={patientData.crp} onChange={e => handleSingleSelectChange('crp', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="ex: 50" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manifestations Cliniques</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                  {ANTI_MDA5_MANIFESTATIONS.map(manifestation => (
                    <label key={manifestation} className="flex items-center text-sm"><input type="checkbox" checked={patientData.antiMDA5Manifestations.includes(manifestation)} onChange={() => handleCheckboxChange('antiMDA5Manifestations', manifestation)} className="mr-2 h-4 w-4" />{manifestation}</label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-5 rounded-lg">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Comorbidités & Contre-indications</h3>
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fonction hépatique</label>
                <select value={patientData.hepaticFunction} onChange={e => handleSingleSelectChange('hepaticFunction', e.target.value as HepaticFunction)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option value="normal">Normale</option><option value="mild">Insuffisance légère</option><option value="moderate">Insuffisance modérée</option><option value="severe">Insuffisance sévère</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contre-indications</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                    {CONTRAINDICATIONS.map(c => <label key={c} className="flex items-center text-sm"><input type="checkbox" checked={patientData.contraindications.includes(c)} onChange={() => handleCheckboxChange('contraindications', c)} className="mr-2 h-4 w-4" />{c}</label>)}
                </div>
              </div>
          </div>
        </div>
        <div className="bg-gray-100 p-5 rounded-lg">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Traitements Actuels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
            {CURRENT_MEDICATIONS.map(med => <label key={med} className="flex items-center text-sm"><input type="checkbox" checked={patientData.currentMedications.includes(med)} onChange={() => handleCheckboxChange('currentMedications', med)} className="mr-2 h-4 w-4" />{med}</label>)}
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={!patientData.connectiviteType || (patientData.hasPID && !patientData.pidStatus)}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
        >
          Générer les recommandations
        </button>
      </div>
    </div>
  );
};

export default PatientInfoForm;