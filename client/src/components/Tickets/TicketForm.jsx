import { useState } from "react";

const priorities = ["LOW", "MEDIUM", "HIGH"];

const TicketForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [requester, setRequester] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !requester.trim()) return;

    const newTicket = {
      id: `TCK-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      description: description.trim(),
      status: "OPEN", 
      priority,
      requester: requester.trim(),
      createdAt: new Date().toISOString(),
    };

    onAdd(newTicket);

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setRequester("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-5 shadow-sm border">
      <div>
        <label className="block text-sm font-medium text-black">Title *</label>
        <input
          className="mt-1 w-full rounded-lg text-black border-gray-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Description</label>
        <textarea
          className="mt-1 w-full rounded-lg text-black border-gray-300"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details, steps to reproduce, etc."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black">Priority</label>
          <select
            className="mt-1 w-full bg-gray-100 text-black rounded-lg"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Requester *</label>
          <input
            className="mt-1 w-full rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder=" email or name"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg sec px-4 py-2 text-white secondary-btn hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Add Ticket
        </button>
      </div>
    </form>
  );
}
export default TicketForm;