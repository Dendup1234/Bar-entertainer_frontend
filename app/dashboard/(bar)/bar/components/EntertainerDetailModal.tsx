"use client";
import React, { useEffect, useState } from 'react';
import { barService } from '@/features/home/services/barServices';
import { Phone, MapPin, Music2, Star, Briefcase, X, Calendar, DollarSign } from 'lucide-react';
import { FaInstagram as Instagram, FaYoutube as Youtube } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  entertainerId: string | null;
}

export const EntertainerDetailModal = ({ isOpen, onClose, entertainerId }: ModalProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && entertainerId) {
      setLoading(true);
      barService.getEntertainerById(entertainerId)
        .then(res => setData(res.profile || res))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, entertainerId]);

  if (!isOpen) return null;

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px 0', borderBottom: '1px solid #f9fafb',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        backgroundColor: '#f9fafb', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ color: '#9ca3af' }}>{icon}</span>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );

  const StatBox = ({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) => (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <p style={{
        margin: 0, fontSize: '22px', fontWeight: 700,
        color: highlight ? '#111827' : '#111827',
      }}>
        {value ?? 0}
      </p>
      <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
        {label}
      </p>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '480px', maxHeight: '90vh',
        backgroundColor: '#fff', borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: '2.5px solid #e5e7eb', borderTopColor: '#111827',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : (
          <>
            {/* Hero cover */}
            <div style={{
              width: '100%', height: '160px', position: 'relative',
              backgroundColor: '#111827', flexShrink: 0,
            }}>
              {data?.profileImage
                ? <img src={data.profileImage} alt={data.stageName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  }} />
                )
              }

              {/* Close button */}
              <button onClick={onClose} style={{
                position: 'absolute', top: '14px', right: '14px',
                width: '30px', height: '30px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.95)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#374151',
              }}>
                <X size={14} />
              </button>

              {/* Type badge */}
              <span style={{
                position: 'absolute', top: '14px', left: '14px',
                padding: '4px 12px', borderRadius: '9999px',
                fontSize: '11px', fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.95)', color: '#111827',
              }}>
                {data?.bio?.entertainerType || '—'}
              </span>

              {/* Avatar + name overlay */}
              <div style={{
                position: 'absolute', bottom: '-28px', left: '20px',
                display: 'flex', alignItems: 'flex-end', gap: '12px',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  border: '3px solid #fff', overflow: 'hidden',
                  backgroundColor: '#e5e7eb', flexShrink: 0,
                }}>
                  {data?.profileImage
                    ? <img src={data.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
                  }
                </div>
              </div>
            </div>

            {/* Name section */}
            <div style={{ padding: '36px 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111827' }}>
                {data?.stageName}
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                {data?.email}
              </p>

              {/* Stats row */}
              <div style={{
                display: 'flex', alignItems: 'center',
                marginTop: '16px', padding: '14px 0',
                borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6',
              }}>
                <StatBox label="Reviews" value={data?.stats?.totalReviews} />
                <div style={{ width: '1px', height: '32px', backgroundColor: '#f3f4f6' }} />
                <StatBox label="Rating" value={data?.stats?.averageRating} highlight />
                <div style={{ width: '1px', height: '32px', backgroundColor: '#f3f4f6' }} />
                <StatBox label="Bookings" value={data?.stats?.totalBookings} />
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 8px' }}>

              <InfoRow icon={<Music2 size={14} />} label="Entertainer Type" value={data?.bio?.entertainerType} />
              <InfoRow icon={<Briefcase size={14} />} label="Genres" value={data?.bio?.genres?.join(', ')} />
              <InfoRow icon={<DollarSign size={14} />} label="Price Range" value={data?.bio?.priceRange} />
              <InfoRow icon={<Calendar size={14} />} label="Availability" value={data?.bio?.availability} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value={data?.contact?.phone} />
              <InfoRow icon={<MapPin size={14} />} label="Location" value={data?.contact?.location} />

              {data?.experience && (
                <div style={{ padding: '14px 0', borderBottom: '1px solid #f9fafb' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Experience
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.7' }}>
                    {data.experience}
                  </p>
                </div>
              )}

              {/* Socials */}
              {(data?.socialLinks?.instagram || data?.socialLinks?.youtube) && (
                <div style={{ padding: '14px 0' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Socials
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {data.socialLinks.instagram && (
                      <a href={data.socialLinks.instagram} target="_blank" rel="noreferrer" style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6b7280', textDecoration: 'none',
                      }}>
                        <Instagram size={16} />
                      </a>
                    )}
                    {data.socialLinks.youtube && (
                      <a href={data.socialLinks.youtube} target="_blank" rel="noreferrer" style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6b7280', textDecoration: 'none',
                      }}>
                        <Youtube size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
              <button onClick={onClose} style={{
                width: '100%', padding: '11px', borderRadius: '12px',
                fontSize: '13px', fontWeight: 500, color: '#6b7280',
                backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', cursor: 'pointer',
              }}>
                Close
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};