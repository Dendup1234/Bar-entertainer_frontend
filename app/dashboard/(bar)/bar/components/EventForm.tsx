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
const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
type TimeField = 'startTime' | 'endTime';
type TimePeriod = 'AM' | 'PM';

const toDateISO = (date: string) => {
  if (!date) return '';
  return new Date(`${date}T00:00:00.000Z`).toISOString();
};

const toDateTimeISO = (date: string, time: string) => {
  if (!date || !time) return '';
  return new Date(`${date}T${time}:00`).toISOString();
};

const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

const normalizeTimeInput = (value: string) => {
  const trimmed = value.trim();

  if (/^\d{3,4}$/.test(trimmed)) {
    const minutes = trimmed.slice(-2);
    const hours = trimmed.slice(0, -2).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [hours, minutes] = trimmed.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  return trimmed;
};

const toTimeInput = (v: string) => {
  if (!v) return '';
  if (v.includes('T')) return new Date(v).toTimeString().slice(0, 5);
  return v;
};

const toPickerParts = (time: string): { hour: string; minute: string; period: TimePeriod } => {
  const normalized = normalizeTimeInput(time);
  if (!isValidTime(normalized)) return { hour: '10', minute: '00', period: 'AM' };

  const [hourValue, minute] = normalized.split(':');
  const hour24 = Number(hourValue);
  const period: TimePeriod = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;

  return { hour: String(hour12).padStart(2, '0'), minute, period };
};

const to24HourTime = (hour: string, minute: string, period: TimePeriod) => {
  const hourNumber = Number(hour);
  const hour24 = period === 'AM'
    ? hourNumber % 12
    : (hourNumber % 12) + 12;

  return `${String(hour24).padStart(2, '0')}:${minute}`;
};

const displayTime = (time: string) => {
  const normalized = normalizeTimeInput(time);
  if (!isValidTime(normalized)) return 'Select time';

  const { hour, minute, period } = toPickerParts(normalized);
  return `${hour}:${minute} ${period}`;
};

const getEventImageUrl = (event: any) => event?.bannerImageUrl || event?.coverImage || event?.image || '';

export const EventForm = ({ initialData, onSuccess, onCancel }: EventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [pendingImageBlobName, setPendingImageBlobName] = useState<string | null>(null);
  const [activeTimeField, setActiveTimeField] = useState<TimeField | null>(null);
  const [draftTime, setDraftTime] = useState<{ hour: string; minute: string; period: TimePeriod }>({
    hour: '10',
    minute: '00',
    period: 'AM',
  });
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
      const imageUrl = getEventImageUrl(initialData);
      if (imageUrl) {
        setBannerPreview(imageUrl);
        setUploadedImageUrl(imageUrl);
      }
    }
  }, [initialData]);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const openTimePicker = (field: TimeField) => {
    setDraftTime(toPickerParts(form[field]));
    setActiveTimeField(field);
  };

  const applyTimePicker = () => {
    if (!activeTimeField) return;

    set(activeTimeField, to24HourTime(draftTime.hour, draftTime.minute, draftTime.period));
    setActiveTimeField(null);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG images are supported.');
      e.target.value = '';
      return;
    }

    setBannerPreview(URL.createObjectURL(file));
    setUploadedImageUrl(null);
    setPendingImageBlobName(null);
    setIsUploadingImage(true);

    try {
      const { sasUrl, blobName } = await barService.getEventImageSasUrl(file);
      await barService.uploadEventImageToAzure(sasUrl, file);

      if (initialData?._id) {
        const confirmed = await barService.confirmEventImageUpload(blobName, initialData._id);
        setUploadedImageUrl(getEventImageUrl(confirmed.data));
      } else {
        setPendingImageBlobName(blobName);
        setUploadedImageUrl(sasUrl.split('?')[0]);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(err instanceof Error ? err.message : 'Image upload failed. Please try again.');
      setBannerPreview(null);
      setPendingImageBlobName(null);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
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
      const startTime = normalizeTimeInput(form.startTime);
      const endTime = normalizeTimeInput(form.endTime);

      if (!isValidTime(startTime) || !isValidTime(endTime)) {
        alert('Please enter start and end time in HH:mm format, for example 18:30.');
        return;
      }

      const payload = {
        ...form,
        entertainerTypeNeeded: [form.entertainerTypeNeeded],
        genresPreferred: form.genresPreferred.split(',').map(s => s.trim()).filter(Boolean),
        eventDate: toDateISO(form.eventDate),
        startTime: toDateTimeISO(form.eventDate, startTime),
        endTime: toDateTimeISO(form.eventDate, endTime),
        ...(initialData?._id && uploadedImageUrl ? { bannerImageUrl: uploadedImageUrl } : {}),
      };

      if (initialData?._id) {
        await barService.updateEvent(initialData._id, payload);
      } else {
        const created = await barService.createEvent(payload);
        const eventId = created?.event?._id || created?.data?._id;

        if (pendingImageBlobName) {
          if (!eventId) {
            throw new Error('Event created, but the image could not be attached because the event ID was missing.');
          }
          await barService.confirmEventImageUpload(pendingImageBlobName, eventId);
        }
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Error saving event');
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
                    ) : uploadedImageUrl || pendingImageBlobName ? (
                      <>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          backgroundColor: '#16a34a', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', marginBottom: '6px',
                        }}>
                          <Check size={14} color="#fff" />
                        </div>
                        <p style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>
                          {pendingImageBlobName ? 'Ready to attach' : 'Uploaded'} — click to change
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
                    JPG, JPEG, or PNG
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={handleFile} style={{ display: 'none' }} />
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
              <button
                type="button"
                onClick={() => openTimePicker('startTime')}
                style={{
                  ...inp,
                  height: '42px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: isValidTime(form.startTime) ? '#111827' : '#9ca3af',
                }}
              >
                <span>{displayTime(form.startTime)}</span>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>Select</span>
              </button>
            </div>
            <div>
              <label style={lbl}>End Time</label>
              <button
                type="button"
                onClick={() => openTimePicker('endTime')}
                style={{
                  ...inp,
                  height: '42px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: isValidTime(form.endTime) ? '#111827' : '#9ca3af',
                }}
              >
                <span>{displayTime(form.endTime)}</span>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>Select</span>
              </button>
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

        {activeTimeField && (
          <div
            onClick={() => setActiveTimeField(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 80,
              backgroundColor: 'rgba(17,24,39,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '312px',
                backgroundColor: '#fff',
                borderRadius: '18px',
                boxShadow: '0 24px 70px rgba(17,24,39,0.22)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '26px 28px 22px' }}>
                <h3 style={{ margin: 0, color: '#111827', fontSize: '22px', fontWeight: 500 }}>
                  Select Time
                </h3>
                <p style={{ margin: '6px 0 0', color: '#9ca3af', fontSize: '12px', fontWeight: 500 }}>
                  {activeTimeField === 'startTime' ? 'Start time' : 'End time'}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
                padding: '24px 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}>
                <select
                  aria-label="Hour"
                  value={draftTime.hour}
                  onChange={(e) => setDraftTime(prev => ({ ...prev, hour: e.target.value }))}
                  style={{
                    width: '64px',
                    height: '36px',
                    border: '1px solid #edf0f5',
                    borderRadius: '8px',
                    backgroundColor: '#f7f9ff',
                    color: '#2563eb',
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {HOURS_12.map(hour => <option key={hour} value={hour}>{hour}</option>)}
                </select>
                <span style={{ color: '#111827', fontSize: '20px', fontWeight: 500 }}>:</span>
                <select
                  aria-label="Minute"
                  value={draftTime.minute}
                  onChange={(e) => setDraftTime(prev => ({ ...prev, minute: e.target.value }))}
                  style={{
                    width: '66px',
                    height: '36px',
                    border: '1px solid #edf0f5',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    color: '#111827',
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {MINUTES.map(minute => <option key={minute} value={minute}>{minute}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '6px', marginLeft: '4px' }}>
                  {(['AM', 'PM'] as TimePeriod[]).map(period => {
                    const active = draftTime.period === period;
                    return (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setDraftTime(prev => ({ ...prev, period }))}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: active ? '#2563eb' : '#9ca3af',
                          fontSize: '16px',
                          fontWeight: active ? 600 : 500,
                          cursor: 'pointer',
                          padding: '4px 0',
                        }}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{
                padding: '24px 26px 28px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '14px',
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTimeField(null)}
                  style={{
                    minWidth: '72px',
                    height: '44px',
                    border: 'none',
                    backgroundColor: '#fff',
                    color: '#2563eb',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyTimePicker}
                  style={{
                    minWidth: '104px',
                    height: '44px',
                    border: 'none',
                    borderRadius: '9999px',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    boxShadow: '0 8px 18px rgba(59,130,246,0.28)',
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
