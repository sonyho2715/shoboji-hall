import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ---- Membership Tiers ----
  const tiers = await Promise.all([
    prisma.membershipTier.upsert({
      where: { tierName: 'Member' },
      update: {},
      create: {
        tierName: 'Member',
        description: 'Active Shoboji member',
        hallBaseRate: 600,
        hallHourlyRate: 50,
        eventSupportBase: 200,
        eventSupportHourly: 35,
        securityDeposit: 100,
      },
    }),
    prisma.membershipTier.upsert({
      where: { tierName: 'Non-Member' },
      update: {},
      create: {
        tierName: 'Non-Member',
        description: 'General public, non-member',
        hallBaseRate: 800,
        hallHourlyRate: 100,
        eventSupportBase: 200,
        eventSupportHourly: 35,
        securityDeposit: 500,
      },
    }),
    prisma.membershipTier.upsert({
      where: { tierName: 'Tenant Member' },
      update: {},
      create: {
        tierName: 'Tenant Member',
        description: 'Tenant organization with active membership',
        hallBaseRate: 500,
        hallHourlyRate: 50,
        eventSupportBase: 120,
        eventSupportHourly: 35,
        securityDeposit: 0,
      },
    }),
    prisma.membershipTier.upsert({
      where: { tierName: 'Tenant Non-Member' },
      update: {},
      create: {
        tierName: 'Tenant Non-Member',
        description: 'Tenant organization without membership',
        hallBaseRate: 700,
        hallHourlyRate: 75,
        eventSupportBase: 200,
        eventSupportHourly: 35,
        securityDeposit: 150,
      },
    }),
    prisma.membershipTier.upsert({
      where: { tierName: 'Tenant 501c3' },
      update: {},
      create: {
        tierName: 'Tenant 501c3',
        description: 'Tenant 501(c)(3) nonprofit organization',
        hallBaseRate: 625,
        hallHourlyRate: 75,
        eventSupportBase: 200,
        eventSupportHourly: 35,
        securityDeposit: 125,
      },
    }),
    prisma.membershipTier.upsert({
      where: { tierName: 'Community Outreach' },
      update: {},
      create: {
        tierName: 'Community Outreach',
        description: 'Community outreach and charitable events',
        hallBaseRate: 300,
        hallHourlyRate: 75,
        eventSupportBase: 200,
        eventSupportHourly: 35,
        securityDeposit: 125,
      },
    }),
  ]);
  console.log(`  Created ${tiers.length} membership tiers`);

  // ---- Funeral Package Tiers ----
  await prisma.funeralPackageTier.deleteMany();
  const funeralTiers = await prisma.funeralPackageTier.createMany({
    data: [
      { tierName: 'Member', attendeeRange: 'up_to_50', minAttendees: 1, maxAttendees: 50, rate: 150, securityDeposit: 0 },
      { tierName: 'Member', attendeeRange: '51_to_100', minAttendees: 51, maxAttendees: 100, rate: 300, securityDeposit: 0 },
      { tierName: 'Member', attendeeRange: '101_to_200', minAttendees: 101, maxAttendees: 200, rate: 400, securityDeposit: 0 },
      { tierName: 'Non-Member', attendeeRange: 'up_to_50', minAttendees: 1, maxAttendees: 50, rate: 350, securityDeposit: 500 },
      { tierName: 'Non-Member', attendeeRange: '51_to_100', minAttendees: 51, maxAttendees: 100, rate: 600, securityDeposit: 500 },
      { tierName: 'Non-Member', attendeeRange: '101_to_200', minAttendees: 101, maxAttendees: 200, rate: 800, securityDeposit: 500 },
    ],
  });
  console.log(`  Created ${funeralTiers.count} funeral package tiers`);

  // ---- Staffing Rules ----
  await prisma.staffingRule.deleteMany();
  const staffingRules = await prisma.staffingRule.createMany({
    data: [
      { minAttendees: 1, maxAttendees: 50, requiredStaff: 1 },
      { minAttendees: 51, maxAttendees: 150, requiredStaff: 2 },
      { minAttendees: 151, maxAttendees: 250, requiredStaff: 3 },
      { minAttendees: 251, maxAttendees: 350, requiredStaff: 4 },
      { minAttendees: 351, maxAttendees: 450, requiredStaff: 5 },
      { minAttendees: 451, maxAttendees: null, requiredStaff: 6 },
    ],
  });
  console.log(`  Created ${staffingRules.count} staffing rules`);

  // ---- Equipment Categories + Items (Official Rate Sheet) ----
  await prisma.bookingEquipment.deleteMany();
  await prisma.equipmentItem.deleteMany();
  await prisma.equipmentCategory.deleteMany();

  const categories = [
    {
      name: 'Tables & Chairs',
      sortOrder: 1,
      items: [
        { name: 'Table, 8 ft', description: '8-foot rectangular folding table', ratePerEvent: 5.00, quantityAvailable: 20, sortOrder: 1 },
        { name: 'Table, 6 ft', description: '6-foot rectangular folding table', ratePerEvent: 5.00, quantityAvailable: 20, sortOrder: 2 },
        { name: 'Chair', description: 'Folding banquet chair', ratePerEvent: 2.00, quantityAvailable: 200, sortOrder: 3 },
      ],
    },
    {
      name: 'Stands',
      sortOrder: 2,
      items: [
        { name: 'Stand', description: 'General purpose stand', ratePerEvent: 15.00, quantityAvailable: 10, sortOrder: 1 },
        { name: 'Stand, Microphone', description: 'Adjustable microphone stand', ratePerEvent: 25.00, quantityAvailable: 10, sortOrder: 2 },
        { name: 'Stand, Tripod', description: 'Tripod stand for lighting or equipment', ratePerEvent: 20.00, quantityAvailable: 5, sortOrder: 3 },
      ],
    },
    {
      name: 'Stage',
      sortOrder: 3,
      items: [
        { name: 'Stage Platform', description: 'Modular stage platform', ratePerEvent: 100.00, quantityAvailable: 4, sortOrder: 1 },
      ],
    },
    {
      name: 'Lighting',
      sortOrder: 4,
      items: [
        { name: 'Lights, Strobe 3"', description: '3" strobe light', ratePerEvent: 35.00, quantityAvailable: 4, sortOrder: 1 },
        { name: 'Lights, Laser 6"', description: '6" laser light', ratePerEvent: 35.00, quantityAvailable: 4, sortOrder: 2 },
        { name: 'Lights, Disco Ball 6"', description: '6" disco ball light', ratePerEvent: 35.00, quantityAvailable: 4, sortOrder: 3 },
        { name: 'Lights, Flashing Par 25', description: 'Par 25 flashing stage light', ratePerEvent: 35.00, quantityAvailable: 8, sortOrder: 4 },
      ],
    },
    {
      name: 'Power & Cables',
      sortOrder: 5,
      items: [
        { name: 'Power Distribution Strip', description: 'Power distribution strip', ratePerEvent: 10.00, quantityAvailable: 5, sortOrder: 1 },
        { name: 'Power Cord, Light', description: 'Power cord for lighting', ratePerEvent: 2.00, quantityAvailable: 20, sortOrder: 2 },
        { name: 'Power Cord, Speaker', description: 'Power cord for speakers', ratePerEvent: 2.00, quantityAvailable: 20, sortOrder: 3 },
        { name: 'Power Cord, Live Audio', description: 'Live audio power cord', ratePerEvent: 2.00, quantityAvailable: 20, sortOrder: 4 },
        { name: 'Power Strip, Multi-Outlet Surge Protect', description: 'Surge-protected multi-outlet power strip', ratePerEvent: 5.00, quantityAvailable: 10, sortOrder: 5 },
      ],
    },
    {
      name: 'Speakers & Monitors',
      sortOrder: 6,
      items: [
        { name: 'Monitor, JBL 15"', description: 'JBL 15" stage monitor', ratePerEvent: 50.00, quantityAvailable: 4, sortOrder: 1 },
        { name: 'Speaker, Wedge 15"', description: '15" wedge speaker', ratePerEvent: 50.00, quantityAvailable: 4, sortOrder: 2 },
        { name: 'Subwoofer 15"', description: '15" subwoofer', ratePerEvent: 50.00, quantityAvailable: 2, sortOrder: 3 },
        { name: 'Subwoofer 18"', description: '18" subwoofer', ratePerEvent: 75.00, quantityAvailable: 2, sortOrder: 4 },
        { name: 'Maui LD, Column Array', description: 'Maui LD column array speaker system', ratePerEvent: 125.00, quantityAvailable: 2, sortOrder: 5 },
      ],
    },
    {
      name: 'Amplifiers',
      sortOrder: 7,
      items: [
        { name: 'Amplifier, Crown', description: 'Crown power amplifier', ratePerEvent: 75.00, quantityAvailable: 2, sortOrder: 1 },
      ],
    },
    {
      name: 'Control Boards',
      sortOrder: 8,
      items: [
        { name: 'Control Board, Small', description: 'Small mixing console', ratePerEvent: 75.00, quantityAvailable: 1, sortOrder: 1 },
        { name: 'Control Board, Large', description: 'Large mixing console', ratePerEvent: 125.00, quantityAvailable: 1, sortOrder: 2 },
      ],
    },
    {
      name: 'Microphones',
      sortOrder: 9,
      items: [
        { name: 'Microphone, Wireless (Shure)', description: 'Shure wireless handheld microphone', ratePerEvent: 50.00, quantityAvailable: 4, sortOrder: 1 },
        { name: 'Microphone Receiver, Wireless (Shure)', description: 'Shure wireless receiver unit', ratePerEvent: 10.00, quantityAvailable: 4, sortOrder: 2 },
        { name: 'Microphone, Lavalier (Shure)', description: 'Shure lavalier/clip-on microphone', ratePerEvent: 25.00, quantityAvailable: 4, sortOrder: 3 },
        { name: 'Microphone, Cardioid (Shure)', description: 'Shure cardioid vocal microphone', ratePerEvent: 25.00, quantityAvailable: 4, sortOrder: 4 },
        { name: 'Microphone, Instrument (Shure SM57)', description: 'Shure SM57 instrument microphone', ratePerEvent: 25.00, quantityAvailable: 4, sortOrder: 5 },
        { name: 'Microphone, Condenser (Shure)', description: 'Shure condenser microphone', ratePerEvent: 25.00, quantityAvailable: 2, sortOrder: 6 },
        { name: 'Microphone, Dynamic (Shure SM58)', description: 'Shure SM58 dynamic vocal microphone', ratePerEvent: 25.00, quantityAvailable: 4, sortOrder: 7 },
      ],
    },
    {
      name: 'Specialty',
      sortOrder: 10,
      items: [
        { name: 'Specialty, Fog Machine', description: 'Fog/haze machine for atmosphere', ratePerEvent: 25.00, quantityAvailable: 1, sortOrder: 1 },
        { name: 'Specialty, Snow Machine', description: 'Snow effect machine', ratePerEvent: 25.00, quantityAvailable: 1, sortOrder: 2 },
        { name: 'Tape, Gaffers 150 ft', description: '150ft roll of gaffer tape', ratePerEvent: 125.00, quantityAvailable: 5, sortOrder: 3 },
      ],
    },
    {
      name: 'Adapters',
      sortOrder: 11,
      items: [
        { name: 'Adapter, AUX to Lighting', description: 'AUX cable to lighting adapter', ratePerEvent: 2.00, quantityAvailable: 10, sortOrder: 1 },
        { name: 'Adapter, AUX to USB-C', description: 'AUX cable to USB-C adapter', ratePerEvent: 2.00, quantityAvailable: 10, sortOrder: 2 },
        { name: 'Adapter, AUX to AUX', description: 'AUX to AUX cable adapter', ratePerEvent: 2.00, quantityAvailable: 10, sortOrder: 3 },
        { name: 'Adapter, AUX to 1/4"', description: 'AUX cable to 1/4" adapter', ratePerEvent: 2.00, quantityAvailable: 10, sortOrder: 4 },
      ],
    },
  ];

  for (const cat of categories) {
    const category = await prisma.equipmentCategory.create({
      data: {
        name: cat.name,
        sortOrder: cat.sortOrder,
      },
    });

    await prisma.equipmentItem.createMany({
      data: cat.items.map((item) => ({
        categoryId: category.id,
        name: item.name,
        description: item.description,
        ratePerEvent: item.ratePerEvent,
        quantityAvailable: item.quantityAvailable,
        sortOrder: item.sortOrder,
      })),
    });
  }
  console.log(`  Created ${categories.length} equipment categories with items`);

  // ---- Service Rates ----
  await prisma.bookingService.deleteMany();
  await prisma.serviceRate.deleteMany();
  const serviceRates = await prisma.serviceRate.createMany({
    data: [
      { roleName: 'Sound Engineer (Small)', ratePerHour: 50, rateType: 'hourly', minHours: 2, notes: 'Events under 100 attendees' },
      { roleName: 'Sound Engineer (Medium)', ratePerHour: 100, rateType: 'hourly', minHours: 2, notes: 'Events 100-250 attendees' },
      { roleName: 'Sound Engineer (Large)', ratePerHour: 200, rateType: 'hourly', minHours: 2, notes: 'Events over 250 attendees' },
      { roleName: 'Sound Tech', ratePerHour: 75, rateType: 'hourly', minHours: 2, notes: 'Setup and teardown support' },
      { roleName: 'Cleanup Supervisor', ratePerHour: 50, rateType: 'hourly', minHours: 2, notes: 'Post-event cleanup coordination' },
      { roleName: 'Salesperson', ratePerHour: null, rateType: 'commission', commissionPct: 10, minHours: 0, notes: '10% commission on hall rental' },
      { roleName: 'Property Manager Rep', ratePerHour: null, rateType: 'flat', minHours: 0, notes: 'Included with hall rental' },
      { roleName: 'Parking Attendant', ratePerHour: 50, rateType: 'hourly', minHours: 2, notes: 'Parking lot traffic management' },
      { roleName: 'Security Detail/HPD', ratePerHour: 300, rateType: 'hourly', minHours: 2, notes: 'Required when alcohol is served' },
      { roleName: 'Custodial/Maintenance', ratePerHour: null, rateType: 'flat', minHours: 0, notes: 'Included with hall rental' },
      { roleName: 'Kitchen Support', ratePerHour: 50, rateType: 'hourly', minHours: 2, notes: 'Kitchen assistance for catering events' },
      { roleName: 'IT Support (Visual)', ratePerHour: 100, rateType: 'hourly', minHours: 2, notes: 'Projector, display, streaming setup' },
      { roleName: 'Stage Construction', ratePerHour: null, rateType: 'flat', minHours: 0, notes: 'Flat rate $400 for stage build and strike' },
    ],
  });
  console.log(`  Created ${serviceRates.count} service rates`);

  // ---- App Settings ----
  const settings = [
    { settingKey: 'operating_hours_start', settingValue: '08:00', description: 'Earliest allowed event start time' },
    { settingKey: 'operating_hours_end', settingValue: '22:00', description: 'Latest allowed event end time' },
    { settingKey: 'base_hours_included', settingValue: '4', description: 'Number of hours included in base rate' },
    { settingKey: 'booking_number_prefix', settingValue: 'SH', description: 'Prefix for booking numbers' },
    { settingKey: 'annual_membership_fee', settingValue: '150', description: 'Annual membership fee in dollars' },
    { settingKey: 'alcohol_requires_police', settingValue: 'true', description: 'Whether alcohol events require HPD detail' },
  ];

  for (const setting of settings) {
    await prisma.appSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: { settingValue: setting.settingValue, description: setting.description },
      create: setting,
    });
  }
  console.log(`  Created ${settings.length} app settings`);

  // ---- Admin User ----
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_PASSWORD environment variable is required in production');
    }
    console.warn('ADMIN_PASSWORD not set. Using insecure default for development only.');
  }
  const passwordToHash = adminPassword || 'dev-only-change-me';
  const adminPasswordHash = await bcrypt.hash(passwordToHash, 12);
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@shoboji.org' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@shoboji.org',
      passwordHash: adminPasswordHash,
      name: 'Site Administrator',
    },
  });
  console.log(`  Admin user ready: ${adminUser.email}`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
