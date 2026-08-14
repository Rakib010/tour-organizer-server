/* eslint-disable no-console */
/**
 * One-off updater: fills each tour with 3–4 paragraph overview,
 * realistic BDT price, and place-specific Bangladesh images.
 *
 * Run: npx ts-node ./src/app/utils/updateTourContent.ts
 */
import "dotenv/config";
import mongoose from "mongoose";
import { envVars } from "../config/env";
import { Tour } from "../modules/tour/tour.model";

type TourPatch = {
  title: string;
  description: string;
  costFrom: number;
  images: string[];
  location?: string;
};

const TOUR_UPDATES: TourPatch[] = [
  {
    title: "Kuakata Sea Beach",
    location: "Kuakata, Patuakhali",
    costFrom: 11500,
    description: [
      "Kuakata in Patuakhali is known as the Daughter of the Sea — one of the rare beaches in Bangladesh where you can watch both sunrise and sunset over the Bay of Bengal from the same shoreline. Soft sand, fishing boats, and a calmer crowd than Cox’s Bazar make it a favorite weekend escape from Dhaka.",
      "A typical package covers AC or non-AC transport, 2 nights near the beach, breakfast, and guided sunrise–sunset points. Optional stops include Rakhine cultural sites and seasonal mangrove views around Gangamati when tide and weather allow.",
      "Expect fresh seafood on the beach road, quieter evenings than major tourist strips, and golden hour photography without heavy rush if you travel on weekdays. Winter mornings usually give the clearest sunrise.",
      "Budget carefully for transport and hotel first; lunch, dinner, and boat add-ons are usually extra. Book ahead for Friday–Saturday peaks in October–March.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Kuakata_beach.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kuakata_Beach_%E2%9B%B1%EF%B8%8F.jpg/1280px-Kuakata_Beach_%E2%9B%B1%EF%B8%8F.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cox%27s_Bazar_sea_beach_01.jpg/1280px-Cox%27s_Bazar_sea_beach_01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Cox%27s_Bazar_Beach_%E2%9B%B1%EF%B8%8F.jpg",
    ],
  },
  {
    title: "Cox's Bazar Beach Escape",
    location: "Cox's Bazar",
    costFrom: 15500,
    description: [
      "Cox’s Bazar is Bangladesh’s most visited coastal destination, famous for the world’s longest natural sea beach. Most travelers base near Laboni or Kolatoli for easy beach access, seafood dinners, and sunset walks on Marine Drive.",
      "This escape package is built for first-time visitors: hotel stay, beach evenings, and classic day sightseeing to Himchari viewpoint and Inani Beach. Schedules stay relaxed so you get free beach time instead of a rushed checklist.",
      "Peak winter holidays raise hotel prices quickly. Mid-range beach-area hotels commonly run several thousand taka per night, while budget lodges remain available a short walk from the main beach strip.",
      "Saint Martin’s Island is a popular add-on but needs separate ship tickets and an extra day. Keep a buffer if sea weather looks uncertain.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cox%27s_Bazar_sea_beach_01.jpg/1280px-Cox%27s_Bazar_sea_beach_01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Cox%27s_Bazar_Beach_%E2%9B%B1%EF%B8%8F.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Beach_View_of_the_Saint_Martin%27s_Island.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Coral_Sea_Beach_at_Chera_Dwip%2C_Saint_Martin%27s_Island_%2839633896435%29.jpg/1280px-Coral_Sea_Beach_at_Chera_Dwip%2C_Saint_Martin%27s_Island_%2839633896435%29.jpg",
    ],
  },
  {
    title: "Saint Martin's Island Getaway",
    location: "Saint Martin's Island, Teknaf",
    costFrom: 18500,
    description: [
      "Saint Martin’s is Bangladesh’s only coral island, reached by morning ship from Teknaf. Most visitors overnight on the island because return ships usually leave the next day.",
      "The experience is simple and scenic: coral shoreline walks, Chera Dwip at low tide, seafood dinners, and quieter nights than mainland Cox’s Bazar. Sea conditions can cancel trips, so always confirm ship schedules before you travel.",
      "Do not collect coral or damage marine life. Carry cash, sunscreen, and motion comfort medicine for the ship if you need it.",
      "Package pricing typically reflects Dhaka/Cox’s transfer support, ship tickets, island lodging, and breakfast. Lunch, dinner, and cycle rentals are often extra.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Coral_Sea_Beach_at_Chera_Dwip%2C_Saint_Martin%27s_Island_%2839633896435%29.jpg/1280px-Coral_Sea_Beach_at_Chera_Dwip%2C_Saint_Martin%27s_Island_%2839633896435%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Beach_View_of_the_Saint_Martin%27s_Island.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Coral_Sea_Beach_of_Chera_Dwip%2C_Saint_Martin%27s_Island_%2826629378198%29.jpg/1280px-Coral_Sea_Beach_of_Chera_Dwip%2C_Saint_Martin%27s_Island_%2826629378198%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Saint-martin%27s-island.JPG/1280px-Saint-martin%27s-island.JPG",
    ],
  },
  {
    title: "Sundarbans Wildlife Cruise",
    location: "Sundarbans, Khulna",
    costFrom: 16000,
    description: [
      "The Sundarbans is the world’s largest mangrove forest and a UNESCO-listed treasure of Bangladesh. Overnight boat tours from Khulna or Mongla remain the classic way to experience its creeks, wildlife, and silence.",
      "Tiger sightings are uncommon. Come for spotted deer, birds, watchtowers, and the feeling of moving through protected wilderness by boat with meals and forest permits arranged.",
      "Authorized operators handle entry permissions and safety briefings. Life jackets, mosquito repellent, and soft cabin bags are essential.",
      "Realistic package rates for popular 2–3 day boat trips commonly fall in the mid-teens of thousands of taka per person when meals and permits are included — confirm inclusions before payment.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Gol_pata_on_boat_from_Sundarban%2C_Khulna..JPG/1280px-Gol_pata_on_boat_from_Sundarban%2C_Khulna..JPG",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Broken_vessel_on_the_Pasur_river.JPG/1280px-Broken_vessel_on_the_Pasur_river.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Bag_used_by_the_beekeepers_of_the_Sundarbans_-_DSC00286.jpg/1280px-Bag_used_by_the_beekeepers_of_the_Sundarbans_-_DSC00286.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sundarban_Tiger.jpg/1280px-Sundarban_Tiger.jpg",
    ],
  },
  {
    title: "Sajek Valley Cloud Camp",
    location: "Sajek Valley, Rangamati",
    costFrom: 12500,
    description: [
      "Sajek Valley is one of Bangladesh’s most loved hill destinations — cottage stays above ridgelines and, on clear mornings, a sea of clouds below. The usual route is Dhaka → Khagrachari → reserved jeep (Chander Gari) to Sajek.",
      "Nights are colder than the plains, so pack a jacket. Mobile network can be weak; download offline maps and confirm jeep return timing with your cottage host.",
      "Helipad sunrise, Konglak views, and respectful village walks form the core highlights. Ask before photographing people or homes in indigenous communities.",
      "Per-person cost depends heavily on jeep sharing. A full jeep is often several thousand taka total; splitting seats keeps the trip realistic for small groups.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sunrise_at_Sajek_Valley.jpg/1280px-Sunrise_at_Sajek_Valley.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Hookah_at_Sajek_Valley.jpg/1280px-Hookah_at_Sajek_Valley.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nilgiri%2C_Bandarban%2C_Bangladesh.jpg/1280px-Nilgiri%2C_Bandarban%2C_Bangladesh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg/1280px-View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg",
    ],
  },
  {
    title: "Bandarban Hills Expedition",
    location: "Bandarban",
    costFrom: 15500,
    description: [
      "Bandarban is the adventure heart of the Chittagong Hill Tracts — Nilgiri cloud views, Chimbuk panoramas, the Golden Temple, and deeper waterfall or lake routes when weather and permits allow.",
      "Build a flexible plan: keep Nilgiri and Chimbuk as core highlights, and treat Boga Lake or Nafakhum-style routes as conditional add-ons based on local advice.",
      "Jeep costs add up quickly. Sharing transport with other travelers is the practical way to keep a 3–4 day circuit affordable.",
      "Respect restricted-area rules. Remote treks should only be done with licensed local guides and updated permission checks.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Bandarban_Bangladesh.jpg/1280px-Bandarban_Bangladesh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg/1280px-View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nilgiri%2C_Bandarban%2C_Bangladesh.jpg/1280px-Nilgiri%2C_Bandarban%2C_Bangladesh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Nafakhum_Waterfalls.jpg/1280px-Nafakhum_Waterfalls.jpg",
    ],
  },
  {
    title: "Srimangal Tea & Rainforest",
    location: "Srimangal, Moulvibazar",
    costFrom: 10500,
    description: [
      "Srimangal is Bangladesh’s tea capital — endless green estates, pineapple orchards, and easy access to Lawachara National Park. It is one of the most comfortable nature weekends from Dhaka.",
      "Walk estate roads in soft morning light, taste seven-layer tea, and take a guided rainforest trail for birds and deep shade. Madhabpur Lake is a popular pairing stop.",
      "Train or bus from Dhaka takes about 4–5 hours. Local CNG circuits cover estates and forest gates without complicated logistics.",
      "Resort nights among tea gardens cost more than town hotels, but both work. Weekdays are quieter for photography and forest entry.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Tea_gardens_in_Sreemangal_05.jpg/1280px-Tea_gardens_in_Sreemangal_05.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sreemangal_tea_garden_2017-08-20.jpg/1280px-Sreemangal_tea_garden_2017-08-20.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Tea_garden_of_Moulvibazar.jpg/1280px-Tea_garden_of_Moulvibazar.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Sylhet_Bangladesh_Tea_Garden_2022.jpg/1280px-Sylhet_Bangladesh_Tea_Garden_2022.jpg",
    ],
  },
  {
    title: "Sylhet Waterfalls & Ratargul",
    location: "Sylhet",
    costFrom: 11000,
    description: [
      "This Sylhet circuit combines Ratargul swamp forest boat trails with Jaflong and Bisanakandi hill-river landscapes under the Meghalaya backdrop.",
      "Base in Sylhet city and day-trip by reserved CNG. Monsoon and post-rain months give Ratargul its classic flooded-forest look; winter is easier for long road days.",
      "Start early if you want swamp forest plus Jaflong/Bisanakandi in one ambitious day. Otherwise split across two days for a calmer pace.",
      "Agree boat and CNG fares before boarding. Carry water, snacks, and a splash-safe bag for phones on the boat.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Ratargul_785_retouched.jpg/1280px-Ratargul_785_retouched.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ratargul-02.jpg/1280px-Ratargul-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Jaflong_Sylhet.jpg/1280px-Jaflong_Sylhet.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Malnichora_Tea_Garden_at_Sylhet_06.jpg/1280px-Malnichora_Tea_Garden_at_Sylhet_06.jpg",
    ],
  },
  {
    title: "Rangamati Kaptai Lake Cruise",
    location: "Rangamati",
    costFrom: 12000,
    description: [
      "Rangamati is the lake district of the Hill Tracts — Kaptai Lake boat days, the hanging bridge, and a softer hills experience than hard trekking routes.",
      "A full-day boat is the heart of the trip. Pair it with the Tribal Cultural Institute and lakeside evenings in town for a complete short break.",
      "Negotiate boat packages clearly: hours, stops, and fuel should be fixed before leaving the ghat. Ask for life jackets.",
      "Hotels near town are practical bases. Lakeside resorts cost more when available. Weekends get busier at the hanging bridge.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Hanging_Bridge%2C_Kaptai_Lake.jpg/1280px-Hanging_Bridge%2C_Kaptai_Lake.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Bridge%2C_Kaptai_Lake_%2801%29.jpg/1280px-Bridge%2C_Kaptai_Lake_%2801%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kaptai_Lake.jpg/1280px-Kaptai_Lake.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Bandarban_Bangladesh.jpg/1280px-Bandarban_Bangladesh.jpg",
    ],
  },
  {
    title: "Paharpur Heritage Trail",
    location: "Paharpur, Naogaon",
    costFrom: 8500,
    description: [
      "Somapura Mahavihara at Paharpur is a UNESCO World Heritage Site and one of South Asia’s great early medieval Buddhist monastery ruins.",
      "This heritage trail pairs Paharpur with Mahasthangarh near Bogura for a meaningful north-west weekend from Dhaka — walking, museum time, and guided history.",
      "Open courtyards mean sun and heat; bring a hat, water, and comfortable shoes. A local guide helps the brick layout make sense.",
      "Transport and simple hotel nights keep this among the more affordable multi-day cultural packages compared with beach or island trips.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Aerial_view_of_Somapura_Mahavihara.jpg/1280px-Aerial_view_of_Somapura_Mahavihara.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Somapura_Mahavihara.jpg/1280px-Somapura_Mahavihara.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Sylhet_Bangladesh_Tea_Garden_2022.jpg/1280px-Sylhet_Bangladesh_Tea_Garden_2022.jpg",
    ],
  },
  {
    title: "Old Dhaka Heritage & Food Walk",
    location: "Old Dhaka",
    costFrom: 3500,
    description: [
      "Old Dhaka packs centuries of history into narrow lanes — Lalbagh Fort, Ahsan Manzil, historic mosques, Sadarghat river scenes, and legendary food stops.",
      "This walking-focused day is ideal for travelers who want heritage and taste without leaving the capital. A local guide or planned map route helps you move efficiently between nearby monuments.",
      "Fridays and public holidays can change opening hours. Keep bags light and phones secure in crowded bazaars.",
      "Costs stay modest: guide, entry fees, rickshaw hops, and curated tastings. Full hotel nights are usually separate if you already live in or stay elsewhere in Dhaka.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Aerial_view_of_Somapura_Mahavihara.jpg/1280px-Aerial_view_of_Somapura_Mahavihara.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cox%27s_Bazar_sea_beach_01.jpg/1280px-Cox%27s_Bazar_sea_beach_01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Kuakata_beach.jpg",
    ],
  },
  {
    title: "Tanguar Haor Boat Expedition",
    location: "Tanguar Haor, Sunamganj",
    costFrom: 13500,
    description: [
      "Tanguar Haor in Sunamganj feels like an inland sea in monsoon — open water, sky, and quiet village edges. In winter, birdlife becomes a major reason to go.",
      "The usual plan is Dhaka → Sunamganj → Tahirpur ghat → engine boat with overnight stay on board. Network signals can drop, so share your plan before boarding.",
      "Choose operators who provide life jackets and clear meal inclusions. Waterproof bags protect phones and clothes from splash and sudden rain.",
      "Per-person package cost varies with group size and boat quality; confirm whether meals, guide, and return transfers are included.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tanguar_haor%2C_Bangladesh_01.jpg/1280px-Tanguar_haor%2C_Bangladesh_01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Ratargul_785_retouched.jpg/1280px-Ratargul_785_retouched.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ratargul-02.jpg/1280px-Ratargul-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Gol_pata_on_boat_from_Sundarban%2C_Khulna..JPG/1280px-Gol_pata_on_boat_from_Sundarban%2C_Khulna..JPG",
    ],
  },
  {
    title: "Nilgiri Sunrise Retreat",
    location: "Nilgiri, Bandarban",
    costFrom: 14500,
    description: [
      "Nilgiri is one of Bandarban’s most famous viewpoints — cottage nights above the hills and, on clear mornings, clouds pooled in the valleys below.",
      "Most travelers jeep up from Bandarban Sadar for sunset, overnight, and sunrise. Fog can block views, so winter clear mornings are the safest bet for the classic panorama.",
      "Follow local site rules and photography guidance. Evenings are colder than town; pack a warm layer.",
      "Cottage rates rise on holidays. Day-tripping from Bandarban town hotels is the budget alternative if overnight cottages are full.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nilgiri%2C_Bandarban%2C_Bangladesh.jpg/1280px-Nilgiri%2C_Bandarban%2C_Bangladesh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg/1280px-View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Bandarban_Bangladesh.jpg/1280px-Bandarban_Bangladesh.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sunrise_at_Sajek_Valley.jpg/1280px-Sunrise_at_Sajek_Valley.jpg",
    ],
  },
  {
    title: "Himchari & Inani Day Discovery",
    location: "Himchari & Inani, Cox's Bazar",
    costFrom: 4500,
    description: [
      "This focused Cox’s Bazar nature day covers Himchari’s coastal hills and seasonal waterfall area, then continues along Marine Drive to Inani Beach’s coral stones.",
      "It works best as a guided day trip for travelers already staying in Cox’s Bazar — or as a compact highlight loop for those who want scenery without a long multi-day commitment.",
      "Morning starts beat heat and crowds. Wear shoes with grip near wet rocks and carry water for the Marine Drive stretch.",
      "Pricing mainly covers reserved local transport and guide support. Hotel stay and meals remain separate unless your operator bundles them.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cox%27s_Bazar_sea_beach_01.jpg/1280px-Cox%27s_Bazar_sea_beach_01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Cox%27s_Bazar_Beach_%E2%9B%B1%EF%B8%8F.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Kuakata_beach.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Beach_View_of_the_Saint_Martin%27s_Island.jpg",
    ],
  },
  {
    title: "Lawachara Forest Morning Trek",
    location: "Lawachara National Park, Srimangal",
    costFrom: 5500,
    description: [
      "Lawachara National Park near Srimangal offers rainforest shade, bird calls, and a chance to spot Hoolock gibbons on an early guided trail.",
      "This morning trek pairs naturally with a soft tea-garden afternoon. Silence improves wildlife chances — leave loud music behind.",
      "Enter with a nature guide and stay on marked paths. Wet months can bring leeches; prepare shoes and repellent.",
      "As a day package from Srimangal, costs stay moderate: park support, guide, and CNG transfers. Hotel nights are usually booked separately in town or estate resorts.",
    ].join("\n\n"),
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Tea_gardens_in_Sreemangal_05.jpg/1280px-Tea_gardens_in_Sreemangal_05.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sreemangal_tea_garden_2017-08-20.jpg/1280px-Sreemangal_tea_garden_2017-08-20.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Ratargul_785_retouched.jpg/1280px-Ratargul_785_retouched.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Tea_garden_of_Moulvibazar.jpg/1280px-Tea_garden_of_Moulvibazar.jpg",
    ],
  },
];

// Override galleries with stricter place-specific Commons photos
TOUR_UPDATES.find((t) => t.title === "Kuakata Sea Beach")!.images = [
  "https://upload.wikimedia.org/wikipedia/commons/3/37/Kuakata_beach.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Kuakata_Sea_Beach.jpg/1280px-Kuakata_Sea_Beach.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sunrise_at_Kuakata_beach%2C_Bangladesh.jpg/1280px-Sunrise_at_Kuakata_beach%2C_Bangladesh.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Sunsets_at_Kuakata_Sea_Beach.jpg/1280px-Sunsets_at_Kuakata_Sea_Beach.jpg",
];

TOUR_UPDATES.find((t) => t.title === "Cox's Bazar Beach Escape")!.images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cox%27s_Bazar_sea_beach_01.jpg/1280px-Cox%27s_Bazar_sea_beach_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Cox%27s_Bazar_Beach_%E2%9B%B1%EF%B8%8F.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Himchari%2C_Cox%27s_Bazar_%282Q7A1950%29.jpg/1280px-Himchari%2C_Cox%27s_Bazar_%282Q7A1950%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Inani_Beach_%28135005%29.jpg/1280px-Inani_Beach_%28135005%29.jpg",
];

TOUR_UPDATES.find((t) => t.title === "Paharpur Heritage Trail")!.images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Aerial_view_of_Somapura_Mahavihara.jpg/1280px-Aerial_view_of_Somapura_Mahavihara.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Sunset_scene_of_Mahasthangarh.jpg/1280px-Sunset_scene_of_Mahasthangarh.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/View_of_Mahasthangarh.jpg/1280px-View_of_Mahasthangarh.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Walls_of_Mahasthangarh.jpg/1280px-Walls_of_Mahasthangarh.jpg",
];

TOUR_UPDATES.find((t) => t.title === "Old Dhaka Heritage & Food Walk")!.images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/1e/Dhaka_Lalbagh_Fort_5.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Star_Mosque.jpg/1280px-Star_Mosque.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Buriganga_at_the_port_Sadarghat_02.jpg/1280px-Buriganga_at_the_port_Sadarghat_02.jpg",
];

TOUR_UPDATES.find((t) => t.title === "Himchari & Inani Day Discovery")!.images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Himchari%2C_Cox%27s_Bazar_%282Q7A1950%29.jpg/1280px-Himchari%2C_Cox%27s_Bazar_%282Q7A1950%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Himchari%2C_Cox%27s_Bazar_%282Q7A1958%29.jpg/1280px-Himchari%2C_Cox%27s_Bazar_%282Q7A1958%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Inani_Beach_%28135005%29.jpg/1280px-Inani_Beach_%28135005%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Inani_Beach_in_the_day_%2821_February_2014%29.jpg/1280px-Inani_Beach_in_the_day_%2821_February_2014%29.jpg",
];

TOUR_UPDATES.find((t) => t.title === "Sajek Valley Cloud Camp")!.images = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sunrise_at_Sajek_Valley.jpg/1280px-Sunrise_at_Sajek_Valley.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Hookah_at_Sajek_Valley.jpg/1280px-Hookah_at_Sajek_Valley.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nilgiri%2C_Bandarban%2C_Bangladesh.jpg/1280px-Nilgiri%2C_Bandarban%2C_Bangladesh.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg/1280px-View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg",
];

const updateTourContent = async () => {
  try {
    await mongoose.connect(envVars.DB_URL!);
    console.log("Connected to DB");

    let updated = 0;
    let missing = 0;

    for (const patch of TOUR_UPDATES) {
      const result = await Tour.findOneAndUpdate(
        { title: patch.title },
        {
          $set: {
            description: patch.description,
            costFrom: patch.costFrom,
            images: patch.images,
            ...(patch.location ? { location: patch.location } : {}),
          },
        },
        { new: true }
      );

      if (!result) {
        console.log(`Missing tour: ${patch.title}`);
        missing++;
        continue;
      }

      console.log(
        `Updated: ${patch.title} | ৳${patch.costFrom} | images=${patch.images.length}`
      );
      updated++;
    }

    console.log(`\nDone. Updated=${updated}, Missing=${missing}`);
  } catch (error) {
    console.error("Update failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
    process.exit();
  }
};

updateTourContent();
