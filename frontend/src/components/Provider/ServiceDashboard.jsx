import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const ServiceDashboard = ({}) => {
  const [bookings, setBookings] = useState([]);
  const { currentProvider } = useSelector((state) => state.provider);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const serviceId = currentProvider._id;
        const response = await axios.post(
          "http://localhost:8000/api/service-provider/providerlist",
          { serviceId }
        );
        console.log(response.data.data);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, []);

  const acceptBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/accept/${bookingId}`);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Accepted" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error accepting booking", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`/api/bookings/delete/${bookingId}`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <nav className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-semibold">Service Provider Dashboard</h1>
        </div>
        <ul>
          <li className="px-6 py-2 text-gray-700 hover:bg-gray-200">
            <a href="/dashboard">Bookings</a>
          </li>

          <li className="px-6 py-2 text-gray-700 hover:bg-gray-200">
            <a href="/settings">Logout</a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Upcoming Bookings</h2>
          <div>
            {/* Add any additional controls like search or filter here */}
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Booking Date
                </th>
                <th className="px-5 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Booking Time
                </th>
                <th className="px-5 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-5 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {booking.bookingTime}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {booking.Address}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {booking.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => acceptBooking(booking._id)}
                          className="mr-2 bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => deleteBooking(booking._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {booking.status === "Accepted" && (
                      <span className="text-green-600 font-semibold">
                        Accepted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="p-5 text-center text-gray-600">
              No upcoming bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;