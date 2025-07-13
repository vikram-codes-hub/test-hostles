import hostel1_1 from './hostel1_1.avif'
import hostel1_2 from './hostel1_2.avif'
import hostel1_3 from './hostel1_3.avif'
import hostel1_4 from './hostel1_4.avif'
import hostel2 from './hostel2.webp'
import hostel3 from './hostel3.webp'
import hostel4 from './hostel4.jpg'
import hostel5 from './hostel5.avif'
import hostel6 from './hostel6.avif'
import hostel7 from './hostel7.avif'

import search_icon from './search_icon.png'
import cross_icon from './cross_icon.png'
import logo from './Logo.jpg'

export const assets = {
  search_icon, cross_icon,logo
}

const hostels = [
  {
    id: '64f08a3ecf3cba001ed2b687',
    name: "Elegance Hostel",
    image: [hostel1_1, hostel1_2, hostel1_3, hostel1_4],
    phone: "9876543210",
    email: "elegance@gmail.com",
    address: "Near MUJ Gate No. 2",
    price: 180000,
    category: "Girls",
    listedDate: "2023-05-15",
    owner: "Mrs. Sharma",
    description: "Premium girls hostel located just 200 meters from MUJ Gate No. 2. Offers AC rooms, hygienic food, and 24/7 security. Perfect for students looking for a safe and comfortable stay close to campus."
  },
  {
    id: '64f08a3ecf3cba001ed2b682',
    name: "Apna Ghar",
    image: [hostel2],
    phone: "9876543221",
    email: "apnaghar@gmail.com",
    address: "Opp. Metro Station",
    price: 165000,
    category: "Boys",
    listedDate: "2023-06-20",
    owner: "Mr. Singh",
    description: "Affordable boys hostel located 1.2 km from MUJ main gate. Features spacious rooms, common study area, and regular cleaning services. Just a 5-minute walk from the metro station for easy connectivity."
  },
  {
    id: '64f08a3ecf3cba001ed2b6811',
    name: "Nirvana Hostel",
    image: [hostel3],
    phone: "9876543222",
    email: "nirvana@gmail.com",
    address: "Opp. Metro Station",
    price: 150000,
    category: "Boys",
    listedDate: "2023-04-10",
    owner: "Mr. Gupta",
    description: "Budget-friendly hostel for boys situated 1.5 km from MUJ. Offers basic amenities with a peaceful environment conducive to studies. Nearby market area for all daily needs."
  },
  {
    id: '64f08a3ecf3cba001ed2b6898',
    name: "GHS Hostel",
    image: [hostel4],
    phone: "9876543223",
    email: "ghs@gmail.com",
    address: "Opp. Metro Station",
    price: 170000,
    category: "Boys",
    listedDate: "2023-07-05",
    owner: "Mr. Patel",
    description: "Modern boys hostel located 1 km from MUJ campus. Features high-speed WiFi, laundry services, and a gym. The metro station opposite makes commuting to other parts of the city convenient."
  },
  {
    id: '64f08a3ecf3cba001ed2b6876',
    name: "Nirvana Girls",
    image: [hostel5],
    phone: "9876543224",
    email: "nirvanagirls@gmail.com",
    address: "Opp. Metro Station",
    price: 190000,
    category: "Girls",
    listedDate: "2023-03-18",
    owner: "Mrs. Kapoor",
    description: "Exclusive girls hostel just 800 meters from MUJ back gate. Provides AC rooms, CCTV surveillance, and nutritious meals. Strict security protocols ensure complete safety for residents."
  },
  {
    id: '64f08a3ecf3cba001ed2b6830',
    name: "Tejasvi Hostel",
    image: [hostel6],
    phone: "9876543225",
    email: "tejasvi@gmail.com",
    address: "Opp. Metro Station",
    price: 200000,
    category: "Girls",
    listedDate: "2023-08-12",
    owner: "Mrs. Reddy",
    description: "Luxury girls hostel located 1.3 km from MUJ main entrance. Offers premium amenities including a library, indoor games room, and monthly housekeeping. Close to shopping complex for convenience."
  },
  {
    id: '64f08a3ecf3cba001ed2b6801',
    name: "Stockers Hostel",
    image: [hostel7],
    phone: "9876543226",
    email: "stockers@gmail.com",
    address: "Opp. Metro Station",
    price: 175000,
    category: "Boys",
    listedDate: "2023-09-01",
    owner: "Mr. Malhotra",
    description: "Well-maintained boys hostel situated 900 meters from MUJ. Features spacious common areas, 24/7 water supply, and power backup. Walking distance to both campus and local market."
  }
];

export default hostels;