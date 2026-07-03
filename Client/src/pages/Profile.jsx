import { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import VerifiedSeal from '../components/VerifiedSeal.jsx';
import { updateProfile } from '../services/profileService.js';

const STATUS_STYLES = {
  verified: 'bg-success-100 text-success-700',
  pending: 'bg-accent-100 text-accent-700',
  unverified: 'bg-primary-100 text-primary-500',
};

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await updateProfile(form);
      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 font-display text-xl font-bold text-primary-700">
          {user.full_name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-primary-900">
            {user.full_name}
          </h1>
          <p className="font-body text-primary-500">@{user.username}</p>
        </div>
        <span
          className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
            STATUS_STYLES[user.verification_status] || STATUS_STYLES.unverified
          }`}
        >
          <VerifiedSeal className="h-4 w-4" />
          {user.verification_status || 'unverified'}
        </span>
      </div>

      <div className="mt-10 rounded-2xl border border-primary-100 p-6">
        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              id="full_name"
              name="full_name"
              label="Full name"
              value={form.full_name}
              onChange={handleChange}
            />
            <Input
              id="username"
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="font-body text-sm font-medium text-primary-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={form.bio}
                onChange={handleChange}
                className="rounded-lg border border-primary-100 px-3.5 py-2.5 font-body text-ink outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="font-display text-lg font-bold text-primary-700">Bio</h2>
            <p className="mt-2 font-body text-ink">
              {user.bio || 'No bio yet — tell buyers a bit about your business.'}
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;