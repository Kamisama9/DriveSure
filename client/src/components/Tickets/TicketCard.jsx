

function StatusBadge({ status }) {
  const map = {
    OPEN: "bg-blue-100 text-blue-700 ring-blue-200",
    IN_PROGRESS: "bg-purple-100 text-purple-700 ring-purple-200",
    CLOSED: "bg-gray-200 text-gray-700 ring-gray-300",
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ring-1 ${map[status]}`}>
      {status}
    </span>
  );
}

const TicketCard = ({ ticket, onClose }) =>{
  const created = new Date(ticket.createdAt).toLocaleString();

  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-black">
              {ticket.title}
            </h3>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="mt-1 text-xs text-gray-400">
            <span className="font-medium">{ticket.id}</span> · Created {created}
          </div>
          {ticket.description && (
            <p className="mt-2 text-sm text-gray-500">
              {ticket.description}
            </p>
          )}
          <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
            <span><span className="text-gray-500">Requester:</span> {ticket.requester}</span>
          </div>
        </div>

        {ticket.status === "OPEN" && (
          <button
            onClick={() => onClose(ticket.id)}
            className="rounded-md border px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-700"
            title="Mark as Closed"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
export default TicketCard;