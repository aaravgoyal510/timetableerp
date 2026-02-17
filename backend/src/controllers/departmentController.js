const supabase = require('../config/supabase');

const getAllDepartments = async (req, res) => {
  try {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('departments').select('*').eq('department_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Department name is required.' });
    }
    const { data, error } = await supabase.from('departments').insert([{ name }]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('departments').update(updates).eq('department_id', id).select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if department is referenced by staff
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('staff_id, staff_name, designation')
      .eq('department_id', id);
    
    if (staffError) throw staffError;
    
    if (staffData && staffData.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete department - it contains ${staffData.length} staff member(s)`,
        details: {
          type: 'staff',
          count: staffData.length,
          records: staffData,
          message: `The following staff are assigned to this department. Remove or reassign them first:\n${staffData.map(s => `- ${s.staff_name} (${s.designation})`).join('\n')}`
        }
      });
    }
    
    // Check if department is referenced by subjects
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects_master')
      .select('subject_code, subject_name, course_name');
    
    if (subjectError) throw subjectError;
    
    const departmentSubjects = subjectData?.filter(s => s.department_id === id) || [];
    if (departmentSubjects.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete department - it has ${departmentSubjects.length} subject(s) assigned`,
        details: {
          type: 'subjects',
          count: departmentSubjects.length,
          records: departmentSubjects,
          message: `The following subjects are assigned to this department. Remove or reassign them first:\n${departmentSubjects.map(s => `- ${s.subject_name} (${s.subject_code})`).join('\n')}`
        }
      });
    }
    
    // Department is safe to delete
    const { error: deleteError } = await supabase.from('departments').delete().eq('department_id', id);
    if (deleteError) throw deleteError;
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
