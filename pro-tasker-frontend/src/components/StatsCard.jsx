function StatsCard({ projects }) {
  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    inprogress: projects.filter((p) => p.status === "In-Progress").length,
    pending: projects.filter((p) => p.status === "Pending").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {/* Total */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-5 text-center hover:scale-105 transition">
        <p className="text-sm opacity-80">Total</p>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>

      {/* Completed */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-5 text-center hover:scale-105 transition">
        <p className="text-sm opacity-80">Completed</p>
        <p className="text-2xl font-bold">{stats.completed}</p>
      </div>

      {/* In Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg p-5 text-center hover:scale-105 transition">
        <p className="text-sm opacity-80">In Progress</p>
        <p className="text-2xl font-bold">{stats.inprogress}</p>
      </div>

      {/* Pending */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg p-5 text-center hover:scale-105 transition">
        <p className="text-sm opacity-80">Pending</p>
        <p className="text-2xl font-bold">{stats.pending}</p>
      </div>

    </div>
  );
}

export default StatsCard;