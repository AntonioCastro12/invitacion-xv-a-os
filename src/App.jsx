import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  CalendarDays,
  Camera,
  Check,
  ChevronUp,
  Clock,
  Copy,
  Crown,
  Diamond,
  Gift,
  Heart,
  Hotel,
  MapPin,
  MessageCircle,
  Music,
  Share2,
  Shirt,
  Sparkles,
  Ticket,
  UserRound,
  Volume2,
  VolumeX,
} from 'lucide-react';

const STORY_MODE = false;

const invitationData = {
  quinceaneraName: 'Camila Fernandez',
  title: 'Mis XV Años',
  date: '31 de octubre de 2026',
  targetDate: '2026-10-31T20:00:00',
  time: '8:00 p.m.',
  city: 'Irapuato, Guanajuato',
  phrase: 'Hoy comienza un sueño que quiero compartir contigo.',
  hashtag: '#XVCamilaFernandez',
  parents: {
    father: 'Nombre del papa',
    mother: 'Nombre de la mama',
  },
  godparents: [
    'Padrinos de honor',
    'Padrinos de brindis',
    'Padrinos de pastel',
    'Padrinos de recuerdos',
  ],
  honorCourt: {
    damas: ['Dama 1', 'Dama 2', 'Dama 3'],
    chambelanes: ['Chambelan 1', 'Chambelan 2', 'Chambelan 3'],
  },
  ceremony: {
    label: 'Ceremonia / Misa',
    place: 'Parroquia editable',
    date: '31 de octubre de 2026',
    time: '6:00 p.m.',
    start: '2026-10-31T18:00:00',
    end: '2026-10-31T19:00:00',
    address: 'Direccion editable, Irapuato, Guanajuato',
    mapsUrl: 'https://maps.google.com/?q=Irapuato%20Guanajuato',
  },
  reception: {
    label: 'Recepcion',
    place: 'Salon editable',
    date: '31 de octubre de 2026',
    time: '8:00 p.m.',
    start: '2026-10-31T20:00:00',
    end: '2026-11-01T02:00:00',
    address: 'Direccion editable, Irapuato, Guanajuato',
    mapsUrl: 'https://maps.google.com/?q=Irapuato%20Guanajuato',
  },
  itinerary: [
    ['6:00 p.m.', 'Ceremonia religiosa'],
    ['8:00 p.m.', 'Recepcion'],
    ['8:30 p.m.', 'Cena'],
    ['9:30 p.m.', 'Entrada de la quinceanera'],
    ['10:00 p.m.', 'Vals'],
    ['10:30 p.m.', 'Baile sorpresa'],
    ['11:00 p.m.', 'Fiesta'],
    ['12:00 a.m.', 'Sorpresas'],
  ],
  dressCode: {
    title: 'Elegante',
    colors: ['Rosa', 'Blanco', 'Dorado', 'Negro'],
    note: 'Agradecemos evitar el color reservado para la quinceanera si aplica.',
  },
  gifts: {
    text: 'Tu presencia es mi mejor regalo, pero si deseas tener un detalle conmigo, puedes hacerlo en las siguientes opciones.',
    links: [
      { label: 'Liverpool', url: 'https://www.liverpool.com.mx/' },
      { label: 'Amazon', url: 'https://www.amazon.com.mx/' },
      { label: 'Transferencia', url: '#' },
      { label: 'Sobre de efectivo', url: '#' },
    ],
    bank: {
      bankName: 'Banco',
      holder: 'Titular',
      clabe: '000000000000000000',
    },
  },
  gallery: [
    '/assets/moment-tiara.png',
    '/assets/moment-cake.png',
    '/assets/moment-ballroom.png',
    '/assets/moment-toast.png',
  ],
  video: '',
  whatsapp: 'https://wa.me/52462XXXXXXX',
  maps: {
    ceremony: 'https://maps.google.com/?q=Irapuato%20Guanajuato',
    reception: 'https://maps.google.com/?q=Irapuato%20Guanajuato',
  },
  music: '/assets/music.mp3',
  socialLinks: {
    instagram: 'https://www.instagram.com/explore/tags/XVCamilaFernandez/',
    spotify: 'https://open.spotify.com/',
  },
  hotels: [
    {
      name: 'Hotel 1',
      description: 'Opcion cercana al evento',
      website: 'https://www.google.com/search?q=hotel+irapuato',
      mapsUrl: 'https://maps.google.com/?q=hotel%20irapuato',
    },
    {
      name: 'Hotel 2',
      description: 'Opcion familiar recomendada',
      website: 'https://www.google.com/search?q=hotel+irapuato+guanajuato',
      mapsUrl: 'https://maps.google.com/?q=hotel%20irapuato%20guanajuato',
    },
  ],
};

const params = new URLSearchParams(window.location.search);
const guestName = params.get('invitado') || 'Invitacion especial';
const guestId = params.get('idInvitado') || '000000';
const guestPeople = params.get('personas') || '1';
const guestTable = params.get('mesa') || 'Por asignar';
const guestStatus = params.get('estado') || 'Habilitado';

function encodeICSDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function downloadCalendarEvent(eventData) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RCM CodeDev//XV Auto Diamante//ES',
    'BEGIN:VEVENT',
    `UID:${eventData.label}-${guestId}@xv-auto-diamante`,
    `DTSTAMP:${encodeICSDate(new Date().toISOString())}`,
    `DTSTART:${encodeICSDate(eventData.start)}`,
    `DTEND:${encodeICSDate(eventData.end)}`,
    `SUMMARY:${eventData.label} - ${invitationData.quinceaneraName}`,
    `LOCATION:${eventData.address}`,
    `DESCRIPTION:XV anos de ${invitationData.quinceaneraName}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${eventData.label.toLowerCase().replaceAll(' ', '-')}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const distance = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function useReveal(dependency) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal, [data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dependency]);
}

function shareInvite(title, text, url = window.location.href) {
  if (navigator.share) {
    return navigator.share({ title, text, url });
  }
  return navigator.clipboard.writeText(url);
}

function DiamondParticles() {
  return (
    <div className="diamond-particles" aria-hidden="true">
      {Array.from({ length: 34 }).map((_, index) => (
        <span key={index} style={{ '--i': index }} />
      ))}
    </div>
  );
}

function FloralFrame() {
  return (
    <div className="floral-frame" aria-hidden="true">
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((position) => (
        <div className={`floral-corner ${position}`} key={position}>
          <span className="rose rose-a" />
          <span className="rose rose-b" />
          <span className="leaf leaf-a" />
          <span className="leaf leaf-b" />
          <span className="leaf leaf-c" />
          <span className="gem gem-a" />
          <span className="gem gem-b" />
        </div>
      ))}
    </div>
  );
}

function CrownDivider({ compact = false }) {
  return (
    <div className={`crown-divider ${compact ? 'compact' : ''}`} aria-hidden="true">
      <span />
      <Crown size={compact ? 18 : 34} />
      <span />
    </div>
  );
}

function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden="true">
      <span />
      <Diamond size={18} />
      <span />
    </div>
  );
}

function LuxuryCarVisual() {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className="car-stage" aria-label="Auto elegante de lujo">
      <div className="car-glow" />
      {!useFallback ? (
        <img
          className="car-image"
          src="/assets/car.png"
          alt="Auto elegante generico"
          onError={() => setUseFallback(true)}
        />
      ) : (
        <div className="css-car" aria-hidden="true">
          <div className="car-top" />
          <div className="car-body" />
          <div className="car-light left" />
          <div className="car-light right" />
          <div className="wheel wheel-left" />
          <div className="wheel wheel-right" />
        </div>
      )}
      <div className="floor-reflection" />
      <Diamond className="car-diamond diamond-one" aria-hidden="true" />
      <Diamond className="car-diamond diamond-two" aria-hidden="true" />
    </div>
  );
}

function QuinceaneraPhoto() {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className="quince-photo-card" aria-label="Foto de quinceanera">
      {!useFallback ? (
        <img
          src="/assets/hero-camila.png"
          alt="Quinceanera con vestido elegante"
          onError={() => setUseFallback(true)}
        />
      ) : (
        <div className="quince-photo-fallback" aria-hidden="true">
          <div className="portrait-glow" />
          <div className="portrait-head" />
          <div className="portrait-hair" />
          <div className="portrait-bodice" />
          <div className="portrait-dress" />
        </div>
      )}
      <span className="photo-sparkle sparkle-a" />
      <span className="photo-sparkle sparkle-b" />
      <span className="photo-sparkle sparkle-c" />
    </div>
  );
}

function BowVisual() {
  return (
    <div className="bow-stage" aria-label="Mono elegante para abrir invitacion">
      <div className="bow-glow" />
      <div className="bow-ribbon left" />
      <div className="bow-ribbon right" />
      <div className="bow-knot">
        <Diamond size={22} />
      </div>
      <div className="bow-tail left" />
      <div className="bow-tail right" />
      <span className="bow-sparkle sparkle-a" />
      <span className="bow-sparkle sparkle-b" />
      <span className="bow-sparkle sparkle-c" />
    </div>
  );
}

function IntroScreen({ onOpen, isOpening }) {
  return (
    <section className={`intro-screen ${isOpening ? 'is-opening' : ''}`}>
      <DiamondParticles />
      <div className="intro-music-hint" aria-hidden="true">
        <Music size={24} />
      </div>
      <div className="intro-content envelope-intro">
        <div className="envelope-copy">
          <p>{invitationData.title}</p>
          <h1>{invitationData.quinceaneraName}</h1>
        </div>
        <div className="invitation-envelope" aria-hidden="true">
          <span className="envelope-panel panel-left" />
          <span className="envelope-panel panel-right" />
          <span className="envelope-panel panel-bottom" />
          <span className="envelope-panel panel-top" />
          <span className="envelope-edge edge-top" />
          <span className="envelope-edge edge-bottom" />
        </div>
        <button className="envelope-seal" type="button" onClick={onOpen} disabled={isOpening} aria-label="Abrir invitacion">
          <img className="seal-image" src="/assets/seal-xv-transparent.png" alt="" />
          <small>Toca para abrir</small>
        </button>
        <p className="intro-date">{invitationData.date}</p>
        <p className="music-note"><Music size={15} /> La música se reproduce al abrir.</p>
      </div>
    </section>
  );
}

function MusicPlayer({ audioRef, isPlaying, setIsPlaying, opened }) {
  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  if (!opened) return null;

  return (
    <button
      className="floating-button music-button"
      type="button"
      onClick={toggleMusic}
      aria-label={isPlaying ? 'Pausar musica' : 'Reproducir musica'}
    >
      {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{isPlaying ? 'Musica activada' : 'Musica pausada'}</span>
    </button>
  );
}

function ShareButton({ className = '', compact = false }) {
  return (
    <button
      className={className || 'ghost-button'}
      type="button"
      onClick={() =>
        shareInvite(
          `${invitationData.title} - ${invitationData.quinceaneraName}`,
          invitationData.phrase,
        )
      }
      aria-label="Compartir invitacion"
    >
      <Share2 size={17} />
      {!compact && 'Compartir'}
    </button>
  );
}

function Section({ id, title, icon: Icon = Sparkles, children, className = '' }) {
  return (
    <section id={id} className={`section reveal ${STORY_MODE ? 'story-section' : ''} ${className}`}>
      <FloralFrame />
      <div className="section-heading">
        <span className="section-icon">
          <Icon size={18} />
        </span>
        <h2>{title}</h2>
      </div>
      <OrnamentDivider />
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero reveal">
      <DiamondParticles />
      <FloralFrame />
      <div className="hero-copy">
        <div className="hero-music-orb" aria-hidden="true"><Music size={22} /></div>
        <CrownDivider />
        <p className="eyebrow">Una noche exclusiva en {invitationData.city}</p>
        <p className="hero-title">{invitationData.title}</p>
        <h1>{invitationData.quinceaneraName}</h1>
        <OrnamentDivider />
        <p className="hero-phrase">"{invitationData.phrase}"</p>
        <QuinceaneraPhoto />
        <div className="hero-meta">
          <article className="intro-detail-card" data-animate style={{ '--delay': '140ms' }}>
            <CalendarDays size={25} />
            <strong>{invitationData.date}</strong>
          </article>
          <article className="intro-detail-card" data-animate style={{ '--delay': '240ms' }}>
            <Clock size={25} />
            <strong>{invitationData.time}</strong>
          </article>
        </div>
      </div>
      <div className="hero-actions">
        <a className="primary-button" href="#rsvp" aria-label="Confirmar asistencia">
          <MessageCircle size={18} />
          Confirmar asistencia
        </a>
        <a className="secondary-button" href="#ubicaciones" aria-label="Ver ubicacion">
          <MapPin size={18} />
          Ver ubicacion
        </a>
      </div>
    </section>
  );
}

function GuestPass() {
  const invitationUrl = window.location.href;

  const handleShare = () =>
    shareInvite('Pase de acceso XV Camila Fernandez', `Pase para ${guestName}. Folio ${guestId}.`, invitationUrl);

  return (
    <Section id="pase" title="Pase personalizado" icon={Ticket}>
      <div className="guest-pass">
        <CrownDivider compact />
        <p className="pass-subtitle">Invitacion para</p>
        <h3>{guestName}</h3>
        <div className="pass-topline">
          <span><Crown size={16} /> Entrada premium</span>
          <span>Folio: {guestId}</span>
        </div>
        <div className="pass-body">
          <div className="pass-grid">
            <span><Ticket size={19} /> Folio</span>
            <strong>{guestId}</strong>
            <span><UserRound size={19} /> Pase valido para</span>
            <strong>{guestPeople} personas</strong>
            <span><Crown size={19} /> Mesa</span>
            <strong>{guestTable}</strong>
            <span><Check size={19} /> Estado</span>
            <strong>{guestStatus}</strong>
          </div>
          <div className="qr-frame" data-animate style={{ '--delay': '150ms' }}>
            <QRCodeCanvas value={invitationUrl} size={150} bgColor="#FFF7F3" fgColor="#0B0B0F" includeMargin />
          </div>
        </div>
        <button className="secondary-button full" type="button" onClick={handleShare} aria-label="Compartir pase">
          <Share2 size={18} />
          Compartir pase
        </button>
      </div>
    </Section>
  );
}

function Countdown() {
  const timeLeft = useCountdown(invitationData.targetDate);
  const units = [
    ['Dias', timeLeft.days],
    ['Horas', timeLeft.hours],
    ['Minutos', timeLeft.minutes],
    ['Segundos', timeLeft.seconds],
  ];

  return (
    <Section id="cuenta" title="Faltan para mi gran noche" icon={Clock}>
      <div className="countdown-grid">
        {units.map(([label, value], index) => (
          <div className="count-card" key={label} data-animate style={{ '--delay': `${index * 90}ms` }}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function MessageSection() {
  return (
    <Section id="mensaje" title="Un mensaje especial" icon={Heart}>
      <p className="statement">
        Hay momentos que se suenan toda la vida, y hoy quiero compartir este sueno contigo. Tu presencia
        hara que esta noche sea aun mas especial.
      </p>
    </Section>
  );
}

function ParentsAndGodparents() {
  return (
    <Section id="familia" title="Con la bendicion de mis padres y padrinos" icon={Heart}>
      <div className="card-list two">
        <article className="glass-card" data-animate style={{ '--delay': '0ms' }}>
          <p>Padres</p>
          <h3>{invitationData.parents.father}</h3>
          <h3>{invitationData.parents.mother}</h3>
        </article>
        {invitationData.godparents.map((godparent, index) => (
          <article className="glass-card" key={godparent} data-animate style={{ '--delay': `${(index + 1) * 80}ms` }}>
            <p>Padrinos</p>
            <h3>{godparent}</h3>
          </article>
        ))}
      </div>
    </Section>
  );
}

function CalendarButton({ eventData }) {
  return (
    <button
      className="ghost-button"
      type="button"
      onClick={() => downloadCalendarEvent(eventData)}
      aria-label={`Agendar ${eventData.label}`}
    >
      <CalendarDays size={17} />
      Agendar {eventData.label.includes('Ceremonia') ? 'ceremonia' : 'recepcion'}
    </button>
  );
}

function EventLocations() {
  const locations = [invitationData.ceremony, invitationData.reception];

  return (
    <Section id="ubicaciones" title="Donde y cuando" icon={MapPin}>
      <div className="card-list">
        {locations.map((eventData, index) => (
          <article className="event-card" key={eventData.label} data-animate style={{ '--delay': `${index * 120}ms` }}>
            <div className="event-portrait" aria-hidden="true">
              {index === 0 ? <Crown size={44} /> : <Sparkles size={44} />}
            </div>
            <div className="event-copy">
              <p className="eyebrow">{eventData.label}</p>
              <h3>{eventData.place}</h3>
              <p><MapPin size={15} /> {eventData.address}</p>
              <p><CalendarDays size={15} /> {eventData.date}</p>
              <p><Clock size={15} /> {eventData.time}</p>
            </div>
            <div className="inline-actions">
              <a className="secondary-button" href={eventData.mapsUrl} target="_blank" rel="noreferrer">
                <MapPin size={17} />
                Ver mapa
              </a>
              <CalendarButton eventData={eventData} />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Timeline() {
  const timelineIcons = [Crown, Heart, Gift, Crown, Music, Sparkles, Diamond, Check];

  return (
    <Section id="itinerario" title="Momentos de mi gran noche" icon={Clock}>
      <div className="timeline">
        {invitationData.itinerary.map(([time, label], index) => {
          const MomentIcon = timelineIcons[index] || Sparkles;
          return (
            <div className="timeline-item" key={`${time}-${label}`} data-animate style={{ '--delay': `${index * 70}ms` }}>
              <span>{time}</span>
              <MomentIcon size={24} />
              <p>{label}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function DressCode() {
  return (
    <Section id="dress-code" title="Codigo de vestimenta" icon={Shirt}>
      <div className="dress-card">
        <div className="dress-icons">
          <Shirt />
          <Sparkles />
          <Crown />
        </div>
        <h3>{invitationData.dressCode.title}</h3>
        <p>Colores sugeridos</p>
        <div className="swatches">
          {invitationData.dressCode.colors.map((color, index) => (
            <span key={color} data-animate style={{ '--delay': `${index * 75}ms` }}>{color}</span>
          ))}
        </div>
        <small>{invitationData.dressCode.note}</small>
      </div>
    </Section>
  );
}

function HonorCourt() {
  return (
    <Section id="corte" title="Mi corte de honor" icon={UserRound}>
      <div className="honor-grid">
        <article className="glass-card" data-animate style={{ '--delay': '0ms' }}>
          <h3>Damas</h3>
          {invitationData.honorCourt.damas.map((name) => <p key={name}>{name}</p>)}
        </article>
        <article className="glass-card" data-animate style={{ '--delay': '100ms' }}>
          <h3>Chambelanes</h3>
          {invitationData.honorCourt.chambelanes.map((name) => <p key={name}>{name}</p>)}
        </article>
      </div>
    </Section>
  );
}

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [brokenImages, setBrokenImages] = useState(new Set());
  const carouselImages = useMemo(() => {
    const images = ['/assets/hero-camila.png', ...invitationData.gallery];
    return images
      .map((image) => ({ image, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ image }) => image);
  }, []);
  const loopImages = [...carouselImages, ...carouselImages];

  const markBroken = (image) => {
    setBrokenImages((current) => new Set(current).add(image));
  };

  return (
    <Section id="galeria" title="Momentos especiales" icon={Sparkles}>
      <div className="gallery-carousel" aria-label="Carrusel automatico de momentos especiales">
        <div className="gallery-track">
        {loopImages.map((image, index) => (
          <button
            className="gallery-item"
            type="button"
            key={`${image}-${index}`}
            onClick={() => !brokenImages.has(image) && setSelectedImage(image)}
            aria-label={`Abrir foto ${index + 1}`}
            data-animate
            style={{ '--delay': `${(index % carouselImages.length) * 65}ms` }}
          >
            {brokenImages.has(image) ? (
              <span><Diamond size={28} /> Momento {index + 1}</span>
            ) : (
              <img src={image} alt={`Momento especial ${index + 1}`} onError={() => markBroken(image)} />
            )}
          </button>
        ))}
        </div>
      </div>
      {invitationData.video && (
        <video className="event-video" controls src={invitationData.video} aria-label="Video especial" />
      )}
      {selectedImage && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedImage(null)}>
          <button className="modal-close" type="button" aria-label="Cerrar galeria" onClick={() => setSelectedImage(null)}>
            Cerrar
          </button>
          <img src={selectedImage} alt="Foto ampliada" />
        </div>
      )}
    </Section>
  );
}

function Gifts() {
  const [copied, setCopied] = useState(false);

  const copyClabe = async () => {
    await navigator.clipboard.writeText(invitationData.gifts.bank.clabe);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Section id="regalos" title="Mesa de regalos" icon={Gift}>
      <p className="soft-text gift-intro">Tu presencia es mi mejor regalo</p>
      <div className="gift-buttons">
        {invitationData.gifts.links.map((link, index) => (
          <a
            className="secondary-button"
            href={link.url}
            key={link.label}
            target="_blank"
            rel="noreferrer"
            data-animate
            style={{ '--delay': `${index * 80}ms` }}
          >
            <Gift size={17} />
            {link.label}
          </a>
        ))}
      </div>
      <div className="bank-card">
        <span>{invitationData.gifts.bank.bankName}</span>
        <strong>{invitationData.gifts.bank.holder}</strong>
        <p>{invitationData.gifts.bank.clabe}</p>
        <button className="ghost-button" type="button" onClick={copyClabe} aria-label="Copiar CLABE">
          <Copy size={17} />
          {copied ? 'CLABE copiada' : 'Copiar CLABE'}
        </button>
      </div>
    </Section>
  );
}

function Playlist() {
  return (
    <Section id="playlist" title="Playlist de la noche" icon={Music}>
      <p className="soft-text">Ayudame a elegir las canciones para bailar toda la noche.</p>
      <a className="primary-button full" href={invitationData.socialLinks.spotify} target="_blank" rel="noreferrer">
        <Music size={18} />
        Agregar cancion
      </a>
    </Section>
  );
}

function HashtagSection() {
  const [copied, setCopied] = useState(false);

  const copyHashtag = async () => {
    await navigator.clipboard.writeText(invitationData.hashtag);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Section id="hashtag" title="Comparte la noche" icon={Camera}>
      <div className="hashtag-card">
        <h3>{invitationData.hashtag}</h3>
        <div className="inline-actions">
          <button className="ghost-button" type="button" onClick={copyHashtag} aria-label="Copiar hashtag">
            <Copy size={17} />
            {copied ? 'Copiado' : 'Copiar hashtag'}
          </button>
          <a className="secondary-button" href={invitationData.socialLinks.instagram} target="_blank" rel="noreferrer">
            <Camera size={17} />
            Ver en Instagram
          </a>
        </div>
      </div>
    </Section>
  );
}

function RSVPForm() {
  const saved = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('xv-rsvp') || 'null');
    } catch {
      return null;
    }
  }, []);

  const [form, setForm] = useState(
    saved || {
      name: guestName,
      people: guestPeople,
      table: guestTable,
      message: '',
      attendance: 'asistire',
    },
  );
  const [confirmed, setConfirmed] = useState(Boolean(saved));

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    localStorage.setItem('xv-rsvp', JSON.stringify(form));
    setConfirmed(true);

    const message =
      form.attendance === 'asistire'
        ? `Hola, confirmo mi asistencia a los XV anos de Camila Fernandez. Nombre: ${form.name}. Personas: ${form.people}. Mesa: ${form.table}. Folio: ${guestId}.`
        : `Hola, lamento no poder asistir a los XV anos de Camila Fernandez. Nombre: ${form.name}. Folio: ${guestId}. Mensaje: ${form.message}.`;
    window.open(`${invitationData.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Section id="rsvp" title="Confirma tu asistencia" icon={Check}>
      {confirmed && (
        <div className="success-banner">
          <Check size={18} />
          Confirmacion guardada
        </div>
      )}
      <form className="rsvp-form" onSubmit={submitForm}>
        <h3>RSVP</h3>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          Numero de personas
          <input name="people" type="number" min="0" value={form.people} onChange={updateField} required />
        </label>
        <label>
          Mesa
          <input name="table" value={form.table} onChange={updateField} />
        </label>
        <label>
          Mensaje opcional
          <textarea name="message" value={form.message} onChange={updateField} rows="3" />
        </label>
        <div className="segmented" aria-label="Seleccionar asistencia">
          <label>
            <input
              type="radio"
              name="attendance"
              value="asistire"
              checked={form.attendance === 'asistire'}
              onChange={updateField}
            />
            <span>Asistire</span>
          </label>
          <label>
            <input
              type="radio"
              name="attendance"
              value="no-asistire"
              checked={form.attendance === 'no-asistire'}
              onChange={updateField}
            />
            <span>No podre asistir</span>
          </label>
        </div>
        <button className="primary-button full" type="submit" aria-label="Enviar confirmacion RSVP">
          <MessageCircle size={18} />
          {confirmed ? 'Modificar confirmacion' : 'Enviar por WhatsApp'}
        </button>
      </form>
    </Section>
  );
}

function HotelSection() {
  return (
    <Section id="hospedaje" title="Hospedaje recomendado" icon={Hotel}>
      <div className="card-list">
        {invitationData.hotels.map((hotel, index) => (
          <article className="glass-card" key={hotel.name} data-animate style={{ '--delay': `${index * 110}ms` }}>
            <h3>{hotel.name}</h3>
            <p>{hotel.description}</p>
            <div className="inline-actions">
              <a className="secondary-button" href={hotel.website} target="_blank" rel="noreferrer">
                <Hotel size={17} />
                Ver hotel
              </a>
              <a className="ghost-button" href={hotel.mapsUrl} target="_blank" rel="noreferrer">
                <MapPin size={17} />
                Ver ubicacion
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function QRSection() {
  const [copied, setCopied] = useState(false);
  const invitationUrl = import.meta.env.VITE_INVITATION_URL || window.location.href;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Section id="qr" title="Escanea y guarda esta invitacion" icon={Diamond}>
      <div className="qr-section-card">
        <QRCodeCanvas value={invitationUrl} size={170} bgColor="#FFF7F3" fgColor="#0B0B0F" includeMargin />
        <div className="inline-actions">
          <button className="ghost-button" type="button" onClick={copyUrl} aria-label="Copiar enlace">
            <Copy size={17} />
            {copied ? 'Enlace copiado' : 'Copiar enlace'}
          </button>
          <ShareButton className="secondary-button" />
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="footer reveal">
      <p>Gracias por acompanarme en este dia tan especial. Tu presencia hara que mi sueno brille aun mas.</p>
      <h2>Camila Fernandez</h2>
      <small>Invitacion digital desarrollada por RCM CodeDev</small>
    </footer>
  );
}

function FloatingActions() {
  return (
    <nav className="floating-actions" aria-label="Acciones globales">
      <a href="#inicio" aria-label="Volver al inicio">
        <ChevronUp size={19} />
      </a>
      <a href="#rsvp" aria-label="Confirmar asistencia">
        <MessageCircle size={19} />
      </a>
      <ShareButton compact className="floating-icon-button" />
    </nav>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useReveal(opened);

  const openInvitation = async () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      await audioRef.current?.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }

    window.setTimeout(() => {
      setOpened(true);
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    }, 1050);
  };

  return (
    <>
      <audio ref={audioRef} src={invitationData.music} loop preload="none" />
      {!opened ? (
        <IntroScreen onOpen={openInvitation} isOpening={isOpening} />
      ) : (
        <main className={`app-shell ${STORY_MODE ? 'story-mode' : ''}`}>
          <Hero />
          <GuestPass />
          <Countdown />
          <MessageSection />
          <ParentsAndGodparents />
          <EventLocations />
          <Timeline />
          <DressCode />
          <HonorCourt />
          <Gallery />
          <Gifts />
          <Playlist />
          <HashtagSection />
          <RSVPForm />
          <HotelSection />
          <QRSection />
          <Footer />
          <FloatingActions />
        </main>
      )}
      <MusicPlayer audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} opened={opened} />
    </>
  );
}
