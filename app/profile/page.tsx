"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, Book, Users, Calendar, Award, Edit2, Save, X, Loader2 } from "lucide-react";

type UniversityDetails = {
    id: string;
    name: string;
    enrollmentNumber: string;
    course: string;
    year: number;
    group: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
};

type UserProfile = {
    id: string;
    clerkId: string;
    email: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
};

type ProfileData = {
    user: UserProfile;
    universityDetails: UniversityDetails | null;
    stats: {
        eventsCreated: number;
        eventsRegistered: number;
        announcements: number;
    };
};

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        enrollmentNumber: "",
        course: "",
        year: 1,
        group: "",
        phoneNumber: "",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const courses = [
        "BTech CSE",
        "BTech ECE",
        "BTech ME",
        "BTech CE",
        "BTech EE",
        "BBA",
        "BCA",
        "MBA",
        "MCA",
    ];

    const groups = ["A", "B", "C", "D", "DSAI A", "DSAI B", "AI/ML A", "AI/ML B"];
    const year = ["1st", "2nd", "3rd", "4th"]

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch("/api/profile");
            if (!response.ok) {
                response.json().then(data => {
                    console.log(data);
                    throw new Error(`${data.error} ${data.details} Failed to fetch profile`);
                })
            }

            const data: ProfileData = await response.json();
            setProfileData(data);

            if (data.universityDetails) {
                setFormData({
                    name: data.universityDetails.name,
                    enrollmentNumber: data.universityDetails.enrollmentNumber,
                    course: data.universityDetails.course,
                    year: data.universityDetails.year,
                    group: data.universityDetails.group,
                    phoneNumber: data.universityDetails.phoneNumber,
                });
            }
        } catch (err) {
            setError("Failed to load profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }
        if (!/^\d{10}$/.test(formData.enrollmentNumber)) {
            errors.enrollmentNumber = "Enter a valid 10-digit enrollment number";
        }
        if (!formData.course) {
            errors.course = "Please select a course";
        }
        if (!formData.group) {
            errors.group = "Please select a group";
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = "Enter a valid 10-digit phone number";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        setError("");

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, year: Number(formData.year) }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update profile");
            }

            await fetchProfile();
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (profileData?.universityDetails) {
            setFormData({
                name: profileData.universityDetails.name,
                enrollmentNumber: profileData.universityDetails.enrollmentNumber,
                course: profileData.universityDetails.course,
                year: profileData.universityDetails.year,
                group: profileData.universityDetails.group,
                phoneNumber: profileData.universityDetails.phoneNumber,
            });
        }
        setFormErrors({});
        setIsEditing(false);
        setError("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Failed to load profile</p>
                </div>
            </div>
        );
    }

    const hasUniversityDetails = !!profileData.universityDetails;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                        My Profile
                    </h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - User Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center sticky top-8">
                            <div className="relative inline-block mb-6">
                                <img
                                    src={profileData.user.imageUrl || "/default-avatar.png"}
                                    alt={profileData.user.name || "User"}
                                    className="w-32 h-32 rounded-full border-4 border-purple-200 shadow-lg object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {profileData.user.name || "User"}
                            </h2>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                                <Award className="w-4 h-4" />
                                {profileData.user.role}
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-purple-500" />
                                    <span className="text-sm break-all">{profileData.user.email}</span>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                    <span className="text-sm">
                                        Joined {new Date(profileData.user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {profileData.stats.eventsRegistered}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Events</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-pink-600">
                                            {profileData.stats.eventsCreated}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Created</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {profileData.stats.announcements}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Posts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - University Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Book className="w-6 h-6 text-purple-600" />
                                    University Details
                                </h3>

                                {hasUniversityDetails && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                    <span className="text-red-600 text-xl">⚠️</span>
                                    <p className="text-sm text-red-700">{error}</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {!hasUniversityDetails && !isEditing ? (
                                <div className="text-center py-12">
                                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        Complete Your Profile
                                    </h4>
                                    <p className="text-gray-600 mb-6">
                                        Add your university details to get started
                                    </p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg font-semibold"
                                    >
                                        Add Details
                                    </button>
                                </div>
                            ) : isEditing ? (
                                <form className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.name
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                        {formErrors.name && (
                                            <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
                                        )}
                                    </div>

                                    {/* Enrollment Number */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Enrollment Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="enrollmentNumber"
                                            value={formData.enrollmentNumber}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.enrollmentNumber
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                                }`}
                                            placeholder="e.g., 2400100774"
                                        />
                                        {formErrors.enrollmentNumber && (
                                            <p className="mt-2 text-sm text-red-600">{formErrors.enrollmentNumber}</p>
                                        )}
                                    </div>

                                    {/* Course and Group */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Course <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${formErrors.course
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                                    }`}
                                            >
                                                <option value="">Select course</option>
                                                {courses.map((course) => (
                                                    <option key={course} value={course}>
                                                        {course}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.course && (
                                                <p className="mt-2 text-sm text-red-600">{formErrors.course}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Group <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="group"
                                                value={formData.group}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${formErrors.group
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                                    }`}
                                            >
                                                <option value="">Select group</option>
                                                {groups.map((group) => (
                                                    <option key={group} value={group}>
                                                        Group {group}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.group && (
                                                <p className="mt-2 text-sm text-red-600">{formErrors.group}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Year <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${formErrors.year
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                                    }`}
                                            >
                                                <option value="">Select Year</option>
                                                {
                                                    year.map((year) => (
                                                        <option key={year} value={Number(year.charAt(0))}>
                                                            {year} Year
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                            {formErrors.year && (
                                                <p className="mt-2 text-sm text-red-600">{formErrors.year}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.phoneNumber
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                                                }`}
                                            placeholder="e.g., 9876543210"
                                        />
                                        {formErrors.phoneNumber && (
                                            <p className="mt-2 text-sm text-red-600">{formErrors.phoneNumber}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                            className="px-6 py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X className="w-5 h-5 inline mr-2" />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <InfoRow icon={<User className="w-5 h-5" />} label="Name" value={profileData.universityDetails!.name} />
                                    <InfoRow icon={<Book className="w-5 h-5" />} label="Enrollment Number" value={profileData.universityDetails!.enrollmentNumber} />
                                    <InfoRow icon={<Book className="w-5 h-5" />} label="Course" value={profileData.universityDetails!.course} />
                                    <InfoRow icon={<Book className="w-5 h-5" />} label="Year" value={profileData.universityDetails!.year?.toString()||"Not specified"} />
                                    <InfoRow icon={<Users className="w-5 h-5" />} label="Group" value={profileData.universityDetails!.group} />
                                    <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone Number" value={profileData.universityDetails!.phoneNumber} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-500 mb-1">{label}</div>
                <div className="text-lg font-semibold text-gray-900 break-words">{value}</div>
            </div>
        </div>
    );
}