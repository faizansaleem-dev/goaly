export const createExpense = async (
  token: string,
  expenseData: {
    amount: number;
    categoryId: string;
    date: string;
    description?: string;
  }
) => {
  const response = await fetch("http://localhost:3000/expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
};
