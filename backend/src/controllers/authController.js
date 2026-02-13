const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Hash PIN using bcrypt
 */
const hashPin = async (pin) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
};

/**
 * Compare PIN with hash
 */
const comparePin = async (pin, hash) => {
  return bcrypt.compare(pin, hash);
};

/**
 * Login with Staff ID and PIN
 */
const login = async (req, res) => {
  try {
    const { staff_id, pin } = req.body;

    // Validate input
    if (!staff_id || !pin) {
      return res.status(400).json({ error: 'Staff ID and PIN are required' });
    }

    // Get auth credentials
    const { data: authCred, error: authError } = await supabase
      .from('auth_credentials')
      .select('*')
      .eq('staff_id', staff_id)
      .single();

    if (authError || !authCred) {
      // Log failed attempt
      await logAuthEvent(null, staff_id, 'FAILED_LOGIN', false, 'Credentials not found');
      return res.status(401).json({ error: 'Invalid Staff ID or PIN' });
    }

    if (!authCred.is_active) {
      await logAuthEvent(null, staff_id, 'FAILED_LOGIN', false, 'Credentials inactive');
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify PIN using bcrypt
    const isPinValid = await comparePin(pin, authCred.pin_hash);
    if (!isPinValid) {
      await logAuthEvent(null, staff_id, 'FAILED_LOGIN', false, 'Invalid PIN');
      return res.status(401).json({ error: 'Invalid Staff ID or PIN' });
    }

    // Get staff details
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('staff_id, staff_name, email, phone_number, designation, staff_type')
      .eq('staff_id', staff_id)
      .single();

    if (staffError || !staffData) {
      await logAuthEvent(null, staff_id, 'FAILED_LOGIN', false, 'Staff record not found');
      return res.status(401).json({ error: 'Staff record not found' });
    }

    // Get roles
    const { data: roleRecords, error: roleError } = await supabase
      .from('staff_role_map')
      .select('roles_master(role_id, role_name, role_description)')
      .eq('staff_id', staff_id);

    if (roleError) {
      console.error('Error fetching roles:', roleError);
    }

    const roles = (roleRecords || []).map(r => r.roles_master);

    // Generate tokens
    const tokenPayload = {
      staff_id: staffData.staff_id,
      staff_name: staffData.staff_name,
      email: staffData.email,
      roles: roles.map(r => r.role_name),
      type: 'access'
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    const refreshToken = jwt.sign({ staff_id: staffData.staff_id, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    // Store session in DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error: sessionError } = await supabase
      .from('auth_sessions')
      .insert({
        staff_id: staffData.staff_id,
        token_hash: tokenHash,
        refresh_token_hash: refreshTokenHash,
        expires_at: expiresAt,
        is_active: true
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({ error: 'Failed to create session' });
    }

    // Update last_login
    await supabase
      .from('auth_credentials')
      .update({ last_login: new Date().toISOString() })
      .eq('staff_id', staff_id);

    // Log successful login
    await logAuthEvent(req, staff_id, 'LOGIN', true);

    res.status(200).json({
      message: 'Login successful',
      staff: {
        staff_id: staffData.staff_id,
        staff_name: staffData.staff_name,
        email: staffData.email,
        designation: staffData.designation,
        roles: roles.map(r => r.role_name)
      },
      tokens: {
        accessToken: token,
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    await logAuthEvent(req, null, 'FAILED_LOGIN', false, error.message);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const staff_id = decoded.staff_id;

    // Verify session exists and is active
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const { data: session, error: sessionError } = await supabase
      .from('auth_sessions')
      .select('*')
      .eq('refresh_token_hash', refreshTokenHash)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      return res.status(401).json({ error: 'Session expired' });
    }

    // Get staff details
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('staff_id, staff_name, email, designation')
      .eq('staff_id', staff_id)
      .single();

    if (staffError || !staffData) {
      return res.status(401).json({ error: 'Staff not found' });
    }

    // Get roles
    const { data: roleRecords } = await supabase
      .from('staff_role_map')
      .select('roles_master(role_name)')
      .eq('staff_id', staff_id);

    const roles = (roleRecords || []).map(r => r.roles_master?.role_name).filter(Boolean);

    // Generate new access token
    const tokenPayload = {
      staff_id: staffData.staff_id,
      staff_name: staffData.staff_name,
      email: staffData.email,
      roles: roles,
      type: 'access'
    };

    const newToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    res.status(200).json({
      accessToken: newToken,
      staff: {
        staff_id: staffData.staff_id,
        staff_name: staffData.staff_name,
        roles: roles
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed', details: error.message });
  }
};

/**
 * Logout - invalidate session
 */
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const staff_id = req.staff_id; // From middleware

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Invalidate session
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const { error } = await supabase
      .from('auth_sessions')
      .update({ is_active: false })
      .eq('token_hash', tokenHash);

    if (error) {
      console.error('Error invalidating session:', error);
    }

    await logAuthEvent(req, staff_id, 'LOGOUT', true);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed', details: error.message });
  }
};

/**
 * Verify current session
 */
const verifySession = async (req, res) => {
  try {
    const staff_id = req.staff_id;

    const { data: staffData, error } = await supabase
      .from('staff')
      .select('staff_id, staff_name, email, designation')
      .eq('staff_id', staff_id)
      .single();

    if (error) {
      return res.status(401).json({ error: 'Session invalid' });
    }

    // Get roles
    const { data: roleRecords } = await supabase
      .from('staff_role_map')
      .select('roles_master(role_name)')
      .eq('staff_id', staff_id);

    const roles = (roleRecords || []).map(r => r.roles_master?.role_name).filter(Boolean);

    res.status(200).json({
      staff: {
        staff_id: staffData.staff_id,
        staff_name: staffData.staff_name,
        email: staffData.email,
        designation: staffData.designation,
        roles: roles
      }
    });
  } catch (error) {
    console.error('Session verify error:', error);
    res.status(500).json({ error: 'Session verification failed' });
  }
};

/**
 * Helper function to log auth events
 */
const logAuthEvent = async (req, staff_id, eventType, success, errorMessage = null) => {
  try {
    const ipAddress = req ? req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress : null;
    const userAgent = req ? req.headers['user-agent'] : null;

    await supabase.from('auth_audit_log').insert({
      staff_id,
      event_type: eventType,
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      error_message: errorMessage
    });
  } catch (err) {
    console.error('Error logging auth event:', err);
  }
};

module.exports = {
  login,
  logout,
  refreshAccessToken,
  verifySession,
  logAuthEvent
};
