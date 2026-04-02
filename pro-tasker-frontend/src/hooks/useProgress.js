const useProgress = (tasks = []) => {
  if (!tasks.length) return 0;

  const total = tasks.length;

  const score = tasks.reduce((acc, task) => {
    if (task.status === "Done") return acc + 1;
    if (task.status === "In Progress") return acc + 0.5;
    return acc;
  }, 0);

  return Math.round((score / total) * 100);
};

export default useProgress;