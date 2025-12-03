import React, { useEffect, useState } from 'react';
import api from '../../api/http';
import toast from 'react-hot-toast';

export default function GroupsPage() {
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const [allRes, mineRes] = await Promise.all([
        api.get('/groups'),
        api.get('/groups/mine'),
      ]);

      setAllGroups(allRes.data || []);
      setMyGroups(mineRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const myGroupIds = new Set(myGroups.map((g) => g._id));

  const handleJoin = async (groupId) => {
    try {
      setJoining(groupId);
      await api.post('/groups/join', { groupId });
      toast.success('Joined group');
      await fetchGroups();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to join group');
    } finally {
      setJoining(null);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Groups</h1>

      {loading ? (
        <div>Loading groups...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {allGroups.map((group) => {
            const joined = myGroupIds.has(group._id);
            return (
              <div
                key={group._id}
                style={{
                  borderRadius: '.75rem',
                  border: '1px solid #1f2937',
                  padding: '1rem',
                  background: '#020617',
                }}
              >
                <h3 style={{ marginBottom: '.25rem' }}>{group.name}</h3>
                <p
                  style={{
                    color: '#9ca3af',
                    fontSize: '.85rem',
                    marginBottom: '.6rem',
                  }}
                >
                  {group.description || 'Support & conversations.'}
                </p>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '.8rem',
                    marginBottom: '.75rem',
                  }}
                >
                  {group.memberCount || 0} members
                </p>

                <button
                  disabled={joined || joining === group._id}
                  onClick={() => handleJoin(group._id)}
                  style={{
                    width: '100%',
                    padding: '.55rem',
                    borderRadius: '.5rem',
                    border: 'none',
                    background: joined ? '#111827' : '#22c55e',
                    color: joined ? '#9ca3af' : '#020617',
                    fontWeight: 600,
                    cursor: joined ? 'default' : 'pointer',
                  }}
                >
                  {joined
                    ? 'Joined'
                    : joining === group._id
                    ? 'Joining...'
                    : 'Join Group'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
