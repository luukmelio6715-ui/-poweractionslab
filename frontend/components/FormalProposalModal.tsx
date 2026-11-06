import React, { useState } from 'react';
import { ChangeRequest, Project } from '../types';
import { 
  Printer, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building, 
  User, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Copy, 
  Check, 
  Download
} from 'lucide-react';

interface FormalProposalModalProps {
  request: ChangeRequest;
  project: Project | undefined;
  onClose: () => void;
  onApproveDirectly?: (signatureName: string) => void;
}

export const FormalProposalModal: React.FC<FormalProposalModalProps> = ({
  request,
  project,
  onClose,
  onApproveDirectly
}) => {
  const [copied, setCopied] = useState(false);

  // Compute financial totals
  const subtotal = request.totaalBedrag;
  const vatRate = 0.21;
  const vatAmount = Math.round(subtotal * vatRate);
  const totalInclVat = subtotal + vatAmount;

  // Calculate validity date (14 days after creation date)
  const createdDate = new Date(request.datumAangemaakt || Date.now());
  const validityDateObj = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  const validityDateStr = validityDateObj.toISOString().split('T')[0];

  const proposalNumber = `OFF-${request.id.replace('cr-', '').toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textSummary = `FORMELE MEERWERKOFFERTE ${proposalNumber}
Project: ${project?.naam || 'Dashboard Project'}
Opdrachtgever: ${project?.klant} (${request.klantContactpersoon})
Onderwerp: ${request.titel}
Geldigheidstermijn: Tot ${validityDateStr}

Berekende Uren: ${request.geschatteUren} uur
Uurtarief: €${request.uurtarief}/uur
Totaalbedrag: €${subtotal.toLocaleString('nl-NL')} excl. btw (€${totalInclVat.toLocaleString('nl-NL')} incl. btw)
Verwachte Doorlooptijd: ${request.doorlooptijdDagen} werkdagen

Scope Afbakening:
${request.onderbouwing}
`;
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto p-2 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between bg-white/95 px-4 py-3 rounded-2xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Sluiten</span>
            </button>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
              Formele Meerwerkofferte #{proposalNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-medium transition"
              title="Kopieer samenvatting"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Gekopieerd!' : 'Kopieer Samenvatting'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-xl shadow-sm transition hover:shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Afdrukken / Exporteer als PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Quotation Document Paper */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 print:border-none print:shadow-none print:rounded-none p-6 sm:p-10 lg:p-12 space-y-8 text-slate-900 font-sans">
          
          {/* Header & Company Brand */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-8 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">ScopeCraft Analytics</h1>
                  <p className="text-xs text-slate-500">Business Intelligence & Dashboard Architecture</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                <p>ScopeCraft B.V. • Data & BI Consultancy</p>
                <p>KvK: 84920194 • BTW: NL863412098B01</p>
                <p>E-mail: projects@scopecraft-bi.nl</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-800 uppercase tracking-wider">
                Offerte Meerwerk
              </div>
              <div className="text-lg font-black text-slate-900 font-mono mt-1">
                {proposalNumber}
              </div>
              <div className="text-xs text-slate-600">
                <p>Offertedatum: <span className="font-semibold text-slate-800">{request.datumAangemaakt}</span></p>
                <p>
                  Geldig t/m:{' '}
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {validityDateStr} (14 dagen)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Client & Project Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px] block">
                Opdrachtgever:
              </span>
              <p className="font-bold text-slate-900 text-sm">{project?.klant}</p>
              <p className="text-slate-700">T.a.v. {request.klantContactpersoon}</p>
              <p className="text-slate-500">{request.klantEmail}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px] block">
                Betrokken Dashboard Project:
              </span>
              <p className="font-bold text-slate-900 text-sm">{project?.naam}</p>
              <p className="text-slate-600">
                Oorspronkelijk urenbudget:{' '}
                <span className="font-semibold text-slate-800">{project?.initieelOfferteUren} uur</span>
              </p>
              <p className="text-slate-600">
                Uurtarief conform raamovereenkomst:{' '}
                <span className="font-semibold text-slate-800">€{request.uurtarief}/uur excl. btw</span>
              </p>
            </div>
          </div>

          {/* Scope Demarcation: Baseline vs. Ad-hoc Change */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <span>1. Scope-Afbakening & Aanleiding Meerwerk</span>
            </h2>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3.5 bg-slate-100 rounded-xl border-l-4 border-slate-400">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Initiële Baseline Scope (Vaste Offerte):
                </span>
                <p className="mt-0.5 text-slate-600">{project?.beschrijvingScope}</p>
              </div>

              <div className="p-3.5 bg-indigo-50/80 rounded-xl border-l-4 border-indigo-600">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider">
                    Nieuwe Aanvullende Klantvraag:
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {request.categorie}
                  </span>
                </div>
                <p className="mt-1 font-semibold text-slate-900 italic">
                  "{request.klantVraagRuweTekst}"
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-semibold text-slate-900 block">
                  Technische onderbouwing van de scope-uitbreiding:
                </span>
                <p className="text-slate-600">{request.onderbouwing}</p>
              </div>

              {/* What is in scope vs out of scope pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-900 block text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inbegrepen in deze meerwerkofferte:</span>
                  </span>
                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                    <li>Realisatie van de gevraagde {request.titel}</li>
                    <li>Datamodel, ETL en berekeningen conform de fasespecificatie</li>
                    <li>Validatie en datareconciliatie met de brondata</li>
                    <li>Overdracht en documentatie in het dashboard</li>
                  </ul>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block text-[11px] flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Niet inbegrepen (Buiten deze scope):</span>
                  </span>
                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                    <li>Aanpassingen in bronsystemen van derden of API upgrades</li>
                    <li>Niet-gespecificeerde additionele dashboardpagina's</li>
                    <li>Historische datacorrecties buiten de projectperiode</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Hours Breakdown Table */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <span>2. Uitsplitsing van de Werkzaamheden & Uren</span>
            </h2>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Fase / Onderdeel</th>
                    <th className="p-3">Omschrijving Werkzaamheden</th>
                    <th className="p-3 text-right">Uren</th>
                    <th className="p-3 text-right">Tarief</th>
                    <th className="p-3 text-right">Totaal (excl. btw)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {request.takenUitsplitsing.map((item, idx) => {
                    const itemCost = Math.round(item.uren * request.uurtarief);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{item.fase}</td>
                        <td className="p-3 text-slate-600">{item.omschrijving}</td>
                        <td className="p-3 text-right font-bold">{item.uren} u</td>
                        <td className="p-3 text-right text-slate-500">€{request.uurtarief}</td>
                        <td className="p-3 text-right font-semibold">€{itemCost.toLocaleString('nl-NL')}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-semibold border-t border-slate-200 text-xs">
                  <tr>
                    <td colSpan={2} className="p-3 text-slate-700">Subtotaal Berekend Meerwerk</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">{request.geschatteUren} u</td>
                    <td className="p-3 text-right text-slate-400">-</td>
                    <td className="p-3 text-right font-bold text-slate-900">€{subtotal.toLocaleString('nl-NL')}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-2.5 text-right text-slate-500">BTW (21%)</td>
                    <td className="p-2.5 text-right text-slate-600 font-medium">€{vatAmount.toLocaleString('nl-NL')}</td>
                  </tr>
                  <tr className="bg-indigo-50/70 border-t border-indigo-200 text-indigo-950 font-black text-sm">
                    <td colSpan={4} className="p-3.5 text-right uppercase tracking-wider">Totaal Investering (incl. BTW)</td>
                    <td className="p-3.5 text-right text-indigo-700 font-extrabold">€{totalInclVat.toLocaleString('nl-NL')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 3: Delivery Timeline & Validity Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                3. Doorlooptijd & Planning:
              </span>
              <p className="text-slate-600">
                Verwachte doorlooptijd: <strong className="text-slate-900">{request.doorlooptijdDagen} werkdagen</strong> na ontvangst van akkoord.
              </p>
              <p className="text-slate-500 text-[11px]">
                De werkzaamheden worden direct meegenomen in de eerstvolgende sprint zonder vertraging van de reeds goedgekeurde hoofdmilestones.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                4. Geldigheid & Voorwaarden:
              </span>
              <p className="text-slate-600">
                Deze offerte is geldig tot en met <strong className="text-indigo-700">{validityDateStr}</strong>.
              </p>
              <p className="text-slate-500 text-[11px]">
                Facturatie geschiedt op nacalculatie op basis van de daadwerkelijk goedgekeurde werkzaamheden met een maximum van het geaccordeerde urenplafond.
              </p>
            </div>
          </div>

          {/* Section 5: Formal Sign-off & Acceptance Declaration */}
          <div className="pt-4 border-t-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                5. Formele Akkoordverklaring Opdrachtgever
              </h2>
              {request.status === 'goedgekeurd' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digitaal Geaccordeerd</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ondergetekende verklaart bevoegd te zijn namens <strong>{project?.klant}</strong> en geeft hierbij formeel
              opdracht tot uitvoering van het bovenomschreven meerwerk voor een bedrag van{' '}
              <strong>€{subtotal.toLocaleString('nl-NL')} excl. btw</strong> ({request.geschatteUren} uren).
            </p>

            {/* Signature Blocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Client Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                  Voor Akkoord: {project?.klant}
                </span>
                
                <div>
                  <span className="text-slate-500 text-[11px] block">Naam gemachtigde:</span>
                  <span className="font-semibold text-slate-800 block text-sm">
                    {request.klantHandtekening || request.klantContactpersoon}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Datum akkoord:</span>
                  <span className="font-semibold text-slate-800">
                    {request.datumGoedgekeurd || request.datumAangemaakt}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 text-[11px] block mb-1">Digitale handtekening / akkoord:</span>
                  {request.status === 'goedgekeurd' ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-mono font-bold text-xs flex items-center justify-between">
                      <span>✓ Digitaal getekend: {request.klantHandtekening || request.klantContactpersoon}</span>
                      <span className="text-[10px] text-emerald-700">{request.datumGoedgekeurd}</span>
                    </div>
                  ) : (
                    <div className="h-12 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1 text-slate-400 text-[11px]">
                      (Handtekening / 1-klik digitaal akkoord via portaal)
                    </div>
                  )}
                </div>
              </div>

              {/* ScopeCraft Consultant Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                  Voor Opdrachtnemer: ScopeCraft B.V.
                </span>

                <div>
                  <span className="text-slate-500 text-[11px] block">Lead Dashboard Architect:</span>
                  <span className="font-semibold text-slate-800 block text-sm">
                    L. van den Berg (Senior BI Lead)
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Datum opstelling:</span>
                  <span className="font-semibold text-slate-800">{request.datumAangemaakt}</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 text-[11px] block mb-1">Status offerte:</span>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-700 flex items-center justify-between">
                    <span>Gevalideerd op historische projectdata</span>
                    <span className="text-indigo-600 font-bold">ScopeCraft Guard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note on print */}
          <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-100">
            Document gegenereerd door ScopeCraft Scope Management • Offerte #{proposalNumber} • Pagina 1 van 1
          </div>
        </div>
      </div>
    </div>
  );
};
