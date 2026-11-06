import { Project, HistoricalTask, ChangeRequest } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    naam: 'Directie KPI & Financieel Dashboard',
    klant: 'Van Leeuwen Logistiek B.V.',
    contactpersoon: 'Mark de Vries (CFO)',
    email: 'm.devries@vanleeuwen-logistiek.nl',
    uurtarief: 110,
    initieelOfferteUren: 80,
    initieelOfferteBedrag: 8800,
    beschrijvingScope: 'P&L overzicht, omzet per divisie, cashflow prognose gekoppeld aan Exact Online. Maximaal 3 rapportagepagina’s.',
    startDatum: '2025-02-01',
    targetOplevering: '2025-03-15'
  },
  {
    id: 'proj-2',
    naam: 'HR Retentie & Verzuim Monitor',
    klant: 'Stichting ZorgPlus Noord',
    contactpersoon: 'Anouk Bakker (HR Directeur)',
    email: 'a.bakker@zorgplusnoord.nl',
    uurtarief: 105,
    initieelOfferteUren: 65,
    initieelOfferteBedrag: 6825,
    beschrijvingScope: 'Dashboard voor ziekteverzuimpercentage (Bradford-factor) en in-/uitstroom uit AFAS. Inclusief teamleider view.',
    startDatum: '2025-02-10',
    targetOplevering: '2025-03-30'
  },
  {
    id: 'proj-3',
    naam: 'E-Commerce Marketing Attribution Hub',
    klant: 'Nordic Living Retail',
    contactpersoon: 'Sander Vermeulen (Head of Growth)',
    email: 'sander@nordicliving.com',
    uurtarief: 125,
    initieelOfferteUren: 110,
    initieelOfferteBedrag: 13750,
    beschrijvingScope: 'Multi-touch attributie via Shopify, Google Ads en Meta Ads. ROAS en CAC per kanaal in Power BI.',
    startDatum: '2025-01-15',
    targetOplevering: '2025-03-01'
  }
];

export const HISTORICAL_TASKS: HistoricalTask[] = [
  {
    id: 'hist-1',
    titel: 'Exact Online REST API koppeling uitbreiden met Kostenplaatsen',
    categorie: 'Data Koppeling & ETL',
    beschrijving: 'Extra tabellen ophalen, delta synchronisatie configureren en koppelen aan datamodel.',
    geschatteUren: 12,
    werkelijkeUren: 14,
    complexiteit: 'Gemiddeld',
    datum: '2024-11-12'
  },
  {
    id: 'hist-2',
    titel: 'Row-Level Security (RLS) op basis van Vestiging & Regiomanager',
    categorie: 'Autorisatie & RLS',
    beschrijving: 'Rollenmatrix inrichten in Azure AD en Power BI Service met dynamische USERPRINCIPALNAME filters.',
    geschatteUren: 8,
    werkelijkeUren: 7.5,
    complexiteit: 'Gemiddeld',
    datum: '2024-12-04'
  },
  {
    id: 'hist-3',
    titel: 'Geavanceerde LTV prognose met seizoenscorrectie (DAX/SQL)',
    categorie: 'Complexe Metric / DAX / SQL',
    beschrijving: 'Cumulatieve berekeningen met rolling 12 months en cohort grouping in DAX.',
    geschatteUren: 16,
    werkelijkeUren: 18,
    complexiteit: 'Hoog',
    datum: '2024-10-20'
  },
  {
    id: 'hist-4',
    titel: 'Nieuwe detail drill-through pagina voor Factuurregels',
    categorie: 'Nieuwe Dashboard Pagina',
    beschrijving: 'Interactieve tabel met custom conditional formatting, slicers en link naar bronsysteem.',
    geschatteUren: 6,
    werkelijkeUren: 5.5,
    complexiteit: 'Laag',
    datum: '2025-01-08'
  },
  {
    id: 'hist-5',
    titel: 'Wekelijkse geautomatiseerde PDF export per e-mail naar management',
    categorie: 'Automatisering & Export',
    beschrijving: 'Power Automate flow met triggers, dynamische filters per manager en foutafhandeling.',
    geschatteUren: 10,
    werkelijkeUren: 11,
    complexiteit: 'Gemiddeld',
    datum: '2024-11-28'
  },
  {
    id: 'hist-6',
    titel: 'Custom visuals & Corporate Identity theme styling',
    categorie: 'UI/UX & Interactief Redesign',
    beschrijving: 'Aanpassing van alle kleurenpaletten, custom navigatiemenu met bookmarks en micro-interacties.',
    geschatteUren: 7,
    werkelijkeUren: 6.5,
    complexiteit: 'Laag',
    datum: '2024-09-15'
  }
];

export const INITIAL_REQUESTS: ChangeRequest[] = [
  {
    id: 'cr-101',
    projectId: 'proj-1',
    titel: 'Wekelijkse Forecast simulatie met ' + 'what-if sliders',
    klantVraagRuweTekst: 'Mark mailde gisteren: "Kunnen we ook een schuifknop toevoegen waarmee we de transportkosten met 5% tot 15% kunnen verhogen om direct te zien wat dat doet met de brutomarge per vestiging?"',
    categorie: 'Complexe Metric / DAX / SQL',
    status: 'goedgekeurd',
    datumAangemaakt: '2025-02-14',
    datumGoedgekeurd: '2025-02-16',
    geschatteUren: 9.5,
    uurtarief: 110,
    totaalBedrag: 1045,
    onderbouwing: 'Aanmaken van What-If parameter tabellen in Power BI, herstructureren van de marge-metrieken en bouwen van interactieve scenario-kaarten.',
    takenUitsplitsing: [
      { fase: 'Datamodel & Parameters', omschrijving: 'Inrichten disconnected parameter tables & sensitivity sliders', uren: 3 },
      { fase: 'DAX Scenario Logica', omschrijving: 'Aanpassen brutomarge formule met dynamische kostenweging', uren: 4 },
      { fase: 'Visualisatie & Testen', omschrijving: 'Testen met historische scenario uitkomsten en layout', uren: 2.5 }
    ],
    relevanteHistorischeReferenties: ['hist-3 (Geavanceerde LTV prognose)'],
    risicoFactor: 'Gemiddeld',
    doorlooptijdDagen: 4,
    klantContactpersoon: 'Mark de Vries (CFO)',
    klantEmail: 'm.devries@vanleeuwen-logistiek.nl',
    klantHandtekening: 'M. de Vries'
  },
  {
    id: 'cr-102',
    projectId: 'proj-1',
    titel: 'Koppeling met nieuw WMS systeem (Warehouse Management)',
    klantVraagRuweTekst: 'Tijdens de sprint review: "We willen eigenlijk ook direct de pickfout-percentages uit ons WMS (Boltrics) tonen op het directiebord."',
    categorie: 'Data Koppeling & ETL',
    status: 'verzonden',
    datumAangemaakt: '2025-02-18',
    geschatteUren: 15,
    uurtarief: 110,
    totaalBedrag: 1650,
    onderbouwing: 'Vereist een nieuwe API-connector of SQL view naar de Boltrics database, uitbreiding van het ETL-schema en extra KPI-tegels.',
    takenUitsplitsing: [
      { fase: 'Analyse & API Test', omschrijving: 'Authenticatie en endpoints in kaart brengen', uren: 3 },
      { fase: 'ETL Pipeline & Datamodel', omschrijving: 'Data transformatie en koppeling aan tijd-/vestigingsdimensies', uren: 8 },
      { fase: 'Rapportage & Validatie', omschrijving: 'KPI visuals en reconciliatie met brongegevens', uren: 4 }
    ],
    relevanteHistorischeReferenties: ['hist-1 (Exact Online REST API koppeling)'],
    risicoFactor: 'Hoog',
    doorlooptijdDagen: 7,
    klantContactpersoon: 'Mark de Vries (CFO)',
    klantEmail: 'm.devries@vanleeuwen-logistiek.nl'
  },
  {
    id: 'cr-103',
    projectId: 'proj-2',
    titel: 'Rechten per afdelingshoofd (Alleen eigen medewerkers zien)',
    klantVraagRuweTekst: 'Anouk belt: "De directie wil niet dat teamleiders van afdeling Kraamzorg de verzuimcijfers en dossiers zien van afdeling Thuiszorg. Kan dat beveiligd worden?"',
    categorie: 'Autorisatie & RLS',
    status: 'verzonden',
    datumAangemaakt: '2025-02-19',
    geschatteUren: 8,
    uurtarief: 105,
    totaalBedrag: 840,
    onderbouwing: 'Implementatie van Row-Level Security (RLS) binnen het Power BI datamodel gekoppeld aan de AFAS afdelingshiërarchie.',
    takenUitsplitsing: [
      { fase: 'Beveiligingsmatrix', omschrijving: 'Specificeren van rollen en security mapping tabel', uren: 2 },
      { fase: 'DAX Filter Logica', omschrijving: 'Instellen van dynamische filterregels op medewerkersniveau', uren: 3.5 },
      { fase: 'Testen met gebruikers', omschrijving: 'Testen als verschillende rollen in Power BI Service', uren: 2.5 }
    ],
    relevanteHistorischeReferenties: ['hist-2 (Row-Level Security)'],
    risicoFactor: 'Laag',
    doorlooptijdDagen: 3,
    klantContactpersoon: 'Anouk Bakker (HR Directeur)',
    klantEmail: 'a.bakker@zorgplusnoord.nl'
  }
];
