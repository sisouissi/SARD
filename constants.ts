import type { PatientData, ConnectiviteInfo, TreatmentDatabase } from './types';

export const INITIAL_PATIENT_DATA: PatientData = {
    patientName: '',
    connectiviteType: '',
    hasPID: false,
    pidStatus: '',
    riskFactors: [],
    currentSymptoms: [],
    antiMDA5Status: '',
    antiMDA5Titer: '',
    antiMDA5Manifestations: [],
    age: '',
    weight: '',
    hepaticFunction: 'normal',
    contraindications: [],
    currentMedications: [],
    ferritin: '',
    ldh: '',
    crp: '',
};

export const CONNECTIVITE_TYPES: ConnectiviteInfo[] = [
    { value: 'RA', label: 'Polyarthrite Rhumatoïde (PR)', risk: 'modéré' },
    { value: 'SSc', label: 'Sclérodermie Systémique (SSc)', risk: 'élevé' },
    { value: 'IIM', label: 'Myosite Inflammatoire Idiopathique (IIM)', risk: 'élevé' },
    { value: 'MCTD', label: 'Connectivite Mixte (MCTD)', risk: 'modéré' },
    { value: 'SjD', label: 'Syndrome de Sjögren (SjD)', risk: 'modéré' }
];

export const RISK_FACTORS: string[] = [
  'Anti-Jo1 positif',
  'Anticorps anti-synthetase',
  'Anti-Scl-70 positif',
  'Sexe masculin',
  'Tabagisme actuel/passé',
  'Exposition professionnelle',
  'Antécédents familiaux de fibrose pulmonaire'
];

export const SYMPTOMS: string[] = [
  'Dyspnée d\'effort',
  'Toux sèche persistante',
  'Fatigue inhabituelle',
  'Douleur thoracique',
  'Crépitants à l\'auscultation',
  'Hippocratisme digital',
  'Désaturation à l\'effort'
];

export const ANTI_MDA5_MANIFESTATIONS: string[] = [
  'Éruption cutanée typique (papules de Gottron)',
  'Ulcérations cutanées',
  'Amyopathie amyosique (sans faiblesse musculaire)',
  'Arthralgie/Arthrite',
  'Phénomène de Raynaud',
  'Vasculopathie cutanée',
  'Alopécie',
  'Fièvre persistante',
  'Perte de poids significative',
  'Progression respiratoire rapide (<3 mois)'
];


export const CONTRAINDICATIONS: string[] = [
    'Infection active',
    'Immunodéficience sévère',
    'Insuffisance rénale sévère',
    'Insuffisance hépatique sévère',
    'Grossesse/allaitement',
    'Antécédent de néoplasie récente',
    'Hypersensibilité connue',
    'Insuffisance cardiaque sévère',
    'BPCO sévère',
    'Ulcère gastroduodénal actif'
];

export const CURRENT_MEDICATIONS: string[] = [
    'Abatacept',
    'Anti-TNF',
    'Azathioprine',
    'Corticoïdes',
    'Cyclophosphamide',
    'Hydroxychloroquine',
    'Inhibiteurs de la calcineurine',
    'Inhibiteurs JAK',
    'IVIg',
    'Léflunomide',
    'Méthotrexate',
    'Mycophénolate mofétil',
    'Nintédanib',
    'Pirfénidone',
    'Rituximab',
    'Sulfasalazine',
    'Tocilizumab',
    'Autres immunosuppresseurs'
].sort();


export const TREATMENT_DATABASE: TreatmentDatabase = {
    'mycophenolate': {
        name: 'Mycophénolate mofétil',
        dosage: '2-3 g/jour (1000-1500 mg x2/jour)',
        administration: 'Per os, à jeun ou avec nourriture légère',
        surveillance: 'NFS, créatinine, transaminases à J15, M1, M3, puis tous les 3 mois',
        contraindications: ['Grossesse', 'Allaitement', 'Hypersensibilité'],
        interactions: ['Antiacides', 'Cholestyramine', 'Ciclosporine'],
        sideEffects: 'Troubles digestifs, leucopénie, anémie, infections',
        monitoring: 'CBC + LFT + créatinine',
        notes: 'Traitement de première ligne préféré pour la plupart des SARD-ILD'
    },
    'azathioprine': {
        name: 'Azathioprine',
        dosage: '2-2.5 mg/kg/jour (max 200 mg/jour)',
        administration: 'Per os, en 1-2 prises',
        surveillance: 'NFS, transaminases hebdomadaires le 1er mois, puis mensuelles',
        contraindications: ['Déficit en TPMT', 'Grossesse', 'Allaitement'],
        interactions: ['Allopurinol', 'ACE inhibiteurs', 'Warfarine'],
        sideEffects: 'Myélosuppression, hépatotoxicité, infections',
        monitoring: 'CBC + LFT, dosage TPMT avant initiation',
        notes: 'Alternative à mycophénolate, vérifier TPMT'
    },
    'rituximab': {
        name: 'Rituximab',
        dosage: '1000 mg J1 et J15, puis tous les 6-12 mois',
        administration: 'IV, avec prémédication (corticoïdes, antihistaminiques)',
        surveillance: 'NFS, Ig, sérologies virales (VHB, VHC, VIH)',
        contraindications: ['Infection active', 'Immunodéficience sévère'],
        interactions: ['Vaccins vivants'],
        sideEffects: 'Réactions perfusion, infections, hypogammaglobulinémie',
        monitoring: 'CBC + Ig + sérologies + clinique',
        notes: 'Efficace dans les myosites et SSc-ILD. Pilier de la triple thérapie anti-MDA5.'
    },
    'cyclophosphamide': {
        name: 'Cyclophosphamide',
        dosage: 'IV: 500-1000 mg/m² mensuel x6 mois ou PO: 1-2 mg/kg/jour',
        administration: 'IV (protocole NIH) ou per os',
        surveillance: 'NFS, ECBU, cystoscopie si PO prolongé',
        contraindications: ['Cystite hémorragique', 'Insuffisance rénale sévère'],
        interactions: ['Allopurinol', 'Phénytoïne'],
        sideEffects: 'Myélosuppression, cystite hémorragique, infertilité, néoplasies',
        monitoring: 'CBC + ECBU + fonction gonadique',
        notes: 'Réservé aux formes sévères. Option dans la triple thérapie anti-MDA5.'
    },
    'tocilizumab': {
        name: 'Tocilizumab',
        dosage: '8 mg/kg (max 800 mg) toutes les 4 semaines ou 162 mg/semaine SC',
        administration: 'IV ou SC',
        surveillance: 'NFS, transaminases, lipides, recherche tuberculose latente',
        contraindications: ['Infection active', 'Neutropénie <500/mm³'],
        interactions: ['Vaccins vivants', 'Warfarine'],
        sideEffects: 'Infections, cytolyse hépatique, dyslipidémie, neutropénie',
        monitoring: 'CBC + LFT + lipides + QuantiFERON',
        notes: 'Spécifiquement recommandé pour SSc-ILD et MCTD-ILD'
    },
    'nintedanib': {
        name: 'Nintédanib',
        dosage: '150 mg x2/jour (réduction à 100 mg x2 si intolérance)',
        administration: 'Per os, au cours des repas',
        surveillance: 'Transaminases à M1, M3, M6 puis tous les 6 mois',
        contraindications: ['Grossesse', 'Allaitement', 'Hépatopathie sévère'],
        interactions: ['Inhibiteurs CYP3A4', 'Anticoagulants'],
        sideEffects: 'Diarrhée, nausées, cytolyse hépatique, saignements',
        monitoring: 'LFT + fonction rénale',
        notes: 'Antifibrotique, recommandé spécifiquement pour SSc-ILD'
    },
    'jak-inhibitors': {
        name: 'Inhibiteurs JAK',
        dosage: 'Tofacitinib: 5 mg x2/jour, Baricitinib: 2-4 mg/jour',
        administration: 'Per os',
        surveillance: 'NFS, transaminases, lipides, recherche tuberculose',
        contraindications: ['Infection active', 'Lymphopénie <500/mm³'],
        interactions: ['Vaccins vivants', 'Immunosuppresseurs puissants'],
        sideEffects: 'Infections, cytolyse, dyslipidémie, thrombose',
        monitoring: 'CBC + LFT + lipides + QuantiFERON',
        notes: 'Particulièrement efficace dans les IIM-ILD, y compris anti-MDA5.'
    },
    'calcineurin-inhibitors': {
        name: 'Inhibiteurs de la calcineurine',
        dosage: 'Tacrolimus: 0.1-0.2 mg/kg/jour, Ciclosporine: 3-5 mg/kg/jour',
        administration: 'Per os, en 2 prises',
        surveillance: 'Taux résiduels, créatinine, TA, K+',
        contraindications: ['Insuffisance rénale sévère', 'HTA non contrôlée'],
        interactions: ['Nombreuses interactions CYP3A4'],
        sideEffects: 'Néphrotoxicité, HTA, tremblements, hirsutisme',
        monitoring: 'Taux + fonction rénale + ionogramme + TA',
        notes: 'Option majeure pour IIM-ILD, notamment dans la triple thérapie anti-MDA5.'
    },
    'ivig': {
        name: 'IVIg',
        dosage: '0.4-1 g/kg/jour x 5 jours, puis mensuel',
        administration: 'IV lente, surveiller surcharge',
        surveillance: 'Fonction rénale, hémolyse',
        contraindications: ['Déficit IgA avec anticorps anti-IgA', 'Insuffisance cardiaque'],
        interactions: ['Vaccins vivants'],
        sideEffects: 'Réactions perfusion, insuffisance rénale, hémolyse',
        monitoring: 'Fonction rénale + haptoglobine + LDH',
        notes: 'Traitement d\'appoint utile dans les IIM-ILD sévères, y compris anti-MDA5.'
    },
    'methylprednisolone': {
        name: 'Méthylprednisolone IV',
        dosage: '500-1000 mg/jour x 3 jours (bolus), puis relais per os',
        administration: 'IV en 60 min',
        surveillance: 'Glycémie, TA, ionogramme',
        contraindications: ['Infection systémique non contrôlée', 'Ulcère gastroduodénal actif'],
        interactions: ['Anticoagulants', 'Antidiabétiques'],
        sideEffects: 'Hyperglycémie, HTA, troubles hydro-électrolytiques',
        monitoring: 'Glycémie + TA + ionogramme',
        notes: 'Indispensable en induction pour les RP-ILD, notamment anti-MDA5.'
    },
    'glucocorticoids': {
        name: 'Corticoïdes',
        dosage: '0.5-1 mg/kg/jour de prednisone équivalent',
        administration: 'Per os, le matin, en 1 prise',
        surveillance: 'Glycémie, TA, ostéodensitométrie',
        contraindications: ['CONTRE-INDIQUÉS pour SSc-ILD (sauf cas exceptionnels)', 'Ulcère gastroduodénal actif'],
        interactions: ['Nombreuses interactions'],
        sideEffects: 'Ostéoporose, diabète, HTA, infections, crise rénale sclérodermique',
        monitoring: 'Glycémie + TA + ostéodensitométrie',
        notes: 'À utiliser avec prudence. Dose et durée les plus faibles possible. CONTRE-INDICATION RELATIVE FORTE pour SSc-ILD.'
    },
    'pirfenidone': {
        name: 'Pirfénidone',
        dosage: 'Titration jusqu\'à 801 mg x3/jour',
        administration: 'Per os, avec de la nourriture',
        surveillance: 'Transaminases avant, puis mensuellement x6 mois, puis tous les 3 mois',
        contraindications: ['Insuffisance hépatique sévère', 'Insuffisance rénale terminale'],
        interactions: ['Fluvoxamine', 'Ciprofloxacine'],
        sideEffects: 'Photosensibilité, rash, troubles digestifs, anorexie',
        monitoring: 'LFT',
        notes: 'Antifibrotique, option pour la progression de la PID dans la PR.'
    },
    'abatacept': {
        name: 'Abatacept',
        dosage: '125 mg SC hebdomadaire ou IV mensuel (selon poids)',
        administration: 'SC ou IV',
        surveillance: 'Recherche de tuberculose latente',
        contraindications: ['Infection active sévère'],
        interactions: ['Anti-TNF', 'Vaccins vivants'],
        sideEffects: 'Infections (surtout respiratoires), céphalées, nausées',
        monitoring: 'QuantiFERON, clinique',
        notes: 'Option pour PR-PID en première ligne.'
    },
};

export const ABBREVIATIONS: { [key: string]: string } = {
    'PID': 'Pneumopathie Interstitielle Diffuse',
    'ACR': 'American College of Rheumatology',
    'SARD-ILD': 'PID associée à une connectivite (Systemic Autoimmune Rheumatic Disease)',
    'MDA5': 'Melanoma Differentiation-Associated protein 5',
    'PR': 'Polyarthrite Rhumatoïde',
    'SSc': 'Sclérodermie Systémique',
    'IIM': 'Myosite Inflammatoire Idiopathique',
    'MCTD': 'Connectivite Mixte',
    'SjD': 'Syndrome de Sjögren',
    'EFR': 'Explorations Fonctionnelles Respiratoires',
    'CVF': 'Capacité Vitale Forcée',
    'DLCO': 'Capacité de Diffusion du Monoxyde de Carbone',
    'HRCT': 'Scanner Thoracique Haute Résolution (High-Resolution Computed Tomography)',
    'NFS': 'Numération Formule Sanguine',
    'ECBU': 'Examen Cyto-Bactériologique des Urines',
    'LDH': 'Lactate Deshydrogenase',
    'CRP': 'Protéine C-Réactive',
    'MMF': 'Mycophénolate Mofétil',
    'TPMT': 'Thiopurine Méthyltransférase',
    'IVIg': 'Immunoglobulines Intraveineuses',
    'Anti-TNF': 'Anticorps anti-Tumor Necrosis Factor',
};