import { useEffect, useState, useCallback, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiPlus } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import SermonsTable from "../../components/dashboard-components/SermonsTable";
import { useToast } from "../../contexts/ToastContext";
import { getSermonsList } from "../../api/landing-page-services";
import LoadingModal from "../../components/LoadingModal";
import type { AxiosResponse } from "axios";
import type { SermonPropType } from "../../constants/basic-types";
import { useAuth } from "../../hooks/useAuth";
import { createSermon } from "../../api/admin-dashboard-apis";
import { useFormik } from "formik";
import * as Yup from "yup";
import Popup from "../../components/modals/Popup";
import RegularInputField from "../../components/inputs/RegularInputField";
import RegularTextArea from "../../components/inputs/RegularTextArea";
import MediaUploadField from "../../components/dashboard-components/MediaUploadField";


interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const SermonsPage: React.FC = () => {
  const { showToast } = useToast();
  const { accessToken, user } = useAuth();

  const [sermonData, setSermonData] = useState<SermonPropType[]>();

  const sermons = sermonData || [];
  const audioSermons = sermons.filter(s => s.sermon_type === 'audio').length;
  const videoSermons = sermons.filter(s => s.sermon_type === 'video').length;

  const stats: Stat[] = [
    { id: 1, title: "Total Sermons", value: sermons.length, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Audio Sermons", value: audioSermons, icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Video Sermons", value: videoSermons, icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Other Formats", value: sermons.length - (audioSermons + videoSermons), icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
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

  const getAllSermon = useCallback(async () => {
    setLoading(true);
    try {
      const res: AxiosResponse = await getSermonsList();
      const response = res.data as SermonPropType[];
      setSermonData(response)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }, [handleApiError]);

  useEffect(() => {
    getAllSermon();
  }, [getAllSermon])

  const [createModal, setCreateModal] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    minister: Yup.string().required("Minister is required"),
    sermon_type: Yup.string().required("Sermon type is required"),
    file: Yup.mixed()
      .nullable()
      .test("file-required", "File is required", function (value) {
        const { sermon_type } = this.parent;
        // For audio and video, file is required
        if (sermon_type === "audio" || sermon_type === "video") {
          return value instanceof File;
        }
        // For text, file might be optional or also required - adjust based on your needs
        // For now, making it required for all types
        return value instanceof File;
      })
      .test("file-type", "Invalid file type", function (value) {
        if (!value || !(value instanceof File)) return true; // Let required test handle null
        const { sermon_type } = this.parent;

        if (sermon_type === "audio") {
          return value.type.startsWith("audio/");
        }
        if (sermon_type === "video") {
          return value.type.startsWith("video/");
        }
        if (sermon_type === "text") {
          // For text, you might accept text files, PDFs, or other document types
          // Adjust based on your requirements
          return true; // Accept any file type for text sermons
        }
        return true;
      }),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      minister: "",
      sermon_type: "",
      file: null,
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createSermon(accessToken || "", {
          title: values.title,
          minister: values.minister,
          sermon_type: values.sermon_type,
          file: values.file,
          description: values.description,
        });
        showToast("Sermon created successfully!", "success");
        setCreateModal(false);
        formik.resetForm();
        getAllSermon();
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
          <h1 className="text-2xl font-semibold text-gray-900">Manage Sermon</h1>
          <p className="text-gray-500 mt-1">
            Organize and manage church sermons and activities effectively
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export
          </button>

          {(user?.role === 'pastor' || user?.role === 'super_admin' || user?.role === 'parish_admin' || user?.role === 'leader') && <button
            onClick={() => setCreateModal(true)}
            className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition">
            <FiPlus className="mr-2" /> Create New Sermon
          </button>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
      {/* List */}
      <SermonsTable sermons={sermonData || []} onSermonDeleted={getAllSermon} />
      <Popup
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
          formik.resetForm();
        }}
        title="Upload new sermon"
        supportingText="Upload a new sermon to your database, this will also be available on your website"
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
          <RegularInputField
            label="Minister"
            name="minister"
            id="minister"
            value={formik.values.minister}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.minister && formik.errors.minister ? formik.errors.minister : undefined}
          />
          <div className="flex flex-col space-y-1">
            <label className="font-normal text-base text-[#383838]">Sermon Type</label>
            <select
              name="sermon_type"
              id="sermon_type"
              value={formik.values.sermon_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="appearance-none w-full p-3 rounded-[5px] border-[1px] border-[#EAECF0] focus:outline-none focus:ring-2 focus:ring-main-orange font-normal"
            >
              <option value="">Select sermon type</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              {/* <option value="text">Text</option> */}
            </select>
            {formik.touched.sermon_type && formik.errors.sermon_type && (
              <p className="text-[12px] text-red-500">{formik.errors.sermon_type}</p>
            )}
          </div>
          <MediaUploadField
            label="Sermon File"
            type={
              formik.values.sermon_type === "audio" ? "Audio" :
                formik.values.sermon_type === "video" ? "Video" :
                  // formik.values.sermon_type === "text" ? "Ebook" :
                  "Picture"
            }
            name="file"
            onChange={(file) => formik.setFieldValue('file', file)}
            onBlur={() => formik.setFieldTouched("file", true)}
            error={formik.touched.file ? (formik.errors.file as string) : undefined}
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
              {loading ? "Creating..." : "Create Sermon"}
            </button>
          </div>
        </form>
      </Popup>
    </div>
  );
};

export default SermonsPage;
