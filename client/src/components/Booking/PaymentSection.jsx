export default function PaymentSection({ payment, setPayment, upiId, setUpiId }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm text-brand-muted mb-2">Payment</h2>
      <select
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
        className="w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2"
      >
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
      </select>
      {payment === "upi" && (
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="Enter UPI ID"
          className="mt-2 w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2"
        />
      )}
    </div>
  );
}
