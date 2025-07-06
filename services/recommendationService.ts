import type { PatientData, RecommendedTreatment, Recommendation, RiskLevel, AntiMDA5PrognosticAssessment } from '../types';
import { CONNECTIVITE_TYPES, TREATMENT_DATABASE } from '../constants';
import { 
    AlertTriangle, CheckCircle, XCircle, Clock, FileText, 
    Activity, Heart, Stethoscope
} from '../components/icons';

export const getAntiMDA5PrognosticAssessment = (patientData: PatientData): AntiMDA5PrognosticAssessment | null => {
    if (patientData.connectiviteType !== 'IIM' || (patientData.antiMDA5Status !== 'confirmed' && patientData.antiMDA5Status !== 'suspected')) {
        return null;
    }

    const riskFactors: string[] = [];
    let riskScore = 0;

    const highRiskManifestations = [
      'Progression respiratoire rapide (<3 mois)',
      'Ulcérations cutanées',
    ];

    const presentHighRisk = patientData.antiMDA5Manifestations.filter(m => 
      highRiskManifestations.includes(m)
    );

    if (presentHighRisk.length > 0) {
      riskScore += presentHighRisk.length * 2;
      riskFactors.push(`Manifestations à haut risque (${presentHighRisk.join(', ')})`);
    }

    const ferritin = parseFloat(patientData.ferritin);
    if (!isNaN(ferritin) && ferritin > 1500) {
      riskScore += 2;
      riskFactors.push(`Hyperferritinémie > 1500 ng/mL (valeur: ${ferritin})`);
    } else if (!isNaN(ferritin) && ferritin > 500) {
      riskScore += 1;
      riskFactors.push(`Hyperferritinémie > 500 ng/mL (valeur: ${ferritin})`);
    }

    const age = parseFloat(patientData.age);
    if (!isNaN(age) && age > 60) {
      riskScore += 1;
      riskFactors.push('Âge > 60 ans');
    }

    if (patientData.pidStatus === 'rapid-progressive') {
      riskScore += 3;
      riskFactors.push('PID rapidement progressive');
    }

    let prognosticLevel: 'Très mauvais' | 'Mauvais' | 'Réservé' | 'Bon';
    let prognosticColor: string;
    let recommendations: string[];

    if (riskScore >= 6) {
      prognosticLevel = 'Très mauvais';
      prognosticColor = 'bg-red-200 text-red-900';
      recommendations = [
        'Triple thérapie d\'emblée URGENTE', 'Admission en soins intensifs ou unité de surveillance continue', 'Discuter transplantation pulmonaire en urgence',
      ];
    } else if (riskScore >= 4) {
      prognosticLevel = 'Mauvais';
      prognosticColor = 'bg-red-100 text-red-800';
      recommendations = [ 'Triple thérapie fortement recommandée', 'Hospitalisation pour initiation du traitement', 'Référence pneumologique IMMÉDIATE', ];
    } else if (riskScore >= 2) {
      prognosticLevel = 'Réservé';
      prognosticColor = 'bg-orange-100 text-orange-800';
      recommendations = [ 'Double/Triple thérapie à discuter', 'Surveillance très rapprochée (hebdomadaire)', 'Référence pneumologique rapide', ];
    } else {
      prognosticLevel = 'Bon';
      prognosticColor = 'bg-yellow-100 text-yellow-800';
      recommendations = [ 'Traitement de fond (ex: MMF)', 'Surveillance rapprochée (mensuelle)', 'Éduquer le patient sur les signes d\'alerte', ];
    }

    return {
      riskScore,
      riskFactors,
      prognosticLevel,
      prognosticColor,
      recommendations,
      mortalityRisk: riskScore >= 6 ? '> 50%' : riskScore >= 4 ? '30-50%' : riskScore >= 2 ? '10-30%' : '< 10%',
    };
};


export const getRiskLevel = (patientData: PatientData): { level: RiskLevel; color: string; icon: React.FC<{className?: string}>; } => {
    const connectiviteInfo = CONNECTIVITE_TYPES.find(s => s.value === patientData.connectiviteType);
    
    // Start with the count of manually checked risk factors
    let riskFactorCount = patientData.riskFactors.length;
    const age = parseFloat(patientData.age);

    // Automatically add age as a risk factor if applicable
    if (!isNaN(age) && age > 50) {
        riskFactorCount++;
    }

    const symptomCount = patientData.currentSymptoms.length;
    
    if (connectiviteInfo?.risk === 'élevé' || riskFactorCount >= 3 || symptomCount >= 2 || (patientData.connectiviteType === 'IIM' && patientData.antiMDA5Status === 'confirmed')) {
      return { level: 'élevé', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (connectiviteInfo?.risk === 'modéré' || riskFactorCount >= 1 || symptomCount >= 1) {
      return { level: 'modéré', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }
    return { level: 'faible', color: 'bg-green-100 text-green-800', icon: CheckCircle };
};

export const getScreeningRecommendations = (patientData: PatientData): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    if (patientData.connectiviteType) {
        recommendations.push({
            test: 'EFR (Explorations Fonctionnelles Respiratoires)',
            recommendation: 'Recommandé conditionnellement',
            level: 'conditional-for', icon: Activity,
            description: 'Mesure de la CVF et de la DLCO pour quantifier l\'atteinte fonctionnelle.'
        });
        recommendations.push({
            test: 'HRCT thoracique',
            recommendation: 'Recommandé conditionnellement',
            level: 'conditional-for', icon: FileText,
            description: 'Examen clé pour détecter et caractériser les anomalies interstitielles.'
        });
        recommendations.push({
            test: 'HRCT + EFR combinés',
            recommendation: 'Fortement recommandé',
            level: 'strong-for', icon: CheckCircle,
            description: 'Approche combinée pour une meilleure sensibilité et une évaluation complète.'
        });
    }
    return recommendations;
};

const getEFRFrequency = (patientData: PatientData): string => {
    if (patientData.connectiviteType === 'IIM' || patientData.connectiviteType === 'SSc') {
        return 'Tous les 3-6 mois la première année, puis si stable.';
    }
    return 'Tous les 6-12 mois la première année, puis si stable.';
};

export const getMonitoringRecommendations = (patientData: PatientData): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    if (patientData.hasPID) {
        recommendations.push({
            test: 'EFR de suivi',
            recommendation: 'Recommandé conditionnellement',
            level: 'conditional-for', icon: Activity,
            frequency: getEFRFrequency(patientData),
            description: 'Surveillance de l\'évolution de la fonction pulmonaire (CVF, DLCO).'
        });
        recommendations.push({
            test: 'HRCT de suivi',
            recommendation: 'Recommandé conditionnellement',
            level: 'conditional-for', icon: FileText,
            frequency: 'À 1-2 ans si stable, ou si dégradation clinique/fonctionnelle.',
            description: 'Surveillance des modifications structurales pulmonaires.'
        });
        recommendations.push({
            test: 'Test de marche de 6 minutes',
            recommendation: 'Recommandé conditionnellement',
            level: 'conditional-for', icon: Heart,
            frequency: 'Tous les 6-12 mois',
            description: 'Évaluation de la tolérance à l\'effort et de la désaturation.'
        });
    }
    return recommendations;
};

export const getRecommendedTreatment = (patientData: PatientData): RecommendedTreatment | null => {
    const { connectiviteType, pidStatus, antiMDA5Status } = patientData;
    const antiMDA5Assessment = getAntiMDA5PrognosticAssessment(patientData);
    if (!connectiviteType || !pidStatus) return null;

    if (pidStatus === 'rapid-progressive') {
      const isAntiMDA5 = antiMDA5Status === 'confirmed' || antiMDA5Status === 'suspected';
      let urgencyLevel: RecommendedTreatment['urgencyLevel'] = 'high';
      if (isAntiMDA5) urgencyLevel = 'critical';
      if (antiMDA5Assessment && antiMDA5Assessment.riskScore >= 6) urgencyLevel = 'extreme';

      const combinationText = isAntiMDA5
          ? "Triple thérapie (corticoïdes + 2 autres agents) recommandée d'emblée."
          : "Thérapie combinée (double ou triple) recommandée par rapport à une monothérapie.";

      return {
        primary: 'methylprednisolone',
        secondary: ['rituximab', 'cyclophosphamide', 'calcineurin-inhibitors', 'jak-inhibitors', 'ivig'],
        combinationText,
        referral: "Orientation précoce pour évaluation en vue d'une transplantation pulmonaire.",
        urgency: true,
        urgencyLevel: urgencyLevel,
        antiMDA5Specific: isAntiMDA5,
      };
    }
    
    if (pidStatus === 'progression') {
        let options: string[] = [];
        let glucocorticoidsNote: RecommendedTreatment['glucocorticoidsNote'] = 'conditional-against';
        let referral: string | undefined = "Orientation pour une évaluation en vue d'une transplantation pulmonaire.";

        switch (connectiviteType) {
            case 'SSc':
                options = ['mycophenolate', 'rituximab', 'nintedanib', 'tocilizumab', 'cyclophosphamide'];
                glucocorticoidsNote = 'strong-against';
                referral = "Orientation vers un centre expert pour discuter d'une greffe de cellules souches (AHSCT) ET évaluation pour transplantation pulmonaire.";
                break;
            case 'IIM':
                options = ['mycophenolate', 'rituximab', 'calcineurin-inhibitors', 'nintedanib', 'cyclophosphamide', 'ivig', 'jak-inhibitors'];
                break;
            case 'MCTD':
                options = ['mycophenolate', 'rituximab', 'nintedanib', 'tocilizumab', 'cyclophosphamide', 'ivig'];
                break;
            case 'RA':
                options = ['mycophenolate', 'rituximab', 'nintedanib', 'tocilizumab', 'cyclophosphamide', 'pirfenidone'];
                break;
            case 'SjD':
                options = ['mycophenolate', 'rituximab', 'nintedanib', 'cyclophosphamide'];
                break;
            default:
              return null;
        }

        const currentMedicationKeys = Object.entries(TREATMENT_DATABASE)
            .filter(([, treatment]) => patientData.currentMedications.includes(treatment.name))
            .map(([key]) => key);

        const availableOptions = options.filter(opt => !currentMedicationKeys.includes(opt));
        
        const finalOptions = availableOptions.length > 0 ? availableOptions : options;

        return {
            primary: finalOptions[0],
            alternatives: finalOptions.slice(1),
            urgency: false,
            glucocorticoidsNote: glucocorticoidsNote,
            referral,
            antiMDA5Specific: (connectiviteType === 'IIM' && (antiMDA5Status === 'confirmed' || antiMDA5Status === 'suspected')),
        };
    }

    if (connectiviteType === 'IIM' && (antiMDA5Status === 'confirmed' || antiMDA5Status === 'suspected') && pidStatus === 'stable') {
      return {
          primary: 'mycophenolate',
          alternatives: ['calcineurin-inhibitors', 'rituximab', 'jak-inhibitors'],
          additional: ['glucocorticoids'],
          urgency: false,
          enhanced: true,
          antiMDA5Specific: true,
          monitoring: 'intensive',
      };
    }

    const firstLineOptions: { [key: string]: RecommendedTreatment } = {
        'SSc': { primary: 'mycophenolate', alternatives: ['nintedanib', 'cyclophosphamide', 'tocilizumab', 'rituximab'], contraindicated: ['glucocorticoids'], urgency: false },
        'IIM': { primary: 'mycophenolate', alternatives: ['azathioprine', 'rituximab', 'calcineurin-inhibitors', 'jak-inhibitors'], additional: ['glucocorticoids'], urgency: false },
        'RA': { primary: 'mycophenolate', alternatives: ['azathioprine', 'rituximab', 'cyclophosphamide'], additional: ['glucocorticoids'], urgency: false },
        'MCTD': { primary: 'mycophenolate', alternatives: ['azathioprine', 'rituximab', 'cyclophosphamide', 'tocilizumab'], additional: ['glucocorticoids'], urgency: false },
        'SjD': { primary: 'mycophenolate', alternatives: ['azathioprine', 'rituximab', 'cyclophosphamide'], additional: ['glucocorticoids'], urgency: false }
    };

    return firstLineOptions[connectiviteType] || null;
};

export const checkContraindications = (patientData: PatientData, treatmentKey: string): string[] => {
    const treatment = TREATMENT_DATABASE[treatmentKey];
    if (!treatment) return [];
    
    const patientContras = patientData.contraindications;
    const treatmentContras = treatment.contraindications;
    
    return treatmentContras.filter(contra => 
        patientContras.some(pc => pc.toLowerCase().includes(contra.toLowerCase()))
    );
};