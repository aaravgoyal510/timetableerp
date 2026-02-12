import React, { useEffect, useState } from 'react';
import { subjectAPI } from '../api';

interface Subject {
  subject_code: string;
  subject_name: string;
  course_name: string;
  department_id: number;
  semester: number;
  credits: number;
  hours_per_week: number;
  is_lab: boolean;
  duration_years: number;
  is_active: boolean;
}

export const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    course_name: '',
    department_id: 1,
    semester: 1,
    credits: 3,
    hours_per_week: 3,
    is_lab: false,
    duration_years: 1,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectAPI.getAll();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subjectAPI.create(formData);
      setFormData({
        subject_code: '',
        subject_name: '',
        course_name: '',
        department_id: 1,
        semester: 1,
        credits: 3,
        hours_per_week: 3,
        is_lab: false,
        duration_years: 1,
      });
      setShowForm(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleDelete = async (code: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await subjectAPI.delete(code);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Subject Code"
            value={formData.subject_code}
            onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={formData.subject_name}
            onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Course Name"
            value={formData.course_name}
            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Credits"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Hours Per Week"
            value={formData.hours_per_week}
            onChange={(e) => setFormData({ ...formData, hours_per_week: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_lab}
              onChange={(e) => setFormData({ ...formData, is_lab: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Is Lab Subject</span>
          </label>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Subject
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Semester</th>
                <th className="px-6 py-3 text-left">Credits</th>
                <th className="px-6 py-3 text-left">Hours/Week</th>
                <th className="px-6 py-3 text-left">Lab</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_code} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{subject.subject_code}</td>
                  <td className="px-6 py-4">{subject.subject_name}</td>
                  <td className="px-6 py-4">{subject.semester}</td>
                  <td className="px-6 py-4">{subject.credits}</td>
                  <td className="px-6 py-4">{subject.hours_per_week}</td>
                  <td className="px-6 py-4">{subject.is_lab ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(subject.subject_code)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
