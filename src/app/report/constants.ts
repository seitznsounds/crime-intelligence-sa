export const PERSON_CATEGORIES = [
    "Drug Dealing / Trafficking",
    "Murder / Attempted Murder",
    "SAPS Corruption & Brutality",
    "Political Bribery & Influence",
    "Robbery / Hijacking",
    "Extortion / Protection Rackets",
    "Fraud / Identity Theft",
    "Human Trafficking",
    "Domestic Violence / Abuse",
    "Illegal Firearm Possession",
    "Sexual Offences",
    "Municipal Tender Fraud",
    "Other Criminal Activity"
];

export const ORG_CATEGORIES = [
    "Drug Syndicate / Distribution Network",
    "Gang Activity / Territorial Violence",
    "Organised Hijacking Ring",
    "Tender Fraud / State Capture",
    "Money Laundering / Shell Companies",
    "Human Trafficking Network",
    "Illegal Mining / Zama Zama",
    "Extortion / Protection Rackets",
    "Illegal Firearms Trade",
    "Taxi Violence / Taxi Mafia",
    "Chop Shop / Stolen Vehicle Ring",
    "Other Criminal Activity"
];

export const CATEGORY_WEIGHTS: Record<string, { base: number; increment: number }> = {
    "Political Bribery & Influence": { base: 40, increment: 10 },
    "SAPS Corruption & Brutality": { base: 35, increment: 8 },
    "Municipal Tender Fraud": { base: 35, increment: 8 },
    "Tender Fraud / State Capture": { base: 40, increment: 10 },
    "Money Laundering / Shell Companies": { base: 38, increment: 9 },
    "Drug Dealing / Trafficking": { base: 30, increment: 6 },
    "Drug Syndicate / Distribution Network": { base: 35, increment: 7 },
    "Murder / Attempted Murder": { base: 35, increment: 8 },
    "Human Trafficking": { base: 40, increment: 10 },
    "Human Trafficking Network": { base: 40, increment: 10 },
    "Gang Activity / Territorial Violence": { base: 30, increment: 6 },
    "Robbery / Hijacking": { base: 28, increment: 5 },
    "Organised Hijacking Ring": { base: 30, increment: 6 },
    "Extortion / Protection Rackets": { base: 30, increment: 6 },
    "Fraud / Identity Theft": { base: 25, increment: 5 },
    "Domestic Violence / Abuse": { base: 25, increment: 5 },
    "Illegal Firearm Possession": { base: 28, increment: 5 },
    "Illegal Firearms Trade": { base: 30, increment: 6 },
    "Sexual Offences": { base: 30, increment: 7 },
    "Illegal Mining / Zama Zama": { base: 28, increment: 5 },
    "Taxi Violence / Taxi Mafia": { base: 30, increment: 6 },
    "Chop Shop / Stolen Vehicle Ring": { base: 28, increment: 5 },
    "Other Criminal Activity": { base: 20, increment: 5 }
};
