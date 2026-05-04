"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, X, ImagePlus, Check } from 'lucide-react';
import { barService } from '@/features/home/services/barServices';

interface EventFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ENTERTAINER_TYPES = [
  { label: 'DJ', value: 'dj' },
  { label: 'Live Band', value: 'band' },
  { label: 'Singer', value: 'singer' },
  { label: 'Comedian', value: 'comedian' },
];

const STATUS_OPTIONS = ['open', 'in progress', 'completed', 'canceled'];

const toISO = (date: string, time: string) => {
  if (!date || !time) return '';
  return new Date(`${date}T${time}:00`).toISOString();
};

const toTimeInput = (v: string) => {
  if (!v) return '';
  if (v.includes('T')) return new Date(v).toTimeString().slice(0, 5);
  return v;
};

export const EventForm = ({ initialData, onSuccess, onCancel }: EventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', description: '', eventDate: '',
    startTime: '', endTime: '', venueAddress: '',
    city: '', offeredAmount: 0, isPublic: true,
    status: 'open', entertainerTypeNeeded: 'dj', genresPreferred: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        eventDate: initialData.eventDate?.split('T')[0] || '',
        startTime: toTimeInput(initialData.startTime || ''),
        endTime: toTimeInput(initialData.endTime || ''),
        venueAddress: initialData.venueAddress || '',
        city: initialData.city || '',
        offeredAmount: initialData.offeredAmount || 0,
        isPublic: initialData.isPublic ?? true,
        status: initialData.status || 'open',
        entertainerTypeNeeded: initialData.entertainerTypeNeeded?.[0] || 'dj',
        genresPreferred: initialData.genresPreferred?.join(', ') || '',
      });
      if (initialData.coverImage) {
        setBannerPreview(initialData.coverImage);
        setUploadedImageUrl(initialData.coverImage);
      }
    }
  }, [initialData]);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Only JPEG/JPG images are supported.');
      e.target.value = '';
      return;
    }

    setBannerPreview(URL.createObjectURL(file));
    setUploadedImageUrl(null);
    setIsUploadingImage(true);

    try {
      const { sasUrl, blobName } = await barService.getEventImageSasUrl(file);
      await barService.uploadEventImageToAzure(sasUrl, file);

      // Pass eventId if editing, undefined if creating
      const confirmed = await barService.confirmEventImageUpload(
        blobName,
        initialData?._id
      );

      console.log('CONFIRM RESPONSE:', confirmed);

      // For existing events, bannerImageUrl is set directly on the event
      // For new events, we store the URL to send with create payload
      const imageUrl = confirmed.data?.bannerImageUrl || confirmed.data?.profileImage;
      console.log('RESOLVED IMAGE URL:', imageUrl);
      setUploadedImageUrl(imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. Please try again.');
      setBannerPreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) {
      alert('Please wait for the image to finish uploading.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        entertainerTypeNeeded: [form.entertainerTypeNeeded],
        genresPreferred: form.genresPreferred.split(',').map(s => s.trim()).filter(Boolean),
        startTime: toISO(form.eventDate, form.startTime),
        endTime: toISO(form.eventDate, form.endTime),
        ...(uploadedImageUrl ? { coverImage: uploadedImageUrl } : {}),
      };

      console.log('=== PAYLOAD BEING SENT ===', payload); // ADD THIS
      console.log('=== uploadedImageUrl ===', uploadedImageUrl); // ADD THIS

      if (initialData?._id) {
        await barService.updateEvent(initialData._id, payload);
      } else {
        await barService.createEvent(payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error saving event');
    } finally {
      setIsSubmitting(false);
    }
  };
  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: '13px',
    color: '#111827', backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb', borderRadius: '10px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  const lbl: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, color: '#6b7280',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: '6px',
  };

  const grid2: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
  };

  const isEdit = !!initialData;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '480px', maxHeight: '92vh',
        backgroundColor: '#fff', borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f3f4f6', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
              {isEdit ? 'Edit Event' : 'Create Event'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              {isEdit ? 'Update your event details' : 'Fill in the details below'}
            </p>
          </div>
          <button onClick={onCancel} style={{
            width: '30px', height: '30px', borderRadius: '50%',
            border: '1px solid #e5e7eb', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#6b7280', flexShrink: 0,
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <form id="event-form" onSubmit={handleSubmit} style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>

          {/* Banner Upload */}
          <div>
            <label style={lbl}>Event Banner</label>
            <div
              onClick={() => !isUploadingImage && fileRef.current?.click()}
              style={{
                width: '100%', height: '140px',
                border: '1.5px dashed #d1d5db', borderRadius: '12px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                overflow: 'hidden', position: 'relative',
                backgroundColor: bannerPreview ? '#000' : '#f9fafb',
              }}
            >
              {bannerPreview ? (
                <>
                  <img
                    src={bannerPreview} alt="banner"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                  }}>
                    {isUploadingImage ? (
                      <>
                        <Loader2 size={20} color="#fff" className="animate-spin" />
                        <p style={{ color: '#fff', fontSize: '12px', marginTop: '8px', fontWeight: 500 }}>
                          Uploading...
                        </p>
                      </>
                    ) : uploadedImageUrl ? (
                      <>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          backgroundColor: '#16a34a', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', marginBottom: '6px',
                        }}>
                          <Check size={14} color="#fff" />
                        </div>
                        <p style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>
                          Uploaded — click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <ImagePlus size={20} color="#fff" />
                        <p style={{ color: '#fff', fontSize: '12px', marginTop: '6px', fontWeight: 500 }}>
                          Change photo
                        </p>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: '#f3f4f6', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '8px',
                  }}>
                    <ImagePlus size={18} color="#9ca3af" />
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: 500 }}>
                    Click to upload banner
                  </p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '3px 0 0' }}>
                    JPG / JPEG only, up to 5MB
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/jpg" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {/* Event Name */}
          <div>
            <label style={lbl}>Event Name</label>
            <input required value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Thimphu Night Life" style={inp} />
          </div>

          {/* Date + Amount */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Date</label>
              <input required type="date" value={form.eventDate}
                onChange={e => set('eventDate', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Offered Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '12px',
                  fontWeight: 600, color: '#9ca3af', pointerEvents: 'none',
                }}>Nu.</span>
                <input type="number" value={form.offeredAmount}
                  onChange={e => set('offeredAmount', Number(e.target.value))}
                  style={{ ...inp, paddingLeft: '36px' }} />
              </div>
            </div>
          </div>

          {/* Times */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Start Time</label>
              <input type="time" value={form.startTime}
                onChange={e => set('startTime', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>End Time</label>
              <input type="time" value={form.endTime}
                onChange={e => set('endTime', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Location */}
          <div style={grid2}>
            <div>
              <label style={lbl}>City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                placeholder="e.g. Thimphu" style={inp} />
            </div>
            <div>
              <label style={lbl}>Venue Address</label>
              <input value={form.venueAddress} onChange={e => set('venueAddress', e.target.value)}
                placeholder="Street / Landmark" style={inp} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea rows={3} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the event, vibe, dress code…"
              style={{ ...inp, resize: 'none', lineHeight: '1.6' }} />
          </div>

          {/* Genre */}
          <div>
            <label style={lbl}>Preferred Genres</label>
            <input value={form.genresPreferred}
              onChange={e => set('genresPreferred', e.target.value)}
              placeholder="e.g. Pop, Jazz, EDM (comma separated)"
              style={inp} />
          </div>

          {/* Entertainer Type */}
          <div>
            <label style={lbl}>Entertainer Type</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ENTERTAINER_TYPES.map(({ label, value }) => {
                const active = form.entertainerTypeNeeded === value;
                return (
                  <button key={value} type="button" onClick={() => set('entertainerTypeNeeded', value)}
                    style={{
                      padding: '7px 16px', borderRadius: '9999px',
                      fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                      border: active ? '1px solid #111827' : '1px solid #e5e7eb',
                      backgroundColor: active ? '#111827' : '#fff',
                      color: active ? '#fff' : '#6b7280', transition: 'all 0.15s',
                    }}
                  >{label}</button>
                );
              })}
            </div>
          </div>

          {/* Visibility + Status */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Visibility</label>
              <div style={{
                display: 'flex', backgroundColor: '#f3f4f6',
                borderRadius: '10px', padding: '3px', gap: '3px',
              }}>
                {['Public', 'Private'].map(opt => {
                  const active = opt === 'Public' ? form.isPublic : !form.isPublic;
                  return (
                    <button key={opt} type="button" onClick={() => set('isPublic', opt === 'Public')}
                      style={{
                        flex: 1, padding: '7px 0', borderRadius: '8px',
                        fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer',
                        backgroundColor: active ? '#fff' : 'transparent',
                        color: active ? '#111827' : '#9ca3af',
                        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s',
                      }}
                    >{opt}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                style={{
                  ...inp, cursor: 'pointer', appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div style={{
          padding: '14px 24px 20px', borderTop: '1px solid #f3f4f6',
          display: 'flex', gap: '10px', flexShrink: 0,
        }}>
          <button type="button" onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: '12px',
            fontSize: '13px', fontWeight: 500, color: '#6b7280',
            backgroundColor: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button type="submit" form="event-form"
            disabled={isSubmitting || isUploadingImage}
            style={{
              flex: 2, padding: '11px', borderRadius: '12px',
              fontSize: '13px', fontWeight: 600, color: '#fff',
              backgroundColor: '#111827', border: 'none',
              cursor: (isSubmitting || isUploadingImage) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              opacity: (isSubmitting || isUploadingImage) ? 0.6 : 1,
            }}
          >
            {isSubmitting
              ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
              : isUploadingImage
                ? <><Loader2 size={13} className="animate-spin" /> Uploading image...</>
                : <><Check size={13} strokeWidth={2.5} /> {isEdit ? 'Save Changes' : 'Create Event'}</>
            }
          </button>
        </div>

      </div>
    </div>
  );
};