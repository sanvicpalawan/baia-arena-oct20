import { SOCIAL_PLATFORMS, OTA_PLATFORMS, guessOtaPlatform, otaInfo } from "./platforms";
import type { SocialPlatform, OtaPlatform } from "./platforms";
import { findFont, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from "./fonts";
import { isHexColor } from "./logoSvg";
import type { LogoLayout } from "./logoSvg";
import type { MapView } from "./maps";

export const CONFIG_VERSION = 4;

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  active: boolean;
}

export interface OtaLink {
  id: string;
  platform: OtaPlatform;
  name: string;
  url: string;
  active: boolean;
  rating: string;
  ratingLabel: string;
  reviewCount: string;
}

export interface DirectPerk {
  icon: string;
  text: string;
}

export interface SiteConfig {
  configVersion: number;
  brand: {
    logoMode: "vector" | "custom";
    customLogoUrl: string;
    customLogoLightUrl: string;
    autoWhiteOnDark: boolean;
    logoInk: string;
    logoGold: string;
    headerLogoVariant: LogoLayout;
    headerLogoHeight: number;
    headerLogoHeightMobile: number;
    headerStyle: "transparent" | "solid";
    footerLogoWidth: number;
    showHeroEmblem: boolean;
  };
  theme: {
    fontSerif: string;
    fontSans: string;
    colorBackground: string;
    colorNavy: string;
    colorAccent: string;
    colorOcean: string;
    colorMuted: string;
    colorDriftwood: string;
    colorShell: string;
  };
  header: {
    logoTitle: string;
    logoSubtitle: string;
    ctaText: string;
    cottageBadgeText: string;
    showCottageBadge: boolean;
    navLinks: Array<{ name: string; href: string }>;
  };
  hero: {
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ratingScore: string;
    locationScore: string;
    backgroundMedia: Array<{ type: "image" | "video"; url: string; caption: string }>;
    ctaBookingText: string;
    showDirectBookingPerks: boolean;
    directBookingPerksText: string;
  };
  otaLinks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    directBenefitText: string;
    savingsPercent: number;
    directCtaText: string;
    secondaryCtaText: string;
    panelTitle: string;
    panelSubtitle: string;
    footnote: string;
    perks: DirectPerk[];
    links: OtaLink[];
  };
  about: {
    badge: string;
    headline: string;
    subheadline: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    imageTall: string;
    imageSecondary: string;
    highlights: Array<{ title: string; desc: string; icon: string }>;
  };
  accommodations: {
    badge: string;
    title: string;
    subtitle: string;
    rooms: Array<{
      id: string;
      name: string;
      subtitle: string;
      tag: string;
      pricePerNight: number;
      currency: string;
      sqm: number;
      occupancy: string;
      bed: string;
      view: string;
      rating: number;
      images: string[];
      description: string;
      amenities: string[];
      highlights: string[];
      active: boolean;
    }>;
  };
  dining: {
    badge: string;
    title: string;
    subtitle: string;
    menus: Array<{
      id: string;
      name: string;
      tagline: string;
      hours: string;
      description: string;
      image: string;
      dishes: Array<{ name: string; description: string; price: string; tag?: string }>;
    }>;
  };
  experiences: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      tabTitle: string;
      tagline: string;
      headline: string;
      description: string;
      image: string;
      badge: string;
      features: string[];
    }>;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    questions: Array<{ id: string; question: string; answer: string; category: string }>;
  };
  reviews: {
    badge: string;
    title: string;
    ratingScore: string;
    ratingText: string;
    items: Array<{
      id: number;
      name: string;
      location: string;
      rating: number;
      title: string;
      date: string;
      stayType: string;
      quote: string;
      avatar: string;
    }>;
  };
  location: {
    badge: string;
    title: string;
    subtitle: string;
    mapLat: number;
    mapLng: number;
    mapZoom: number;
    mapType: MapView;
    googleMapsUrl: string;
    airportNote: string;
    highlights: Array<{ name: string; distance: string; type: string; desc: string }>;
  };
  footer: {
    brandDescription: string;
    address: string;
    phone: string;
    email: string;
    accreditationText: string;
    socials: SocialLink[];
    showNewsletter: boolean;
    newsletterTitle: string;
    newsletterText: string;
    copyrightText: string;
    showAdminLink: boolean;
  };
  legal: {
    privacyTitle: string;
    privacyBody: string;
    termsTitle: string;
    termsBody: string;
  };
}

export type RoomConfig = SiteConfig["accommodations"]["rooms"][number];

const PEXELS = (id: number, w = 1200, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  configVersion: CONFIG_VERSION,
  brand: {
    logoMode: "vector",
    customLogoUrl: "",
    customLogoLightUrl: "",
    autoWhiteOnDark: true,
    logoInk: "#3E5374",
    logoGold: "#B3A176",
    headerLogoVariant: "stacked",
    headerLogoHeight: 72,
    headerLogoHeightMobile: 54,
    headerStyle: "transparent",
    footerLogoWidth: 190,
    showHeroEmblem: false,
  },
  theme: {
    fontSerif: "Cormorant Garamond",
    fontSans: "Plus Jakarta Sans",
    colorBackground: "#FBF9F5",
    colorNavy: "#12232E",
    colorAccent: "#C87D55",
    colorOcean: "#4F6D7A",
    colorMuted: "#7A9A8B",
    colorDriftwood: "#EAE3D9",
    colorShell: "#F5F2EB",
  },
  header: {
    logoTitle: "BAIA",
    logoSubtitle: "San Vicente, Palawan",
    ctaText: "Book your stay",
    cottageBadgeText: "3 Cottages Available",
    showCottageBadge: true,
    navLinks: [
      { name: "The Lodge", href: "#about" },
      { name: "Cottages", href: "#accommodations" },
      { name: "Dining", href: "#dining" },
      { name: "Experiences", href: "#experiences" },
      { name: "FAQ", href: "#faq" },
      { name: "Guest Stories", href: "#reviews" },
      { name: "Location", href: "#location" },
    ],
  },
  hero: {
    tagline: "A Mini Sanctuary for Inner Work & Reflection",
    titleLine1: "Private Beachfront",
    titleLine2: "Luxury in Paradise",
    subtitle:
      "Welcome to BAIA. Where untouched Palawan tides meet barefoot tranquility, tailored chef dining, and absolute stillness right on the sand of Sitio Panindigan.",
    ratingScore: "9.4",
    locationScore: "9.2",
    backgroundMedia: [
      { type: "image", url: PEXELS(36758179, 2200, 1400), caption: "Sitio Panindigan's Protected Turquoise Shoreline" },
      { type: "image", url: PEXELS(33549434, 2200, 1400), caption: "Traditional Outrigger Pickups Right at the Sand" },
      { type: "image", url: PEXELS(33549425, 2200, 1400), caption: "Gentle Tropical Swells & Lush Coconut Groves" },
    ],
    ctaBookingText: "Check availability",
    showDirectBookingPerks: true,
    directBookingPerksText: "Book direct: free airport chauffeur, sunset cocktails & best rate guaranteed",
  },
  otaLinks: {
    eyebrow: "Official Website · Best Rate Guarantee",
    title: "Book direct, and the sanctuary gives back.",
    subtitle:
      "Our three cottages also appear on global booking sites — but reserving here means our lowest price, zero booking fees and a few quiet privileges kept for direct guests.",
    directBenefitText: "Save up to 18% in third-party commissions by booking directly on this official site.",
    savingsPercent: 18,
    directCtaText: "Reserve direct",
    secondaryCtaText: "Ask BAIA",
    panelTitle: "Also on trusted platforms",
    panelSubtitle: "Read our reviews anywhere — then book here for the best rate.",
    footnote:
      "Third-party platforms add service fees and commissions of up to 18%. Booking on this website always guarantees our lowest rate and direct contact with the lodge.",
    perks: [
      { icon: "BadgePercent", text: "Lowest rate, zero booking fees" },
      { icon: "Plane", text: "Free private SWL airport chauffeur" },
      { icon: "Wine", text: "Welcome sunset cocktails" },
      { icon: "Coffee", text: "Chef's breakfast every morning" },
      { icon: "CalendarCheck", text: "Flexible 14-day cancellation" },
      { icon: "MessageCircle", text: "Direct WhatsApp with your host" },
    ],
    links: [
      { id: "ota-booking", platform: "booking", name: "Booking.com", url: "https://www.booking.com/hotel/ph/baia-beachfront-boutique-lodge-in-san-vicente-palawan.html", active: true, rating: "9.4", ratingLabel: "Wonderful", reviewCount: "" },
      { id: "ota-airbnb", platform: "airbnb", name: "Airbnb", url: "https://www.airbnb.com/rooms/1504775335074258078", active: true, rating: "", ratingLabel: "", reviewCount: "" },
      { id: "ota-agoda", platform: "agoda", name: "Agoda", url: "https://www.agoda.com/baia-beachfront-boutique-lodge-in-san-vicente-palawan/hotel/palawan-ph.html", active: true, rating: "9.4", ratingLabel: "Exceptional", reviewCount: "" },
    ],
  },
  about: {
    badge: "The BAIA Philosophy",
    headline: "An intimate sanctuary by the calm waters",
    subheadline: "Barefoot coastal luxury",
    paragraph1:
      "Situated right in the heart of the serene fishing village of Sitio Panindigan, BAIA is an exclusive 3-cottage beachfront haven — designed for quiet luxury, calm waters and deep relaxation away from the crowds.",
    paragraph2:
      "Mornings begin with gentle ripples against warm sand and a pour-over overlooking the bay. Step aboard a traditional wooden boat right at the shoreline, or slow down over a candlelit dinner made from local Palawan produce. BAIA invites you to reconnect with what matters.",
    quote: "A little slice of untouched Palawan where you can genuinely hear your own thoughts again.",
    imageTall: PEXELS(11569908, 800, 1200),
    imageSecondary: PEXELS(36945989, 400, 400),
    highlights: [
      { title: "Direct beachfront access", desc: "Four steps from your door to the bay", icon: "Waves" },
      { title: "Private beach area", desc: "A secluded sandbar, never crowded", icon: "Anchor" },
      { title: "Three guest cottages", desc: "Privacy and personal care", icon: "BedDouble" },
      { title: "Handcrafted dining", desc: "Daily catch, Italian & Asian classics", icon: "Utensils" },
    ],
  },
  accommodations: {
    badge: "Sanctuary Cottages",
    title: "Crafted for quiet stillness",
    subtitle: "Only three private cottages exist on our shoreline, ensuring unbroken tranquility and thoughtful hospitality tailored to you.",
    rooms: [
      {
        id: "deluxe-suite-sea-view",
        name: "Deluxe Suite with Sea View",
        subtitle: "Front-row ocean vistas with a private balcony",
        tag: "Most coveted",
        pricePerNight: 280,
        currency: "USD",
        sqm: 48,
        occupancy: "2–3 guests",
        bed: "King bed + sofa daybed",
        view: "Direct turquoise ocean",
        rating: 9.8,
        active: true,
        images: [PEXELS(14025911), PEXELS(14025909), PEXELS(39836709)],
        description:
          "Perched at the water's edge, this signature suite invites the rhythm of calm San Vicente tides into your sanctuary. Solid hardwood architecture, Italian linen, an oceanfront daybed balcony and an artisan espresso bar make it our premier retreat.",
        amenities: [
          "Oceanfront balcony & private daybed",
          "King bed with organic linen",
          "Italian espresso machine",
          "Whisper-quiet inverter air-conditioning",
          "Open-air rain shower",
          "Starlink Wi-Fi",
          "Daily chef's breakfast",
          "Evening turndown & aromatherapy",
        ],
        highlights: ["King bed + sofa bed", "Oceanfront balcony", "Private terrace", "Espresso bar"],
      },
      {
        id: "double-room-patio",
        name: "Double Room with Patio",
        subtitle: "A garden terrace that steps down to the sand",
        tag: "Garden & sea",
        pricePerNight: 210,
        currency: "USD",
        sqm: 38,
        occupancy: "2 guests",
        bed: "Queen bed",
        view: "Tropical garden & bay",
        rating: 9.5,
        active: true,
        images: [PEXELS(39836703), PEXELS(14025910), PEXELS(17301475)],
        description:
          "Gentle greenery softly yields to Penanindigan's calm shoreline. A stone-tiled veranda, handmade rattan, freshly ground Palawan coffee and a secluded daybed for morning meditation.",
        amenities: [
          "Teak garden veranda & hammock",
          "Queen bed with eco-luxe linen",
          "Palawan pour-over & tea station",
          "Natural stone ensuite with rain shower",
          "Air-conditioning",
          "Twenty steps to the water",
          "Daily breakfast on the patio",
          "Organic botanical toiletries",
        ],
        highlights: ["Queen bed", "Garden & sea patio", "Beach walkout", "Artisan coffee"],
      },
      {
        id: "beachfront-sanctuary-cottage",
        name: "Beachfront Sanctuary Cottage",
        subtitle: "A standalone cottage on the sand with a private cabana",
        tag: "Exclusive haven",
        pricePerNight: 350,
        currency: "USD",
        sqm: 62,
        occupancy: "2–4 guests",
        bed: "King bed + daybed alcove",
        view: "180° bay & sunset",
        rating: 9.9,
        active: true,
        images: [PEXELS(13716055), PEXELS(38422794), PEXELS(1320670)],
        description:
          "The jewel of BAIA. Step from your hardwood veranda straight onto powdery sand — made for couples and solitary seekers who want pure calm, private boat pickups and dinners under the stars.",
        amenities: [
          "Standalone cottage, no shared walls",
          "Private beach cabana & loungers",
          "Private dining by your host",
          "Outdoor teak deck & soaking tub",
          "Sunset cocktails daily",
          "Private island-hopping boat pickup",
          "Round-trip airport chauffeur",
          "Bluetooth hi-fi sound system",
        ],
        highlights: ["Standalone cottage", "Private cabana", "Outdoor soaking tub", "Private boat"],
      },
    ],
  },
  dining: {
    badge: "Dining",
    title: "Handcrafted dining at the edge of the bay",
    subtitle: "Mediterranean simplicity meets Palawan's freshest daily catch, served barefoot under the stars.",
    menus: [
      {
        id: "breakfast-morning",
        name: "Artisan Breakfast",
        tagline: "Served on your veranda or at the beach cabana",
        hours: "07:00 – 11:00",
        description:
          "House-baked sourdough, tropical fruit from San Vicente orchards, organic eggs your way and Palawan pour-over coffee.",
        image: PEXELS(2684260, 900, 600),
        dishes: [
          { name: "Continental BAIA Harvest", description: "Warm brioche, cultured butter, mango honeycomb, tropical fruit bowl", price: "Included", tag: "Signature" },
          { name: "Filipino Silog", description: "Garlic rice, sunny-side eggs, Palawan beef tapa or local bangus", price: "Included", tag: "Local favourite" },
          { name: "Mediterranean Shakshuka", description: "San Marzano tomatoes, cumin, poached eggs, feta, crusty bread", price: "Included" },
          { name: "Avocado & Smoked Fish Toast", description: "Sourdough, smashed avocado, smoked mackerel, micro-greens", price: "Included" },
        ],
      },
      {
        id: "evening-dinner",
        name: "Seaside Dinner",
        tagline: "Candlelight on the sand, catch of the day",
        hours: "18:00 – 22:00",
        description: "Line-caught yellowfin, sweet rock lobster and handmade pasta prepared daily by our kitchen team.",
        image: PEXELS(18708072, 900, 600),
        dishes: [
          { name: "Grilled Rock Lobster", description: "Garlic-herb butter, calamansi reduction, saffron potatoes", price: "$34", tag: "Today's catch" },
          { name: "Tagliolini alle Vongole", description: "Ribbon pasta, baby clams, olive oil, chilli, white wine", price: "$24", tag: "Homemade" },
          { name: "Yellowfin Tuna Crudo", description: "Citrus ponzu, pickled sea fennel, crispy capers", price: "$19" },
          { name: "Coconut Pork Adobo", description: "Native vinegar, coconut milk, garlic, jasmine rice", price: "$22", tag: "Heritage" },
        ],
      },
      {
        id: "cocktails-wine",
        name: "Sunset Bar",
        tagline: "All day at the open-air pavilion",
        hours: "12:00 – 23:00",
        description: "Cold-pressed island juices, natural wines from Italy and France, and cocktails with local rum and passionfruit.",
        image: PEXELS(38896850, 900, 600),
        dishes: [
          { name: "Panindigan Passion Sunset", description: "Palawan rum, passionfruit, lime, kaffir lime syrup", price: "$12", tag: "Signature" },
          { name: "Smoky Mezcalita", description: "Mezcal, fresh pineapple, jalapeño saline, black salt rim", price: "$14" },
          { name: "Organic Prosecco", description: "Treviso, Italy — green apple and white blossom", price: "$16" },
          { name: "Fresh Buko Coconut", description: "Young coconut from our grove, served in the shell", price: "$5" },
        ],
      },
    ],
  },
  experiences: {
    badge: "Curated Moments",
    title: "The BAIA experience",
    subtitle: "Private island hops from our sand, chef-crafted dinners and healing beach massages — every moment curated for tranquility.",
    items: [
      {
        id: "beachfront-water",
        tabTitle: "Beach & Water",
        tagline: "Turquoise stillness & doorstep departures",
        headline: "Calm turquoise water at your door, and boats that collect you from the sand.",
        description:
          "Penanindigan Bay is sheltered by outer reefs, keeping the water glassy and calm. Traditional outriggers pull up on our sandbar for effortless trips to secret lagoons, sandbars and sea-turtle sanctuaries.",
        image: PEXELS(33549434),
        badge: "Exclusive shoreline",
        features: [
          "Boat boarding right in front of your cottage",
          "Calm, shallow, swim-friendly water",
          "Complimentary kayaks, paddleboards & snorkels",
          "Private island-hopping charters with our crew",
        ],
      },
      {
        id: "dining-culinary",
        tabTitle: "Dining",
        tagline: "Mediterranean soul, Palawan catch",
        headline: "Chef-crafted Mediterranean, Italian and Filipino cooking.",
        description:
          "We buy the day's catch from Panindigan fishermen and produce from nearby farms. Dine barefoot by candlelight on the shore or enjoy a slow multi-course dinner on your veranda.",
        image: PEXELS(8753680),
        badge: "Artisan kitchen",
        features: [
          "Continental, Filipino and Asian breakfasts",
          "Handmade pasta, grilled fish & Palawan crab",
          "Natural wines & signature cocktails",
          "Private candlelit beach dinners",
        ],
      },
      {
        id: "wellness-peace",
        tabTitle: "Wellness",
        tagline: "A sanctuary for reflection",
        headline: "Beachfront massage, quiet reflection and films under the stars.",
        description:
          "BAIA was designed for inner work and deep rest. Morning breathwork to the sound of the waves, traditional hilot massage, and open-air cinema nights beneath the Milky Way.",
        image: PEXELS(31234756),
        badge: "Inner sanctuary",
        features: [
          "Hilot massage in open-air beach cabanas",
          "Yoga mats, cushions & journal prompts",
          "Outdoor cinema nights",
          "Unplugged hours for writing and reflection",
        ],
      },
      {
        id: "conveniences",
        tabTitle: "Arrival & Care",
        tagline: "Seamless, discreet hospitality",
        headline: "Free airport chauffeur, fast Wi-Fi and a personal host.",
        description:
          "Remote, but never inconvenient. We're ten minutes from San Vicente Airport (SWL): our driver meets your flight, and Starlink keeps you connected whenever you need it.",
        image: PEXELS(33549424),
        badge: "Effortless arrival",
        features: [
          "Complimentary SWL airport chauffeur",
          "Starlink Wi-Fi with power backup",
          "Free private parking & 24/7 security",
          "Concierge for tours, ferries and flights",
        ],
      },
    ],
  },
  faq: {
    badge: "Good to Know",
    title: "Questions, answered",
    subtitle: "Everything you need to plan a calm, effortless stay in Sitio Panindigan.",
    questions: [
      {
        id: "faq-1",
        category: "Getting here",
        question: "How do we get to BAIA from Manila or Clark?",
        answer:
          "Fly direct into San Vicente Airport (SWL). BAIA is just 5 km away — about 10 minutes — and our private chauffeur meets you at arrivals free of charge.",
      },
      {
        id: "faq-2",
        category: "Booking",
        question: "Why book on this website instead of Booking.com or Airbnb?",
        answer:
          "Direct bookings get our guaranteed lowest rate with no commission mark-ups, plus a free airport chauffeur, daily chef's breakfast, welcome cocktails and direct WhatsApp contact with your host.",
      },
      {
        id: "faq-3",
        category: "The water",
        question: "Is the water calm and safe for swimming?",
        answer:
          "Yes. Outer reefs shelter the bay, so the water is gentle and lagoon-like with virtually no strong currents — lovely for swimming, floating and paddleboarding all year.",
      },
      {
        id: "faq-4",
        category: "Tours",
        question: "How does island hopping work?",
        answer:
          "Our private outrigger boats collect you right on the sand in front of BAIA — no van rides to crowded ports. Just step aboard with our captain.",
      },
      {
        id: "faq-5",
        category: "Wi-Fi",
        question: "Is the Wi-Fi good enough for remote work?",
        answer: "We have Starlink satellite internet (typically 150–250 Mbps) with battery backup across the cottages and cabanas.",
      },
      {
        id: "faq-6",
        category: "Dining",
        question: "Can you cater for vegan, gluten-free or pescatarian diets?",
        answer: "Absolutely. With only three cottages, our chef cooks for each guest personally — just tell us your preferences in advance or on arrival.",
      },
    ],
  },
  reviews: {
    badge: "Guest Stories",
    title: "Voices of BAIA",
    ratingScore: "9.4 / 10",
    ratingText: "Rated “Wonderful” by international guests",
    items: [
      {
        id: 1,
        name: "Marie",
        location: "United States",
        rating: 10,
        title: "BAIA is a vibe! Calm and chill.",
        date: "February 2025",
        stayType: "Couple • Deluxe Suite",
        quote:
          "Boat access right in front of the property made island hopping effortless. The hosts treat you like family, and waking up to that calm water every morning is something I'll never forget.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      },
      {
        id: 2,
        name: "Happy",
        location: "Philippines",
        rating: 9.8,
        title: "One of San Vicente's best.",
        date: "January 2025",
        stayType: "Solo traveller • Double Room",
        quote:
          "Peace and quiet in a charming fishing village. The food is extraordinary — fresh seafood, handmade pasta and tropical fruit. Sitio Panindigan has a purity that's getting rare.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      },
      {
        id: 3,
        name: "Alicia",
        location: "Canada",
        rating: 10,
        title: "A mini sanctuary for inner work.",
        date: "December 2024",
        stayType: "Solo retreat • Sanctuary Cottage",
        quote:
          "Beautiful aesthetics, warm wood, breeze and absolute stillness. I wrote half my book here listening to the gentle ocean.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
      },
      {
        id: 4,
        name: "Jekaterina",
        location: "Estonia",
        rating: 9.6,
        title: "A little paradise by the ocean.",
        date: "November 2024",
        stayType: "Couple • Deluxe Suite",
        quote: "Our host made us feel at home instantly. Sunsets from the deck and breakfast on the sand — we extended our stay twice!",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
      },
      {
        id: 5,
        name: "Julian & Sophie",
        location: "Switzerland",
        rating: 10,
        title: "Unmatched barefoot luxury.",
        date: "October 2024",
        stayType: "Honeymoon • Sanctuary Cottage",
        quote:
          "Only three cottages on the whole beach gives BAIA an intimacy big resorts can't match. Being collected by boat right in front of the lodge to swim with turtles was the highlight of our trip.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
      },
    ],
  },
  location: {
    badge: "Location",
    title: "Sitio Panindigan, San Vicente",
    subtitle: "On the quiet shore of Sitio Panindigan in Barangay Poblacion — minutes from San Vicente town and San Vicente Airport (SWL).",
    mapLat: 10.538582,
    mapLng: 119.237916,
    mapZoom: 15,
    mapType: "satellite",
    googleMapsUrl: "",
    airportNote: "Our driver meets your flight at San Vicente Airport (SWL), 5 km from the lodge — about 10 minutes by car and complimentary for direct bookings.",
    highlights: [
      { name: "Penanindigan Beach", distance: "4 m", type: "Your doorstep", desc: "Calm, clear swimming water right in front of the lodge." },
      { name: "New Capari Beach", distance: "600 m", type: "Short stroll", desc: "A quiet crescent bay framed by coconut palms." },
      { name: "Marina Terrace Restaurant", distance: "3 km", type: "5 min drive", desc: "Seaside dining overlooking the San Vicente marina." },
      { name: "San Vicente Airport (SWL)", distance: "5 km", type: "10 min drive", desc: "Direct flights from Manila and Clark." },
      { name: "Long Beach", distance: "11 km", type: "20 min drive", desc: "The Philippines' longest white-sand beach — 14.7 km of shoreline." },
    ],
  },
  footer: {
    brandDescription:
      "An intimate sanctuary of three cottages on the calm turquoise shores of Sitio Panindigan, San Vicente, Palawan.",
    address: "Sitio Panindigan, Barangay Poblacion, San Vicente, Palawan 5309, Philippines",
    phone: "+63 (048) 723-2242",
    email: "baiapalawan@gmail.com",
    accreditationText: "DOT-accredited boutique lodge",
    socials: [
      { id: "social-instagram", platform: "instagram", url: "https://www.instagram.com/baia_palawan/", active: true },
      { id: "social-facebook", platform: "facebook", url: "https://www.facebook.com/p/BAIA-Palawan-61577281393482/", active: true },
      { id: "social-tiktok", platform: "tiktok", url: "", active: true },
      { id: "social-youtube", platform: "youtube", url: "", active: false },
      { id: "social-whatsapp", platform: "whatsapp", url: "https://wa.me/639171234567", active: false },
    ],
    showNewsletter: true,
    newsletterTitle: "Newsletter",
    newsletterText: "Seasonal news, special offers and early access to new dates.",
    copyrightText: "BAIA Palawan. All rights reserved.",
    showAdminLink: true,
  },
  legal: {
    privacyTitle: "Privacy Policy",
    privacyBody: `BAIA Palawan ("BAIA", "we", "us") respects your privacy. This policy explains how we collect and use personal information when you visit our website, contact us or make a reservation.

## Information we collect
When you book or send an enquiry we collect your name, email address, phone or WhatsApp number, stay dates, number of guests and any requests you choose to share (for example dietary needs or flight details).

## How we use it
We use your information only to manage your reservation, arrange airport transfers, answer your questions and, if you subscribe, send occasional news. We never sell your personal information.

## Storage & security
Your information is stored securely and kept only as long as needed for your stay, our legal and accounting obligations, or until you ask us to delete it.

## Your rights
In line with the Philippine Data Privacy Act of 2012 (RA 10173) you may request access to, correction of, or deletion of your personal data at any time.

## Contact
For privacy questions please email baiapalawan@gmail.com.`,
    termsTitle: "Terms & Conditions",
    termsBody: `These terms apply to all reservations made directly with BAIA Palawan through this website, by email, phone or WhatsApp.

## Reservations
A reservation is confirmed once we have sent written confirmation. Rates are quoted per cottage per night in US dollars and include breakfast unless stated otherwise.

## Cancellations
Cancellations made 14 days or more before arrival are free of charge. Cancellations within 14 days, or no-shows, may be charged the first night of the stay.

## Check-in & check-out
Check-in is from 2:00 pm and check-out is until 11:00 am. Early arrival or late departure can be arranged on request, subject to availability.

## During your stay
Guests are asked to respect the quiet of the lodge and the local fishing community. Activities such as island hopping depend on weather and sea conditions, and safety decisions of our crew are final.

## Liability
BAIA is not responsible for loss of personal belongings or for delays caused by weather, flights or other circumstances outside our control.

## Contact
Questions about these terms? Email baiapalawan@gmail.com.`,
  },
};

/* ------------------------------------------------------------------ */
/* Normalisation: deep-merge saved data with defaults + migrations     */
/* ------------------------------------------------------------------ */
type AnyRecord = Record<string, unknown>;
const isPlainObject = (v: unknown): v is AnyRecord => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const clampNum = (v: unknown, min: number, max: number, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};

function mergeWithDefaults<T>(defaults: T, raw: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(raw) ? raw : defaults) as T;
  if (isPlainObject(defaults)) {
    const src = isPlainObject(raw) ? raw : {};
    const out: AnyRecord = {};
    for (const key of Object.keys(defaults)) out[key] = mergeWithDefaults(defaults[key], src[key]);
    return out as T;
  }
  if (raw === undefined || raw === null) return defaults;
  return (typeof raw === typeof defaults ? raw : defaults) as T;
}

const SOCIAL_IDS = SOCIAL_PLATFORMS.map((p) => p.id) as string[];
const OTA_IDS = OTA_PLATFORMS.map((p) => p.id) as string[];
const LOGO_VARIANTS: LogoLayout[] = ["stacked", "wordmark", "horizontal", "mark"];

export function normalizeConfig(raw: unknown): SiteConfig {
  const base = structuredClone(DEFAULT_SITE_CONFIG);
  if (!isPlainObject(raw)) return base;
  const version = typeof raw.configVersion === "number" ? raw.configVersion : 1;
  const cfg = mergeWithDefaults(base, raw);

  // Legacy footer.socialLinks {instagram, facebook, ...} → socials[]
  const rawFooter = isPlainObject(raw.footer) ? raw.footer : {};
  if (!Array.isArray(rawFooter.socials) && isPlainObject(rawFooter.socialLinks)) {
    const legacy = rawFooter.socialLinks;
    cfg.footer.socials = (["instagram", "facebook", "tiktok", "whatsapp"] as const)
      .filter((p) => str(legacy[p]))
      .map((p) => ({ id: `social-${p}`, platform: p, url: str(legacy[p]), active: p !== "whatsapp" }));
  }
  cfg.footer.socials = (cfg.footer.socials as unknown[]).filter(isPlainObject).map((s, i) => {
    const platform = (SOCIAL_IDS.includes(str(s.platform)) ? str(s.platform) : "website") as SocialPlatform;
    return { id: str(s.id) || `social-${i}-${platform}`, platform, url: str(s.url), active: s.active !== false };
  });

  cfg.otaLinks.links = (cfg.otaLinks.links as unknown[]).filter(isPlainObject).map((l, i) => {
    const platform = (OTA_IDS.includes(str(l.platform)) ? str(l.platform) : guessOtaPlatform(str(l.name))) as OtaPlatform;
    const info = otaInfo(platform);
    return {
      id: str(l.id) || `ota-${i}-${platform}`,
      platform,
      name: str(l.name) || info.label,
      url: str(l.url),
      active: l.active !== false,
      rating: str(l.rating),
      ratingLabel: str(l.ratingLabel, info.defaultRatingLabel),
      reviewCount: str(l.reviewCount),
    };
  });
  cfg.otaLinks.perks = (cfg.otaLinks.perks as unknown[]).filter(isPlainObject).map((p) => ({ icon: str(p.icon, "Sparkles"), text: str(p.text) }));

  cfg.accommodations.rooms = cfg.accommodations.rooms.filter(isPlainObject).map((r, i) => ({
    ...DEFAULT_SITE_CONFIG.accommodations.rooms[0],
    ...r,
    id: str(r.id) || `room-${i}`,
    images: Array.isArray(r.images) ? r.images.filter((x) => typeof x === "string") : [],
    amenities: Array.isArray(r.amenities) ? r.amenities.filter((x) => typeof x === "string") : [],
    highlights: Array.isArray(r.highlights) ? r.highlights.filter((x) => typeof x === "string") : [],
    active: r.active !== false,
  }));
  cfg.dining.menus = cfg.dining.menus.filter(isPlainObject).map((m, i) => ({
    ...m,
    id: str(m.id) || `menu-${i}`,
    dishes: Array.isArray(m.dishes) ? m.dishes.filter(isPlainObject) : [],
  })) as SiteConfig["dining"]["menus"];
  cfg.experiences.items = cfg.experiences.items.filter(isPlainObject).map((e, i) => ({
    ...e,
    id: str(e.id) || `exp-${i}`,
    features: Array.isArray(e.features) ? e.features.filter((x) => typeof x === "string") : [],
  })) as SiteConfig["experiences"]["items"];
  cfg.hero.backgroundMedia = cfg.hero.backgroundMedia.filter((m) => isPlainObject(m) && typeof m.url === "string" && m.url);

  // Theme
  const t = cfg.theme;
  const dt = DEFAULT_SITE_CONFIG.theme;
  (["colorBackground", "colorNavy", "colorAccent", "colorOcean", "colorMuted", "colorDriftwood", "colorShell"] as const).forEach((k) => {
    if (!isHexColor(t[k])) t[k] = dt[k];
  });
  if (!findFont(t.fontSerif)) t.fontSerif = DEFAULT_HEADING_FONT;
  if (!findFont(t.fontSans)) t.fontSans = DEFAULT_BODY_FONT;

  // Brand
  const b = cfg.brand;
  const db = DEFAULT_SITE_CONFIG.brand;
  if (!isHexColor(b.logoInk)) b.logoInk = db.logoInk;
  if (!isHexColor(b.logoGold)) b.logoGold = db.logoGold;
  if (!LOGO_VARIANTS.includes(b.headerLogoVariant)) b.headerLogoVariant = db.headerLogoVariant;
  b.headerLogoHeight = clampNum(b.headerLogoHeight, 28, 140, db.headerLogoHeight);
  b.headerLogoHeightMobile = clampNum(b.headerLogoHeightMobile, 24, 110, db.headerLogoHeightMobile);
  b.footerLogoWidth = clampNum(b.footerLogoWidth, 100, 420, db.footerLogoWidth);
  if (b.headerStyle !== "solid") b.headerStyle = "transparent";
  b.logoMode = b.logoMode === "custom" && b.customLogoUrl ? "custom" : "vector";
  cfg.otaLinks.savingsPercent = clampNum(cfg.otaLinks.savingsPercent, 0, 60, 18);

  // Map pin
  const loc = cfg.location;
  const dl = DEFAULT_SITE_CONFIG.location;
  const lat = Number(loc.mapLat);
  const lng = Number(loc.mapLng);
  loc.mapLat = Number.isFinite(lat) && Math.abs(lat) <= 90 ? lat : dl.mapLat;
  loc.mapLng = Number.isFinite(lng) && Math.abs(lng) <= 180 ? lng : dl.mapLng;
  loc.mapZoom = clampNum(loc.mapZoom, 3, 20, dl.mapZoom);
  if (loc.mapType !== "map" && loc.mapType !== "satellite") loc.mapType = dl.mapType;

  // Upgrades from earlier versions of the site settings
  if (version < 3) {
    const d = DEFAULT_SITE_CONFIG;
    b.showHeroEmblem = false;
    if (b.headerLogoHeight === 46) b.headerLogoHeight = db.headerLogoHeight;
    if (b.footerLogoWidth === 230) b.footerLogoWidth = db.footerLogoWidth;
    if (cfg.otaLinks.secondaryCtaText === "Ask our host") cfg.otaLinks.secondaryCtaText = d.otaLinks.secondaryCtaText;
    if (cfg.header.ctaText === "Check Availability") cfg.header.ctaText = d.header.ctaText;
    if (cfg.hero.ctaBookingText === "Check Rates & Availability") cfg.hero.ctaBookingText = d.hero.ctaBookingText;
    if (cfg.footer.copyrightText === "BAIA Boutique Lodge. All rights reserved. Sitio Panindigan, Palawan.") cfg.footer.copyrightText = d.footer.copyrightText;
  }
  if (version < 4) {
    const d = DEFAULT_SITE_CONFIG;
    if (/Sitio\+Panindigan\+San\+Vicente/.test(cfg.location.googleMapsUrl)) cfg.location.googleMapsUrl = "";
    const listing: Record<string, string> = {
      "https://www.booking.com": d.otaLinks.links[0].url,
      "https://www.airbnb.com": d.otaLinks.links[1].url,
      "https://www.agoda.com": d.otaLinks.links[2].url,
    };
    cfg.otaLinks.links.forEach((l) => {
      if (listing[l.url]) l.url = listing[l.url];
    });
    const socials: Record<string, string> = {
      "https://instagram.com/baia.palawan": "https://www.instagram.com/baia_palawan/",
      "https://facebook.com/baiapalawan": "https://www.facebook.com/p/BAIA-Palawan-61577281393482/",
      "https://tiktok.com/@baia_sanctuary": "",
    };
    cfg.footer.socials.forEach((s) => {
      if (s.url in socials) s.url = socials[s.url];
    });
    if (cfg.footer.email === "reservations@baia-palawan.com") cfg.footer.email = d.footer.email;
  }
  cfg.configVersion = CONFIG_VERSION;
  return cfg;
}
