import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Mail, Phone, LogOut, ChevronRight, Shield, Fingerprint, Activity, ClipboardList, Home, HeartPulse, FileText, Users, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Form State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ standard: {}, flexible: {} });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                navigate('/login');
                return;
            }

            try {
                // Fetch the merged profile from the new API
                const res = await axios.get('/api/profiles/me', {
                    headers: { 'x-user-id': storedUser.id }
                });

                const fullProfile = res.data.data;
                setUser(fullProfile);
                setProfileData(fullProfile.profile_details || {});
                setBiometricEnabled(fullProfile.is_biometric_enrolled);

                // Initialize form data
                setFormData({
                    standard: { ...fullProfile.profile_details },
                    flexible: { ...fullProfile.user_metadata }
                });

            } catch (err) {
                console.error("Failed to fetch smart profile", err);
                // Fallback
                setUser(storedUser);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, isEditing]);

    const toggleBiometric = async () => {
        const newValue = !biometricEnabled;
        setBiometricEnabled(newValue); // Optimistic UI
        const token = localStorage.getItem('token');

        try {
            const res = await axios.put('/api/user/profile', { biometric_enabled: newValue }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local storage user
            const updatedUser = res.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            console.error(err);
            setBiometricEnabled(!newValue); // Revert
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            await axios.put('/api/profiles/me', {
                standard_fields: formData.standard,
                flexible_metadata: formData.flexible
            }, {
                headers: { 'x-user-id': user.id }
            });
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to save profile details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStandardChange = (e) => {
        setFormData(prev => ({ ...prev, standard: { ...prev.standard, [e.target.name]: e.target.value } }));
    };

    const handleFlexibleChange = (e) => {
        setFormData(prev => ({ ...prev, flexible: { ...prev.flexible, [e.target.name]: e.target.value } }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-black/90 flex items-center justify-center text-white">Loading Profile...</div>;
    }

    if (!user) return null;

    const tenantType = user.tenant_type || 'default';
    const metadata = user.user_metadata || {};

    // Dynamic Renderers based on Tenant Type
    const renderSchoolFields = () => (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 space-y-4 animate-fade-in">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Parent Information</h3>

            {isEditing ? (
                <div className="space-y-3">
                    <input type="text" name="national_id" value={formData.standard.national_id || ''} onChange={handleStandardChange} placeholder="Parent National ID" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <input type="email" name="parent_email" value={formData.flexible.parent_email || ''} onChange={handleFlexibleChange} placeholder="Parent Email" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <input type="text" name="bank_transfer_info" value={formData.flexible.bank_transfer_info || ''} onChange={handleFlexibleChange} placeholder="Bank Info (e.g., Stanbic A/C 1234)" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <input type="text" name="parent_profession" value={formData.flexible.parent_profession || ''} onChange={handleFlexibleChange} placeholder="Profession" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                        <div className="bg-white/5 p-2 rounded"><span className="text-xs text-gray-500 block">Parent ID</span>{profileData.national_id || '-'}</div>
                        <div className="bg-white/5 p-2 rounded"><span className="text-xs text-gray-500 block">Profession</span>{metadata.parent_profession || '-'}</div>
                        <div className="col-span-2 bg-white/5 p-2 rounded"><span className="text-xs text-gray-500 block">Bank Info</span>{metadata.bank_transfer_info || '-'}</div>
                    </div>
                </>
            )}

            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 mt-4">Academic Performance</h3>
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-500/10 rounded-lg"><ClipboardList className="w-5 h-5 text-purple-400" /></div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Study Report</p>
                    <p className="text-white text-sm">{metadata.study_report_status || 'Good Standing'}</p>
                </div>
            </div>
        </div>
    );

    const renderHotelFields = () => (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 space-y-4 animate-fade-in">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Stay Details</h3>

            {isEditing ? (
                <div className="space-y-3">
                    <input type="text" name="passport_number" value={formData.standard.passport_number || ''} onChange={handleStandardChange} placeholder="Passport Number" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <input type="number" name="days_of_stay" value={formData.flexible.days_of_stay || ''} onChange={handleFlexibleChange} placeholder="Days of Stay" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 text-sm text-white">
                    <div className="bg-white/5 p-2 rounded"><span className="text-xs text-gray-500 block">Passport</span>{profileData.passport_number || '-'}</div>
                    <div className="bg-white/5 p-2 rounded"><span className="text-xs text-gray-500 block">Stay Duration</span>{metadata.days_of_stay ? `${metadata.days_of_stay} Days` : '-'}</div>
                </div>
            )}

            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 mt-4">Health & Safety</h3>
            {isEditing ? (
                <div className="space-y-3">
                    <input type="text" name="health_condition" value={formData.flexible.health_condition || ''} onChange={handleFlexibleChange} placeholder="Health Consideration (e.g. Allergies)" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <textarea name="lost_items_log" value={formData.flexible.lost_items_log || ''} onChange={handleFlexibleChange} placeholder="Lost Items Log" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" rows="2"></textarea>
                </div>
            ) : (
                <div className="space-y-2 text-sm text-white">
                    <div className="bg-red-500/10 p-2 rounded border border-red-500/20"><span className="text-xs text-red-400 block font-semibold flex items-center gap-1"><HeartPulse className="w-3 h-3" /> Health Issues</span>{metadata.health_condition || 'None Reported'}</div>
                    <div className="bg-amber-500/10 p-2 rounded border border-amber-500/20"><span className="text-xs text-amber-400 block font-semibold">Lost Items Log</span>{metadata.lost_items_log || 'None'}</div>
                </div>
            )}
        </div>
    );

    const renderApartmentFields = () => (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 space-y-4 animate-fade-in">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Lease Information</h3>

            {isEditing ? (
                <div className="space-y-3">
                    <input type="text" name="lease_duration" value={formData.flexible.lease_duration || ''} onChange={handleFlexibleChange} placeholder="Lease Duration (Months/Weeks paid)" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <input type="number" name="members_count" value={formData.flexible.members_count || ''} onChange={handleFlexibleChange} placeholder="Number of Family Members" className="w-full bg-white/10 text-white rounded-lg p-2 text-sm" />
                    <select name="payment_method" value={formData.flexible.payment_method || ''} onChange={handleFlexibleChange} className="w-full bg-white/10 text-white rounded-lg p-2 text-sm">
                        <option value="" disabled className="text-gray-800">Select Payment Method</option>
                        <option value="Cash at bank" className="text-gray-800">Bank Transfer (Cash at bank)</option>
                        <option value="Cash at hand" className="text-gray-800">Physical Register (Cash at hand)</option>
                    </select>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 text-sm text-white">
                    <div className="col-span-2 bg-emerald-500/10 p-2 rounded border border-emerald-500/20"><span className="text-xs text-emerald-400 block">Lease Duration</span>{metadata.lease_duration || 'Not Set'}</div>
                    <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20"><span className="text-xs text-blue-400 block flex items-center gap-1"><Users className="w-3 h-3" /> Members</span>{metadata.members_count || 1}</div>
                    <div className="bg-purple-500/10 p-2 rounded border border-purple-500/20"><span className="text-xs text-purple-400 block">Payment Method</span>{metadata.payment_method || 'Bank'}</div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans tap-highlight-transparent">
            <div className="w-full max-w-[375px] h-[812px] bg-[#0A1F44] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-4 ring-gray-900 flex flex-col animate-scale-in">

                {/* Header */}
                <div className="p-6 pt-12 flex items-center justify-between bg-[#0A1F44] z-10 sticky top-0">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-white">My Profile</h1>
                    </div>
                    {isEditing ? (
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setIsEditing(false)} className="p-2 text-red-400 hover:bg-white/10 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                            <button onClick={handleSaveProfile} className="p-2 text-[#1EC677] hover:bg-white/10 rounded-full transition">
                                <Save className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-white/10 rounded-full transition text-[#FFA500]">
                            <Edit3 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20">

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden shadow-xl mb-4 relative">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.full_name}&background=1EC677&color=fff&bold=true`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
                        <p className="text-blue-200/60 text-sm font-medium capitalize">{tenantType} Member</p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                <p className="text-white text-sm truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                <p className="text-white text-sm">{user.phone || '+256 700 000000'}</p>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC COMPONENT INJECTION based on Industry */}
                    {tenantType === 'school' && renderSchoolFields()}
                    {tenantType === 'hotel' && renderHotelFields()}
                    {tenantType === 'apartment' && renderApartmentFields()}

                    {/* Settings Actions */}
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Settings</h3>
                    <div className="space-y-3">
                        <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[#1EC677]/10 text-[#1EC677] rounded-lg">
                                    <Fingerprint className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">Biometric Access</span>
                            </div>
                            <button
                                onClick={toggleBiometric}
                                className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${biometricEnabled ? 'bg-[#1EC677]' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${biometricEnabled ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/subscriptions')}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">My Subscriptions</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>

                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">Security & Privacy</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-white/5 hover:bg-red-500/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="text-red-400 font-medium">Log Out</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-xs">Cortex App v1.2.0 (Build 504)</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
