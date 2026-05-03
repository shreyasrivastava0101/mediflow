// AI Triage Mock Controller
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, severity, duration, age } = req.body;
    
    // Deterministic Mock Logic based on keywords
    let urgency = 'Low';
    let specialist = 'General Physician';
    let confidence = 85;
    let explanation = 'Based on your symptoms, a standard consultation is recommended.';

    const symptomStr = symptoms.join(' ').toLowerCase();

    if (symptomStr.includes('chest pain') || symptomStr.includes('heart')) {
      urgency = 'Critical';
      specialist = 'Cardiologist';
      confidence = 94;
      explanation = 'Chest pain indicates a possible cardiac event. Immediate medical attention is required.';
    } else if (symptomStr.includes('breath') || symptomStr.includes('asthma')) {
      urgency = 'High';
      specialist = 'Pulmonologist';
      confidence = 89;
      explanation = 'Respiratory distress detected. Please seek a pulmonologist promptly.';
    } else if (symptomStr.includes('fever') && severity >= 7) {
      urgency = 'Medium';
      specialist = 'General Physician';
      confidence = 92;
      explanation = 'High fever suggests an acute infection. Standard medical evaluation is advised.';
    } else if (symptomStr.includes('headache') || symptomStr.includes('migraine')) {
      urgency = severity > 8 ? 'High' : 'Low';
      specialist = 'Neurologist';
      confidence = 88;
      explanation = severity > 8 ? 'Severe neurological symptoms require immediate check.' : 'Standard headache. Rest and hydration recommended.';
    }

    if (age > 65 && urgency !== 'Critical') {
      urgency = 'High';
      confidence -= 5;
      explanation += ' Elevated urgency due to patient age factor.';
    }

    res.status(200).json({
      success: true,
      data: {
        urgency,
        specialist,
        confidence,
        explanation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
