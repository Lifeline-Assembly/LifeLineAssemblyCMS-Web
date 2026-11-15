import React, { useEffect, useState, useCallback, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiUser, FiMessageSquare, FiBook, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import LoadingModal from "../../components/LoadingModal";
import { getRequestById, pastorPrayerRequestResponse, membersPrayerRequestTestimony } from "../../api/admin-dashboard-apis";
import type { PrayerRequestByIdResponse, statusType } from "../../constants/basic-types";

const PrayerRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);

  const handleApiError = useCallback((error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else {
      // fallback for unexpected errors
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [request, setRequest] = useState<PrayerRequestByIdResponse | null>(null);

  // Pastor Response State
  const [status, setStatus] = useState<statusType>("pending");
  const [ministerComment, setMinisterComment] = useState("");
  const [prayerPoints, setPrayerPoints] = useState("");
  const [scriptureReferences, setScriptureReferences] = useState("");

  // Member Testimony State
  const [testimony, setTestimony] = useState("");
  const [testimonyDate, setTestimonyDate] = useState("");

  const fetchRequestDetails = useCallback(async () => {
    if (!id || !accessToken) return;
    setLoading(true);
    try {
      const response = await getRequestById({ token: accessToken, id: parseInt(id) });
      setRequest(response);

      // Initialize form states
      setStatus(response.status);
      setMinisterComment(response.minister_comment || "");
      setPrayerPoints(response.prayer_points || "");
      setScriptureReferences(response.scripture_references || "");
      setTestimony(response.testimony || "");
      setTestimonyDate(response.testimony_date ? response.testimony_date.split("T")[0] : new Date().toISOString().split("T")[0]);

    } catch (error) {
      handleApiError(error)
      navigate("/dashboard/prayer-requests"); // Go back on error
    } finally {
      setLoading(false);
    }
  }, [id, accessToken, showToast, navigate]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handlePastorSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!request || !accessToken) return;
    setSubmitting(true);
    try {
      await pastorPrayerRequestResponse({
        token: accessToken,
        id: request.id,
        body: {
          status,
          minister_comment: ministerComment,
          prayer_points: prayerPoints,
          scripture_references: scriptureReferences,
        },
      });
      showToast("Response sent successfully!", "success");
      fetchRequestDetails(); // Refresh
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitting(false);
    }
  };

  const handleMemberSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!request || !accessToken) return;
    setSubmitting(true);
    try {
      await membersPrayerRequestTestimony({
        token: accessToken,
        id: request.id,
        body: {
          testimony,
          testimony_date: testimonyDate,
        },
      });
      showToast("Testimony submitted successfully!", "success");
      fetchRequestDetails(); // Refresh
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Check roles (adjust logic as needed for your specific role system)
  const isPastor = user?.role_display?.toLowerCase().includes("pastor") || user?.role_display?.toLowerCase().includes("admin") || user?.is_staff;
  // If not pastor, assume member (or check strictly)
  const isMember = !isPastor;

  if (!request && !loading) return null;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      <LoadingModal isLoading={loading || submitting} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 transition self-start"
      >
        <FiArrowLeft className="mr-2" /> Back to Requests
      </button>

      {request && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <FiCalendar />
                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{request.category_display || request.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                    {request.priority_display || request.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
            ${(request.status === 'answered' || request.status === 'closed') ? 'bg-green-100 text-green-800' :
                      (request.status === 'praying' || request.status === 'pending') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                    {request.status_display || request.status}
                  </span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Request Description</h3>
                <p className="whitespace-pre-wrap">{request.description}</p>
              </div>
            </div>

            {/* Response Display Section (visible to all if exists) */}
            {(request.minister_comment || request.prayer_points || request.scripture_references) && (
              <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <FiMessageSquare className="mr-2" /> Pastoral Response
                </h2>
                <div className="space-y-4">
                  {request.minister_comment && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Comment</h4>
                      <p className="text-blue-900 mt-1 whitespace-pre-wrap">{request.minister_comment}</p>
                    </div>
                  )}
                  {request.prayer_points && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Prayer Points</h4>
                      <p className="text-blue-900 mt-1 whitespace-pre-wrap">{request.prayer_points}</p>
                    </div>
                  )}
                  {request.scripture_references && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider flex items-center">
                        <FiBook className="mr-1" /> Scripture References
                      </h4>
                      <p className="text-blue-900 mt-1 italic whitespace-pre-wrap">{request.scripture_references}</p>
                    </div>
                  )}
                  {request.minister && (
                    <div className="pt-4 mt-4 border-t border-blue-200 text-sm text-blue-700">
                      Responded by: <span className="font-semibold">{request.minister.full_name}</span> ({request.minister.title})
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Testimony Display Section */}
            {request.testimony && (
              <div className="bg-green-50 rounded-lg shadow-sm border border-green-100 p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <FiCheckCircle className="mr-2" /> Testimony
                </h2>
                <p className="text-green-900 whitespace-pre-wrap">{request.testimony}</p>
                {request.testimony_date && (
                  <p className="text-sm text-green-700 mt-2">Date: {new Date(request.testimony_date).toLocaleDateString()}</p>
                )}
              </div>
            )}

            {/* Pastor Action Form */}
            {isPastor && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Respond to Request</h2>
                <form onSubmit={handlePastorSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as statusType)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-main-orange focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="praying">Praying</option>
                        <option value="answered">Answered</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minister Comment</label>
                    <textarea
                      value={ministerComment}
                      onChange={(e) => setMinisterComment(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-main-orange focus:border-transparent"
                      placeholder="Add a comment..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Points</label>
                    <textarea
                      value={prayerPoints}
                      onChange={(e) => setPrayerPoints(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-main-orange focus:border-transparent"
                      placeholder="Enter specific prayer points..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scripture References</label>
                    <input
                      type="text"
                      value={scriptureReferences}
                      onChange={(e) => setScriptureReferences(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-main-orange focus:border-transparent"
                      placeholder="e.g. Psalm 23:1, John 3:16"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-main-orange text-white px-6 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send Response"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Member Testimony Form (Using generic logic if user is owner or just member access) */}
            {(isMember || (request.member.id === user?.id)) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Testimony</h2>
                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimony</label>
                    <textarea
                      value={testimony}
                      onChange={(e) => setTestimony(e.target.value)}
                      rows={4}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-main-orange focus:border-transparent"
                      placeholder="Share what God has done..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={testimonyDate}
                      onChange={(e) => setTestimonyDate(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-main-orange focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Testimony"}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Sidebar - Right Column */}
          <div className="flex flex-col gap-6">
            {/* Member Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" /> Requested By
              </h3>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                  {request.is_anonymous ? '?' : request.member.full_name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {request.is_anonymous ? "Anonymous" : request.member.full_name}
                  </p>
                  {!request.is_anonymous && (
                    <p className="text-xs text-gray-500">{request.member?.email}</p>
                  )}
                </div>
              </div>
              {!request.is_anonymous && (
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Phone: {request.member?.phone_number || "N/A"}</p>
                  {/* Add more member details if needed */}
                </div>
              )}
            </div>

            {/* Minister Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" /> Assigned Minister
              </h3>
              {request.minister ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {request.minister.full_name?.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{request.minister.full_name}</p>
                      <p className="text-xs text-gray-500">{request.minister.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{request.minister.email}</p>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-md border border-dashed border-gray-300 text-gray-500">
                  Unassigned
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerRequestDetailsPage;
