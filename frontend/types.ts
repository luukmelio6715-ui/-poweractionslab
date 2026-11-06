export type RequestStatus = 'concept' | 'verzonden' | 'goedgekeurd' | 'afgewezen';

export type TaskCategory = 
  | 'Data Koppeling & ETL'
  | 'Complexe Metric / DAX / SQL'
  | 'Nieuwe Dashboard Pagina'
  | 'Autorisatie & RLS'
  | 'Automatisering & Export'
  | 'UI/UX & Interactief Redesign'
  | 'Overig Meerwerk';

export interface HistoricalTask {
  id: string;
  titel: string;
  categorie: TaskCategory;
  beschrijving: string;
  geschatteUren: number;
  werkelijkeUren: number;
  complexiteit: 'Laag' | 'Gemiddeld' | 'Hoog';
  datum: string;
}

export interface TaskBreakdownItem {
  fase: string;
  omschrijving: string;
  uren: number;
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  titel: string;
  klantVraagRuweTekst: string;
  categorie: TaskCategory;
  status: RequestStatus;
  datumAangemaakt: string;
  datumGoedgekeurd?: string;
  geschatteUren: number;
  uurtarief: number;
  totaalBedrag: number;
  onderbouwing: string;
  takenUitsplitsing: TaskBreakdownItem[];
  relevanteHistorischeReferenties: string[];
  risicoFactor: 'Laag' | 'Gemiddeld' | 'Hoog';
  doorlooptijdDagen: number;
  klantContactpersoon: string;
  klantEmail: string;
  klantOpmerkingen?: string;
  klantHandtekening?: string;
}

export interface Project {
  id: string;
  naam: string;
  klant: string;
  contactpersoon: string;
  email: string;
  uurtarief: number;
  initieelOfferteUren: number;
  initieelOfferteBedrag: number;
  beschrijvingScope: string;
  startDatum: string;
  targetOplevering: string;
}

export interface EstimationResult {
  geschatteUren: number;
  urenMin: number;
  urenMax: number;
  onderbouwing: string;
  takenUitsplitsing: TaskBreakdownItem[];
  relevanteHistorischeReferenties: string[];
  risicoFactor: 'Laag' | 'Gemiddeld' | 'Hoog';
  doorlooptijdDagen: number;
  geadviseerdeKlantTekst: string;
}
