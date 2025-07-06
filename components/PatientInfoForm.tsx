import React from 'react';
import type { PatientData } from '../types';
import { CONNECTIVITE_TYPES, CONTRAINDICATIONS, CURRENT_MEDICATIONS, RISK_FACTORS, SYMPTOMS, ANTI_MDA5_MANIFESTATIONS } from '../constants';

interface PatientInfoFormProps {
  patientData: PatientData;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
  onGenerate: () => void;
}

const CheckboxGroup: React.FC<{title: string, options: string[], checkedItems: string[], onChange: (item: string) => void}> = ({ title, options, checkedItems, onChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{title}</label>
        <div className="p-3 bg-white rounded-md border border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto">
            {options.map(item => (
                <label key={item} className="flex items-center text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checkedItems.includes(item)}
                        onChange={() => onChange(item)}
                        className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    {item}
                </label>
            ))}
        </div>
    </div>
);


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

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4 text-lg">1. Informations Générales & Cliniques</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge (années)</label>
              <input type="number" value={patientData.age} onChange={e => setPatientData(d => ({...d, age: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="ex: 65" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <input type="number" value={patientData.weight} onChange={e => setPatientData(d => ({...d, weight: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="ex: 70" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de connectivite</label>
            <select value={patientData.connectiviteType} onChange={e => setPatientData(d => ({...d, connectiviteType: e.target.value as PatientData['connectiviteType']}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Sélectionnez le type</option>
              {CONNECTIVITE_TYPES.map(type => <option key={type.value} value={type.value}>{type.label} (Risque {type.risk})</option>)}
            </select>
          </div>
          <CheckboxGroup title="Facteurs de risque de PID" options={RISK_FACTORS} checkedItems={patientData.riskFactors} onChange={(item) => handleCheckboxChange('riskFactors', item)} />
          <CheckboxGroup title="Symptômes évocateurs de PID" options={SYMPTOMS} checkedItems={patientData.currentSymptoms} onChange={(item) => handleCheckboxChange('currentSymptoms', item)} />
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4 text-lg">2. Statut de la PID</h3>
           <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PID déjà diagnostiquée ?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer"><input type="radio" name="hasPID" checked={patientData.hasPID === true} onChange={() => setPatientData(d => ({...d, hasPID: true}))} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" /> Oui</label>
                  <label className="flex items-center cursor-pointer"><input type="radio" name="hasPID" checked={patientData.hasPID === false} onChange={() => setPatientData(d => ({...d, hasPID: false, pidStatus: ''}))} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" /> Non</label>
                </div>
            </div>

            {patientData.hasPID && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Évolution de la PID</label>
                <select value={patientData.pidStatus} onChange={(e) => setPatientData(d => ({...d, pidStatus: e.target.value as PatientData['pidStatus']}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Sélectionnez le statut</option>
                  <option value="stable">Stable / Nouveau diagnostic</option>
                  <option value="progression">Progression malgré traitement</option>
                  <option value="rapid-progressive">Rapidement progressive (RP-ILD)</option>
                </select>
              </div>
            )}
           </div>
      </div>


      {patientData.connectiviteType === 'IIM' && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-4 text-lg">3. Evaluation spécifique Anti-MDA5 (pour Myosite)</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut anti-MDA5</label>
                    <select value={patientData.antiMDA5Status} onChange={e => setPatientData(d => ({...d, antiMDA5Status: e.target.value as PatientData['antiMDA5Status']}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Sélectionnez le statut</option>
                        <option value="confirmed">Confirmé positif</option>
                        <option value="suspected">Suspecté (clinique compatible)</option>
                        <option value="negative">Négatif</option>
                        <option value="unknown">Non testé/Inconnu</option>
                    </select>
                </div>
                {(patientData.antiMDA5Status === 'confirmed' || patientData.antiMDA5Status === 'suspected') && (
                    <>
                        <CheckboxGroup title="Manifestations cliniques évocatrices" options={ANTI_MDA5_MANIFESTATIONS} checkedItems={patientData.antiMDA5Manifestations} onChange={(item) => handleCheckboxChange('antiMDA5Manifestations', item)} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ferritine (ng/mL)</label>
                                <input type="number" value={patientData.ferritin} onChange={e => setPatientData({...patientData, ferritin: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" placeholder="> 500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LDH (UI/L)</label>
                                <input type="number" value={patientData.ldh} onChange={e => setPatientData({...patientData, ldh: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" placeholder="> 280"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CRP (mg/L)</label>
                                <input type="number" value={patientData.crp} onChange={e => setPatientData({...patientData, crp: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" placeholder="> 3"/>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-4 text-lg">4. Comorbidités & Traitements</h3>
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fonction hépatique</label>
                <select value={patientData.hepaticFunction} onChange={e => setPatientData(d => ({...d, hepaticFunction: e.target.value as PatientData['hepaticFunction']}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="normal">Normale</option>
                    <option value="mild">Insuffisance légère</option>
                    <option value="moderate">Insuffisance modérée</option>
                    <option value="severe">Insuffisance sévère</option>
                </select>
              </div>
              <CheckboxGroup title="Contre-indications présentes" options={CONTRAINDICATIONS} checkedItems={patientData.contraindications} onChange={(item) => handleCheckboxChange('contraindications', item)} />
              <CheckboxGroup title="Traitements de fond actuels/récents" options={CURRENT_MEDICATIONS} checkedItems={patientData.currentMedications} onChange={(item) => handleCheckboxChange('currentMedications', item)} />
          </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={!patientData.connectiviteType || (patientData.hasPID && !patientData.pidStatus)}
        className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Générer les recommandations
      </button>
    </div>
  );
};

export default PatientInfoForm;