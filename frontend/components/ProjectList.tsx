import React from 'react';
import { Project, ChangeRequest } from '../types';
import { 
  CheckCircle2, 
  Send, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight, 
  FileText, 
  UserCheck, 
  Calendar, 
  ThumbsUp, 
  Printer
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  requests: ChangeRequest[];
  onOpenRequestDetail: (req: ChangeRequest) => void;
  onOpenNewRequestForProject: (projectId: string) => void;
  onOpenClientApproval: (req: ChangeRequest) => void;
  onOpenFormalProposal: (req: ChangeRequest) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  requests,
  onOpenRequestDetail,
  onOpenNewRequestForProject,
  onOpenClientApproval,
  onOpenFormalProposal
}) => {
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const projectRequests = requests.filter((r) => r.projectId === currentProject.id);

  // Metrics
  const approvedHours = projectRequests
    .filter((r) => r.status === 'goedgekeurd')
    .reduce((acc, curr) => acc + curr.geschatteUren, 0);

  const pendingHours = projectRequests
    .filter((r) => r.status === 'verzonden' || r.status === 'concept')
    .reduce((acc, curr) => acc + curr.geschatteUren, 0);

  const approvedRevenue = approvedHours * currentProject.uurtarief;
  const pendingRevenue = pendingHours * currentProject.uurtarief;

  const totalCommittedHours = currentProject.initieelOfferteUren + approvedHours;
  const totalForecastHours = totalCommittedHours + pendingHours;

  return (
    <div className="space-y-6">
      {/* Project Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
          Dashboard Projecten:
        </span>
        {projects.map((proj) => {
          const isSelected = proj.id === currentProject.id;
          const countPending = requests.filter(
            (r) => r.projectId === proj.id && r.status === 'verzonden'
          ).length;

          return (
            <button
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{proj.naam}</span>
              {countPending > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {countPending} wachtend
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Project Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentProject.naam}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Klant: {currentProject.klant}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              <span className="font-semibold text-slate-700">Oorspronkelijke scope:</span>{' '}
              {currentProject.beschrijvingScope}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right text-xs text-slate-500 hidden sm:block">
              <div>Contact: <span className="font-medium text-slate-700">{currentProject.contactpersoon}</span></div>
              <div>Uurtarief: <span className="font-semibold text-slate-900">€{currentProject.uurtarief}/uur</span></div>
            </div>
            <button
              onClick={() => onOpenNewRequestForProject(currentProject.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center space-x-1.5"
            >
              <span>+ Nieuwe Klantvraag</span>
            </button>
          </div>
        </div>

        {/* Financial & Hours Budget Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Initiële Offerte
            </span>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-slate-900">
                {currentProject.initieelOfferteUren} u
              </span>
              <span className="text-xs text-slate-500">
                (€{currentProject.initieelOfferteBedrag.toLocaleString('nl-NL')})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Vaste baseline scope</span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider block flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Goedgekeurd Meerwerk</span>
            </span>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-emerald-900">
                +{approvedHours.toFixed(1)} u
              </span>
              <span className="text-xs text-emerald-700">
                (+€{approvedRevenue.toLocaleString('nl-NL')})
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 mt-1 block">
              Gedekt door klant akkoord
            </span>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wider block flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>In Aanvraag / Wachtend</span>
            </span>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-amber-900">
                +{pendingHours.toFixed(1)} u
              </span>
              <span className="text-xs text-amber-700">
                (+€{pendingRevenue.toLocaleString('nl-NL')})
              </span>
            </div>
            <span className="text-[11px] text-amber-700 mt-1 block">
              {projectRequests.filter((r) => r.status === 'verzonden').length} voorstel openstaand
            </span>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
            <span className="text-xs font-medium text-indigo-800 uppercase tracking-wider block flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Totale Prognose</span>
            </span>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-indigo-900">
                {totalForecastHours.toFixed(1)} u
              </span>
              <span className="text-xs text-indigo-700">
                (€{(totalForecastHours * currentProject.uurtarief).toLocaleString('nl-NL')})
              </span>
            </div>
            <span className="text-[11px] text-indigo-700 mt-1 block">
              +{(((totalForecastHours - currentProject.initieelOfferteUren) / currentProject.initieelOfferteUren) * 100).toFixed(0)}% t.o.v. start
            </span>
          </div>
        </div>

        {/* Visual Budget Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Urenverdeling & Scope Verloop</span>
            <span>
              Baseline: {currentProject.initieelOfferteUren}u | Goedgekeurd: {approvedHours}u | In
              behandeling: {pendingHours}u
            </span>
          </div>
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-indigo-600 h-full transition-all"
              style={{
                width: `${(currentProject.initieelOfferteUren / Math.max(1, totalForecastHours)) * 100}%`
              }}
              title="Originele Offerte Uren"
            />
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{
                width: `${(approvedHours / Math.max(1, totalForecastHours)) * 100}%`
              }}
              title="Goedgekeurd Meerwerk"
            />
            <div
              className="bg-amber-400 h-full transition-all"
              style={{
                width: `${(pendingHours / Math.max(1, totalForecastHours)) * 100}%`
              }}
              title="In Aanvraag"
            />
          </div>
          <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-600">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
              <span>Offerte Baseline</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Goedgekeurd Meerwerk</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span>Wacht op Akkoord</span>
            </span>
          </div>
        </div>
      </div>

      {/* Change Requests Section for this Project */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Klantvragen & Meerwerkverzoeken ({projectRequests.length})
            </h3>
            <p className="text-xs text-slate-500">
              Tussentijdse verzoeken, berekende uren, formele offertes en 1-klik akkoord status.
            </p>
          </div>
        </div>

        {projectRequests.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">Nog geen meerwerkverzoeken</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Komt er een tussentijdse vraag van de klant binnen? Voer hem in om direct uren te
              schatten op basis van historische data en akkoord te vragen.
            </p>
            <button
              onClick={() => onOpenNewRequestForProject(currentProject.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              + Nieuwe Klantvraag Invoeren
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectRequests.map((req) => {
              const statusStyles = {
                concept: 'bg-slate-100 text-slate-700 border-slate-200',
                verzonden: 'bg-amber-50 text-amber-800 border-amber-200',
                goedgekeurd: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                afgewezen: 'bg-rose-50 text-rose-800 border-rose-200'
              }[req.status];

              const statusLabels = {
                concept: 'Concept Inschatting',
                verzonden: 'Wacht op Klant Akkoord',
                goedgekeurd: 'Klant Heeft Akkoord Gegeven',
                afgewezen: 'Afgewezen door Klant'
              }[req.status];

              return (
                <div
                  key={req.id}
                  className="py-4 hover:bg-slate-50/80 rounded-xl px-3 -mx-3 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div 
                    onClick={() => onOpenRequestDetail(req)}
                    className="space-y-1.5 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900 text-base">{req.titel}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusStyles}`}>
                        {statusLabels}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      "{req.klantVraagRuweTekst}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {req.categorie}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Aangemaakt: {req.datumAangemaakt}</span>
                      </span>
                      {req.datumGoedgekeurd && (
                        <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          <span>Akkoord: {req.datumGoedgekeurd}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right cursor-pointer mr-2" onClick={() => onOpenRequestDetail(req)}>
                      <div className="text-base font-bold text-slate-900">
                        {req.geschatteUren} uur
                      </div>
                      <div className="text-xs text-slate-500">
                        €{req.totaalBedrag.toLocaleString('nl-NL')} excl. btw
                      </div>
                    </div>

                    {/* Action buttons: Print/Export Quote & 1-Click Client Approval */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onOpenFormalProposal(req)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm transition flex items-center space-x-1.5"
                        title="Genereer een formele, printbare meerwerkofferte compleet met scope-afbakening en handtekeningblok"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="hidden sm:inline">Exporteer Offerte</span>
                        <span className="sm:hidden">Offerte</span>
                      </button>

                      <button
                        onClick={() => onOpenClientApproval(req)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 ${
                          req.status === 'goedgekeurd'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title="Open de schone klantweergave voor 1-klik goedkeuring"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{req.status === 'goedgekeurd' ? 'Akkoord' : '1-Klik Akkoord'}</span>
                      </button>

                      <button
                        onClick={() => onOpenRequestDetail(req)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Bekijk details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
