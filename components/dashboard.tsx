"use client";

import { FormEvent, useState } from "react";

export default function CreateEventForm() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        imageUrl: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 🔴 Replace with API call
        console.log("Event Data:", formData);
        e.preventDefault();
        try {
            const response = await fetch('/api/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    date: formData.date,
                    location: formData.location,
                    category: formData.category,
                    imageUrl: formData.imageUrl
                })
            })
            setLoading(false)
            if (!response.ok) {
                throw new Error('Failed to create event');
            }

        } catch (err) {
            console.error("Error Creating Events")
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-semibold text-pink-600 mb-6 text-center">
                    Create New Event
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="CodeSprint Hackathon"
                            className="w-full rounded-xl border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your event..."
                            rows={4}
                            className="w-full rounded-xl border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                        />
                    </div>
                    {/* image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-xl border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Hackathon / Workshop"
                                className="w-full rounded-xl border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Integral University, Lucknow"
                            className="w-full rounded-xl border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition duration-200 disabled:opacity-60"
                    >
                        {loading ? "Creating Event..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
}
