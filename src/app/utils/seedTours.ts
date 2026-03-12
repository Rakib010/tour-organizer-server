/* eslint-disable no-console */
import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { envVars } from "../config/env";
import { Division } from "../modules/division/division.model";
import { TourType } from "../modules/tour type/tourType.modal";
import { Tour } from "../modules/tour/tour.model";
import { ITour } from "../modules/tour/tour.interface";

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getOrCreateDivision = async (name: string) => {
  let div = await Division.findOne({ name });
  if (!div) {
    div = await Division.create({ name, description: `${name} division of Bangladesh` });
  }
  return div._id;
};

const getOrCreateTourType = async (name: string) => {
  let tt = await TourType.findOne({ name });
  if (!tt) {
    tt = await TourType.create({ name });
  }
  return tt._id;
};

const TOURS: Omit<ITour, "division" | "tourType" | "slug">[] = [
  {
    title: "Cox's Bazar Beach & Sea Cave Adventure",
    description:
      "Experience the world's longest natural sea beach. Enjoy sunrise at Laboni Point, visit Himchari Waterfall, explore the coral-rich St. Martin's Island, and relax on pristine sandy beaches. Perfect for beach lovers and photography enthusiasts.",
    images: [],
    location: "Cox's Bazar, Chittagong",
    costFrom: 15000,
    starDate: addDays(new Date(), 7),
    endDate: addDays(new Date(), 10),
    departureLocation: "Dhaka",
    arrivalLocation: "Cox's Bazar",
    included: [
      "Accommodation (3 nights)",
      "Breakfast & dinner",
      "Transport (AC bus)",
      "Guide",
      "Beach activities",
    ],
    exclude: ["Lunch", "Personal expenses", "Optional excursions"],
    amenities: ["WiFi", "Camera allowed", "Swimming", "Beach access"],
    tourPlan: [
      "Day 1: Depart from Dhaka, reach Cox's Bazar evening, check-in, beach walk.",
      "Day 2: Himchari Waterfall trip, Inani Beach, sunset at Laboni Point.",
      "Day 3: Full day at St. Martin's Island, snorkeling, coral viewing.",
      "Day 4: Morning leisure, return to Dhaka.",
    ],
    maxGuest: 25,
    minAge: 5,
  },
  {
    title: "Sundarbans Wildlife Safari",
    description:
      "Explore the largest mangrove forest in the world. Spot Royal Bengal Tigers, saltwater crocodiles, spotted deer, and diverse bird species. Cruise through narrow canals and experience the mystical beauty of the Sundarbans.",
    images: [],
    location: "Sundarbans, Khulna",
    costFrom: 22000,
    starDate: addDays(new Date(), 14),
    endDate: addDays(new Date(), 17),
    departureLocation: "Khulna",
    arrivalLocation: "Mongla",
    included: ["Boat accommodation", "All meals", "Forest permit", "Expert guide", "Safety equipment"],
    exclude: ["Travel to Khulna", "Personal items", "Camera fee"],
    amenities: ["Life jacket", "Binoculars", "First aid"],
    tourPlan: [
      "Day 1: Reach Khulna, board vessel, sail to Sundarbans, evening wildlife watch.",
      "Day 2: Early morning cruise, Karamjol watchtower, Hiron Point.",
      "Day 3: Dublar Char island, fishing village visit, crocodile spotting.",
      "Day 4: Return to Khulna, departure.",
    ],
    maxGuest: 15,
    minAge: 10,
  },
  {
    title: "Srimangal Tea Garden & Rainforest",
    description:
      "Discover the land of two leaves and a bud. Walk through lush tea gardens, visit Lawachara National Park, experience the seven-layer tea, and explore Madhabpur Lake. A paradise for nature and tea lovers.",
    images: [],
    location: "Srimangal, Sylhet",
    costFrom: 12000,
    starDate: addDays(new Date(), 21),
    endDate: addDays(new Date(), 23),
    departureLocation: "Dhaka",
    arrivalLocation: "Srimangal",
    included: ["Accommodation (2 nights)", "All meals", "Transport", "Tea garden visit", "Park entry"],
    exclude: ["Seven-layer tea", "Souvenirs", "Optional trekking"],
    amenities: ["Homestay option", "Trekking", "Bird watching"],
    tourPlan: [
      "Day 1: Dhaka to Srimangal, tea estate walk, seven-layer tea, Nilkantha Tea Cabin.",
      "Day 2: Lawachara National Park, Madhabpur Lake, tribal village.",
      "Day 3: Baikka Beel wetland, return to Dhaka.",
    ],
    maxGuest: 20,
    minAge: 5,
  },
  {
    title: "Bandarban Hill Tracks Expedition",
    description:
      "Trek through the rugged hills of Bandarban. Visit Nilgiri, Buddha Dhatu Jadi, Nafakhum Waterfall, and experience indigenous culture. Ideal for adventure seekers and trekkers.",
    images: [],
    location: "Bandarban, Chittagong",
    costFrom: 18000,
    starDate: addDays(new Date(), 28),
    endDate: addDays(new Date(), 32),
    departureLocation: "Chittagong",
    arrivalLocation: "Bandarban",
    included: ["Hotel & homestay", "All meals", "Local transport", "Trekking guide", "Permits"],
    exclude: ["Chittagong travel", "Personal trekking gear"],
    amenities: ["Trekking", "Photography", "Cultural visit"],
    tourPlan: [
      "Day 1: Chittagong to Bandarban, Buddha Dhatu Jadi (Golden Temple).",
      "Day 2: Nilgiri Hills, Ruma Bazar.",
      "Day 3: Trek to Nafakhum Waterfall, Remakri.",
      "Day 4: Boga Lake trek, return.",
      "Day 5: Chimbuk Hill, back to Chittagong.",
    ],
    maxGuest: 12,
    minAge: 12,
  },
  {
    title: "Saint Martin Island Paradise",
    description:
      "Escape to the only coral island of Bangladesh. Crystal-clear waters, sandy beaches, and vibrant marine life. Snorkeling, swimming, and island hopping await you.",
    images: [],
    location: "Saint Martin Island, Chittagong",
    costFrom: 20000,
    starDate: addDays(new Date(), 35),
    endDate: addDays(new Date(), 38),
    departureLocation: "Cox's Bazar / Teknaf",
    arrivalLocation: "Saint Martin",
    included: ["Speedboat/ferry", "Resort (2 nights)", "Breakfast & dinner", "Snorkeling gear"],
    exclude: ["Lunch", "Coral island day trip", "Sea food extras"],
    amenities: ["Beach resort", "Snorkeling", "Sunset view"],
    tourPlan: [
      "Day 1: Teknaf to Saint Martin by ferry, check-in, beach leisure.",
      "Day 2: Chera Dwip island trip, snorkeling, sunset.",
      "Day 3: North beach, coconut groves, local market.",
      "Day 4: Morning swim, return to Teknaf.",
    ],
    maxGuest: 20,
    minAge: 5,
  },
  {
    title: "Rangamati Kaptai Lake & Tribal Culture",
    description:
      "Cruise on the largest man-made lake in South Asia. Visit tribal villages, Shuvolong Waterfall, and enjoy the serene hills and water. Perfect for culture and nature enthusiasts.",
    images: [],
    location: "Rangamati, Chittagong",
    costFrom: 14000,
    starDate: addDays(new Date(), 42),
    endDate: addDays(new Date(), 44),
    departureLocation: "Chittagong",
    arrivalLocation: "Rangamati",
    included: ["Hotel accommodation", "Boat cruise", "All meals", "Tribal village visit", "Guide"],
    exclude: ["Chittagong transport", "Handicrafts"],
    amenities: ["Lake cruise", "Tribal museum", "Hanging bridge"],
    tourPlan: [
      "Day 1: Chittagong to Rangamati, Kaptai Lake cruise, tribal museum.",
      "Day 2: Shuvolong Waterfall, Rajban Vihar, Parjatan complex.",
      "Day 3: Hanging bridge, local market, return.",
    ],
    maxGuest: 18,
    minAge: 5,
  },
  {
    title: "Kuakata Sea Beach & Buddhist Heritage",
    description:
      "Witness both sunrise and sunset from the same beach. Visit Buddhist temples, Rakhine villages, and enjoy the serene coast of Patuakhali.",
    images: [],
    location: "Kuakata, Patuakhali",
    costFrom: 11000,
    starDate: addDays(new Date(), 49),
    endDate: addDays(new Date(), 51),
    departureLocation: "Dhaka",
    arrivalLocation: "Kuakata",
    included: ["Hotel (2 nights)", "Breakfast", "Transport", "Temple visits", "Beach access"],
    exclude: ["Lunch & dinner", "Gangamati reserve"],
    amenities: ["Sunrise/sunset view", "Temple tour", "Beach"],
    tourPlan: [
      "Day 1: Dhaka to Kuakata, sunset at beach, Rakhine village.",
      "Day 2: Sunrise viewing, Buddhist temple, Gangamati, Lebur Char.",
      "Day 3: Morning leisure, return to Dhaka.",
    ],
    maxGuest: 25,
    minAge: 5,
  },
  {
    title: "Sylhet Tea & Waterfall Discovery",
    description:
      "Explore Jaflong, Ratargul Swamp Forest, Lalakhal, and numerous tea estates. Experience the natural beauty and tea culture of Sylhet.",
    images: [],
    location: "Sylhet",
    costFrom: 13000,
    starDate: addDays(new Date(), 56),
    endDate: addDays(new Date(), 58),
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    included: ["Hotel (2 nights)", "All meals", "Boat & transport", "Shrine visit", "Tea estate tour"],
    exclude: ["Shopping", "Optional excursions"],
    amenities: ["Shah Jalal shrine", "Ratargul boat", "Jaflong"],
    tourPlan: [
      "Day 1: Dhaka to Sylhet, Shah Jalal shrine, Shah Paran, tea gardens.",
      "Day 2: Jaflong, Ratargul Swamp Forest boat, Lalakhal.",
      "Day 3: Bisnakandi, return to Dhaka.",
    ],
    maxGuest: 22,
    minAge: 5,
  },
  {
    title: "Paharpur & Mahasthangarh Heritage Tour",
    description:
      "Step back in time at the UNESCO World Heritage site of Somapura Mahavihara (Paharpur) and the ancient city of Mahasthangarh. A journey through Bangladesh's rich archaeological past.",
    images: [],
    location: "Naogaon & Bogura, Rajshahi",
    costFrom: 9000,
    starDate: addDays(new Date(), 63),
    endDate: addDays(new Date(), 65),
    departureLocation: "Dhaka",
    arrivalLocation: "Bogura",
    included: ["Hotel (2 nights)", "Breakfast", "Transport", "Entry fees", "Guide"],
    exclude: ["Lunch & dinner", "Souvenirs"],
    amenities: ["UNESCO site", "Archaeological museum", "Heritage"],
    tourPlan: [
      "Day 1: Dhaka to Bogura, Mahasthangarh archaeological site, Govinda Bhita.",
      "Day 2: Paharpur Buddhist Monastery, museum, Varendra Research Museum.",
      "Day 3: Kantajew Temple, return to Dhaka.",
    ],
    maxGuest: 20,
    minAge: 8,
  },
  {
    title: "Dhaka City Heritage & Food Walk",
    description:
      "Explore the vibrant capital: Lalbagh Fort, Ahsan Manzil, Armenian Church, Old Dhaka streets, and savor authentic Bengali cuisine. A perfect blend of history and food.",
    images: [],
    location: "Dhaka",
    costFrom: 5000,
    starDate: addDays(new Date(), 3),
    endDate: addDays(new Date(), 4),
    departureLocation: "Meeting point, Dhaka",
    arrivalLocation: "Dhaka",
    included: ["Guide", "Rickshaw ride", "Food tastings (5 stops)", "Entry fees"],
    exclude: ["Accommodation", "Extra meals"],
    amenities: ["Walking tour", "Food tour", "Rickshaw"],
    tourPlan: [
      "Day 1: Lalbagh Fort, Ahsan Manzil, Star Mosque, Armenian Church.",
      "Day 2: Old Dhaka food walk - Haji Biriyani, Bakarkhani, Jilapi, Chotpoti, Faluda.",
    ],
    maxGuest: 15,
    minAge: 10,
  },
];

const seedTours = async () => {
  try {
    await mongoose.connect(envVars.DB_URL!);
    console.log("Connected to DB");

    const divisions = ["Chittagong", "Khulna", "Sylhet", "Rajshahi", "Barisal", "Dhaka"];
    const tourTypes = ["Beach", "Wildlife", "Cultural", "Adventure", "Heritage", "Food"];

    const divisionIds: Record<string, Types.ObjectId> = {};
    for (const name of divisions) {
      divisionIds[name] = await getOrCreateDivision(name);
    }

    const tourTypeIds: Record<string, Types.ObjectId> = {};
    for (const name of tourTypes) {
      tourTypeIds[name] = await getOrCreateTourType(name);
    }

    const tourMapping: { division: string; tourType: string }[] = [
      { division: "Chittagong", tourType: "Beach" },
      { division: "Khulna", tourType: "Wildlife" },
      { division: "Sylhet", tourType: "Cultural" },
      { division: "Chittagong", tourType: "Adventure" },
      { division: "Chittagong", tourType: "Beach" },
      { division: "Chittagong", tourType: "Cultural" },
      { division: "Barisal", tourType: "Beach" },
      { division: "Sylhet", tourType: "Cultural" },
      { division: "Rajshahi", tourType: "Heritage" },
      { division: "Dhaka", tourType: "Food" },
    ];

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < TOURS.length; i++) {
      const tour = TOURS[i];
      const { division: divName, tourType: ttName } = tourMapping[i];
      const existing = await Tour.findOne({ title: tour.title });
      if (existing) {
        console.log(`Skipped (exists): ${tour.title}`);
        skipped++;
        continue;
      }
      await Tour.create({
        ...tour,
        division: divisionIds[divName] || divisionIds.Dhaka,
        tourType: tourTypeIds[ttName] || tourTypeIds.Cultural,
      });
      console.log(`Created: ${tour.title}`);
      created++;
    }

    console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
    process.exit(0);
  }
};

seedTours();

