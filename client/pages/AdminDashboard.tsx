import { useState } from "react";
import { ClipboardCheck, PackageCheck, Settings2, Warehouse } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth, type LiveCentre } from "@/context/AuthContext";
import { farmers } from "@/data/mockData";
import { EmptyState, Notice, StaffLayout, Stat } from "./StaffLayout";

type Confirmation =
  | { kind: "policy" }
  | { kind: "centre"; id: string }
  | null;

type CentreDraft = {
  name: string;
  district: string;
  tehsil: string;
  daily: number;
  warehouse: number;
};

const toDraft = (centre: LiveCentre): CentreDraft => ({
  name: centre.name,
  district: centre.district,
  tehsil: centre.tehsil,
  daily: centre.dailyWeighingCapacity,
  warehouse: centre.warehouseCapacity,
});

export default function AdminDashboard() {
  const { policy, centres, tokens, updatePolicy, updateCentre, addCentre } = useAuth();
  const [season, setSeason] = useState(policy.season);
  const [crop, setCrop] = useState(policy.crop);
  const [msp, setMsp] = useState(policy.msp);
  const [limit, setLimit] = useState(policy.procurementLimitPerAcre);
  const [start, setStart] = useState(policy.procurementPeriodStart);
  const [end, setEnd] = useState(policy.procurementPeriodEnd);
  const [drafts, setDrafts] = useState<Record<string, CentreDraft>>({});
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [newCentre, setNewCentre] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const getDraft = (centre: LiveCentre) => drafts[centre.id] || toDraft(centre);
  const setDraft = (id: string, patch: Partial<CentreDraft>) =>
    setDrafts((current) => ({ ...current, [id]: { ...getDraft(centres.find((centre) => centre.id === id)!), ...patch } }));

  const savePolicy = async () => {
    setConfirmation(null);
    setBusy(true);
    setError("");
    const result = await updatePolicy({ season, crop, msp, procurementLimitPerAcre: limit, procurementPeriodStart: start, procurementPeriodEnd: end });
    setBusy(false);
    if (result.ok) setNotice("Procurement configuration saved.");
    else setError(result.error || "Could not save configuration.");
  };

  const saveCentre = async (id: string) => {
    const value = getDraft(centres.find((centre) => centre.id === id)!);
    setConfirmation(null);
    setBusy(true);
    setError("");
    const result = await updateCentre(id, { name: value.name, district: value.district, tehsil: value.tehsil, dailyWeighingCapacity: value.daily, warehouseCapacity: value.warehouse });
    setBusy(false);
    if (result.ok) setNotice("Centre configuration saved.");
    else setError(result.error || "Could not save centre.");
  };

  const createCentre = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const result = await addCentre({ name: String(data.get("name")), district: String(data.get("district")), tehsil: String(data.get("tehsil")), address: "To be configured", distance: 0, dailyWeighingCapacity: Number(data.get("daily")), usedDailyCapacity: 0, warehouseCapacity: Number(data.get("warehouse")), reservedWarehouseCapacity: 0 });
    setBusy(false);
    if (result.ok) {
      setNotice("Centre added.");
      setNewCentre(false);
      event.currentTarget.reset();
    } else setError(result.error || "Could not add centre.");
  };

  return (
    <StaffLayout role="admin" title="Government / Admin" subtitle="Configure the procurement season, MSP limits, and collection centres.">
      <div className="staff-stats">
        <Stat label="Farmers registered" value={String(farmers.length)} detail="Verified mock records" icon={ClipboardCheck} />
        <Stat label="Active tokens today" value={String(tokens.filter((token) => token.requestedDate === "21 Mar 2024").length)} detail="All statuses" icon={PackageCheck} tone="green" />
        <Stat label="Configured centres" value={String(centres.length)} detail="Available procurement locations" icon={Warehouse} tone="sand" />
        <Stat label="Season crop" value={policy.crop} detail={policy.season} icon={Settings2} tone="orange" />
      </div>
      {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      {error && <Notice message={error} error onClose={() => setError("")} />}
      <div className="staff-grid admin-grid">
        <section className="staff-panel">
          <div className="staff-panel-header"><div><span className="eyebrow">PROCUREMENT CONFIGURATION</span><h3>Season and policy</h3></div></div>
          <div className="admin-form">
            <label>Season<input value={season} onChange={(event) => setSeason(event.target.value)} /></label>
            <label>Crop<input value={crop} onChange={(event) => setCrop(event.target.value)} /></label>
            <label>MSP / quintal<input type="number" value={msp} onChange={(event) => setMsp(Number(event.target.value))} /></label>
            <label>Procurement limit / acre<input type="number" value={limit} onChange={(event) => setLimit(Number(event.target.value))} /></label>
            <label>Procurement period start<input type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label>
            <label>Procurement period end<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label>
          </div>
          <button className="primary-button" disabled={busy} onClick={() => setConfirmation({ kind: "policy" })}>{busy ? "Saving…" : "Save policy configuration"}</button>
        </section>
        <section className="staff-panel">
          <div className="staff-panel-header"><div><span className="eyebrow">LIVE ELIGIBILITY</span><h3>Current policy impact</h3></div></div>
          <div className="summary-grid"><div><span>Crop</span><strong>{policy.crop}</strong></div><div><span>MSP</span><strong>₹{policy.msp.toLocaleString("en-IN")} / q</strong></div><div><span>Limit / acre</span><strong>{policy.procurementLimitPerAcre} q</strong></div><div><span>Period</span><strong>{policy.procurementPeriodStart} — {policy.procurementPeriodEnd}</strong></div></div>
        </section>
        <section className="staff-panel wide-panel">
          <div className="staff-panel-header"><div><span className="eyebrow">CENTRE CONFIGURATION</span><h3>Procurement centres</h3></div><button className="outline-button" onClick={() => setNewCentre((value) => !value)}>{newCentre ? "Close form" : "Add new centre"}</button></div>
          {centres.length === 0 ? <EmptyState>No centres configured</EmptyState> : <div className="table-wrap"><table><thead><tr><th>Name</th><th>District</th><th>Tehsil</th><th>Daily capacity</th><th>Warehouse capacity</th><th /></tr></thead><tbody>{centres.map((centre) => { const value = getDraft(centre); return <tr key={centre.id}><td><input value={value.name} onChange={(event) => setDraft(centre.id, { name: event.target.value })} /></td><td><input value={value.district} onChange={(event) => setDraft(centre.id, { district: event.target.value })} /></td><td><input value={value.tehsil} onChange={(event) => setDraft(centre.id, { tehsil: event.target.value })} /></td><td><input type="number" value={value.daily} onChange={(event) => setDraft(centre.id, { daily: Number(event.target.value) })} /></td><td><input type="number" value={value.warehouse} onChange={(event) => setDraft(centre.id, { warehouse: Number(event.target.value) })} /></td><td><button className="text-button" disabled={busy} onClick={() => setConfirmation({ kind: "centre", id: centre.id })}>Save</button></td></tr>; })}</tbody></table></div>}
          {newCentre && <form className="admin-form" onSubmit={createCentre}><label>Name<input name="name" required /></label><label>District<input name="district" required /></label><label>Tehsil<input name="tehsil" required /></label><label>Daily capacity<input name="daily" type="number" min="0" required /></label><label>Warehouse capacity<input name="warehouse" type="number" min="0" required /></label><button className="primary-button" disabled={busy} type="submit">{busy ? "Adding…" : "Add centre"}</button></form>}
        </section>
      </div>
      <AlertDialog open={confirmation !== null} onOpenChange={(open) => !open && setConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirm live configuration change</AlertDialogTitle><AlertDialogDescription>{confirmation?.kind === "centre" ? "This will change centre capacity and affect officer capacity calculations." : "This will change MSP, eligibility limits, or procurement dates for all dashboards."}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={() => confirmation?.kind === "centre" ? saveCentre(confirmation.id) : savePolicy()}>Confirm and save</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StaffLayout>
  );
}
