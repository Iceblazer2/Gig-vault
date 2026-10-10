import React, { useState } from "react";

// Gig-Worker Safety Vault
// Single-file React component suitable for hackathon demo / prototype
// Uses Tailwind classes. Replace mocked APIs with real back-end/payment integrations.

export default function App() {
  const [user, setUser] = useState({ role: "client", name: "Anita" }); // role: client | worker
  const [jobs, setJobs] = useState(sampleJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEscrow, setShowEscrow] = useState(false);
  const [wallet, setWallet] = useState({ balance: 1200 });
  const [disputes, setDisputes] = useState([]);

  function postJob(form) {
    const newJob = {
      id: Math.random().toString(36).slice(2, 9),
      title: form.title,
      description: form.description,
      budget: Number(form.budget),
      status: "open",
      client: user.name,
      worker: null,
      escrow: null,
      createdAt: new Date().toISOString(),
    };
    setJobs([newJob, ...jobs]);
  }

  function hireWorker(jobId, workerName) {
    setJobs(
      jobs.map((j) => (j.id === jobId ? { ...j, worker: workerName, status: "in_progress" } : j))
    );
  }

  function fundEscrow(jobId) {
    // MOCK: withdraw from wallet and create escrow record
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    if (wallet.balance < job.budget) return alert("Insufficient balance in demo wallet.");
    setWallet({ ...wallet, balance: wallet.balance - job.budget });
    const updated = jobs.map((j) =>
      j.id === jobId
        ? { ...j, escrow: { amount: j.budget, fundedAt: new Date().toISOString(), status: "funded" }, status: "in_progress" }
        : j
    );
    setJobs(updated);
    setShowEscrow(false);
    alert("Escrow funded (demo). In production this calls a payments/escrow API.");
  }

  function releaseEscrow(jobId) {
    const updated = jobs.map((j) => {
      if (j.id !== jobId) return j;
      const newJ = { ...j, status: "completed" };
      if (j.escrow) newJ.escrow = { ...j.escrow, status: "released", releasedAt: new Date().toISOString() };
      return newJ;
    });
    setJobs(updated);
    // credit worker wallet in real app
    alert("Escrow released (demo). Worker would be paid now.");
  }

  function raiseDispute(jobId, reason) {
    const d = { id: Math.random().toString(36).slice(2, 9), jobId, reason, raisedAt: new Date().toISOString(), status: "open" };
    setDisputes([d, ...disputes]);
    // mark job disputed
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "disputed" } : j)));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} setUser={setUser} wallet={wallet} />
      <main className="max-w-6xl mx-auto p-6">
        <Hero />

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HowItWorks />

            <div className="mt-6 flex gap-4">
              <PostJobCard onPost={postJob} role={user.role} />
              <QuickActions wallet={wallet} setWallet={setWallet} />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Open Jobs</h3>
              <div className="mt-3 space-y-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={() => setSelectedJob(job)}
                    onHire={(w) => hireWorker(job.id, w)}
                    onFundEscrow={() => {
                      setSelectedJob(job);
                      setShowEscrow(true);
                    }}
                    onRelease={() => releaseEscrow(job.id)}
                    onDispute={(r) => raiseDispute(job.id, r)}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="p-4 rounded-2xl bg-white shadow">
            <h4 className="font-semibold">Dashboard</h4>
            <p className="text-sm mt-2">Role: <strong>{user.role}</strong></p>
            <div className="mt-4 space-y-2">
              <button
                className="w-full py-2 px-3 rounded-lg border"
                onClick={() => setUser((u) => ({ ...u, role: u.role === "client" ? "worker" : "client" }))}
              >
                Switch to {user.role === "client" ? "Worker" : "Client"} view
              </button>
              <div className="pt-2">
                <p className="text-sm text-slate-500">Wallet (demo)</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">₹{wallet.balance}</div>
                    <div className="text-xs text-slate-500">Available balance</div>
                  </div>
                  <div>
                    <button
                      className="px-3 py-1 rounded bg-slate-100 border text-sm"
                      onClick={() => setWallet({ ...wallet, balance: wallet.balance + 500 })}
                    >
                      Add ₹500
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h5 className="font-medium">Active disputes</h5>
              {disputes.length === 0 ? (
                <p className="text-sm text-slate-500 mt-2">No open disputes</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {disputes.map((d) => (
                    <div key={d.id} className="text-xs border rounded p-2">
                      <div className="font-medium">Job {d.jobId}</div>
                      <div className="text-slate-600">{d.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold">Design & Security Principles</h3>
          <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-slate-700">
            <li>Escrow-first payments — client funds are held until client confirms satisfactory delivery.</li>
            <li>Simple dispute flow with human mediation + evidence upload points (photo, video, chat logs).</li>
            <li>Low-friction onboarding using ID verification and micro-deposits to confirm worker accounts.</li>
            <li>Transparent fees and quick partial payouts for urgent small jobs via "instant advance" product.</li>
          </ul>
        </section>

        <footer className="mt-12 py-8 text-center text-sm text-slate-500">
          Prototype for hackathon • Replace mock functions with real payment & KYC integrations.
        </footer>
      </main>

      {/* Modals */}
      {showEscrow && selectedJob && (
        <Modal onClose={() => setShowEscrow(false)}>
          <h4 className="text-lg font-semibold">Fund Escrow — {selectedJob.title}</h4>
          <p className="text-sm text-slate-600 mt-2">Amount: ₹{selectedJob.budget}</p>
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 rounded bg-slate-800 text-white" onClick={() => fundEscrow(selectedJob.id)}>
              Fund from demo wallet
            </button>
            <button type="button" className="px-4 py-2 rounded border" onClick={() => alert('In production: open payment gateway flow')}>
              Pay with card / UPI
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------------------- Small components below ----------------------

function Header({ user, setUser, wallet }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-rose-400 flex items-center justify-center text-white font-bold">SV</div>
          <div>
            <div className="font-semibold">Safety Vault</div>
            <div className="text-xs text-slate-500">Secure escrow & fair payments for gig workers</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">{user.name}</div>
          <div className="px-3 py-1 rounded bg-slate-100 text-sm">₹{wallet.balance}</div>
          <button
            className="px-3 py-1 rounded border"
            onClick={() => alert('In demo: open onboarding / settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gig-Worker Safety Vault</h1>
          <p className="mt-2 text-slate-600 max-w-xl">An escrow-first platform that protects freelancers and local service providers from non-payment and exploitation. Designed for low-fee, trust-first transactions.</p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-md bg-indigo-600 text-white" onClick={() => alert('Go to post job in demo')}>
              Post a Job
            </button>
            <button className="px-4 py-2 rounded-md border" onClick={() => alert('View how escrow works in demo')}>
              How escrow works
            </button>
          </div>
        </div>
        <div className="hidden md:block p-6 bg-white rounded-2xl shadow">
          <div className="text-sm text-slate-500">Demo flow</div>
          <div className="mt-3 font-medium">Escrow → Work → Release</div>
          <div className="mt-4 text-xs text-slate-500">Includes quick dispute, rating & evidence upload</div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <div className="rounded-2xl p-4 bg-white shadow">
      <h3 className="font-semibold">How it protects workers</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card title="Escrow-first" body="Client pays into escrow before work starts. Worker receives funds when client confirms." />
        <Card title="Dispute support" body="Fast, tiered mediation — upload evidence, get an impartial reviewer." />
        <Card title="KYC-lite" body="Simple ID verification reduces fake clients and chargebacks." />
        <Card title="Worker ratings" body="Transparent ratings & job history build reputations." />
      </div>
    </div>
  );
}

function Card({ title, body }) {
  return (
    <div className="p-3 border rounded-lg bg-slate-50">
      <div className="font-medium">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{body}</div>
    </div>
  );
}

function PostJobCard({ onPost, role }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex-1 bg-white p-4 rounded-2xl shadow">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{role === "client" ? "Post a job" : "Find jobs"}</h4>
        <button className="text-sm" onClick={() => setOpen((s) => !s)}>{open ? "Close" : "Open"}</button>
      </div>
      {open && <PostJobForm onPost={(f) => { onPost(f); setOpen(false); }} />}
    </div>
  );
}

function PostJobForm({ onPost }) {
  const [form, setForm] = useState({ title: "Clean 2BHK", description: "General cleaning needed", budget: "600" });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPost(form);
      }}
      className="mt-3 space-y-2"
    >
      <input className="w-full border rounded p-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="w-full border rounded p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="w-32 border rounded p-2" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded bg-indigo-600 text-white">Post job</button>
        <button type="button" className="px-4 py-2 rounded border" onClick={() => alert('Preview in demo')}>Preview</button>
      </div>
    </form>
  );
}

function QuickActions({ wallet, setWallet }) {
  return (
    <div className="w-64 p-4 rounded-2xl bg-white shadow">
      <div className="font-medium">Quick actions</div>
      <div className="mt-3 space-y-2 text-sm">
        <button className="w-full text-left px-3 py-2 border rounded" onClick={() => setWallet({ ...wallet, balance: wallet.balance + 200 })}>Top-up ₹200 (demo)</button>
        <button className="w-full text-left px-3 py-2 border rounded" onClick={() => alert('Open support chat (demo)')}>Contact support</button>
        <button className="w-full text-left px-3 py-2 border rounded" onClick={() => alert('Open dispute center (demo)')}>Dispute center</button>
      </div>
    </div>
  );
}

function JobCard({ job, onSelect, onHire, onFundEscrow, onRelease, onDispute }) {
  const [showRaise, setShowRaise] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <div className="p-3 bg-white border rounded-lg flex items-start justify-between">
      <div>
        <div className="font-medium">{job.title} <span className="text-xs text-slate-400">#{job.id}</span></div>
        <div className="text-sm text-slate-600">{job.description}</div>
        <div className="mt-2 text-xs text-slate-500">Budget: ₹{job.budget} • Status: {job.status}</div>
        <div className="mt-2 flex gap-2">
          <button className="px-3 py-1 border rounded text-sm" onClick={onSelect}>Details</button>
          {job.status === "open" && <button className="px-3 py-1 bg-green-50 border rounded text-sm" onClick={() => onHire("Ramesh")}>Hire Ramesh</button>}
          {job.status === "in_progress" && !job.escrow && <button className="px-3 py-1 border rounded text-sm" onClick={onFundEscrow}>Fund escrow</button>}
          {job.escrow && job.escrow.status === "funded" && <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm" onClick={onRelease}>Release</button>}
        </div>

        {job.status === "in_progress" && (
          <div className="mt-3">
            <button className="text-xs text-rose-600" onClick={() => setShowRaise((s) => !s)}>Raise dispute</button>
            {showRaise && (
              <div className="mt-2">
                <input className="w-full border p-2 rounded text-sm" placeholder="Brief reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-1 bg-rose-600 text-white rounded text-sm" onClick={() => onDispute(reason)}>Submit dispute</button>
                  <button className="px-3 py-1 border rounded text-sm" onClick={() => setShowRaise(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-right text-xs">
        <div className="text-slate-500">Client: {job.client}</div>
        <div className="mt-2">{job.worker ? <div>Worker: <strong>{job.worker}</strong></div> : <div className="text-slate-400">No worker yet</div>}</div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-lg p-6 z-50 w-full max-w-lg">
        <div className="flex justify-end"><button className="text-slate-500" onClick={onClose}>✕</button></div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// ---------------------- Sample data ----------------------

const sampleJobs = [
  { id: "a1b2c3", title: "Fix leaking sink", description: "Kitchen sink leaking. Need plumbing for 1 hour.", budget: 800, status: "open", client: "Rita", worker: null, escrow: null },
  { id: "d4e5f6", title: "Graphic: Event Poster", description: "Design a poster for a local event.", budget: 1500, status: "in_progress", client: "Karan", worker: "Suresh", escrow: null },
  { id: "z9y8x7", title: "Deep clean 3BHK", description: "Full cleaning service, 5 hours.", budget: 2200, status: "in_progress", client: "Meera", worker: "Ramesh", escrow: { amount: 2200, status: "funded" } },
];

// ---------------------- End of file ----------------------

export default App;
