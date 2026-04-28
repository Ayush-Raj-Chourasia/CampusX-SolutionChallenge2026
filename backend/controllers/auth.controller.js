const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, college, year, department, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // TEST BYPASS: Auto-verify test accounts for testing/demo purposes
    const isTestAccount = email.toLowerCase() === 'tester@campusx.test' || email.toLowerCase() === 'test@soa.ac.in';

    // Validate college email (expanded list for testing & production)
    const validDomains = [
      // Original domains
      'iitbbs.ac.in', 'nitrkl.ac.in', 'kiit.ac.in', 'soa.ac.in', 'iitg.ac.in', 'op.iitg.ac.in', 'silicon.ac.in',

      // IITs
      'iitb.ac.in', 'iitd.ac.in', 'iitm.ac.in', 'iitk.ac.in', 'iitr.ac.in', 'iitp.ac.in',
      'iiti.ac.in', 'iitgn.ac.in', 'iitj.ac.in', 'iitmandi.ac.in', 'iitbhilai.ac.in',
      'iitgoa.ac.in', 'iitdh.ac.in', 'iitpkd.ac.in', 'iittp.ac.in', 'iitbhu.ac.in',

      // NITs
      'nitw.ac.in', 'nitt.edu', 'nitk.ac.in', 'nitc.ac.in', 'nits.ac.in', 'nitap.ac.in',
      'nituk.ac.in', 'nitmanipur.ac.in', 'nitmz.ac.in', 'nitsikkim.ac.in', 'nitnagaland.ac.in',
      'nitdgp.ac.in', 'nitjsr.ac.in', 'nitrr.ac.in', 'nitmeghalaya.in',

      // IIITs
      'iiita.ac.in', 'iiitb.ac.in', 'iiith.ac.in', 'iiitdm.ac.in', 'iiitn.ac.in',
      'iiits.ac.in', 'iiitkottayam.ac.in', 'iiitbhopal.ac.in', 'iiit-bh.ac.in',

      // IIMs
      'iimahd.ac.in', 'iimb.ac.in', 'iiml.ac.in', 'iimc.ac.in', 'iimk.ac.in',
      'iimi.ac.in', 'iimranchi.ac.in', 'iimraipur.ac.in', 'iimsambalpur.ac.in',
      'iimshillong.ac.in', 'iimudaipur.ac.in', 'iimt.ac.in',

      // IISERs
      'iiserkol.ac.in', 'iisermohali.ac.in', 'iiserpune.ac.in', 'iisertvm.ac.in',
      'iiserbhopal.ac.in', 'iisertirupati.ac.in', 'iiserberhampur.ac.in', 'iiserbpr.ac.in',

      // Central Universities
      'du.ac.in', 'jnu.ac.in', 'amu.ac.in', 'jamiahamdard.edu', 'visvabharati.ac.in',
      'hcu.ac.in', 'tezu.ernet.in', 'cuo.ac.in',

      // Odisha Universities
      'utkaluniversity.ac.in', 'bput.ac.in', 'suniv.ac.in', 'fmuniversity.nic.in',
      'dduniversity.ac.in', 'nou.nic.in', 'uuc.ac.in', 'ouat.ac.in', 'vssut.ac.in',
      'ravenshawuniversity.ac.in', 'khallikote.ac.in', 'bamu.ac.in',

      // Odisha Private/Deemed
      'soasuniversity.ac.in', 'cutm.ac.in', 'ximuniversity.edu.in', 'ximb.ac.in',
      'asbm.ac.in', 'cvramanglobaluniversity.ac.in', 'birlaglobaluniversity.edu.in',
      'srisriuniversity.edu.in', 'niituniversity.in',

      // Jharkhand
      'bitmesra.ac.in', 'ranchiuniversity.ac.in', 'iitism.ac.in', 'vinobabhaveuniversity.ac.in',
      'kolhanuniversity.ac.in',

      // West Bengal
      'iitkgp.ac.in', 'jadavpuruniversity.in', 'caluniv.ac.in', 'presiuniv.ac.in',
      'makautwb.ac.in', 'heritageit.edu', 'iem.edu.in',

      // Bihar
      'patnauniversity.ac.in', 'lnmu.ac.in', 'tmbuniv.ac.in',

      // Deemed/Private (High Usage)
      'bits-pilani.ac.in', 'vit.ac.in', 'srmist.edu.in', 'manipal.edu', 'amrita.edu',
      'lpu.in', 'upes.ac.in', 'mitwpu.edu.in', 'kluniversity.in', 'klef.ac.in',
      'thapar.edu', 'snu.edu.in', 'ashoka.edu.in', 'opju.ac.in', 'plaksha.edu.in',
      'sastra.edu',

      // Engineering Universities
      'annauniv.edu', 'jntuh.ac.in', 'jntuk.edu.in', 'jntua.ac.in', 'aktu.ac.in',

      // Research/Science
      'iisc.ac.in', 'tifr.res.in', 'niser.ac.in', 'isi.ac.in',

      // Law Universities
      'nls.ac.in', 'nluo.ac.in', 'nludelhi.ac.in', 'nlujodhpur.ac.in',

      // Medical
      'aiimsbhubaneswar.edu.in', 'aiims.edu', 'pgimer.edu.in', 'cmcvellore.ac.in',

      // Design/Architecture
      'nid.edu', 'spa.ac.in',

      // Open Universities
      'ignou.ac.in',

      // Defence/Space
      'nda.nic.in', 'iist.ac.in',

      // North-East
      'dibrugarhuni.ac.in', 'guwahati.ac.in', 'tripurauniv.ac.in',

      // Odisha Colleges
      'panchayatcollege.in', 'sgckanikapada.org', 'pnautonomouscollege.in'
    ];

    const emailDomain = email.split('@')[1]?.toLowerCase();
    const isValidCollege = isTestAccount || validDomains.some(domain => emailDomain?.includes(domain.toLowerCase()));

    // Log for debugging (remove in production)
    console.log('Email domain check:', { emailDomain, isValidCollege, isTestAccount });

    if (!isValidCollege) {
      return res.status(400).json({
        success: false,
        message: 'Please use a valid college email address from supported institutions (IITs, NITs, IIITs, IIMs, etc.)'
      });
    }

    // Create user (test account is auto-verified)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save hook in User model
      college: college || 'Unknown College',
      year: year || '1st Year', // Default to 1st Year if not provided
      department: department || '',
      phone: phone || '',
      verified: isTestAccount ? true : false, // Test account auto-verified
      trustScore: isTestAccount ? 100 : 50 // Test account gets max trust
    });

    // Generate OTP for email verification (skip for test account)
    let otp = null;
    if (!isTestAccount) {
      otp = user.generateOTP();
      await user.save();
      console.log(`[OTP] ${email}: ${otp}`);

      // Send OTP via email
      try {
        await sendEmail({
          to: email,
          subject: 'Verify Your CampusX Account',
          text: `Your OTP verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="color: #2563eb; text-align: center; margin-bottom: 20px;">
                  🎓 Welcome to CampusX!
                </h1>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Hi ${name},
                </p>
                <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
                  Thank you for signing up! Please verify your email address by entering this OTP code:
                </p>
                <div style="background-color: #f0f9ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                  <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your Verification Code:</p>
                  <h2 style="font-size: 36px; color: #2563eb; margin: 0; letter-spacing: 8px; font-weight: bold;">
                    ${otp}
                  </h2>
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                  ⏰ This code will expire in <strong>10 minutes</strong>.
                </p>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                  If you didn't request this verification code, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">
                  © 2025 CampusX - Campus Marketplace Platform<br>
                  This is an automated message, please do not reply.
                </p>
              </div>
            </div>
          `
        });
        console.log('✅ OTP email sent successfully to:', email);
      } catch (emailError) {
        console.error('❌ Failed to send OTP email:', emailError.message);
        // Don't fail registration if email fails, user can resend OTP
      }
    }

    // Test account gets immediate JWT token
    if (isTestAccount) {
      const token = user.generateToken();
      return res.status(201).json({
        success: true,
        message: '✅ Test account created and auto-verified!',
        data: {
          email: user.email,
          name: user.name,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            college: user.college,
            verified: true,
            trustScore: 100
          },
          token // Ready to use immediately
        }
      });
    }

    // Regular account - needs OTP verification
    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email for verification code.',
      data: {
        email: user.email,
        name: user.name,
        // In production, never send OTP in response - only via email
        // For prototype demo, include it so frontend can test
        otp: process.env.NODE_ENV === 'production' ? undefined : otp
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user has verified their email (OTP verification)
    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your email for the OTP.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate JWT token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          verified: user.verified,
          trustScore: user.trustScore,
          avatar: user.avatar,
          phone: user.phone,
          department: user.department,
          year: user.year,
          department: user.department,
          year: user.year,
          bio: user.bio,
          theme: user.theme
        },
        token
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private (requires JWT token)
const getProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, profilePicture, department, year, theme } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;
    if (department) user.department = department;
    if (year) user.year = year;
    if (theme) user.theme = theme;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

// @desc    Generate OTP for email verification (or resend)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please sign up first.'
      });
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }

    // Generate new OTP (method defined in User model)
    const otp = user.generateOTP();
    await user.save();

    console.log(`[OTP Resend] ${email}: ${otp}`);
    console.log('[OTP Resend] OTP saved to DB:', user.otp);
    console.log('[OTP Resend] OTP Expiry:', user.otpExpiry);

    // Send OTP via email
    try {
      await sendEmail({
        to: email,
        subject: 'CampusX - Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Your Verification Code</h1>
            <p>Your OTP verification code is:</p>
            <h2 style="font-size: 36px; color: #2563eb; letter-spacing: 8px;">${otp}</h2>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `
      });
      console.log('✅ OTP resent via email');
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      // In production, never send OTP in response - only via email
      // For prototype demo, we can return it
      otp: process.env.NODE_ENV === 'production' ? undefined : otp
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending OTP',
      error: error.message
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user and explicitly select OTP fields (they might be excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('[OTP Verification] Email:', email);
    console.log('[OTP Verification] Received OTP:', otp, 'Type:', typeof otp);
    console.log('[OTP Verification] Stored OTP:', user.otp, 'Type:', typeof user.otp);
    console.log('[OTP Verification] OTP Expiry:', user.otpExpiry);
    console.log('[OTP Verification] Current Time:', new Date());

    // Check OTP expiry (10 minutes)
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Verify OTP - compare as strings
    const receivedOtp = String(otp).trim();
    const storedOtp = String(user.otp).trim();

    console.log('[OTP Verification] Comparing:', receivedOtp, '===', storedOtp, ':', receivedOtp === storedOtp);

    if (storedOtp !== receivedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token after successful verification
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to CampusX.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          verified: user.verified,
          trustScore: user.trustScore,
          phone: user.phone,
          department: user.department,
          year: user.year,
          bio: user.bio,
          theme: user.theme
        },
        token
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying OTP',
      error: error.message
    });
  }
};

// @desc    Forgot Password - Send reset link via email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Generate 6-digit reset code (like OTP)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const crypto = require('crypto');

    // Hash the reset code before storing
    user.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    console.log(`[Password Reset] ${email}: ${resetCode}`);
    console.log('[Password Reset] Token expires:', user.resetPasswordExpires);

    // Send reset code via email
    try {
      await sendEmail({
        to: email,
        subject: 'CampusX - Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #2563eb; text-align: center; margin-bottom: 20px;">
                🔒 Password Reset Request
              </h1>
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Hi ${user.name},
              </p>
              <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
                We received a request to reset your password. Use this code to reset your password:
              </p>
              <div style="background-color: #f0f9ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your Reset Code:</p>
                <h2 style="font-size: 36px; color: #2563eb; margin: 0; letter-spacing: 8px; font-weight: bold;">
                  ${resetCode}
                </h2>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                ⏰ This code will expire in <strong>15 minutes</strong>.
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                © 2025 CampusX - Campus Marketplace Platform<br>
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        `
      });
      console.log('✅ Password reset email sent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send reset email:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset code.',
      // For development only - remove in production
      resetCode: process.env.NODE_ENV === 'production' ? undefined : resetCode
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request',
      error: error.message
    });
  }
};

// @desc    Reset Password with code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, reset code, and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code or email'
      });
    }

    // Check if reset token exists
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'No password reset request found. Please request a new reset code.'
      });
    }

    // Check if token has expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.'
      });
    }

    // Hash the provided reset code and compare
    const crypto = require('crypto');
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    if (user.resetPasswordToken !== hashedResetCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for: ${email}`);

    // Generate JWT token for immediate login
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          verified: user.verified,
          trustScore: user.trustScore
        },
        token
      }
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword
};
