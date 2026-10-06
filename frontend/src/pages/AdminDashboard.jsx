import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Upload,
  FileText,
  Users,
  BookOpen,
  Download,
  Eye,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  BarChart3,
  FolderOpen,
  GraduationCap,
  Menu,
  ShieldCheck,
  Music,
  Image,
  Play,
  Pause,
  UserCheck,
  UserPlus,
  Activity,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://studygem-your-knowledge-your-growth.onrender.com/api";


const AdminDashboard = ({ onLogout }) => {
  const fileInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [pyqs, setPyqs] = useState([]);
  const [loadingPyqs, setLoadingPyqs] =
    useState(true);

  // =====================================================
  // SONG MANAGEMENT
  // =====================================================

  const songAudioInputRef = useRef(null);
  const songThumbnailInputRef = useRef(null);

  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] =
    useState(true);

  const [uploadingSong, setUploadingSong] =
    useState(false);

  const [deletingSongId, setDeletingSongId] =
    useState(null);

  const [togglingSongId, setTogglingSongId] =
    useState(null);

  const [songTitle, setSongTitle] =
    useState("");

  const [songArtist, setSongArtist] =
    useState("");

  const [songOrder, setSongOrder] =
    useState("");

  const [selectedSongAudio, setSelectedSongAudio] =
    useState(null);

  const [selectedSongThumbnail, setSelectedSongThumbnail] =
    useState(null);

  // =====================================================
  // USER ANALYTICS
  // =====================================================

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0,
    newUsers7Days: 0,
    admins: 0,
    growth: [],
    recentUsers: [],
  });

  const [loadingUserStats, setLoadingUserStats] =
    useState(true);

  const [userStatsAvailable, setUserStatsAvailable] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [selectedYear, setSelectedYear] =
    useState("");

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [editTitle, setEditTitle] =
    useState("");

  const [editCategory, setEditCategory] =
    useState("");

  const [editSubject, setEditSubject] =
    useState("");

  const [editYear, setEditYear] =
    useState("");

  const [editClass, setEditClass] =
    useState("");


  // =====================================================
  // AUTH TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem(
      "studyGemToken"
    );
  };


  // =====================================================
  // CLEAR MESSAGE
  // =====================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };


  // =====================================================
  // FETCH PYQs
  // =====================================================

  const fetchPYQs = async () => {
    try {
      setLoadingPyqs(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/pyq`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch PYQs."
        );
      }

      setPyqs(data.pyqs || []);
    } catch (err) {
      console.error(
        "Fetch PYQs Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load PYQs."
      );
    } finally {
      setLoadingPyqs(false);
    }
  };


  // =====================================================
  // FETCH SONGS
  // =====================================================

  const fetchSongs = async () => {
    try {
      setLoadingSongs(true);

      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/songs/admin`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch songs."
        );
      }

      setSongs(data.songs || []);
    } catch (err) {
      console.error(
        "Fetch Songs Error:",
        err
      );
    } finally {
      setLoadingSongs(false);
    }
  };


  // =====================================================
  // FETCH USER ANALYTICS
  // =====================================================

  const fetchUserStats = async () => {
    try {
      setLoadingUserStats(true);

      const token = getToken();

      if (!token) {
        setUserStatsAvailable(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/admin-stats`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch user statistics."
        );
      }

      setUserStats({
        totalUsers:
          Number(data.stats?.totalUsers) || 0,

        verifiedUsers:
          Number(data.stats?.verifiedUsers) || 0,

        activeUsers:
          Number(data.stats?.activeUsers) || 0,

        newUsers7Days:
          Number(data.stats?.newUsers7Days) || 0,

        admins:
          Number(data.stats?.admins) || 0,

        growth:
          Array.isArray(data.stats?.growth)
            ? data.stats.growth
            : [],

        recentUsers:
          Array.isArray(data.stats?.recentUsers)
            ? data.stats.recentUsers
            : [],
      });

      setUserStatsAvailable(true);
    } catch (err) {
      console.error(
        "Fetch User Stats Error:",
        err
      );

      setUserStatsAvailable(false);
    } finally {
      setLoadingUserStats(false);
    }
  };


  useEffect(() => {
    fetchPYQs();
    fetchSongs();
    fetchUserStats();
  }, []);


  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (event) => {
    clearMessages();

    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      setError(
        "Only PDF files are allowed."
      );

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "PDF size must be less than 10 MB."
      );

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };


  // =====================================================
  // RESET UPLOAD FORM
  // =====================================================

  const resetUploadForm = () => {
    setTitle("");
    setSelectedCategory("");
    setSelectedSubject("");
    setSelectedYear("");
    setSelectedClass("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  // =====================================================
  // SONG FILE VALIDATION
  // =====================================================

  const handleSongAudioChange = (event) => {
    clearMessages();

    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedSongAudio(null);
      return;
    }

    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/ogg",
      "audio/mp4",
      "audio/x-m4a",
      "audio/aac",
    ];

    const validType =
      allowedTypes.includes(file.type) ||
      /\.(mp3|wav|ogg|m4a|aac)$/i.test(
        file.name
      );

    if (!validType) {
      setError(
        "Please select a valid audio file (MP3, WAV, OGG, M4A or AAC)."
      );

      event.target.value = "";
      setSelectedSongAudio(null);
      return;
    }

    if (
      file.size >
      50 * 1024 * 1024
    ) {
      setError(
        "Audio file must be less than 50 MB."
      );

      event.target.value = "";
      setSelectedSongAudio(null);
      return;
    }

    setSelectedSongAudio(file);
  };


  const handleSongThumbnailChange = (
    event
  ) => {
    clearMessages();

    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedSongThumbnail(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image for the thumbnail."
      );

      event.target.value = "";
      setSelectedSongThumbnail(null);
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Thumbnail must be less than 5 MB."
      );

      event.target.value = "";
      setSelectedSongThumbnail(null);
      return;
    }

    setSelectedSongThumbnail(file);
  };


  const resetSongForm = () => {
    setSongTitle("");
    setSongArtist("");
    setSongOrder("");
    setSelectedSongAudio(null);
    setSelectedSongThumbnail(null);

    if (songAudioInputRef.current) {
      songAudioInputRef.current.value = "";
    }

    if (songThumbnailInputRef.current) {
      songThumbnailInputRef.current.value = "";
    }
  };


  // =====================================================
  // UPLOAD SONG
  // =====================================================

  const handleSongUpload = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    if (!songTitle.trim()) {
      setError(
        "Please enter a song title."
      );
      return;
    }

    if (!selectedSongAudio) {
      setError(
        "Please select an audio file."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Authentication expired. Please login again."
      );
      return;
    }

    try {
      setUploadingSong(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        songTitle.trim()
      );

      formData.append(
        "artist",
        songArtist.trim() ||
          "StudyGem"
      );

      formData.append(
        "order",
        songOrder || "0"
      );

      formData.append(
        "audio",
        selectedSongAudio
      );

      if (selectedSongThumbnail) {
        formData.append(
          "thumbnail",
          selectedSongThumbnail
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/songs/add`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to upload song."
        );
      }

      setSuccess(
        "Song uploaded successfully."
      );

      resetSongForm();

      await fetchSongs();
    } catch (err) {
      console.error(
        "Upload Song Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while uploading the song."
      );
    } finally {
      setUploadingSong(false);
    }
  };


  // =====================================================
  // DELETE SONG
  // =====================================================

  const handleDeleteSong = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this song? This will also remove its files from Cloudinary."
      );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Authentication expired. Please login again."
      );
      return;
    }

    try {
      clearMessages();

      setDeletingSongId(id);

      const response =
        await fetch(
          `${API_BASE_URL}/songs/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete song."
        );
      }

      setSuccess(
        "Song deleted successfully."
      );

      setSongs((current) =>
        current.filter(
          (item) =>
            item._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Song Error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete song."
      );
    } finally {
      setDeletingSongId(null);
    }
  };


  // =====================================================
  // TOGGLE SONG
  // =====================================================

  const handleToggleSong = async (
    id
  ) => {
    const token = getToken();

    if (!token) {
      setError(
        "Authentication expired. Please login again."
      );
      return;
    }

    try {
      clearMessages();

      setTogglingSongId(id);

      const response =
        await fetch(
          `${API_BASE_URL}/songs/${id}/toggle`,
          {
            method: "PATCH",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update song."
        );
      }

      setSongs((current) =>
        current.map(
          (item) =>
            item._id === id
              ? {
                  ...item,
                  isActive:
                    data.song?.isActive ??
                    !item.isActive,
                }
              : item
        )
      );

      setSuccess(
        data.message ||
          "Song status updated successfully."
      );
    } catch (err) {
      console.error(
        "Toggle Song Error:",
        err
      );

      setError(
        err.message ||
          "Unable to update song."
      );
    } finally {
      setTogglingSongId(null);
    }
  };


  // =====================================================
  // UPLOAD PYQ
  // =====================================================

  const handleUpload = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    if (!title.trim()) {
      setError(
        "Please enter PYQ title."
      );
      return;
    }

    if (!selectedCategory) {
      setError(
        "Please select category."
      );
      return;
    }

    if (!selectedSubject) {
      setError(
        "Please select subject."
      );
      return;
    }

    if (!selectedYear) {
      setError(
        "Please select year."
      );
      return;
    }

    if (!selectedClass) {
      setError(
        "Please select class/exam level."
      );
      return;
    }

    if (!selectedFile) {
      setError(
        "Please select a PDF file."
      );
      return;
    }

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      setError(
        "Only PDF files are allowed."
      );
      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      setError(
        "PDF size must be less than 10 MB."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Authentication expired. Please login again."
      );
      return;
    }

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "category",
        selectedCategory
      );

      formData.append(
        "subject",
        selectedSubject
      );

      formData.append(
        "year",
        selectedYear
      );

      formData.append(
        "classLevel",
        selectedClass
      );

      formData.append(
        "file",
        selectedFile
      );

      const response =
        await fetch(
          `${API_BASE_URL}/pyq/upload`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to upload PYQ."
        );
      }

      setSuccess(
        "PYQ uploaded successfully."
      );

      resetUploadForm();

      await fetchPYQs();
    } catch (err) {
      console.error(
        "Upload PYQ Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };


  // =====================================================
  // DELETE PYQ
  // =====================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this PYQ? This will also remove the PDF from storage."
      );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Authentication expired. Please login again."
      );
      return;
    }

    try {
      clearMessages();

      setDeletingId(id);

      const response =
        await fetch(
          `${API_BASE_URL}/pyq/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete PYQ."
        );
      }

      setSuccess(
        "PYQ deleted successfully."
      );

      setPyqs((current) =>
        current.filter(
          (item) =>
            item._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete PYQ Error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete PYQ."
      );
    } finally {
      setDeletingId(null);
    }
  };


  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (item) => {
    clearMessages();

    setEditingId(item._id);

    setEditTitle(
      item.title || ""
    );

    setEditCategory(
      item.category || ""
    );

    setEditSubject(
      item.subject || ""
    );

    setEditYear(
      item.year || ""
    );

    setEditClass(
      item.classLevel || ""
    );
  };


  // =====================================================
  // UPDATE PYQ
  // =====================================================

  const handleUpdate = async (
    event
  ) => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Authentication expired. Please login again."
      );
      return;
    }

    if (!editTitle.trim()) {
      setError(
        "Title is required."
      );
      return;
    }

    try {
      clearMessages();

      const response =
        await fetch(
          `${API_BASE_URL}/pyq/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title:
                editTitle.trim(),

              category:
                editCategory,

              subject:
                editSubject,

              year:
                editYear,

              classLevel:
                editClass,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update PYQ."
        );
      }

      setSuccess(
        "PYQ updated successfully."
      );

      setEditingId(null);

      await fetchPYQs();
    } catch (err) {
      console.error(
        "Update PYQ Error:",
        err
      );

      setError(
        err.message ||
          "Unable to update PYQ."
      );
    }
  };


  // =====================================================
  // FILTERED PYQs
  // =====================================================

  const filteredPYQs =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return pyqs.filter(
        (item) => {
          if (!query) {
            return true;
          }

          return (
            item.title
              ?.toLowerCase()
              .includes(query) ||

            item.category
              ?.toLowerCase()
              .includes(query) ||

            item.subject
              ?.toLowerCase()
              .includes(query) ||

            String(
              item.year || ""
            ).includes(query)
          );
        }
      );
    }, [pyqs, search]);


  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const stats = [
    {
      title: "Total Users",
      value:
        userStatsAvailable
          ? userStats.totalUsers
          : "—",
      icon: Users,
      description:
        "Registered students",
    },

    {
      title: "Total PYQs",
      value: pyqs.length,
      icon: FileText,
      description:
        "Uploaded papers",
    },

    {
      title: "Categories",
      value:
        new Set(
          pyqs.map(
            (item) =>
              item.category
          )
        ).size,
      icon: FolderOpen,
      description:
        "Active categories",
    },

    {
      title: "Subjects",
      value:
        new Set(
          pyqs.map(
            (item) =>
              item.subject
          )
        ).size,
      icon: BookOpen,
      description:
        "Available subjects",
    },

    {
      title: "Downloads",
      value: pyqs.reduce(
        (total, item) =>
          total +
          Number(
            item.downloads || 0
          ),
        0
      ),
      icon: Download,
      description:
        "Total downloads",
    },

    {
      title: "Views",
      value: pyqs.reduce(
        (total, item) =>
          total +
          Number(
            item.views || 0
          ),
        0
      ),
      icon: Eye,
      description:
        "Total views",
    },
  ];


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =====================================================
  // FILE SIZE
  // =====================================================

  const formatFileName = (
    name
  ) => {
    if (!name) {
      return "PDF Document";
    }

    if (name.length <= 30) {
      return name;
    }

    return (
      name.slice(0, 27) +
      "..."
    );
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false);

    if (onLogout) {
      onLogout();
    }
  };


  // =====================================================
  // THEME
  // =====================================================

  const pageBg = darkMode
    ? "bg-[#080812]"
    : "bg-[#f7f5ff]";

  const cardBg = darkMode
    ? "bg-[#11111d]"
    : "bg-white";

  const textPrimary = darkMode
    ? "text-white"
    : "text-[#17203d]";

  const textSecondary =
    darkMode
      ? "text-[#a7a7bb]"
      : "text-[#69738d]";

  const borderColor =
    darkMode
      ? "border-[#26263a]"
      : "border-[#e8e4f5]";


  return (
    <div
      className={`
        min-h-screen
        w-full
        ${pageBg}
        ${textPrimary}
        transition-colors
        duration-300
      `}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={`
          sticky
          top-0
          z-40
          border-b
          ${borderColor}
          ${cardBg}
        `}
      >
        <div
          className="
            w-full
            px-4
            sm:px-6
            lg:px-8
            py-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="
                  lg:hidden
                  h-10
                  w-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-[#f0ebff]
                  text-[#6425ed]
                "
              >
                <Menu size={20} />
              </button>

              <div
                className="
                  h-11
                  w-11
                  rounded-xl
                  bg-gradient-to-br
                  from-[#8b32ff]
                  to-[#4c20ff]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-purple-200
                "
              >
                <ShieldCheck
                  size={22}
                  className="text-white"
                />
              </div>

              <div>
                <h1
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                  "
                >
                  StudyGem
                </h1>

                <p
                  className={`
                    text-xs
                    ${textSecondary}
                  `}
                >
                  Admin Panel
                </p>
              </div>
            </div>


            <div
              className="
                hidden
                md:flex
                flex-1
                max-w-xl
                mx-4
              "
            >
              <div
                className={`
                  w-full
                  h-11
                  rounded-xl
                  border
                  ${borderColor}
                  ${darkMode
                    ? "bg-[#171725]"
                    : "bg-[#f8f7fc]"
                  }
                  flex
                  items-center
                  gap-3
                  px-4
                `}
              >
                <Search
                  size={18}
                  className={
                    darkMode
                      ? "text-[#89899e]"
                      : "text-[#8991a7]"
                  }
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search PYQs, songs and users..."
                  className={`
                    w-full
                    bg-transparent
                    outline-none
                    text-sm
                    ${textPrimary}
                    placeholder:text-[#969bb0]
                  `}
                />
              </div>
            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setDarkMode(
                    !darkMode
                  )
                }
                className={`
                  h-10
                  w-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  border
                  ${borderColor}
                  ${darkMode
                    ? "bg-[#171725]"
                    : "bg-[#f8f7fc]"
                  }
                `}
              >
                {darkMode ? (
                  <Sun
                    size={18}
                    className="text-yellow-400"
                  />
                ) : (
                  <Moon
                    size={18}
                    className="text-[#6425ed]"
                  />
                )}
              </button>


              <button
                type="button"
                className={`
                  hidden
                  sm:flex
                  h-10
                  w-10
                  rounded-xl
                  items-center
                  justify-center
                  border
                  ${borderColor}
                `}
              >
                <Bell
                  size={18}
                  className={
                    darkMode
                      ? "text-[#a7a7bb]"
                      : "text-[#68738f]"
                  }
                />
              </button>


              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      !profileOpen
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    px-2
                    py-1.5
                    hover:bg-[#f4f1ff]
                  "
                >
                  <div
                    className="
                      h-9
                      w-9
                      rounded-full
                      bg-gradient-to-br
                      from-[#8b32ff]
                      to-[#4c20ff]
                      flex
                      items-center
                      justify-center
                      text-white
                      text-sm
                      font-bold
                    "
                  >
                    A
                  </div>

                  <div className="hidden lg:block text-left">
                    <p
                      className="
                        text-sm
                        font-semibold
                      "
                    >
                      Admin
                    </p>

                    <p
                      className={`
                        text-[11px]
                        ${textSecondary}
                      `}
                    >
                      Administrator
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={
                      textSecondary
                    }
                  />
                </button>


                {profileOpen && (
                  <div
                    className={`
                      absolute
                      right-0
                      top-12
                      z-50
                      w-52
                      rounded-2xl
                      border
                      ${borderColor}
                      ${cardBg}
                      shadow-xl
                      p-2
                    `}
                  >
                    <div
                      className="
                        px-3
                        py-2
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        Admin Account
                      </p>

                      <p
                        className={`
                          text-xs
                          ${textSecondary}
                        `}
                      >
                        Manage StudyGem
                      </p>
                    </div>

                    <div
                      className={`
                        h-px
                        my-1
                        ${darkMode
                          ? "bg-[#26263a]"
                          : "bg-[#ece9f5]"
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-xl
                        text-sm
                        text-red-500
                        hover:bg-red-50
                        text-left
                      "
                    >
                      <LogOut
                        size={17}
                      />

                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="md:hidden mt-3">
            <div
              className={`
                h-11
                rounded-xl
                border
                ${borderColor}
                flex
                items-center
                gap-3
                px-4
                ${darkMode
                  ? "bg-[#171725]"
                  : "bg-[#f8f7fc]"
                }
              `}
            >
              <Search
                size={18}
                className={
                  textSecondary
                }
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search PYQs, songs and users..."
                className={`
                  w-full
                  bg-transparent
                  outline-none
                  text-sm
                  ${textPrimary}
                `}
              />
            </div>
          </div>
        </div>
      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          w-full
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-8
        "
      >
        {/* =================================================
            WELCOME
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[24px]
            bg-gradient-to-r
            from-[#6526ef]
            via-[#7d31ef]
            to-[#9b46f6]
            p-6
            sm:p-8
            text-white
            shadow-xl
            shadow-purple-200
          "
        >
          <div
            className="
              relative
              z-10
              max-w-2xl
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/15
                border
                border-white/20
                px-3
                py-1.5
                text-xs
                font-medium
                mb-4
              "
            >
              <ShieldCheck
                size={14}
              />

              Admin Dashboard
            </div>

            <h2
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                tracking-tight
              "
            >
              Welcome back, Admin 👋
            </h2>

            <p
              className="
                mt-2
                text-sm
                sm:text-base
                text-white/80
                max-w-xl
              "
            >
              Manage StudyGem PYQs,
              upload new papers,
              manage study music,
              monitor users and
              keep your study content
              organized from one place.
            </p>
          </div>

          <div
            className="
              absolute
              -right-12
              -bottom-20
              h-64
              w-64
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              absolute
              right-10
              top-8
              hidden
              lg:block
              opacity-20
            "
          >
            <GraduationCap
              size={130}
            />
          </div>
        </section>


        {/* =================================================
            ALERTS
        ================================================= */}

        {(success || error) && (
          <div className="mt-5">
            {success && (
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  text-green-700
                "
              >
                <CheckCircle2
                  size={18}
                />

                <span>
                  {success}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSuccess("")
                  }
                  className="ml-auto"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {error && (
              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                <AlertCircle
                  size={18}
                />

                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                  className="ml-auto"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}


        {/* =================================================
            STATS
        ================================================= */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-6
            gap-4
          "
        >
          {stats.map(
            (stat) => {
              const Icon =
                stat.icon;

              return (
                <div
                  key={
                    stat.title
                  }
                  className={`
                    ${cardBg}
                    rounded-2xl
                    border
                    ${borderColor}
                    p-5
                    shadow-sm
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div
                      className="
                        h-11
                        w-11
                        rounded-xl
                        bg-[#f0eaff]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        size={20}
                        className="text-[#6c2cf5]"
                      />
                    </div>

                    <BarChart3
                      size={17}
                      className={
                        textSecondary
                      }
                    />
                  </div>

                  <p
                    className={`
                      mt-5
                      text-2xl
                      font-bold
                      ${textPrimary}
                    `}
                  >
                    {stat.value}
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                    "
                  >
                    {stat.title}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-xs
                      ${textSecondary}
                    `}
                  >
                    {stat.description}
                  </p>
                </div>
              );
            }
          )}
        </section>


        {/* =================================================
            USER ANALYTICS
        ================================================= */}

        <section
          className={`
            mt-6
            ${cardBg}
            rounded-[24px]
            border
            ${borderColor}
            shadow-sm
            overflow-hidden
          `}
        >
          <div
            className={`
              px-5
              sm:px-6
              py-5
              border-b
              ${borderColor}
            `}
          >
            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Users
                    size={19}
                    className="text-[#6c2cf5]"
                  />

                  <h3
                    className="
                      text-lg
                      font-bold
                    "
                  >
                    User Overview
                  </h3>
                </div>

                <p
                  className={`
                    mt-1
                    text-sm
                    ${textSecondary}
                  `}
                >
                  Monitor registered users,
                  verification and recent
                  account activity.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchUserStats}
                disabled={
                  loadingUserStats
                }
                className="
                  h-10
                  px-4
                  rounded-xl
                  border
                  border-[#ddd8ed]
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  font-semibold
                  text-[#6425ed]
                  hover:bg-[#f6f2ff]
                  transition
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    loadingUserStats
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh Users
              </button>
            </div>
          </div>


          {!userStatsAvailable &&
          !loadingUserStats ? (
            <div
              className="
                px-5
                sm:px-6
                py-8
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  h-12
                  w-12
                  rounded-2xl
                  bg-[#f0eaff]
                  flex
                  items-center
                  justify-center
                "
              >
                <Users
                  size={22}
                  className="text-[#7c3aed]"
                />
              </div>

              <h4
                className="
                  mt-4
                  text-sm
                  font-semibold
                "
              >
                User analytics unavailable
              </h4>

              <p
                className={`
                  mt-1
                  text-xs
                  max-w-lg
                  mx-auto
                  ${textSecondary}
                `}
              >
                Connect the admin user
                statistics endpoint to show
                live registered-user details.
              </p>
            </div>
          ) : (
            <>
              <div
                className="
                  p-5
                  sm:p-6
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-4
                "
              >
                <div
                  className={`
                    rounded-2xl
                    border
                    ${borderColor}
                    p-4
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-[#faf9ff]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div
                      className="
                        h-10
                        w-10
                        rounded-xl
                        bg-[#eee8ff]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Users
                        size={18}
                        className="text-[#6c2cf5]"
                      />
                    </div>

                    <TrendingUp
                      size={17}
                      className="text-emerald-500"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-2xl
                      font-bold
                    "
                  >
                    {loadingUserStats
                      ? "..."
                      : userStats.totalUsers}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-xs
                      ${textSecondary}
                    `}
                  >
                    Total registered users
                  </p>
                </div>


                <div
                  className={`
                    rounded-2xl
                    border
                    ${borderColor}
                    p-4
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-[#faf9ff]"
                    }
                  `}
                >
                  <div
                    className="
                      h-10
                      w-10
                      rounded-xl
                      bg-green-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <UserCheck
                      size={18}
                      className="text-green-600"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-2xl
                      font-bold
                    "
                  >
                    {loadingUserStats
                      ? "..."
                      : userStats.verifiedUsers}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-xs
                      ${textSecondary}
                    `}
                  >
                    Verified users
                  </p>
                </div>


                <div
                  className={`
                    rounded-2xl
                    border
                    ${borderColor}
                    p-4
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-[#faf9ff]"
                    }
                  `}
                >
                  <div
                    className="
                      h-10
                      w-10
                      rounded-xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <UserPlus
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-2xl
                      font-bold
                    "
                  >
                    {loadingUserStats
                      ? "..."
                      : userStats.newUsers7Days}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-xs
                      ${textSecondary}
                    `}
                  >
                    New users · last 7 days
                  </p>
                </div>


                <div
                  className={`
                    rounded-2xl
                    border
                    ${borderColor}
                    p-4
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-[#faf9ff]"
                    }
                  `}
                >
                  <div
                    className="
                      h-10
                      w-10
                      rounded-xl
                      bg-purple-50
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Activity
                      size={18}
                      className="text-purple-600"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-2xl
                      font-bold
                    "
                  >
                    {loadingUserStats
                      ? "..."
                      : userStats.activeUsers}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-xs
                      ${textSecondary}
                    `}
                  >
                    Active users · last 7 days
                  </p>
                </div>
              </div>


              <div
                className="
                  px-5
                  sm:px-6
                  pb-5
                  sm:pb-6
                  grid
                  grid-cols-1
                  xl:grid-cols-[1.35fr_0.65fr]
                  gap-5
                "
              >
                <div
                  className={`
                    rounded-2xl
                    border
                    ${borderColor}
                    p-5
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <h4
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        User Growth
                      </h4>

                      <p
                        className={`
                          mt-1
                          text-xs
                          ${textSecondary}
                        `}
                      >
                        Registered users over recent
                        months.
                      </p>
                    </div>

                    <div
                      className="
                        rounded-full
                        bg-[#f0eaff]
                        px-3
                        py-1.5
                        text-[11px]
                        font-medium
                        text-[#6425ed]
                      "
                    >
                      Last 6 months
                    </div>
                  </div>


                  <div
                    className="
                      mt-6
                      h-44
                      flex
                      items-end
                      gap-2
                      sm:gap-4
                    "
                  >
                    {(
                      userStats.growth.length
                        ? userStats.growth
                        : [
                            {
                              label: "—",
                              users: 0,
                            },
                          ]
                    ).map(
                      (item, index) => {
                        const values =
                          userStats.growth.length
                            ? userStats.growth.map(
                                (entry) =>
                                  Number(
                                    entry.users ||
                                      entry.count ||
                                      entry.value ||
                                      0
                                  )
                              )
                            : [0];

                        const maxValue =
                          Math.max(
                            ...values,
                            1
                          );

                        const value =
                          Number(
                            item.users ||
                              item.count ||
                              item.value ||
                              0
                          );

                        const height =
                          Math.max(
                            value === 0
                              ? 4
                              : (value /
                                  maxValue) *
                                  100,
                            4
                          );

                        return (
                          <div
                            key={`${item.label || index}-${index}`}
                            className="
                              flex
                              h-full
                              flex-1
                              min-w-0
                              flex-col
                              items-center
                              justify-end
                              gap-2
                            "
                          >
                            <span
                              className="
                                text-[10px]
                                text-[#7a8195]
                              "
                            >
                              {value || ""}
                            </span>

                            <div
                              className="
                                w-full
                                max-w-10
                                rounded-t-xl
                                bg-gradient-to-t
                                from-[#5b21e9]
                                to-[#a855f7]
                                transition-all
                              "
                              style={{
                                height: `${height}%`,
                              }}
                            />

                            <span
                              className="
                                text-[10px]
                                text-[#7a8195]
                                truncate
                                max-w-12
                              "
                            >
                              {item.label ||
                                "—"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>


                <div
                  className={`
                    rounded-2xl
                    border
                    ${borderColor}
                    p-5
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <h4
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        Recent Users
                      </h4>

                      <p
                        className={`
                          mt-1
                          text-xs
                          ${textSecondary}
                        `}
                      >
                        Latest registered accounts.
                      </p>
                    </div>

                    <div
                      className="
                        h-9
                        w-9
                        rounded-xl
                        bg-[#f0eaff]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Users
                        size={16}
                        className="text-[#6425ed]"
                      />
                    </div>
                  </div>


                  <div
                    className="
                      mt-4
                      space-y-3
                    "
                  >
                    {loadingUserStats ? (
                      <div
                        className="
                          py-8
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Loader2
                          size={20}
                          className="
                            animate-spin
                            text-[#7c3aed]
                          "
                        />
                      </div>
                    ) : userStats.recentUsers
                        .length === 0 ? (
                      <div
                        className="
                          py-8
                          text-center
                        "
                      >
                        <p
                          className={`
                            text-xs
                            ${textSecondary}
                          `}
                        >
                          No recent users found.
                        </p>
                      </div>
                    ) : (
                      userStats.recentUsers
                        .slice(0, 5)
                        .map(
                          (user) => {
                            const userName =
                              user.name ||
                              "User";

                            const initials =
                              userName
                                .split(" ")
                                .map(
                                  (part) =>
                                    part[0]
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();

                            return (
                              <div
                                key={
                                  user._id ||
                                  user.id ||
                                  user.email
                                }
                                className="
                                  flex
                                  items-center
                                  gap-3
                                "
                              >
                                <div
                                  className="
                                    h-9
                                    w-9
                                    shrink-0
                                    rounded-full
                                    bg-gradient-to-br
                                    from-[#8b32ff]
                                    to-[#4c20ff]
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                    text-[11px]
                                    font-semibold
                                  "
                                >
                                  {initials}
                                </div>

                                <div
                                  className="
                                    min-w-0
                                    flex-1
                                  "
                                >
                                  <p
                                    className="
                                      text-xs
                                      font-semibold
                                      truncate
                                    "
                                  >
                                    {userName}
                                  </p>

                                  <p
                                    className={`
                                      mt-0.5
                                      text-[10px]
                                      truncate
                                      ${textSecondary}
                                    `}
                                  >
                                    {user.email ||
                                      "No email"}
                                  </p>
                                </div>

                                <span
                                  className="
                                    shrink-0
                                    rounded-full
                                    bg-green-50
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-green-600
                                  "
                                >
                                  {user.isVerified
                                    ? "Verified"
                                    : "Pending"}
                                </span>
                              </div>
                            );
                          }
                        )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>


        {/* =================================================
            UPLOAD SECTION
        ================================================= */}

        <section
          className={`
            mt-6
            ${cardBg}
            rounded-[24px]
            border
            ${borderColor}
            shadow-sm
            overflow-hidden
          `}
        >
          <div
            className={`
              px-5
              sm:px-6
              py-5
              border-b
              ${borderColor}
            `}
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Upload
                    size={19}
                    className="text-[#6c2cf5]"
                  />

                  <h3
                    className="
                      text-lg
                      font-bold
                    "
                  >
                    Upload PYQ
                  </h3>
                </div>

                <p
                  className={`
                    mt-1
                    text-sm
                    ${textSecondary}
                  `}
                >
                  Upload a PDF and
                  make it available
                  to students.
                </p>
              </div>

              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#f2edff]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#6425ed]
                "
              >
                PDF only · Max 10 MB
              </div>
            </div>
          </div>


          <form
            onSubmit={
              handleUpload
            }
            className="p-5 sm:p-6"
          >
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-5
              "
            >
              {/* TITLE */}

              <div
                className="
                  md:col-span-2
                  xl:col-span-3
                "
              >
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  PYQ Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. UPSC CSE Prelims 2024 - General Studies Paper 1"
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                    focus:ring-4
                    focus:ring-purple-100
                  `}
                />
              </div>


              {/* CATEGORY */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Category
                </label>

                <select
                  value={
                    selectedCategory
                  }
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                  `}
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="UPSC">
                    UPSC
                  </option>

                  <option value="SSC">
                    SSC
                  </option>

                  <option value="Banking">
                    Banking
                  </option>

                  <option value="Railway">
                    Railway
                  </option>

                  <option value="Teaching">
                    Teaching
                  </option>

                  <option value="State Exams">
                    State Exams
                  </option>

                  <option value="Engineering">
                    Engineering
                  </option>

                  <option value="Medical">
                    Medical
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>


              {/* SUBJECT */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Subject
                </label>

                <input
                  value={
                    selectedSubject
                  }
                  onChange={(e) =>
                    setSelectedSubject(
                      e.target.value
                    )
                  }
                  placeholder="e.g. General Studies"
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                  `}
                />
              </div>


              {/* YEAR */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Year
                </label>

                <select
                  value={
                    selectedYear
                  }
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value
                    )
                  }
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                  `}
                >
                  <option value="">
                    Select Year
                  </option>

                  {Array.from(
                    {
                      length: 15,
                    },
                    (_, index) =>
                      new Date().getFullYear() -
                      index
                  ).map(
                    (year) => (
                      <option
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>


              {/* CLASS / LEVEL */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Class / Exam Level
                </label>

                <select
                  value={
                    selectedClass
                  }
                  onChange={(e) =>
                    setSelectedClass(
                      e.target.value
                    )
                  }
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                  `}
                >
                  <option value="">
                    Select Level
                  </option>

                  <option value="Class 6">
                    Class 6
                  </option>

                  <option value="Class 7">
                    Class 7
                  </option>

                  <option value="Class 8">
                    Class 8
                  </option>

                  <option value="Class 9">
                    Class 9
                  </option>

                  <option value="Class 10">
                    Class 10
                  </option>

                  <option value="Class 11">
                    Class 11
                  </option>

                  <option value="Class 12">
                    Class 12
                  </option>

                  <option value="Graduation">
                    Graduation
                  </option>

                  <option value="Competitive Exam">
                    Competitive Exam
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>


              {/* FILE */}

              <div
                className="
                  md:col-span-2
                  xl:col-span-1
                "
              >
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  PDF File
                </label>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={
                    handleFileChange
                  }
                  className="
                    hidden
                  "
                  id="pyq-pdf-upload"
                />

                <label
                  htmlFor="pyq-pdf-upload"
                  className={`
                    h-12
                    rounded-xl
                    border
                    border-dashed
                    ${darkMode
                      ? "border-[#393950] bg-[#171725]"
                      : "border-[#cfc7e9] bg-[#faf9ff]"
                    }
                    flex
                    items-center
                    gap-3
                    px-4
                    cursor-pointer
                    hover:border-[#7c3aed]
                    transition
                  `}
                >
                  <div
                    className="
                      h-8
                      w-8
                      rounded-lg
                      bg-[#eee8ff]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <FileText
                      size={16}
                      className="text-[#6c2cf5]"
                    />
                  </div>

                  <span
                    className={`
                      text-sm
                      truncate
                      ${selectedFile
                        ? textPrimary
                        : textSecondary
                      }
                    `}
                  >
                    {selectedFile
                      ? formatFileName(
                          selectedFile.name
                        )
                      : "Choose PDF file"}
                  </span>
                </label>
              </div>
            </div>


            <div
              className="
                mt-6
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >
              <p
                className={`
                  text-xs
                  ${textSecondary}
                `}
              >
                Supported format:
                PDF · Maximum size:
                10 MB
              </p>

              <div
                className="
                  flex
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={
                    resetUploadForm
                  }
                  disabled={
                    uploading
                  }
                  className="
                    h-11
                    px-5
                    rounded-xl
                    border
                    border-[#ddd8ed]
                    text-sm
                    font-semibold
                    text-[#5f6579]
                    hover:bg-[#f7f5fb]
                    transition
                    disabled:opacity-50
                  "
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={
                    uploading
                  }
                  className="
                    h-11
                    px-6
                    rounded-xl
                    bg-gradient-to-r
                    from-[#7c2ff3]
                    to-[#5b21e9]
                    text-white
                    text-sm
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-purple-200
                    hover:shadow-purple-300
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  {uploading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload
                        size={17}
                      />

                      Upload PYQ
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>


        {/* =================================================
            SONG MANAGEMENT
        ================================================= */}

        <section
          className={`
            mt-6
            ${cardBg}
            rounded-[24px]
            border
            ${borderColor}
            shadow-sm
            overflow-hidden
          `}
        >
          <div
            className={`
              px-5
              sm:px-6
              py-5
              border-b
              ${borderColor}
            `}
          >
            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Music
                    size={19}
                    className="text-[#6c2cf5]"
                  />

                  <h3
                    className="
                      text-lg
                      font-bold
                    "
                  >
                    Study Music
                  </h3>
                </div>

                <p
                  className={`
                    mt-1
                    text-sm
                    ${textSecondary}
                  `}
                >
                  Upload motivational study songs
                  for the Home page player.
                </p>
              </div>

              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#f2edff]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#6425ed]
                "
              >
                Audio · Max 50 MB
              </div>
            </div>
          </div>


          <form
            onSubmit={
              handleSongUpload
            }
            className="p-5 sm:p-6"
          >
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
                gap-5
              "
            >
              <div
                className="
                  md:col-span-2
                  xl:col-span-2
                "
              >
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Song Title
                </label>

                <input
                  value={songTitle}
                  onChange={(e) =>
                    setSongTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Focus & Keep Going"
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                    focus:ring-4
                    focus:ring-purple-100
                  `}
                />
              </div>


              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Artist
                </label>

                <input
                  value={songArtist}
                  onChange={(e) =>
                    setSongArtist(
                      e.target.value
                    )
                  }
                  placeholder="StudyGem"
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                  `}
                />
              </div>


              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={songOrder}
                  onChange={(e) =>
                    setSongOrder(
                      e.target.value
                    )
                  }
                  placeholder="1"
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    ${borderColor}
                    px-4
                    text-sm
                    outline-none
                    ${darkMode
                      ? "bg-[#171725]"
                      : "bg-white"
                    }
                    focus:border-[#7c3aed]
                  `}
                />
              </div>


              <div
                className="
                  md:col-span-1
                  xl:col-span-2
                "
              >
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Audio File
                </label>

                <input
                  ref={
                    songAudioInputRef
                  }
                  type="file"
                  accept=".mp3,.wav,.ogg,.m4a,.aac,audio/*"
                  onChange={
                    handleSongAudioChange
                  }
                  className="hidden"
                  id="study-song-audio"
                />

                <label
                  htmlFor="study-song-audio"
                  className={`
                    min-h-14
                    rounded-xl
                    border
                    border-dashed
                    ${darkMode
                      ? "border-[#393950] bg-[#171725]"
                      : "border-[#cfc7e9] bg-[#faf9ff]"
                    }
                    flex
                    items-center
                    gap-3
                    px-4
                    cursor-pointer
                    hover:border-[#7c3aed]
                    transition
                  `}
                >
                  <div
                    className="
                      h-9
                      w-9
                      rounded-lg
                      bg-[#eee8ff]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Music
                      size={17}
                      className="text-[#6c2cf5]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`
                        text-sm
                        truncate
                        ${selectedSongAudio
                          ? textPrimary
                          : textSecondary
                        }
                      `}
                    >
                      {selectedSongAudio
                        ? formatFileName(
                            selectedSongAudio.name
                          )
                        : "Choose audio file"}
                    </p>

                    <p
                      className={`
                        mt-0.5
                        text-[11px]
                        ${textSecondary}
                      `}
                    >
                      MP3, WAV, OGG, M4A or AAC
                    </p>
                  </div>
                </label>
              </div>


              <div
                className="
                  md:col-span-1
                  xl:col-span-2
                "
              >
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Thumbnail
                  <span
                    className={`
                      ml-1
                      font-normal
                      ${textSecondary}
                    `}
                  >
                    (optional)
                  </span>
                </label>

                <input
                  ref={
                    songThumbnailInputRef
                  }
                  type="file"
                  accept="image/*"
                  onChange={
                    handleSongThumbnailChange
                  }
                  className="hidden"
                  id="study-song-thumbnail"
                />

                <label
                  htmlFor="study-song-thumbnail"
                  className={`
                    min-h-14
                    rounded-xl
                    border
                    border-dashed
                    ${darkMode
                      ? "border-[#393950] bg-[#171725]"
                      : "border-[#cfc7e9] bg-[#faf9ff]"
                    }
                    flex
                    items-center
                    gap-3
                    px-4
                    cursor-pointer
                    hover:border-[#7c3aed]
                    transition
                  `}
                >
                  <div
                    className="
                      h-9
                      w-9
                      rounded-lg
                      bg-[#eee8ff]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Image
                      size={17}
                      className="text-[#6c2cf5]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`
                        text-sm
                        truncate
                        ${selectedSongThumbnail
                          ? textPrimary
                          : textSecondary
                        }
                      `}
                    >
                      {selectedSongThumbnail
                        ? formatFileName(
                            selectedSongThumbnail.name
                          )
                        : "Choose thumbnail image"}
                    </p>

                    <p
                      className={`
                        mt-0.5
                        text-[11px]
                        ${textSecondary}
                      `}
                    >
                      JPG, PNG, WEBP · Max 5 MB
                    </p>
                  </div>
                </label>
              </div>
            </div>


            <div
              className="
                mt-6
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >
              <p
                className={`
                  text-xs
                  ${textSecondary}
                `}
              >
                Songs uploaded here will become
                available to the StudyGem music
                player.
              </p>

              <div
                className="
                  flex
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={
                    resetSongForm
                  }
                  disabled={
                    uploadingSong
                  }
                  className="
                    h-11
                    px-5
                    rounded-xl
                    border
                    border-[#ddd8ed]
                    text-sm
                    font-semibold
                    text-[#5f6579]
                    hover:bg-[#f7f5fb]
                    transition
                    disabled:opacity-50
                  "
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={
                    uploadingSong
                  }
                  className="
                    h-11
                    px-6
                    rounded-xl
                    bg-gradient-to-r
                    from-[#7c2ff3]
                    to-[#5b21e9]
                    text-white
                    text-sm
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-purple-200
                    hover:shadow-purple-300
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  {uploadingSong ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload
                        size={17}
                      />

                      Upload Song
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>


          {/* MUSIC LIBRARY */}

          <div
            className={`
              border-t
              ${borderColor}
            `}
          >
            <div
              className="
                px-5
                sm:px-6
                py-5
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <h4
                  className="
                    text-base
                    font-semibold
                  "
                >
                  Music Library
                </h4>

                <p
                  className={`
                    mt-1
                    text-xs
                    ${textSecondary}
                  `}
                >
                  {songs.length} song
                  {songs.length === 1
                    ? ""
                    : "s"} in the library.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fetchSongs
                }
                disabled={
                  loadingSongs
                }
                className="
                  h-9
                  px-3
                  rounded-xl
                  border
                  border-[#ddd8ed]
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  font-semibold
                  text-[#6425ed]
                  hover:bg-[#f6f2ff]
                  transition
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={14}
                  className={
                    loadingSongs
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>


            {loadingSongs ? (
              <div
                className="
                  min-h-[180px]
                  flex
                  items-center
                  justify-center
                "
              >
                <Loader2
                  size={25}
                  className="
                    animate-spin
                    text-[#7c3aed]
                  "
                />
              </div>
            ) : songs.length === 0 ? (
              <div
                className="
                  min-h-[180px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  px-5
                "
              >
                <div
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-[#f0eaff]
                    flex
                    items-center
                    justify-center
                    mb-3
                  "
                >
                  <Music
                    size={25}
                    className="text-[#7c3aed]"
                  />
                </div>

                <h5
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  No songs uploaded
                </h5>

                <p
                  className={`
                    mt-1
                    text-xs
                    ${textSecondary}
                  `}
                >
                  Upload your first study song
                  using the form above.
                </p>
              </div>
            ) : (
              <div
                className="
                  overflow-x-auto
                "
              >
                <table
                  className="
                    w-full
                    min-w-[850px]
                  "
                >
                  <thead>
                    <tr
                      className={`
                        border-t
                        border-b
                        ${borderColor}
                        ${darkMode
                          ? "bg-[#171725]"
                          : "bg-[#faf9ff]"
                        }
                      `}
                    >
                      <th
                        className="
                          px-5
                          py-3
                          text-left
                          text-[11px]
                          font-semibold
                          text-[#7a8195]
                          uppercase
                        "
                      >
                        Song
                      </th>

                      <th
                        className="
                          px-5
                          py-3
                          text-left
                          text-[11px]
                          font-semibold
                          text-[#7a8195]
                          uppercase
                        "
                      >
                        Artist
                      </th>

                      <th
                        className="
                          px-5
                          py-3
                          text-left
                          text-[11px]
                          font-semibold
                          text-[#7a8195]
                          uppercase
                        "
                      >
                        Order
                      </th>

                      <th
                        className="
                          px-5
                          py-3
                          text-left
                          text-[11px]
                          font-semibold
                          text-[#7a8195]
                          uppercase
                        "
                      >
                        Status
                      </th>

                      <th
                        className="
                          px-5
                          py-3
                          text-right
                          text-[11px]
                          font-semibold
                          text-[#7a8195]
                          uppercase
                        "
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>


                  <tbody>
                    {songs.map(
                      (song) => (
                        <tr
                          key={
                            song._id
                          }
                          className={`
                            border-b
                            ${borderColor}
                            transition
                            hover:bg-[#faf9ff]
                            ${darkMode
                              ? "hover:bg-[#171725]"
                              : ""
                            }
                          `}
                        >
                          <td
                            className="
                              px-5
                              py-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >
                              <div
                                className="
                                  h-11
                                  w-11
                                  rounded-xl
                                  overflow-hidden
                                  bg-[#eee8ff]
                                  flex
                                  items-center
                                  justify-center
                                  shrink-0
                                "
                              >
                                {song.thumbnailUrl ? (
                                  <img
                                    src={
                                      song.thumbnailUrl
                                    }
                                    alt=""
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                ) : (
                                  <Music
                                    size={18}
                                    className="text-[#7c3aed]"
                                  />
                                )}
                              </div>

                              <div
                                className="
                                  min-w-0
                                "
                              >
                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                    truncate
                                    max-w-[260px]
                                  "
                                  title={
                                    song.title
                                  }
                                >
                                  {
                                    song.title
                                  }
                                </p>

                                <a
                                  href={
                                    song.audioUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="
                                    mt-0.5
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-[11px]
                                    text-[#6c2cf5]
                                    hover:underline
                                  "
                                >
                                  <Play
                                    size={11}
                                    fill="currentColor"
                                  />

                                  Preview audio
                                </a>
                              </div>
                            </div>
                          </td>


                          <td
                            className={`
                              px-5
                              py-4
                              text-sm
                              ${textSecondary}
                            `}
                          >
                            {song.artist ||
                              "StudyGem"}
                          </td>


                          <td
                            className="
                              px-5
                              py-4
                              text-sm
                              font-semibold
                            "
                          >
                            {song.order ||
                              0}
                          </td>


                          <td
                            className="
                              px-5
                              py-4
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleSong(
                                  song._id
                                )
                              }
                              disabled={
                                togglingSongId ===
                                song._id
                              }
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                transition
                                ${
                                  song.isActive
                                    ? "bg-green-50 text-green-600"
                                    : "bg-gray-100 text-gray-500"
                                }
                              `}
                            >
                              {togglingSongId ===
                              song._id ? (
                                <Loader2
                                  size={13}
                                  className="animate-spin"
                                />
                              ) : (
                                <span
                                  className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-current
                                  "
                                />
                              )}

                              {song.isActive
                                ? "Active"
                                : "Inactive"}
                            </button>
                          </td>


                          <td
                            className="
                              px-5
                              py-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                justify-end
                                gap-2
                              "
                            >
                              <a
                                href={
                                  song.audioUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                  h-9
                                  w-9
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                  bg-[#f0eaff]
                                  text-[#6425ed]
                                  hover:bg-[#e6ddff]
                                  transition
                                "
                                title="Preview"
                              >
                                <Play
                                  size={15}
                                  fill="currentColor"
                                />
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteSong(
                                    song._id
                                  )
                                }
                                disabled={
                                  deletingSongId ===
                                  song._id
                                }
                                className="
                                  h-9
                                  w-9
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                  bg-red-50
                                  text-red-500
                                  hover:bg-red-100
                                  transition
                                  disabled:opacity-50
                                "
                                title="Delete"
                              >
                                {deletingSongId ===
                                song._id ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={15}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>


        {/* =================================================
            RECENT UPLOADS
        ================================================= */}

        <section
          className={`
            mt-6
            ${cardBg}
            rounded-[24px]
            border
            ${borderColor}
            shadow-sm
            overflow-hidden
          `}
        >
          <div
            className={`
              px-5
              sm:px-6
              py-5
              border-b
              ${borderColor}
              flex
              flex-col
              sm:flex-row
              sm:items-center
              justify-between
              gap-4
            `}
          >
            <div>
              <h3
                className="
                  text-lg
                  font-bold
                "
              >
                Recent Uploads
              </h3>

              <p
                className={`
                  mt-1
                  text-sm
                  ${textSecondary}
                `}
              >
                Manage all PYQs
                uploaded to StudyGem.
              </p>
            </div>

            <button
              type="button"
              onClick={
                fetchPYQs
              }
              disabled={
                loadingPyqs
              }
              className="
                h-10
                px-4
                rounded-xl
                border
                border-[#ddd8ed]
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-semibold
                text-[#6425ed]
                hover:bg-[#f6f2ff]
                transition
              "
            >
              <RefreshCw
                size={16}
                className={
                  loadingPyqs
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>


          {loadingPyqs ? (
            <div
              className="
                min-h-[280px]
                flex
                flex-col
                items-center
                justify-center
                gap-3
              "
            >
              <Loader2
                size={28}
                className="
                  animate-spin
                  text-[#7c3aed]
                "
              />

              <p
                className={`
                  text-sm
                  ${textSecondary}
                `}
              >
                Loading PYQs...
              </p>
            </div>
          ) : filteredPYQs.length ===
            0 ? (
            <div
              className="
                min-h-[280px]
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-5
              "
            >
              <div
                className="
                  h-16
                  w-16
                  rounded-2xl
                  bg-[#f0eaff]
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >
                <FileText
                  size={28}
                  className="text-[#7c3aed]"
                />
              </div>

              <h4
                className="
                  text-base
                  font-semibold
                "
              >
                No PYQs found
              </h4>

              <p
                className={`
                  mt-1
                  text-sm
                  max-w-md
                  ${textSecondary}
                `}
              >
                {search
                  ? "No uploaded PYQ matches your search."
                  : "Upload your first PYQ using the upload form above."}
              </p>
            </div>
          ) : (
            <div
              className="
                overflow-x-auto
              "
            >
              <table
                className="
                  w-full
                  min-w-[1050px]
                "
              >
                <thead>
                  <tr
                    className={`
                      border-b
                      ${borderColor}
                      ${darkMode
                        ? "bg-[#171725]"
                        : "bg-[#faf9ff]"
                      }
                    `}
                  >
                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      PYQ
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      Category
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      Subject
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      Year
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      Uploaded
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      Activity
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        text-[#7a8195]
                        uppercase
                      "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>


                <tbody>
                  {filteredPYQs.map(
                    (item) => (
                      <tr
                        key={
                          item._id
                        }
                        className={`
                          border-b
                          ${borderColor}
                          hover:bg-[#faf9ff]
                          ${darkMode
                            ? "hover:bg-[#171725]"
                            : ""
                          }
                          transition
                        `}
                      >
                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <div
                              className="
                                h-10
                                w-10
                                rounded-xl
                                bg-red-50
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >
                              <FileText
                                size={19}
                                className="text-red-500"
                              />
                            </div>

                            <div className="min-w-0">
                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  truncate
                                  max-w-[280px]
                                "
                                title={
                                  item.title
                                }
                              >
                                {
                                  item.title
                                }
                              </p>

                              <p
                                className={`
                                  mt-0.5
                                  text-xs
                                  ${textSecondary}
                                `}
                              >
                                {formatFileName(
                                  item.fileName
                                )}
                              </p>
                            </div>
                          </div>
                        </td>


                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-[#f0eaff]
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-[#6425ed]
                            "
                          >
                            {
                              item.category
                            }
                          </span>
                        </td>


                        <td
                          className={`
                            px-5
                            py-4
                            text-sm
                            ${textSecondary}
                          `}
                        >
                          {
                            item.subject
                          }
                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            font-semibold
                          "
                        >
                          {
                            item.year
                          }
                        </td>


                        <td
                          className={`
                            px-5
                            py-4
                            text-sm
                            ${textSecondary}
                          `}
                        >
                          {formatDate(
                            item.createdAt
                          )}
                        </td>


                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <span
                              className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                text-[#69738d]
                              "
                            >
                              <Eye
                                size={14}
                              />

                              {
                                item.views ||
                                0
                              }
                            </span>

                            <span
                              className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                text-[#69738d]
                              "
                            >
                              <Download
                                size={14}
                              />

                              {
                                item.downloads ||
                                0
                              }
                            </span>
                          </div>
                        </td>


                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              justify-end
                              items-center
                              gap-2
                            "
                          >
                            <a
                              href={
                                item.fileUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                h-9
                                w-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                bg-[#f0eaff]
                                text-[#6425ed]
                                hover:bg-[#e6ddff]
                                transition
                              "
                              title="View PDF"
                            >
                              <ExternalLink
                                size={16}
                              />
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  item
                                )
                              }
                              className="
                                h-9
                                w-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                bg-blue-50
                                text-blue-600
                                hover:bg-blue-100
                                transition
                              "
                              title="Edit"
                            >
                              <Edit3
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                              disabled={
                                deletingId ===
                                item._id
                              }
                              className="
                                h-9
                                w-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                bg-red-50
                                text-red-500
                                hover:bg-red-100
                                transition
                                disabled:opacity-50
                              "
                              title="Delete"
                            >
                              {deletingId ===
                              item._id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>


        {/* =================================================
            FOOTER INFO
        ================================================= */}

        <div
          className={`
            mt-6
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
            px-2
            pb-4
            text-xs
            ${textSecondary}
          `}
        >
          <p>
            StudyGem Admin Panel
          </p>

          <p>
            Secure content
            management system
          </p>
        </div>
      </main>


      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingId && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() =>
            setEditingId(null)
          }
        >
          <div
            className="
              w-full
              max-w-xl
              rounded-[24px]
              bg-white
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-[#eeeaf7]
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#17203d]
                  "
                >
                  Edit PYQ
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#737b91]
                  "
                >
                  Update PYQ details.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingId(null)
                }
                className="
                  h-9
                  w-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  hover:bg-[#f5f2fb]
                "
              >
                <X size={18} />
              </button>
            </div>


            <form
              onSubmit={
                handleUpdate
              }
              className="p-6 space-y-5"
            >
              <div>
                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-[#20294a]
                    mb-2
                  "
                >
                  PYQ Title
                </label>

                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#ddd8ed]
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#7c3aed]
                  "
                />
              </div>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#20294a]
                      mb-2
                    "
                  >
                    Category
                  </label>

                  <input
                    value={
                      editCategory
                    }
                    onChange={(e) =>
                      setEditCategory(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-[#ddd8ed]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#7c3aed]
                    "
                  />
                </div>


                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#20294a]
                      mb-2
                    "
                  >
                    Subject
                  </label>

                  <input
                    value={
                      editSubject
                    }
                    onChange={(e) =>
                      setEditSubject(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-[#ddd8ed]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#7c3aed]
                    "
                  />
                </div>


                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#20294a]
                      mb-2
                    "
                  >
                    Year
                  </label>

                  <input
                    type="number"
                    value={
                      editYear
                    }
                    onChange={(e) =>
                      setEditYear(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-[#ddd8ed]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#7c3aed]
                    "
                  />
                </div>


                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#20294a]
                      mb-2
                    "
                  >
                    Class / Level
                  </label>

                  <input
                    value={
                      editClass
                    }
                    onChange={(e) =>
                      setEditClass(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-[#ddd8ed]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#7c3aed]
                    "
                  />
                </div>
              </div>


              <div
                className="
                  flex
                  justify-end
                  gap-3
                  pt-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setEditingId(null)
                  }
                  className="
                    h-11
                    px-5
                    rounded-xl
                    border
                    border-[#ddd8ed]
                    text-sm
                    font-semibold
                    text-[#626a80]
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    h-11
                    px-6
                    rounded-xl
                    bg-gradient-to-r
                    from-[#7c2ff3]
                    to-[#5b21e9]
                    text-white
                    text-sm
                    font-semibold
                  "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;