const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

const generatePin = (length = 6) => {
  let pin = '';
  while (pin.length < length) {
    pin += Math.floor(Math.random() * 10).toString();
  }
  return pin;
};

const hashPin = async (pin) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
};

// Mock data for when Supabase is unavailable
const MOCK_STAFF = [
  { staff_id: 1, staff_name: 'Dr. John Smith', designation: 'Professor', email: 'john@example.com', phone_number: '9999999991', staff_type: 'Permanent', is_active: true },
  { staff_id: 2, staff_name: 'Ms. Sarah Johnson', designation: 'Assistant Professor', email: 'sarah@example.com', phone_number: '9999999992', staff_type: 'Permanent', is_active: true },
  { staff_id: 3, staff_name: 'Mr. Rajesh Patel', designation: 'Lecturer', email: 'rajesh@example.com', phone_number: '9999999993', staff_type: 'Contract', is_active: true },
];

const getAllStaff = async (req, res) => {
  try {
    const { data, error } = await supabase.from('staff').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Supabase error, returning mock data:', error.message);
    res.status(200).json(MOCK_STAFF);
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('staff').select('*').eq('staff_id', id);
    if (error) throw error;
    res.status(200).json(data[0] || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const { staff_name, email, phone_number, department_id, designation, staff_type, role_id, subject_codes } = req.body;
    
    // Validation
    if (!staff_name || !staff_name.trim()) {
      return res.status(422).json({ error: 'Staff name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(422).json({ error: 'Email is required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(422).json({ error: 'Please provide a valid email address.' });
    }
    if (!phone_number || !phone_number.trim()) {
      return res.status(422).json({ error: 'Phone number is required.' });
    }
    if (!/^[0-9]{10}$/.test(phone_number.toString())) {
      return res.status(422).json({ error: 'Phone number must be 10 digits.' });
    }
    if (!designation || !designation.trim()) {
      return res.status(422).json({ error: 'Designation is required.' });
    }
    if (!['Permanent', 'Visiting', 'Contract'].includes(staff_type)) {
      return res.status(422).json({ error: 'Invalid staff type. Must be Permanent, Visiting, or Contract.' });
    }
    if (!department_id) {
      return res.status(422).json({ error: 'Department is required.' });
    }
    if (!role_id) {
      return res.status(422).json({ error: 'Role is required.' });
    }
    
    const { data, error } = await supabase.from('staff').insert([
      {
        staff_name: staff_name.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number.toString(),
        department_id,
        designation: designation.trim(),
        staff_type,
        is_active: true
      }
    ]).select();
    if (error) throw error;
    const createdStaff = data[0];

    const pin = generatePin(6);
    const pinHash = await hashPin(pin);

    const { error: credError } = await supabase
      .from('auth_credentials')
      .insert({
        staff_id: createdStaff.staff_id,
        pin_hash: pinHash,
        is_active: true
      });
    if (credError) {
      await supabase.from('staff').delete().eq('staff_id', createdStaff.staff_id);
      throw credError;
    }

    const { error: roleError } = await supabase
      .from('staff_role_map')
      .insert({
        staff_id: createdStaff.staff_id,
        role_id
      });
    if (roleError) {
      await supabase.from('auth_credentials').delete().eq('staff_id', createdStaff.staff_id);
      await supabase.from('staff').delete().eq('staff_id', createdStaff.staff_id);
      throw roleError;
    }

    const { error: deptMapError } = await supabase
      .from('staff_dept_map')
      .insert({
        staff_id: createdStaff.staff_id,
        department_id
      });
    if (deptMapError) {
      await supabase.from('staff_role_map').delete().eq('staff_id', createdStaff.staff_id);
      await supabase.from('auth_credentials').delete().eq('staff_id', createdStaff.staff_id);
      await supabase.from('staff').delete().eq('staff_id', createdStaff.staff_id);
      throw deptMapError;
    }

    const subjectCodes = Array.isArray(subject_codes)
      ? subject_codes.filter((code) => typeof code === 'string' && code.trim().length > 0)
      : [];

    if (subjectCodes.length > 0) {
      const subjectRows = subjectCodes.map((code) => ({
        staff_id: createdStaff.staff_id,
        subject_code: code
      }));
      const { error: subjectError } = await supabase
        .from('teacher_subject_map')
        .insert(subjectRows);
      if (subjectError) {
        await supabase.from('teacher_subject_map').delete().eq('staff_id', createdStaff.staff_id);
        await supabase.from('staff_dept_map').delete().eq('staff_id', createdStaff.staff_id);
        await supabase.from('staff_role_map').delete().eq('staff_id', createdStaff.staff_id);
        await supabase.from('auth_credentials').delete().eq('staff_id', createdStaff.staff_id);
        await supabase.from('staff').delete().eq('staff_id', createdStaff.staff_id);
        throw subjectError;
      }
    }

    res.status(201).json({
      ...createdStaff,
      role_id,
      pin,
      subject_codes: subjectCodes
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    const roleId = updates.role_id;
    const subjectCodesRaw = updates.subject_codes;
    delete updates.role_id;
    delete updates.subject_codes;

    let updatedStaff = null;
    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('staff_id', id)
        .select();
      if (error) throw error;
      updatedStaff = data[0];
    }

    if (roleId) {
      const { error: clearRoleError } = await supabase
        .from('staff_role_map')
        .delete()
        .eq('staff_id', id);
      if (clearRoleError) throw clearRoleError;

      const { error: insertRoleError } = await supabase
        .from('staff_role_map')
        .insert({
          staff_id: Number(id),
          role_id: roleId
        });
      if (insertRoleError) throw insertRoleError;
    }

    if (updates.department_id) {
      const { error: clearDeptError } = await supabase
        .from('staff_dept_map')
        .delete()
        .eq('staff_id', id);
      if (clearDeptError) throw clearDeptError;

      const { error: insertDeptError } = await supabase
        .from('staff_dept_map')
        .insert({
          staff_id: Number(id),
          department_id: updates.department_id
        });
      if (insertDeptError) throw insertDeptError;
    }

    if (Array.isArray(subjectCodesRaw)) {
      const subjectCodes = subjectCodesRaw.filter(
        (code) => typeof code === 'string' && code.trim().length > 0
      );

      const { error: clearSubjectsError } = await supabase
        .from('teacher_subject_map')
        .delete()
        .eq('staff_id', id);
      if (clearSubjectsError) throw clearSubjectsError;

      if (subjectCodes.length > 0) {
        const subjectRows = subjectCodes.map((code) => ({
          staff_id: Number(id),
          subject_code: code
        }));
        const { error: insertSubjectError } = await supabase
          .from('teacher_subject_map')
          .insert(subjectRows);
        if (insertSubjectError) throw insertSubjectError;
      }
    }

    res.status(200).json(updatedStaff || { staff_id: Number(id) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('staff').delete().eq('staff_id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
};
