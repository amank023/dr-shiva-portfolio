import { useState, useEffect, useRef } from 'react'
import { getContent, updateContent, resetContent } from '../../hooks/api'
import { Save, RotateCcw, Plus, Trash2, Edit2, User, Briefcase, GraduationCap, Award, Wrench, Check, Upload, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContentTab({ onContentUpdated }) {
  const [content, setContent]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [activeSub, setActiveSub] = useState('profile') // profile, experience, education, skills, achievements
  const fileInputRef              = useRef(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const { data } = await getContent()
      setContent(data)
    } catch {
      toast.error('Failed to load website content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      const { data } = await updateContent(content)
      setContent(data.content)
      toast.success('Website content saved successfully! 🎉')
      if (onContentUpdated) onContentUpdated(data.content)
    } catch {
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all website content back to initial defaults? Any unsaved edits will be lost.')) return
    try {
      setSaving(true)
      const { data } = await resetContent()
      setContent(data.content)
      toast.success('Website content reset to initial defaults!')
      if (onContentUpdated) onContentUpdated(data.content)
    } catch {
      toast.error('Failed to reset content')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      return toast.error('Image is too large. Please select an image under 8MB.')
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 800
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL('image/jpeg', 0.85)
        updateProfile('photo', compressed)
        toast.success('Photo updated in preview! Click "Save Changes" to publish.')
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Helper updaters
  const updateProfile = (k, v) => {
    setContent(prev => ({
      ...prev,
      profile: { ...prev.profile, [k]: v }
    }))
  }

  const updateStat = (index, k, v) => {
    setContent(prev => {
      const stats = [...(prev.profile?.stats || [])]
      stats[index] = { ...stats[index], [k]: v }
      return { ...prev, profile: { ...prev.profile, stats } }
    })
  }

  // Experience helpers
  const addExperience = () => {
    const newItem = {
      id: Date.now(),
      date: 'March 2026 — Present',
      role: 'Consultant — Critical Care',
      org: 'Hospital Name',
      loc: 'Lucknow',
      badge: 'ICU Unit',
      points: ['Clinical management of critical care patients']
    }
    setContent(prev => ({ ...prev, experience: [newItem, ...(prev.experience || [])] }))
  }

  const updateExperience = (index, k, v) => {
    setContent(prev => {
      const exp = [...(prev.experience || [])]
      exp[index] = { ...exp[index], [k]: v }
      return { ...prev, experience: exp }
    })
  }

  const deleteExperience = (index) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  // Education helpers
  const addEducation = () => {
    const newItem = {
      id: Date.now(),
      year: new Date().getFullYear().toString(),
      icon: '🎓',
      deg: 'Degree / Specialization Title',
      sf: 'Short Form',
      inst: 'Institution Name',
      uni: 'University / Board',
      badges: ['Key Specialty']
    }
    setContent(prev => ({ ...prev, education: [newItem, ...(prev.education || [])] }))
  }

  const updateEducation = (index, k, v) => {
    setContent(prev => {
      const edu = [...(prev.education || [])]
      edu[index] = { ...edu[index], [k]: v }
      return { ...prev, education: edu }
    })
  }

  const deleteEducation = (index) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // Skills helpers
  const addSkill = () => {
    const newItem = {
      id: Date.now(),
      icon: '🩺',
      cat: 'Procedures',
      title: 'New Clinical Skill',
      desc: 'Description of clinical procedure or diagnosis.',
      prof: 90
    }
    setContent(prev => ({ ...prev, skills: [...(prev.skills || []), newItem] }))
  }

  const updateSkill = (index, k, v) => {
    setContent(prev => {
      const sk = [...(prev.skills || [])]
      sk[index] = { ...sk[index], [k]: k === 'prof' ? parseInt(v) || 0 : v }
      return { ...prev, skills: sk }
    })
  }

  const deleteSkill = (index) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // Achievements helpers
  const addAchievement = () => {
    const newItem = {
      id: Date.now(),
      icon: '🏅',
      cat: 'Quality',
      year: '2026',
      title: 'Achievement Title',
      desc: 'Description of the milestone or recognition.',
      impact: 'Clinical Impact'
    }
    setContent(prev => ({ ...prev, achievements: [...(prev.achievements || []), newItem] }))
  }

  const updateAchievement = (index, k, v) => {
    setContent(prev => {
      const ach = [...(prev.achievements || [])]
      ach[index] = { ...ach[index], [k]: v }
      return { ...prev, achievements: ach }
    })
  }

  const deleteAchievement = (index) => {
    setContent(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  if (loading || !content) {
    return (
      <div className="flex justify-center items-center py-20 text-sky-500">
        <span className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
      </div>
    )
  }

  const profile = content.profile || {}
  const ic = "w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 transition-colors"

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Website Content & Profile Editor</h1>
          <p className="text-gray-400 text-xs mt-0.5">Modify doctor information, experience timeline, qualifications, skills, and stats live on the website</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            disabled={saving}
            className="px-3.5 py-2.5 rounded-xl border border-sky-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-md shadow-sky-400/25 flex items-center gap-2 transition-all disabled:opacity-60"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-sky-100 dark:border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'profile', label: 'Doctor Profile & Stats', icon: User },
          { id: 'experience', label: `Experience (${content.experience?.length || 0})`, icon: Briefcase },
          { id: 'skills', label: `Skills (${content.skills?.length || 0})`, icon: Wrench },
          { id: 'education', label: `Education (${content.education?.length || 0})`, icon: GraduationCap },
          { id: 'achievements', label: `Achievements (${content.achievements?.length || 0})`, icon: Award }
        ].map(sub => {
          const Icon = sub.icon
          const active = activeSub === sub.id
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                active
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-400/20'
                  : 'bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-sky-300'
              }`}
            >
              <Icon size={14} /> {sub.label}
            </button>
          )
        })}
      </div>

      {/* SUB-TAB 1: Profile & General Details */}
      {activeSub === 'profile' && (
        <div className="space-y-6">
          {/* Doctor Profile Picture Card */}
          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white border-b border-sky-100 dark:border-white/10 pb-3 mb-4 flex items-center justify-between">
              <span>Doctor Profile Picture</span>
              <span className="text-xs font-normal text-gray-400">Live preview across site</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Picture Preview */}
              <div className="relative group flex-shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-sky-500 shadow-xl shadow-sky-400/20 bg-sky-50 dark:bg-gray-800">
                  <img
                    src={profile.photo || '/doctor.jpg'}
                    alt={profile.name || 'Doctor'}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white text-xs font-semibold rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload size={18} className="mb-1" /> Change Photo
                </button>
              </div>

              {/* Upload Controls & URL */}
              <div className="flex-1 space-y-3 w-full">
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                  Upload a photo from your computer or provide a direct web image link. This picture automatically updates across the <strong>Navbar</strong>, <strong>Hero Banner</strong>, <strong>Footer</strong>, and <strong>Virtual Assistant</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-md shadow-sky-400/20 transition-all"
                  >
                    <Upload size={14} /> Upload Picture
                  </button>

                  {profile.photo && profile.photo !== '/doctor.jpg' && (
                    <button
                      type="button"
                      onClick={() => {
                        updateProfile('photo', '/doctor.jpg')
                        toast.success('Reset to default photo')
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-white/10 text-xs font-medium transition-colors"
                    >
                      <RotateCcw size={13} /> Reset to Default
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Or enter direct Image URL:</label>
                  <input
                    type="text"
                    value={profile.photo || ''}
                    onChange={e => updateProfile('photo', e.target.value)}
                    placeholder="https://example.com/doctor.jpg or /doctor.jpg"
                    className={ic}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white border-b border-sky-100 dark:border-white/10 pb-3">
              Personal & Professional Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Doctor Full Name</label>
                <input
                  value={profile.name || ''}
                  onChange={e => updateProfile('name', e.target.value)}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Medical Registration Number</label>
                <input
                  value={profile.regNo || ''}
                  onChange={e => updateProfile('regNo', e.target.value)}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Primary Specialty</label>
                <input
                  value={profile.specialty || ''}
                  onChange={e => updateProfile('specialty', e.target.value)}
                  className={ic}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Degrees Subtitle</label>
                <input
                  value={profile.degrees || ''}
                  onChange={e => updateProfile('degrees', e.target.value)}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Header Tagline</label>
                <input
                  value={profile.tagline || ''}
                  onChange={e => updateProfile('tagline', e.target.value)}
                  className={ic}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Contact Phone</label>
                <input
                  value={profile.phone || ''}
                  onChange={e => updateProfile('phone', e.target.value)}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Contact Email</label>
                <input
                  value={profile.email || ''}
                  onChange={e => updateProfile('email', e.target.value)}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Location</label>
                <input
                  value={profile.location || ''}
                  onChange={e => updateProfile('location', e.target.value)}
                  className={ic}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Clinic Address</label>
                <input
                  value={profile.address || ''}
                  onChange={e => updateProfile('address', e.target.value)}
                  className={ic}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-medium">Consultation Hours</label>
                <input
                  value={profile.hours || ''}
                  onChange={e => updateProfile('hours', e.target.value)}
                  className={ic}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1 font-medium">
                📹 Doctor Google Meet Room Link (Optional — Used as default for Video Consultations)
              </label>
              <input
                value={profile.googleMeetLink || ''}
                onChange={e => updateProfile('googleMeetLink', e.target.value)}
                placeholder="https://meet.google.com/shv-care-meet"
                className={`${ic} font-mono`}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                If provided, this Google Meet room link will be automatically assigned when patients select "Video Call" during booking.
              </p>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1 font-medium">Hero Introduction Bio</label>
              <textarea
                rows={3}
                value={profile.heroBio || ''}
                onChange={e => updateProfile('heroBio', e.target.value)}
                className={`${ic} resize-none`}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1 font-medium">About Section Detailed Bio</label>
              <textarea
                rows={4}
                value={profile.aboutBio || ''}
                onChange={e => updateProfile('aboutBio', e.target.value)}
                className={`${ic} resize-none`}
              />
            </div>
          </div>

          {/* Stats Bar Configuration */}
          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white border-b border-sky-100 dark:border-white/10 pb-3 mb-4">
              Hero Stats Bar Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(profile.stats || []).map((s, idx) => (
                <div key={idx} className="bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 p-3 rounded-xl space-y-2">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Value</label>
                    <input
                      value={s.num || ''}
                      onChange={e => updateStat(idx, 'num', e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-sky-100 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs font-bold text-sky-600 dark:text-sky-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Label</label>
                    <input
                      value={s.label || ''}
                      onChange={e => updateStat(idx, 'label', e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-sky-100 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Experience Timeline */}
      {activeSub === 'experience' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Career Roles & Hospital Appointments</h3>
            <button
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Role
            </button>
          </div>

          {(content.experience || []).map((exp, idx) => (
            <div key={exp.id || idx} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-semibold text-sky-600">Role #{idx + 1}</span>
                <button
                  onClick={() => deleteExperience(idx)}
                  className="text-rose-500 hover:text-rose-600 p-1"
                  title="Delete Role"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Designation / Role Title</label>
                  <input
                    value={exp.role || ''}
                    onChange={e => updateExperience(idx, 'role', e.target.value)}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Hospital / Organization</label>
                  <input
                    value={exp.org || ''}
                    onChange={e => updateExperience(idx, 'org', e.target.value)}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Location</label>
                  <input
                    value={exp.loc || ''}
                    onChange={e => updateExperience(idx, 'loc', e.target.value)}
                    className={ic}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Time Period (e.g. October 2020 — July 2025)</label>
                  <input
                    value={exp.date || ''}
                    onChange={e => updateExperience(idx, 'date', e.target.value)}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Unit Badge (e.g. Medical Intensive Care Unit)</label>
                  <input
                    value={exp.badge || ''}
                    onChange={e => updateExperience(idx, 'badge', e.target.value)}
                    className={ic}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-[11px] block mb-1">Key Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={(exp.points || []).join('\n')}
                  onChange={e => updateExperience(idx, 'points', e.target.value.split('\n').filter(Boolean))}
                  className={`${ic} resize-none`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: Skills & Competencies */}
      {activeSub === 'skills' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Clinical Competencies & Procedures</h3>
            <button
              onClick={addSkill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Skill
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(content.skills || []).map((sk, idx) => (
              <div key={sk.id || idx} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <input
                      value={sk.icon || '🩺'}
                      onChange={e => updateSkill(idx, 'icon', e.target.value)}
                      className="w-9 h-9 text-center text-lg bg-sky-50 dark:bg-white/10 border border-sky-100 dark:border-white/10 rounded-xl outline-none"
                    />
                    <div>
                      <input
                        value={sk.title || ''}
                        onChange={e => updateSkill(idx, 'title', e.target.value)}
                        placeholder="Skill Title"
                        className="font-semibold text-xs text-gray-900 dark:text-white bg-transparent border-b border-sky-200 dark:border-white/20 outline-none pb-0.5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSkill(idx)}
                    className="text-rose-500 hover:text-rose-600 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Category</label>
                    <select
                      value={sk.cat || 'Procedures'}
                      onChange={e => updateSkill(idx, 'cat', e.target.value)}
                      className={ic}
                    >
                      <option value="Procedures">Procedures</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Diagnostics">Diagnostics</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Proficiency % ({sk.prof}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={sk.prof || 90}
                      onChange={e => updateSkill(idx, 'prof', e.target.value)}
                      className="w-full accent-sky-500 mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={sk.desc || ''}
                    onChange={e => updateSkill(idx, 'desc', e.target.value)}
                    className={`${ic} resize-none`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Education */}
      {activeSub === 'education' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Academic Background & Qualifications</h3>
            <button
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Degree
            </button>
          </div>

          {(content.education || []).map((edu, idx) => (
            <div key={edu.id || idx} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-semibold text-sky-600">Qualification #{idx + 1}</span>
                <button
                  onClick={() => deleteEducation(idx)}
                  className="text-rose-500 hover:text-rose-600 p-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Degree Name</label>
                  <input
                    value={edu.deg || ''}
                    onChange={e => updateEducation(idx, 'deg', e.target.value)}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Short Form (e.g. MBBS)</label>
                  <input
                    value={edu.sf || ''}
                    onChange={e => updateEducation(idx, 'sf', e.target.value)}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Passing Year</label>
                  <input
                    value={edu.year || ''}
                    onChange={e => updateEducation(idx, 'year', e.target.value)}
                    className={ic}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">Institution</label>
                  <input
                    value={edu.inst || ''}
                    onChange={e => updateEducation(idx, 'inst', e.target.value)}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[11px] block mb-1">University / Board</label>
                  <input
                    value={edu.uni || ''}
                    onChange={e => updateEducation(idx, 'uni', e.target.value)}
                    className={ic}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-[11px] block mb-1">Badges / Highlights (comma separated)</label>
                <input
                  value={(edu.badges || []).join(', ')}
                  onChange={e => updateEducation(idx, 'badges', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className={ic}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 5: Achievements */}
      {activeSub === 'achievements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Achievements & Recognition</h3>
            <button
              onClick={addAchievement}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(content.achievements || []).map((ach, idx) => (
              <div key={ach.id || idx} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <input
                      value={ach.icon || '🏅'}
                      onChange={e => updateAchievement(idx, 'icon', e.target.value)}
                      className="w-9 h-9 text-center text-lg bg-sky-50 dark:bg-white/10 border border-sky-100 dark:border-white/10 rounded-xl outline-none"
                    />
                    <input
                      value={ach.title || ''}
                      onChange={e => updateAchievement(idx, 'title', e.target.value)}
                      placeholder="Title"
                      className="font-semibold text-xs text-gray-900 dark:text-white bg-transparent border-b border-sky-200 dark:border-white/20 outline-none pb-0.5"
                    />
                  </div>
                  <button
                    onClick={() => deleteAchievement(idx)}
                    className="text-rose-500 hover:text-rose-600 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Category</label>
                    <input
                      value={ach.cat || ''}
                      onChange={e => updateAchievement(idx, 'cat', e.target.value)}
                      className={ic}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Year / Period</label>
                    <input
                      value={ach.year || ''}
                      onChange={e => updateAchievement(idx, 'year', e.target.value)}
                      className={ic}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Impact Label</label>
                    <input
                      value={ach.impact || ''}
                      onChange={e => updateAchievement(idx, 'impact', e.target.value)}
                      className={ic}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={ach.desc || ''}
                    onChange={e => updateAchievement(idx, 'desc', e.target.value)}
                    className={`${ic} resize-none`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
