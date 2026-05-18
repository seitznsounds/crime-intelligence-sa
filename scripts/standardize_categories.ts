export const STANDARD_CRIME_CATEGORIES = [
  'Gang Violence',
  'Drug Trafficking',
  'Cash-in-Transit (CIT)',
  'Extortion',
  'Mass Shooting',
  'Kidnapping',
  'Vehicle Hijacking',
  'Corruption/Police Involvement',
  'Illegal Mining'
];

export function mapToStandardCategory(title: string, fullText: string): string | null {
  const lowercaseTitle = title.toLowerCase();
  const lowercaseFullText = fullText.toLowerCase();
  
  // Rejection List (Only check against TITLE to avoid news site footer matches)
  const rejectionKeywords = [
    'opinionista', 'broken pipes', 'safest province', 'drop in crime',
    'fresh start', 'interview', 'tribute', 'biography', 'personality traits',
    'national dialogue', 'state of the nation', 'parliamentary', 'policy debate',
    'judge president', 'judicial', 'appoints', 'nomination', 'official opening',
    'weather warning', 'sport', 'match', 'score', 'festival', 'celebration'
  ];

  const matchedReject = rejectionKeywords.find(kw => lowercaseTitle.includes(kw));
  if (matchedReject) {
    console.log(`    [DEBUG] Rejected by keyword "${matchedReject}" found in title.`);
    return null;
  }

  // Combined text for mapping
  const combined = `${lowercaseTitle} ${lowercaseFullText}`;

  // Mapping
  if (combined.includes('gang hit') || combined.includes('gang violence') || combined.includes('gang-related')) return 'Gang Violence';
  if (combined.includes('drug bust') || combined.includes('drug trafficking') || (combined.includes('seized') && (combined.includes('cocaine') || combined.includes('mandrax') || combined.includes('heroin')))) return 'Drug Trafficking';
  if (combined.includes('cash-in-transit') || combined.includes('cit heist') || combined.includes('cit robbery') || combined.includes('cash heist')) return 'Cash-in-Transit (CIT)';
  if (combined.includes('extortion') || combined.includes('protection fee') || combined.includes('construction mafia')) return 'Extortion';
  if (combined.includes('mass shooting') || combined.includes('multiple shot dead') || combined.includes('family massacre')) return 'Mass Shooting';
  if (combined.includes('kidnapped') || combined.includes('kidnapping') || combined.includes('abducted')) return 'Kidnapping';
  if (combined.includes('hijacking') || (combined.includes('hijacked') && (combined.includes('car') || combined.includes('truck') || combined.includes('vehicle')))) return 'Vehicle Hijacking';
  if ((combined.includes('corrupt') || combined.includes('bribe') || (combined.includes('saps') && combined.includes('arrested')))) return 'Corruption/Police Involvement';
  if (combined.includes('zama zama') || combined.includes('illegal mining')) return 'Illegal Mining';
  
  return null;
}
