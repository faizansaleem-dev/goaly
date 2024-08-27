export const createGoal = async (
  token: string,
  goalData: {
    target_amount: number;
    current_amount?: number | null;
    target_date: string; // ISO string format
  }
): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3000/goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalData),
    });

    if (!response.ok) {
      throw new Error("Failed to create goal");
    }

    const newGoal = await response.json();
    return newGoal;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};

export const getTrendData = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:3000/goal/trend-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trend data");
    }

    const trendData = await response.json();
    return trendData;
  } catch (error) {
    console.error("Error fetching trend data:", error);
    throw error;
  }
};
