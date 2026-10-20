export interface Room {
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
}

export const ROOMS: Room[] = [
  {
    id: "deluxe-suite-sea-view",
    name: "Deluxe Suite with Sea View",
    subtitle: "Front-row panoramic ocean vistas with private balcony",
    tag: "Most Coveted",
    pricePerNight: 280,
    currency: "USD",
    sqm: 48,
    occupancy: "2-3 Guests",
    bed: "King Bed + Plush Sofa Daybed",
    view: "Direct Penanindigan Turquoise Ocean",
    rating: 9.8,
    images: [
      "https://images.pexels.com/photos/14025911/pexels-photo-14025911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
      "https://images.pexels.com/photos/14025909/pexels-photo-14025909.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
      "https://images.pexels.com/photos/39836709/pexels-photo-39836709.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200"
    ],
    description: "Perched gracefully at the water's edge, this signature suite invites the rhythm of calm San Vicente tides into your sanctuary. Handcrafted solid hardwood architecture, Italian linen sheets, an oceanfront daybed balcony, and an artisanal espresso bar make this our premier retreat.",
    amenities: [
      "Oceanfront Balcony & Private Daybed",
      "King Bed with Hand-spun Organic Linen",
      "Artisanal Italian Espresso Machine",
      "Whisper-quiet Daikin Inverter AC",
      "Private Open-air Rain Shower",
      "High-speed Starlink Wi-Fi (8.7+ rated)",
      "Daily Chef-curated Breakfast Included",
      "Curated Evening Turndown & Aromatherapy"
    ],
    highlights: ["King Bed + Sofa Bed", "Oceanfront Balcony", "Private Terrace", "Espresso Bar", "Inverter AC"]
  },
  {
    id: "double-room-patio",
    name: "Double Room with Patio",
    subtitle: "Direct step-out garden terrace leading down to the sand",
    tag: "Garden & Sea Flow",
    pricePerNight: 210,
    currency: "USD",
    sqm: 38,
    occupancy: "2 Guests",
    bed: "Plush Queen Bed with Organic Cotton",
    view: "Lush Tropical Garden & Peeking Turquoise Bay",
    rating: 9.5,
    images: [
      "https://images.pexels.com/photos/39836703/pexels-photo-39836703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
      "https://images.pexels.com/photos/14025910/pexels-photo-14025910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
      "https://images.pexels.com/photos/17301475/pexels-photo-17301475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200"
    ],
    description: "Immerse yourself in gentle greenery that softly yields to Penanindigan's calm shoreline. Features a stone-tiled outdoor veranda, handmade rattan fixtures, freshly ground Palawan origin coffee, and a secluded daybed for morning meditation.",
    amenities: [
      "Private Teak Garden Veranda & Hammock",
      "Queen Bed with Eco-luxe Linens",
      "Artisan Palawan Pour-Over & Tea Station",
      "Natural Stone Ensuite with Rain Shower",
      "Whisper-quiet Daikin AC",
      "Direct Shoreline Pathway (20 steps to water)",
      "Daily Organic Breakfast on Patio",
      "Refillable Organic Botanical Toiletries"
    ],
    highlights: ["Queen Bed", "Garden & Sea View Patio", "Direct Beach Walkout", "Artisan Coffee Setup"]
  },
  {
    id: "beachfront-sanctuary-cottage",
    name: "Beachfront Sanctuary Cottage",
    subtitle: "Complete standalone cottage directly on the sand with private cabana",
    tag: "Exclusive Haven",
    pricePerNight: 350,
    currency: "USD",
    sqm: 62,
    occupancy: "2-4 Guests",
    bed: "Master King Bed + Daybed Alcove",
    view: "Uninterrupted 180° Penanindigan Bay & Sunset",
    rating: 9.9,
    images: [
      "https://images.pexels.com/photos/13716055/pexels-photo-13716055.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
      "https://images.pexels.com/photos/38422794/pexels-photo-38422794.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
      "https://images.pexels.com/photos/1320670/pexels-photo-1320670.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200"
    ],
    description: "The crown jewel of BAIA's three intimate cottages. Step directly from your hardwood veranda onto the powdery sand. Designed specifically for couples or solitary seekers wanting pure calm, private beachfront boat pickups, and evening stargazing dinners.",
    amenities: [
      "Standalone Cottage with Zero Shared Walls",
      "Dedicated Private Beach Cabana & Loungers",
      "Private Dining Setup by Personal Host",
      "Premium Bluetooth Hi-Fi Sound System",
      "Expansive Outdoor Teak Deck & Soak Tub",
      "Complimentary Sunset Cocktails Daily",
      "VIP Private Island Hopping Boat Pick-up",
      "Private Roundtrip Airport Chauffeur"
    ],
    highlights: ["Standalone Cottage", "Private Beach Cabana", "Outdoor Soak Tub", "Private Boat Boarding"]
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: "Marie",
    location: "United States",
    rating: 10.0,
    title: "BAIA is a vibe! Calm and chill.",
    date: "February 2025",
    verified: true,
    stayType: "Couple • Deluxe Suite",
    quote: "BAIA is a vibe! Calm and chill. Boat access right in front of the property for island hopping made our Palawan holiday completely effortless. The hosts treat you like family, and waking up to the crystal calm water every morning is something I'll never forget.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
  },
  {
    id: 2,
    name: "Happy",
    location: "Philippines",
    rating: 9.8,
    title: "One of San Vicente's best! Peace and quiet.",
    date: "January 2025",
    verified: true,
    stayType: "Solo Traveler • Double Room with Patio",
    quote: "One of San Vicente's best! Peace and quiet in a charming fishing village. The food prepared by the local team is extraordinary—fresh seafood, handmade pastas, and tropical fruits. Sitio Panindigan has this untouched purity that's getting rare.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
  },
  {
    id: 3,
    name: "Alicia",
    location: "Canada",
    rating: 10.0,
    title: "A mini sanctuary to do inner work and reflection.",
    date: "December 2024",
    verified: true,
    stayType: "Solo Retreat • Sanctuary Cottage",
    quote: "A mini sanctuary to do inner work and reflection. Beautiful aesthetics, warm wood, breeze, and absolute stillness. I wrote half my book here listening to the gentle ocean. San Vicente's gentle tide is healing medicine.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80"
  },
  {
    id: 4,
    name: "Jekaterina",
    location: "Estonia",
    rating: 9.6,
    title: "A little paradise by the ocean.",
    date: "November 2024",
    verified: true,
    stayType: "Couple • Deluxe Suite",
    quote: "A little paradise by the ocean. Host made us feel at home instantly. Watching sunset from the cottage deck and having breakfast served right on the beach sand was heavenly. We extended our stay twice!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80"
  },
  {
    id: 5,
    name: "Julian & Sophie",
    location: "Switzerland",
    rating: 10.0,
    title: "Unmatched barefoot luxury in Panindigan.",
    date: "October 2024",
    verified: true,
    stayType: "Honeymoon • Sanctuary Cottage",
    quote: "Having only 3 cottages on the entire beachfront gives BAIA an intimacy that 5-star mega resorts can never match. The private boat picking us up right in front of the lodge for turtle swimming was the pinnacle of our trip.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
  }
];

export const EXPERIENCES = [
  {
    id: "beachfront-water",
    tabTitle: "Beachfront & Water",
    tagline: "Turquoise Stillness & Doorstep Departures",
    headline: "Calm turquoise waters right at your doorstep, private boat pickup for island hopping.",
    description: "Unlike high-traffic tourist hubs, Penanindigan Bay is protected by outer reefs, resulting in glass-like tranquil waters. Traditional Palawan outriggers pull up right along our sandbar for effortless excursions to Secret Lagoon, German Island, and pristine sea turtle sanctuaries.",
    features: [
      "Zero commute boat boarding right on the beach in front of your cottage",
      "Calm, shallow swim-friendly turquoise ocean without undertow",
      "Complimentary ocean kayaks, paddleboards, and snorkel gear",
      "Private customized island hopping charters with personal lodge crew"
    ],
    image: "https://images.pexels.com/photos/33549434/pexels-photo-33549434.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    badge: "Exclusive Shoreline"
  },
  {
    id: "dining-culinary",
    tabTitle: "Dining & Culinary",
    tagline: "Mediterranean Soul Meets Palawan Catch",
    headline: "Chef-crafted Mediterranean, Italian, and local cuisines with bespoke breakfast styles.",
    description: "Every meal at BAIA is cooked with intention. We source catch of the day straight from the local Panindigan fishermen and organic produce from nearby San Vicente farms. Dine barefoot with candlelight on the shoreline or enjoy a slow multi-course meal on your veranda.",
    features: [
      "Full continental, traditional English, and fresh Asian breakfast menus",
      "Handmade pasta, wood-fired flavors, and fresh Palawan crab & grilled fish",
      "Curated biodynamic wine list & signature passionfruit mezcal cocktails",
      "Private romantic beach candle dinners staged under coconut palms"
    ],
    image: "https://images.pexels.com/photos/8753680/pexels-photo-8753680.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    badge: "Artisanal Kitchen"
  },
  {
    id: "wellness-peace",
    tabTitle: "Wellness & Inner Peace",
    tagline: "Sanctuary for Reflection & Stillness",
    headline: "Beachfront massages, ocean-view reflections, and film nights under tropical stars.",
    description: "Designed from the ground up as a sanctuary for inner work and deep somatic relaxation. Awaken with guided morning breathwork to the sound of soft waves, indulge in Palawan hilot massage therapy, or unwind with an intimate cinema projector screening under the Milky Way.",
    features: [
      "Palawan Hilot traditional full-body massage on open-air beach cabanas",
      "Daily oceanfront yoga mats, meditation cushions & curated journal prompts",
      "Outdoor boutique cinema nights with artisan cocktails under the stars",
      "Unplugged silence hours for creative writing, study, and deep reflection"
    ],
    image: "https://images.pexels.com/photos/31234756/pexels-photo-31234756.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    badge: "Inner Sanctuary"
  },
  {
    id: "conveniences",
    tabTitle: "Conveniences & Care",
    tagline: "Seamless Comfort & Discrete Hospitality",
    headline: "Free Airport Shuttle (5km from SWL), High-speed WiFi, and personalized lodge host.",
    description: "Enjoy supreme remoteness without sacrificing modern convenience. We are located just 10 minutes from San Vicente Airport (SWL). Our private chauffeur meets your flight, seamlessly whisking you away to paradise while Starlink connectivity lets you stay in touch whenever needed.",
    features: [
      "Complimentary private airport shuttle (San Vicente SWL Airport, 5 km away)",
      "High-speed Starlink Wi-Fi (rated 8.7+ by digital nomads and writers)",
      "Free private guest parking & secure private compound with 24/7 security",
      "Dedicated lodge concierge for motorbike rentals, ferry transfers, and flights"
    ],
    image: "https://images.pexels.com/photos/33549424/pexels-photo-33549424.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    badge: "Effortless Arrival"
  }
];

export const NEARBY_POINTS = [
  {
    name: "Penanindigan Beach & Sandbar",
    distance: "4 meters",
    type: "Direct Step-Out",
    desc: "Lodge's private beach threshold with calm turquoise swimming conditions year-round."
  },
  {
    name: "New Capari Beach",
    distance: "600 meters",
    type: "Short Stroll",
    desc: "Golden crescent bay framed by wild coconut groves, perfect for sunrise beach runs."
  },
  {
    name: "Marina Terrace Restaurant",
    distance: "3 kilometers",
    type: "5 min drive",
    desc: "Renowned Italian seaside dining overlooking San Vicente's marina with artisan pizzas."
  },
  {
    name: "San Vicente Airport (SWL)",
    distance: "5 kilometers",
    type: "10 min transfer",
    desc: "Direct flights from Manila & Clark. Complimentary private airport shuttle included."
  },
  {
    name: "Port Barton Archipelago Tour",
    distance: "Boat from lodge",
    type: "Direct Departure",
    desc: "Secret reef gardens, starfish sandbars, and sea turtle sanctuary excursions."
  }
];
