export type Division = 'ঢাকা' | 'চট্টগ্রাম' | 'রাজশাহী' | 'খুলনা' | 'বরিশাল' | 'সিলেট' | 'রংপুর' | 'ময়মনসিংহ';
export type FuelStatus = 'তেল পাওয়া যাচ্ছে' | 'সীমিত তেল' | 'তেল নেই';
export type QueueStatus = 'ছোট লাইন' | 'মাঝারি লাইন' | 'খুব লম্বা লাইন';

export interface Pump {
  id: string;
  name: string;
  district: string;
  division: Division;
  lat: number;
  lng: number;
  fuelType: string;
  fuelStatus: FuelStatus;
  queueStatus: QueueStatus;
  quote: string;
}

const divisions: { name: Division; lat: number; lng: number }[] = [
  { name: 'ঢাকা', lat: 23.8103, lng: 90.4125 },
  { name: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832 },
  { name: 'রাজশাহী', lat: 24.3745, lng: 88.6042 },
  { name: 'খুলনা', lat: 22.8456, lng: 89.5403 },
  { name: 'বরিশাল', lat: 22.7010, lng: 90.3535 },
  { name: 'সিলেট', lat: 24.8949, lng: 91.8687 },
  { name: 'রংপুর', lat: 25.7439, lng: 89.2752 },
  { name: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203 },
];

const pumpNames = [
  'Jamuna Filling Station',
  'Padma Oil Company',
  'Meghna Petroleum',
  'Trust Filling Station',
  'Metro Filling Station',
  'City Filling Station',
  'Highway Filling Station',
  'Sonalika Filling Station',
];

const fuelStatuses: FuelStatus[] = ['তেল পাওয়া যাচ্ছে', 'সীমিত তেল', 'তেল নেই'];
const queueStatuses: QueueStatus[] = ['ছোট লাইন', 'মাঝারি লাইন', 'খুব লম্বা লাইন'];

const quotes = [
  'তেল নিয়ে তারাতারি বিদায় হন',
  'লাইন দেখে মনে হচ্ছে ঈদের ট্রেন ধরতে এসেছি',
  'তেল থাকলে আজ জীবন সুন্দর',
  'আজকে তেল পাওয়া মানে ভাগ্য ভালো',
  'তেল শেষ, আশা শেষ।',
];

export const generatePumps = (count: number = 200): Pump[] => {
  const pumps: Pump[] = [];
  for (let i = 0; i < count; i++) {
    const division = divisions[Math.floor(Math.random() * divisions.length)];
    const latOffset = (Math.random() - 0.5) * 1.5;
    const lngOffset = (Math.random() - 0.5) * 1.5;

    // Make 'খুব লম্বা লাইন' more frequent
    const queueRandom = Math.random();
    let queueStatus: QueueStatus = 'খুব লম্বা লাইন';
    if (queueRandom < 0.1) queueStatus = 'ছোট লাইন';
    else if (queueRandom < 0.3) queueStatus = 'মাঝারি লাইন';

    pumps.push({
      id: `pump-${i}`,
      name: pumpNames[Math.floor(Math.random() * pumpNames.length)],
      district: `${division.name} জেলা`, // Simplified district
      division: division.name,
      lat: division.lat + latOffset,
      lng: division.lng + lngOffset,
      fuelType: Math.random() > 0.5 ? 'পেট্রোল' : 'ডিজেল',
      fuelStatus: fuelStatuses[Math.floor(Math.random() * fuelStatuses.length)],
      queueStatus,
      quote: quotes[Math.floor(Math.random() * quotes.length)],
    });
  }
  return pumps;
};

export const pumpsData = generatePumps(250);
