import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Info, Leaf, MapPin, PackageCheck, Warehouse } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { farmer } from "@/data/mockData";

const steps = ["Crop", "Centre", "Confirm"];

export default function BookSlot() {
  const { currentUser, centres, policy } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [district, setDistrict] = useState(farmer.district);
  const [tehsil, setTehsil] = useState("All tehsils");
  const [centreId, setCentreId] = useState(centres[0]?.id || "");
  const [quantity, setQuantity] = useState(40);
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const eligibleQuantity = farmer.verifiedLandArea * policy.procurementLimitPerAcre;
  const alreadyProcured = 80;
  const remainingQuantity = eligibleQuantity - alreadyProcured;
  const centre = centres.find((item) => item.id === centreId) || centres[0];
  const availableCapacity = centre ? centre.warehouseCapacity - centre.reservedWarehouseCapacity : 0;
  const estimatedAmount = quantity > 0 ? quantity * policy.msp : 0;
  const filteredCentres = useMemo(() => centres.filter((item) => item.district === district && (tehsil === "All tehsils" || item.tehsil === tehsil)), [centres, district, tehsil]);
  const sortedCentres = useMemo(() => [...filteredCentres].sort((a, b) => a.distance - b.distance), [filteredCentres]);
  const quantityError = quantity <= 0 ? "Enter a quantity greater than zero." : quantity > remainingQuantity ? `You can book up to ${remainingQuantity} quintals, your remaining eligible quantity.` : quantity > availableCapacity ? `Only ${availableCapacity} quintals are available at this centre. Reduce the quantity or choose another centre.` : "";

  if (!currentUser || currentUser.role !== "farmer") return <Navigate to="/login/farmer" replace />;

  const goToStep = (nextStep: number) => {
    setError("");
    setStep(nextStep);
  };

  const chooseCentre = (id: string) => {
    setCentreId(id);
    setError("");
  };

  const submitBooking = () => {
    if (!centre) { setError("Choose a procurement centre to continue."); return; }
    if (quantityError) { setError(quantityError); return; }
    setSubmitting(true);
    window.setTimeout(() => { setSubmitting(false); setBooked(true); }, 650);
  };

  if (booked && centre) return <div className="booking-page"><div className="demo-mode-banner" role="status">Demo Mode · Simulated data for SIH26032 prototype</div><div className="tricolor" /><div className="booking-wrap"><div className="booking-success" role="status"><div className="success-check"><Check size={35} /></div><span className="eyebrow">SLOT BOOKED SUCCESSFULLY</span><h1>Your procurement window is active</h1><p>Space has been reserved for your crop at the selected centre.</p><div className="success-details"><div><span>Slot validity</span><strong>Today – 9 days from today</strong></div><div><span>Procurement centre</span><strong>{centre.name}</strong></div><div><span>Intended quantity</span><strong>{quantity} quintals</strong></div></div><div className="success-reference"><CheckCircle2 size={15} /> Keep your Kisaan Code ready when you visit the centre.</div><div className="success-actions"><button className="primary-button" onClick={() => navigate("/")}>Go to farmer dashboard <ArrowRight size={16} /></button><button className="outline-button" onClick={() => window.print()}>Print slot slip</button></div></div></div></div>;

  return <div className="booking-page"><div className="demo-mode-banner" role="status">Demo Mode · Simulated data for SIH26032 prototype</div><div className="tricolor" /><header className="booking-header"><div className="booking-wrap booking-header-inner"><Link to="/" className="booking-brand"><div className="auth-emblem"><Leaf size={24} /></div><strong>ई-उपार्जन <span>e-Uparjan</span></strong></Link><span className="booking-user">{farmer.name} · {farmer.kisaanCode}</span></div></header><main className="booking-wrap"><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to dashboard</Link><div className="booking-title"><div><span className="eyebrow">FARMER SERVICES</span><h1>Book a procurement slot</h1><p>Reserve your 9-day window to bring your crop to an authorized centre.</p></div><div className="step-progress" aria-label="Slot booking progress">{steps.map((label, index) => { const number = index + 1; return <div className={step >= number ? "step active" : "step"} aria-current={step === number ? "step" : undefined} key={label}><span>{step > number ? <Check size={13} /> : number}</span><small>{label}</small></div>; })}</div></div>{error && <div className="booking-error" role="alert"><Info size={16} /><span>{error}</span></div>}<div className="booking-grid"><section className="booking-card">
    {step === 1 && <div className="booking-step"><span className="step-kicker">STEP 1 OF 3</span><h2>Confirm your crop details</h2><p className="step-copy">These details come from your verified farmer profile and cannot be changed here.</p><div className="read-only-grid"><div><span>Crop</span><strong>{farmer.crop}</strong></div><div><span>Season</span><strong>{farmer.season}</strong></div><div><span>MSP</span><strong>₹{policy.msp.toLocaleString("en-IN")} / q</strong></div><div><span>Limit per acre</span><strong>{policy.procurementLimitPerAcre} q</strong></div></div><div className="quantity-callout"><PackageCheck size={22} /><div><span>Remaining eligible quantity</span><strong>{remainingQuantity} quintals</strong><small>{farmer.verifiedLandArea} acres × {policy.procurementLimitPerAcre} q total eligibility · {alreadyProcured} q already procured</small></div></div><button className="primary-button next-button" onClick={() => goToStep(2)}>Select a procurement centre <ArrowRight size={16} /></button></div>}
    {step === 2 && <div className="booking-step"><span className="step-kicker">STEP 2 OF 3</span><h2>Choose a procurement centre</h2><p className="step-copy">The recommendation is advisory. You can choose any centre in your district.</p><div className="filter-row"><label>District<select value={district} onChange={(event) => { setDistrict(event.target.value); setCentreId(centres.find((item) => item.district === event.target.value)?.id || ""); }}><option>Sehore</option></select></label><label>Tehsil<select value={tehsil} onChange={(event) => setTehsil(event.target.value)}><option>All tehsils</option><option>Ashta</option><option>Sehore</option></select></label></div><div className="centre-list">{sortedCentres.map((item, index) => { const itemAvailable = item.warehouseCapacity - item.reservedWarehouseCapacity; const used = Math.round((item.reservedWarehouseCapacity / item.warehouseCapacity) * 100); return <button type="button" className={centreId === item.id ? "centre-choice selected" : "centre-choice"} onClick={() => chooseCentre(item.id)} key={item.id} aria-pressed={centreId === item.id}><div className="centre-top"><div className="centre-radio">{centreId === item.id && <span />}</div><div><strong>{item.name}</strong><small><MapPin aria-hidden="true" size={12} /> {item.address} · {item.distance} km away</small></div>{index === 0 && <span className="recommended">Recommended</span>}</div><div className="centre-capacity"><span><Warehouse aria-hidden="true" size={14} /> Warehouse: <strong>{itemAvailable} / {item.warehouseCapacity} q available</strong></span><span>Daily capacity: {item.dailyWeighingCapacity} q</span></div><div className="capacity-bar" aria-label={`${used}% warehouse capacity used`}><span className={used > 90 ? "red" : used > 70 ? "yellow" : "green"} style={{ width: `${used}%` }} /></div></button>; })}</div>{!sortedCentres.length && <div className="staff-empty"><Warehouse size={22} /><span>No centres found for this district and tehsil.</span></div>}<div className="step-actions"><button className="text-button" onClick={() => goToStep(1)}><ArrowLeft size={15} /> Back</button><button className="primary-button" disabled={!centre} onClick={() => goToStep(3)}>Continue <ArrowRight size={16} /></button></div></div>}
    {step === 3 && <div className="booking-step"><span className="step-kicker">STEP 3 OF 3</span><h2>Confirm intended quantity</h2><p className="step-copy">Enter the amount you plan to bring. The operator records the actual weighed quantity later.</p><label className="quantity-input">Intended quantity (quintals)<div><input aria-invalid={Boolean(quantityError)} type="number" min={1} max={remainingQuantity} value={quantity} onChange={(event) => { setQuantity(Number(event.target.value)); setError(""); }} /><span>quintals</span></div></label><div className="quantity-presets" aria-label="Quantity shortcuts">{[20, 40, 60].filter((value) => value <= remainingQuantity && value <= availableCapacity).map((value) => <button type="button" className={quantity === value ? "selected" : ""} onClick={() => setQuantity(value)} key={value}>{value} q</button>)}</div>{quantityError && <div className="form-error" role="alert">{quantityError}</div>}<div className="value-preview"><span>Estimated value at current MSP</span><strong>{quantity > 0 ? `₹${estimatedAmount.toLocaleString("en-IN")}` : "—"}</strong><small>Final payment uses the actual quantity recorded at weighing.</small></div><div className="confirm-summary"><div><span>Selected centre</span><strong>{centre?.name || "Not selected"}</strong></div><div><span>Slot duration</span><strong>9 days from today</strong></div><div><span>Remaining eligibility</span><strong>{remainingQuantity} quintals</strong></div></div><div className="step-actions"><button className="text-button" onClick={() => goToStep(2)}><ArrowLeft size={15} /> Change centre</button><button className="primary-button" disabled={submitting} onClick={submitBooking}>{submitting ? "Reserving your slot…" : "Confirm & book slot"} {!submitting && <Check size={16} />}</button></div></div>}
  </section><aside className="booking-aside"><div className="aside-icon"><CheckCircle2 size={20} /></div><h3>Before you book</h3><ul><li>Your slot remains valid for 9 days.</li><li>Book a token separately for your visit date.</li><li>Carry your Kisaan Code to the centre.</li><li>Actual quantity is weighed and recorded at the centre.</li></ul><div className="aside-capacity"><span>Selected centre availability</span><strong>{availableCapacity} q available</strong><div className="capacity-bar"><span className="green" style={{ width: `${centre ? Math.max(5, (availableCapacity / centre.warehouseCapacity) * 100) : 0}%` }} /></div></div><div className="aside-help"><strong>Need help?</strong><span>Call 1800-233-4250</span></div></aside></div></main><footer className="booking-footer"><span>e-Uparjan · Smart Procurement & Token Management System</span><span>Terms · Privacy · Sitemap · Contact · Last updated: 18 March 2024</span></footer></div>;
}
