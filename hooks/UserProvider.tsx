"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'

interface UniversityDetails {
    id: string
    userId: string
    name: string
    enrollmentNumber: string
    course: string
    year: number
    group: string
    phoneNumber: string
    createdAt: string
    updatedAt: string
}
interface Registration{
    eventId:string
}

interface UserData {
    id: string
    clerkId: string
    email: string
    name: string | null
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    role: string
    createdAt: string
    updatedAt: string
}

interface ProfileData {
    user: UserData
    universityDetails: UniversityDetails | null
    registrations: Registration[]
    stats: {
        eventsCreated: number
        eventsRegistered: number
        announcements: number
    }
}

interface UserContextType {
    user: ProfileData | null
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
}

const userContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
})

function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch('/api/profile')
            
            if (!response.ok) {
                setError('Failed to fetch profile')
                return
            }
            
            const userData: ProfileData = await response.json()
            setUser(userData)
        } catch (err) {
            console.error('Error fetching user:', err)
            setError('An error occurred while fetching profile')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, []) // Add empty dependency array!

    const value: UserContextType = {
        user,
        isLoading,
        error,
        refetch: fetchUser,
    }

    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(userContext)
    if (!context) {
        throw new Error('useUser must be used within UserProvider')
    }
    return context
}

export default UserProvider