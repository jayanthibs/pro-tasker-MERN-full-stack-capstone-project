function StatsCard({ projects }){


    const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    inprogress: projects.filter((p) => p.status === "In-Progress").length,
    pending: projects.filter((p) => p.status === "Pending").length,
  };

    return(
        <>
        
        {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-slate-500 text-sm">Total</p>
          <p className="text-xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-slate-500 text-sm">Completed</p>
          <p className="text-xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-slate-500 text-sm">In Progress</p>
          <p className="text-xl font-bold text-blue-600">{stats.inprogress}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-slate-500 text-sm">Pending</p>
          <p className="text-xl font-bold text-amber-600">{stats.pending}</p>
        </div>
      </div>
        
        
        </>
    )

}

export default StatsCard;