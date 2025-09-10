import TicketCard from "./TicketCard"

const TicketList = ({ tickets, onClose }) => {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
        No open tickets 🎉
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tickets.map((t) => (
        <TicketCard key={t.id} ticket={t} onClose={onClose} />
      ))}
    </div>
  );
}
export default TicketList;
