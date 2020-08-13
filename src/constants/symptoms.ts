export const symptoms = [
  'fatigue',
  'aches',
  'headache',
  'throat',
  'congestion',
  'nausea',
  'diarrhea',
  'fever',
  'cough',
  'breath',
  'taste'
] as const;

export type SymptomsCheckResult =
  | 'noSymptomsFeelingWell'
  | 'noSymptomsNotFeelingWell'
  | 'riskGroup'
  | 'coronavirus';

export const symptomsByPage = [symptoms];

// Derives restricted string type from array: 'fever' | 'cough' | etc
export type Symptom = typeof symptoms[number];

// Object like { fever: 0, cough: 1, ...etc }
export type SymptomRecord = Record<Symptom, 0 | 1>;

export const emptySymptomRecord: SymptomRecord = symptoms.reduce(
  (symptomRecord, symptom: Symptom) => ({...symptomRecord, [symptom]: 0}),
  {} as SymptomRecord
);
