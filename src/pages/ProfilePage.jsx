import { useState, useEffect } from 'react'
import './ProfilePage.css'
import API_BASE_URL from '../config/api';

function ProfilePage() {

  // =====================================
  // PROFILE STATE
  // =====================================

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const [originalProfile, setOriginalProfile] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // =====================================
  // FETCH LOGGED-IN USER PROFILE
  // =====================================

  useEffect(() => {

    async function fetchProfile() {

      try {

        const token = localStorage.getItem('spendwiseToken')

        const response = await fetch(
          `${API_BASE_URL}/api/users/me`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Unable to load profile')
        }

        const data = await response.json()

        const profileData = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        }

        setProfile(profileData)
        setOriginalProfile(profileData)

      } catch (error) {

        console.error('Profile loading error:', error)
        alert('Unable to load profile details')

      } finally {

        setIsLoading(false)

      }

    }

    fetchProfile()

  }, [])

  // =====================================
  // GET PROFILE INITIALS
  // =====================================

  const getInitials = () => {

    if (!profile.name.trim()) return 'U'

    return profile.name
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('')

  }

  // =====================================
  // HANDLE INPUT CHANGES
  // =====================================

  function handleChange(e) {

    const { name, value } = e.target

    setProfile(prev => ({
      ...prev,
      [name]: value
    }))

  }

  // =====================================
  // CANCEL PROFILE EDITING
  // =====================================

  function handleCancel() {

    setProfile(originalProfile)
    setIsEditing(false)

  }

  // =====================================
  // SAVE PROFILE DETAILS TO BACKEND
  // =====================================

  async function handleSave() {

    if (!isEditing || isSaving) return

    // Validate required fields
    if (
      !profile.name.trim() ||
      !profile.email.trim() ||
      !profile.phone.trim()
    ) {
      alert('Please fill all the fields')
      return
    }

    try {

      setIsSaving(true)

      const token = localStorage.getItem('spendwiseToken')

      const response = await fetch(
        `${API_BASE_URL}/api/users/me`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            phone: profile.phone.trim()
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update profile')
      }

      const updatedProfile = {
        name: data.name,
        email: data.email,
        phone: data.phone || ''
      }

      setProfile(updatedProfile)
      setOriginalProfile(updatedProfile)
      setIsEditing(false)

      alert('Profile updated successfully!')

    } catch (error) {

      console.error('Profile update error:', error)
      alert(error.message || 'Something went wrong')

    } finally {

      setIsSaving(false)

    }

  }

  // =====================================
  // LOADING STATE
  // =====================================

  if (isLoading) {

    return (
      <div className="profile-page">
        <p>Loading profile details...</p>
      </div>
    )

  }

  // =====================================
  // PROFILE PAGE UI
  // =====================================

  return (

    <div className="profile-page">

      {/* Page Header */}

      <div className="profile-page-header">

        <div>
          <span className="profile-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and account details.
          </p>
        </div>

        <div className="profile-status-badge">
          <span></span>
          Active Account
        </div>

      </div>


      {/* Profile Overview Card */}

      <div className="profile-overview-card">

        <div className="profile-avatar">
          {getInitials()}
        </div>

        <div className="profile-overview-info">

          <span className="profile-overview-label">
            PERSONAL ACCOUNT
          </span>

          <h2>{profile.name || 'Your Name'}</h2>

          <p>
            {profile.email || 'Add your email address'}
          </p>

        </div>

        <div className="profile-overview-icon">
          ✦
        </div>

      </div>


      {/* Personal Information Card */}

      <div className="profile-card">

        <div className="profile-card-heading">

          <div className="profile-heading-icon">
            ♙
          </div>

          <div>
            <h2>Personal Information</h2>

            <p>
              Update your personal details below.
            </p>
          </div>

        </div>


        {/* Profile Form */}

        <div className="profile-form">

          {/* Full Name */}

          <div className="profile-form-group">

            <label htmlFor="profile-name">
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>


          {/* Email Address */}

          <div className="profile-form-group">

            <label htmlFor="profile-email">
              Email Address
            </label>

            <input
              id="profile-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={profile.email}
              disabled
            />

          </div>


          {/* Phone Number */}

          <div className="profile-form-group">

            <label htmlFor="profile-phone">
              Phone Number
            </label>

            <input
              id="profile-phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>


          {/* Profile Action Buttons */}

          <div className="profile-actions">

            {isEditing ? (

              <>
                {/* Save Button */}

                <button
                  type="button"
                  className="profile-save-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : '✓ Save Changes'}
                </button>

                {/* Cancel Button */}

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </>

            ) : (

              /* Edit Button */

              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✎ Edit Profile
              </button>

            )}

          </div>

        </div>

      </div>


      {/* Account Information */}

      <div className="profile-security-note">

        <div className="security-icon">
          ✓
        </div>

        <div>
          <h3>Your information is important</h3>

          <p>
            Keep your profile details up to date for a better
            SpendWise experience.
          </p>
        </div>

      </div>

    </div>

  )

}

export default ProfilePage