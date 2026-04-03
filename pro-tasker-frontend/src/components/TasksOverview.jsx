import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function TasksOverview({ tasks }) {
  // counts
  const total = tasks.length;

  const counts = {
    todo: tasks.filter((t) => t.status === "To Do").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  const data = [
    { name: "To Do", value: counts.todo, color: "#3b82f6" },
    { name: "In Progress", value: counts.inProgress, color: "#22c55e" },
    { name: "Done", value: counts.done, color: "#eab308" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 text-xl">My Tasks Overview</h2>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Left Stats */}
        <div className="space-y-2 w-full md:w-1/2">
          <Stat
            label="Total Tasks Assigned"
            value={total}
            color="bg-gray-400"
          />
          <Stat label="To Do" value={counts.todo} color="bg-blue-500" />
          <Stat
            label="In Progress"
            value={counts.inProgress}
            color="bg-green-500"
          />
          <Stat label="Done" value={counts.done} color="bg-yellow-500" />
        </div>

        {/* Right Chart */}
        <div className="w-full md:w-1/2 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded ${color}`} />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}

export default TasksOverview;
