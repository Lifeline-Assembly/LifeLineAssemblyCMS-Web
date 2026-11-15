import { useEffect, useState, useCallback, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiPlus } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useToast } from "../../contexts/ToastContext";
import { getEventList } from "../../api/landing-page-services";
import LoadingModal from "../../components/LoadingModal";
import type { AxiosResponse } from "axios";
import type { EventPropType } from "../../constants/basic-types";
import EventsTable from "../../components/dashboard-components/EventsTable";
import Popup from "../../components/modals/Popup";
import RegularInputField from "../../components/inputs/RegularInputField";
import RegularTextArea from "../../components/inputs/RegularTextArea";
import { useAuth } from "../../hooks/useAuth";
import { createEvent } from "../../api/admin-dashboard-apis";
import { useFormik } from "formik";
import * as Yup from "yup";
import MediaUploadField from "../../components/dashboard-components/MediaUploadField";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const EventsPage: React.FC = () => {
  const { showToast } = useToast();
  const { accessToken, user } = useAuth();
  const [eventData, setEventData] = useState<EventPropType[]>()
  const events = eventData || [];
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.start_datetime) > now).length;
  const pastEvents = events.filter(e => new Date(e.start_datetime) < now).length;
  const thisMonthEvents = events.filter(e => {
    const date = new Date(e.start_datetime);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const stats: Stat[] = [
    { id: 1, title: "Total Events", value: events.length, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Upcoming Events", value: upcomingEvents, icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Past Events", value: pastEvents, icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "This Month", value: thisMonthEvents, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  const [loading, setLoading] = useState(false);

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

  const getAllEvent = useCallback(async () => {
    setLoading(true);
    try {
      const res: AxiosResponse = await getEventList();
      const response = res.data as EventPropType[]
      setEventData(response || [])
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    getAllEvent();
  }, [getAllEvent]);

  const [createModal, setCreateModal] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    location: Yup.string().required("Location is required"),
    start_datetime: Yup.string().required("Start date is required"),
    end_datetime: Yup.string()
      .required("End date is required")
      .test("is-after-start", "End date must be after start date", function (value) {
        const { start_datetime } = this.parent;
        if (!start_datetime || !value) return true;
        return new Date(value) > new Date(start_datetime);
      }),
    banner: Yup.string()
      .test("banner-or-file", "Cannot have both banner URL and file upload", function (value) {
        const { bannerFile } = this.parent;
        // If bannerFile exists, banner should be empty
        if (bannerFile) {
          return !value || value.trim() === "";
        }
        return true;
      })
      .test("banner-url", "Must be a valid URL", function (value) {
        const { bannerFile } = this.parent;
        // Only validate URL if bannerFile is not provided and value exists
        if (!bannerFile && value && value.trim() !== "") {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        }
        return true;
      })
      .test("banner-required", "Either banner URL or file upload is required", function (value) {
        const { bannerFile } = this.parent;
        // At least one must be provided
        const hasBanner = value && value.trim() !== "";
        const hasFile = bannerFile instanceof File;
        return hasBanner || hasFile;
      }),
    bannerFile: Yup.mixed()
      .nullable()
      .test("banner-or-file", "Cannot have both banner URL and file upload", function (value) {
        const { banner } = this.parent;
        // If banner exists, bannerFile should be null
        if (banner && banner.trim() !== "") {
          return !value || value === null;
        }
        return true;
      })
      .test("banner-required", "Either banner URL or file upload is required", function (value) {
        const { banner } = this.parent;
        // At least one must be provided
        const hasBanner = banner && banner.trim() !== "";
        const hasFile = value instanceof File;
        return hasBanner || hasFile;
      }),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      start_datetime: "",
      end_datetime: "",
      banner: "",
      bannerFile: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createEvent(accessToken || "", {
          title: values.title,
          description: values.description,
          location: values.location,
          start_datetime: values.start_datetime,
          end_datetime: values.end_datetime,
          banner: values.banner && values.banner.trim() !== "" ? values.banner : undefined,
          bannerFile: values.bannerFile || undefined,
        });
        showToast("Event created successfully!", "success");
        setCreateModal(false);
        formik.resetForm();
        getAllEvent();
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <LoadingModal isLoading={loading} />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Event Management</h1>
          <p className="text-gray-500 mt-1">
            Organize and manage church events and activities effectively
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export
          </button>

          {user?.role === 'church_staff' || user?.role === 'super_admin' || user?.role === 'church_presbytery' || user?.role === 'pastor' || user?.role === 'parish_admin' || user?.role === 'leader' && <button
            onClick={() => setCreateModal(true)}
            className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition">
            <FiPlus className="mr-2" /> Create New Event
          </button>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
      <EventsTable events={eventData || []} onEventDeleted={getAllEvent} />
      <Popup
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
          formik.resetForm();
        }}
        title="Upload new event"
        supportingText="Upload a new event to your database, this will also be available on your website"
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <RegularInputField
            label="Title"
            name="title"
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          />
          <RegularTextArea
            label="Description"
            name="description"
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
          />
          <RegularInputField
            label="Location"
            name="location"
            id="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && formik.errors.location ? formik.errors.location : undefined}
          />
          <RegularInputField
            label="Start date"
            type="datetime-local"
            name="start_datetime"
            id="start_datetime"
            value={formik.values.start_datetime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.start_datetime && formik.errors.start_datetime ? formik.errors.start_datetime : undefined}
          />
          <RegularInputField
            label="End date"
            type="datetime-local"
            name="end_datetime"
            id="end_datetime"
            value={formik.values.end_datetime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.end_datetime && formik.errors.end_datetime ? formik.errors.end_datetime : undefined}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600 font-medium">Banner Image</p>
            <p className="text-xs text-gray-500">Provide either a banner URL or upload a file (not both)</p>
          </div>
          <RegularInputField
            label="Banner URL (Optional if uploading file)"
            name="banner"
            id="banner"
            type="url"
            placeholder="https://example.com/banner.jpg"
            value={formik.values.banner}
            onChange={(e) => {
              formik.handleChange(e);
              // Clear bannerFile if banner URL is provided
              if (e.target.value.trim() !== "") {
                formik.setFieldValue("bannerFile", null);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.banner && formik.errors.banner ? formik.errors.banner : undefined}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">OR</p>
          </div>
          <MediaUploadField
            label="Upload Banner File (Optional if providing URL)"
            type="Picture"
            name="bannerFile"
            onChange={(file) => {
              formik.setFieldValue("bannerFile", file);
              // Clear banner URL if file is uploaded
              if (file) {
                formik.setFieldValue("banner", "");
              }
            }}
            onBlur={() => formik.setFieldTouched("bannerFile", true)}
            error={formik.touched.bannerFile ? (formik.errors.bannerFile as string) : undefined}
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setCreateModal(false);
                formik.resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-main-orange text-white rounded-md hover:bg-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </Popup>
    </div>
  );
};

export default EventsPage;
