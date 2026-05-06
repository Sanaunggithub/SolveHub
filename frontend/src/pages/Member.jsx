import { useState, useEffect } from "react";
import { FaChartLine, FaFire, FaEye, FaThumbsUp, FaSearch } from "react-icons/fa";
import api from "../api/axios";
import Footer from "../components/Footer";

export default function Member() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/statistics/all");
      setMembers(response.data);
      setFilteredMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading members...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FaChartLine className="text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold">Members Statistics</h1>
          </div>
          <p className="text-blue-100 text-sm md:text-base">
            Explore all active members and their contributions to the forum
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Members</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">{members.length}</p>
                </div>
                <FaChartLine className="text-4xl text-blue-500 opacity-30" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Posts</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">
                    {members.reduce((sum, m) => sum + m.posts, 0)}
                  </p>
                </div>
                <FaFire className="text-4xl text-orange-500 opacity-30" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Votes</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">
                    {/* start from 0 nd adding*/}
                    {members.reduce((sum, m) => sum + m.votes, 0) }
                  </p>
                </div>
                <FaThumbsUp className="text-4xl text-green-500 opacity-30" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Views</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">
                    {/* start from 0 add */}
                    {members.reduce((sum, m) => sum + m.views, 0)}
                  </p>
                </div>
                <FaEye className="text-4xl text-purple-500 opacity-30" />
              </div>
            </div>
          </div>

          

          {/* Members Table/Grid */}
          {filteredMembers.length > 0 ? (
            <div className="space-y-3">
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Posts</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Votes</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Views</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">@{member.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                            <FaFire className="text-xs" />
                            {member.posts}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <FaThumbsUp className="text-xs" />
                            {member.votes}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                            <FaEye className="text-xs" />
                            {member.views}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredMembers.map((member, index) => (
                  <div key={member.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                            {member.status}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{member.full_name}</p>
                        <p className="text-xs text-gray-500">@{member.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Posts</p>
                        <p className="font-bold text-orange-600 text-lg">{member.posts}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Votes</p>
                        <p className="font-bold text-green-600 text-lg">{member.votes}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Views</p>
                        <p className="font-bold text-purple-600 text-lg">{member.views}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No members found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
