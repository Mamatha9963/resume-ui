import './styles/FormPage.scss' // Assuming you have some styles for the form

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export interface FormData {
  name: string
  jobTitle: string
  experience: string
  skills: string
  achievements: string
  education: string
  tone: string
  email: string
  phone: string
  [key: string]: string
}

const FormPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    jobTitle: '',
    experience: '',
    skills: '',
    achievements: '',
    education: '',
    tone: 'formal',
    email: '',
    phone: '',
  })

  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate`,
        formData
      )
      const { resume } = response.data
      navigate('/result', { state: { resume } })
    } catch (err) {
      
      alert('Error generating resume')
      console.error(err)
    }
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">AI Resume Generator</h2>
        <form onSubmit={handleSubmit}>
          {[
            'name',
            'jobTitle',
            'experience',
            'skills',
            'achievements',
            'education',
            'email',
            'phone',
          ].map((field) => (
            <div className="mb-3" key={field}>
              <label htmlFor={field} className="form-label text-capitalize">
                {field}
              </label>
              {['experience', 'skills', 'achievements', 'education'].includes(
                field
              ) ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  rows={3}
                  className="form-control"
                  required
                />
              ) : (
                <input
                  type={
                    field === 'email'
                      ? 'email'
                      : field === 'phone'
                      ? 'tel'
                      : 'text'
                  }
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              )}
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="tone" className="form-label">
              Tone
            </label>
            <select
              name="tone"
              id="tone"
              value={formData.tone}
              onChange={handleChange}
              className="form-select"
            >
              <option value="formal">Formal</option>
              <option value="confident">Confident</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          <div className="text-center">
            <button type="submit" className="btn text-white bg-success">
              Generate Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormPage
