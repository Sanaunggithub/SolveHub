import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ForumStatistics() {
  const [statistics, setStatistics] = useState([
    { label: "Topics", value: 0 },
    { label: "Posts", value: 0 },
    { label: "Users", value: 0 },
    { label: "Members", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch discussions count
      const discussionsResponse = await api.get("/discussions", {
        params: { skip: 0, limit: 1000 }
      });
      const discussionsCount = discussionsResponse.data.length;

      // Fetch users statistics
      const usersResponse = await api.get("/users/statistics/all");
      const usersCount = usersResponse.data.length;

      // Calculate statistics
      const stats = [
        { label: "Topics", value: Math.ceil(discussionsCount / 5) },
        { label: "Posts", value: discussionsCount },
        { label: "Users", value: usersCount },
        { label: "Members", value: usersCount },
      ];

      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white shadow-lg rounded-lg w-full">
      <div className="px-4 pt-4 pb-2 text-xl font-bold text-gray-800">
        Forum Statistics
      </div>
    
      <div className="flex flex-col">
        {loading ? (
          <div className="px-4 py-4 text-center text-gray-500">Loading...</div>
        ) : (
          statistics.map((item, index) => (
            <div
              key={index}
              className="flex justify-between px-4 py-2 text-sm text-gray-700"
            >
              <span className="font-semibold text-gray-500">{item.label}</span>
              <span className="font-bold text-gray-800">{item.value}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
