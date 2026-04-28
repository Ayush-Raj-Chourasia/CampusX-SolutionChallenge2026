import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircularImageCropper } from "@/components/CircularImageCropper";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.data.user;
          setUser(userData);
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
          setPhoneNumber(userData.phone || "");
          setBranch(userData.department || "");
          setYear(userData.year || "");
        } else {
          // Fallback to cached data
          const cached = sessionStorage.getItem("currentUser");
          if (cached) {
            const u = JSON.parse(cached);
            setUser(u);
            setPhoneNumber(u.phone || "");
            setBranch(u.department || "");
            setYear(u.year || "");
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use cached data
        const cached = sessionStorage.getItem("currentUser");
        if (cached) {
          const u = JSON.parse(cached);
          setUser(u);
          setPhoneNumber(u.phone || "");
          setBranch(u.department || "");
          setYear(u.year || "");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Prepare update data
      const updateData: any = {};
      if (phoneNumber) updateData.phone = phoneNumber;
      if (branch) updateData.department = branch;
      if (year) updateData.year = year;
      if (user.avatar) updateData.profilePicture = user.avatar;

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local session storage with new data
      const updatedUser = data.data.user;
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      navigate('/profile');
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP formats are supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: string) => {
    const updated = { ...user, avatar: croppedImage };
    setUser(updated);
    sessionStorage.setItem("currentUser", JSON.stringify(updated));
    toast.success("Profile photo updated");
    setShowCropper(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-card p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              📌 Name and college email cannot be changed for security reasons.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={user.name || user.fullName || ""} readOnly className="bg-muted cursor-not-allowed" />
              <p className="text-xs text-muted-foreground mt-1">Read-only • Set during signup</p>
            </div>

            <div>
              <Label>College Email</Label>
              <Input value={user.email || user.collegeEmail || ""} readOnly className="bg-muted cursor-not-allowed" />
              <p className="text-xs text-muted-foreground mt-1">Read-only • Verified account</p>
            </div>

            <div className="pt-4 border-t border-border">
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                  <SelectItem value="ECE">Electronics & Communication</SelectItem>
                  <SelectItem value="ME">Mechanical Engineering</SelectItem>
                  <SelectItem value="CE">Civil Engineering</SelectItem>
                  <SelectItem value="EE">Electrical Engineering</SelectItem>
                  <SelectItem value="ChE">Chemical Engineering</SelectItem>
                  <SelectItem value="BT">Biotechnology</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">Final Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-border">
              <Label>Phone Number</Label>
              <Input 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0,10))} 
                placeholder="10-digit phone number"
              />
            </div>

            <div>
              <Label>Profile Photo</Label>
              <div className="space-y-3">
                {user.avatar && (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary bg-muted flex items-center justify-center">
                      {user.avatar.startsWith('data:image') ? (
                        <img 
                          src={user.avatar} 
                          alt="profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{user.fullName?.[0] || '👤'}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Photo</p>
                      <p className="text-xs text-muted-foreground">Click upload to change</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.webp,image/*" 
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90
                    cursor-pointer"
                  aria-label="Upload profile picture"
                  title="Upload profile picture" 
                  onChange={handlePhotoUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Max 1MB • JPG, PNG, WebP • Tap to crop and adjust
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>Cancel</Button>
            </div>
          </div>
        </div>

        {/* Circular Image Cropper Modal */}
        <CircularImageCropper
          isOpen={showCropper}
          onClose={() => setShowCropper(false)}
          imageSrc={imageToCrop}
          onSave={handleCropComplete}
        />
      </div>
    </div>
  );
};

export default EditProfile;
