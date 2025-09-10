import { useMemo, useState } from "react";
import { initialTickets } from "../../data/initialticket";
import TicketForm from "../Tickets/TicketForm";
import TicketList from "../Tickets/TicketList";

const Feedback = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [tab, setTab] = useState("OPEN"); 

  const visibleTickets = useMemo(
    () => tickets.filter((t) => t.status === tab),
    [tickets, tab]
  );

  const handleAdd = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleClose = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "CLOSED" } : t))
    );
  };

  const tabs = [
    { key: "OPEN", label: "Open" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "CLOSED", label: "Closed" },
  ];

  return (
    <div>

      <main className="mx-auto max-w-5xl p-4 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3 text-black">Add Ticket</h2>
          <TicketForm onAdd={handleAdd} />
        </section>
        
        <section>
          <div className="flex items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  tab === t.key
                    ? "bg-[#ff4d31] text-black border-[#ff4d31]"
                    : "bg-[#fffaf6] text-[#ff4d31] hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <TicketList
              tickets={visibleTickets}
              onClose={handleClose}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Feedback;