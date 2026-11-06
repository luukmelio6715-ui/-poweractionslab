import React, { useState } from 'react';
import { Project, ChangeRequest, HistoricalTask } from './types';
import { INITIAL_PROJECTS, INITIAL_REQUESTS, HISTORICAL_TASKS } from './constants';
import { Header } from './components/Header';
import { ProjectList } from './components/ProjectList';
import { NewRequestModal } from './components/NewRequestModal';
import { RequestDetailModal } from './components/RequestDetailModal';
import { ClientApprovalView } from './components/ClientApprovalView';
import { FormalProposalModal } from './components/FormalProposalModal';
import { HistoricalDataView } from './components/HistoricalDataView';

export function App() {
  const [currentView, setCurrentView] = useState<'projecten' | 'historie'>('projecten');
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [requests, setRequests] = useState<ChangeRequest[]>(INITIAL_REQUESTS);
  const [historicalTasks, setHistoricalTasks] = useState<HistoricalTask[]>(HISTORICAL_TASKS);

  // Modals & Views
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [activeRequestDetail, setActiveRequestDetail] = useState<ChangeRequest | null>(null);
  const [clientApprovalRequest, setClientApprovalRequest] = useState<ChangeRequest | null>(null);
  const [formalProposalRequest, setFormalProposalRequest] = useState<ChangeRequest | null>(null);

  const totalPending = requests.filter((r) => r.status === 'verzonden').length;

  const handleSaveNewRequest = (newReq: ChangeRequest, sendDirectly: boolean) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: ChangeRequest['status'],
    signature?: string,
    notes?: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: newStatus,
            datumGoedgekeurd:
              newStatus === 'goedgekeurd'
                ? new Date().toISOString().split('T')[0]
                : r.datumGoedgekeurd,
            klantHandtekening: signature || r.klantHandtekening,
            klantOpmerkingen: notes || r.klantOpmerkingen
          };
        }
        return r;
      })
    );

    if (activeRequestDetail?.id === id) {
      setActiveRequestDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    if (formalProposalRequest?.id === id) {
      setFormalProposalRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleClientApprove = (signatureName: string, notes?: string) => {
    if (clientApprovalRequest) {
      handleUpdateStatus(clientApprovalRequest.id, 'goedgekeurd', signatureName, notes);
      setClientApprovalRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'goedgekeurd',
              klantHandtekening: signatureName,
              datumGoedgekeurd: new Date().toISOString().split('T')[0],
              klantOpmerkingen: notes
            }
          : null
      );
    }
  };

  const handleClientReject = (reason: string) => {
    if (clientApprovalRequest) {
      handleUpdateStatus(clientApprovalRequest.id, 'afgewezen', undefined, reason);
      setClientApprovalRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'afgewezen',
              klantOpmerkingen: reason
            }
          : null
      );
    }
  };

  const handleAddHistoricalTask = (task: HistoricalTask) => {
    setHistoricalTasks((prev) => [task, ...prev]);
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenNewRequest={() => setIsNewRequestOpen(true)}
        totalPendingRequests={totalPending}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentView === 'projecten' ? (
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            requests={requests}
            onOpenRequestDetail={(req) => setActiveRequestDetail(req)}
            onOpenNewRequestForProject={(pId) => {
              setSelectedProjectId(pId);
              setIsNewRequestOpen(true);
            }}
            onOpenClientApproval={(req) => setClientApprovalRequest(req)}
            onOpenFormalProposal={(req) => setFormalProposalRequest(req)}
          />
        ) : (
          <HistoricalDataView
            tasks={historicalTasks}
            onAddTask={handleAddHistoricalTask}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <p>
          ScopeCraft Dashboard Scope Protection • Geoptimaliseerd voor BI consultants, Power BI & Tableau projecten.
        </p>
      </footer>

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        projects={projects}
        defaultProjectId={selectedProjectId}
        historicalTasks={historicalTasks}
        onSaveRequest={handleSaveNewRequest}
      />

      {/* Request Details & Actions Modal */}
      <RequestDetailModal
        request={activeRequestDetail}
        project={currentProject}
        onClose={() => setActiveRequestDetail(null)}
        onUpdateStatus={handleUpdateStatus}
        onOpenClientPortal={(req) => {
          setActiveRequestDetail(null);
          setClientApprovalRequest(req);
        }}
        onOpenFormalProposal={(req) => {
          setActiveRequestDetail(null);
          setFormalProposalRequest(req);
        }}
      />

      {/* Clean Client-Facing Approval Portal for Sign-off */}
      {clientApprovalRequest && (
        <ClientApprovalView
          request={clientApprovalRequest}
          project={projects.find((p) => p.id === clientApprovalRequest.projectId)}
          onClose={() => setClientApprovalRequest(null)}
          onApprove={handleClientApprove}
          onReject={handleClientReject}
          onOpenFormalProposal={(req) => {
            setClientApprovalRequest(null);
            setFormalProposalRequest(req);
          }}
        />
      )}

      {/* Printable Formal Change Request Proposal View */}
      {formalProposalRequest && (
        <FormalProposalModal
          request={formalProposalRequest}
          project={projects.find((p) => p.id === formalProposalRequest.projectId)}
          onClose={() => setFormalProposalRequest(null)}
          onApproveDirectly={(signature) => handleUpdateStatus(formalProposalRequest.id, 'goedgekeurd', signature)}
        />
      )}
    </div>
  );
}

export default App;
