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
        description: 'Active Shoboji temple member',
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

  // ---- Equipment Categories + Items ----
  await prisma.bookingEquipment.deleteMany();
  await prisma.equipmentItem.deleteMany();
  await prisma.equipmentCategory.deleteMany();

  const categories = [
    {
      name: 'Table',
      sortOrder: 1,
      items: [
        { name: '6ft Rectangular Table', description: 'Standard 6-foot folding table, seats 6-8', ratePerEvent: 10, quantityAvailable: 30, sortOrder: 1 },
        { name: '8ft Rectangular Table', description: 'Large 8-foot folding table, seats 8-10', ratePerEvent: 15, quantityAvailable: 20, sortOrder: 2 },
        { name: '5ft Round Table', description: '60-inch round banquet table, seats 8-10', ratePerEvent: 15, quantityAvailable: 25, sortOrder: 3 },
        { name: 'Cocktail High-Top Table', description: '30-inch round cocktail table, standing height', ratePerEvent: 20, quantityAvailable: 10, sortOrder: 4 },
        { name: 'Head Table (Skirted)', description: '8ft table with linen skirting for head table', ratePerEvent: 35, quantityAvailable: 4, sortOrder: 5 },
      ],
    },
    {
      name: 'Chair',
      sortOrder: 2,
      items: [
        { name: 'Standard Folding Chair', description: 'Metal folding chair with padded seat', ratePerEvent: 2, quantityAvailable: 300, sortOrder: 1 },
        { name: 'Padded Banquet Chair', description: 'Upholstered stacking banquet chair', ratePerEvent: 5, quantityAvailable: 200, sortOrder: 2 },
        { name: 'White Resin Chair', description: 'White resin folding chair for ceremonies', ratePerEvent: 4, quantityAvailable: 150, sortOrder: 3 },
      ],
    },
    {
      name: 'Stand',
      sortOrder: 3,
      items: [
        { name: 'Music Stand', description: 'Adjustable music stand', ratePerEvent: 10, quantityAvailable: 6, sortOrder: 1 },
        { name: 'Speaker Stand (Tripod)', description: 'Heavy-duty tripod speaker stand', ratePerEvent: 15, quantityAvailable: 8, sortOrder: 2 },
        { name: 'Microphone Boom Stand', description: 'Adjustable boom microphone stand', ratePerEvent: 10, quantityAvailable: 10, sortOrder: 3 },
        { name: 'Lighting Stand', description: 'Heavy-duty lighting tripod stand', ratePerEvent: 15, quantityAvailable: 6, sortOrder: 4 },
      ],
    },
    {
      name: 'Stage',
      sortOrder: 4,
      items: [
        { name: 'Stage Platform (4x8)', description: '4x8 ft modular stage section, 16-24 inch height', ratePerEvent: 50, quantityAvailable: 8, sortOrder: 1 },
        { name: 'Stage Stairs (3-step)', description: 'Portable 3-step stage stairs with handrail', ratePerEvent: 25, quantityAvailable: 4, sortOrder: 2 },
        { name: 'Stage Skirting (per section)', description: 'Black fabric skirting per stage section', ratePerEvent: 15, quantityAvailable: 8, sortOrder: 3 },
        { name: 'Portable Dance Floor (4x4)', description: '4x4 ft interlocking dance floor panels', ratePerEvent: 20, quantityAvailable: 16, sortOrder: 4 },
      ],
    },
    {
      name: 'Lighting',
      sortOrder: 5,
      items: [
        { name: 'PAR Can LED (RGBA)', description: 'LED wash light, RGBA color mixing', ratePerEvent: 25, quantityAvailable: 12, sortOrder: 1 },
        { name: 'Moving Head Spot', description: 'Moving head spotlight for stage shows', ratePerEvent: 75, quantityAvailable: 4, sortOrder: 2 },
        { name: 'String Lights (50ft)', description: '50ft strand of warm white bistro lights', ratePerEvent: 20, quantityAvailable: 10, sortOrder: 3 },
        { name: 'Uplighting Package (8 units)', description: '8 wireless LED uplights for ambient lighting', ratePerEvent: 100, quantityAvailable: 2, sortOrder: 4 },
        { name: 'Follow Spot', description: 'Manual follow spotlight for performances', ratePerEvent: 50, quantityAvailable: 2, sortOrder: 5 },
      ],
    },
    {
      name: 'Power',
      sortOrder: 6,
      items: [
        { name: 'Power Distribution Box', description: 'Multi-outlet power distribution unit', ratePerEvent: 25, quantityAvailable: 4, sortOrder: 1 },
        { name: 'Extension Cord (50ft)', description: '50ft heavy-duty extension cord, 12-gauge', ratePerEvent: 5, quantityAvailable: 20, sortOrder: 2 },
        { name: 'Power Strip (6-outlet)', description: 'Surge-protected power strip', ratePerEvent: 5, quantityAvailable: 15, sortOrder: 3 },
        { name: 'Portable Generator', description: 'Quiet portable generator for outdoor use', ratePerEvent: 150, quantityAvailable: 1, sortOrder: 4 },
      ],
    },
    {
      name: 'Speaker/Monitor/Subwoofer',
      sortOrder: 7,
      items: [
        { name: 'Powered Speaker (12")', description: '12-inch powered PA speaker, 1000W', ratePerEvent: 50, quantityAvailable: 6, sortOrder: 1 },
        { name: 'Powered Speaker (15")', description: '15-inch powered PA speaker, 1500W', ratePerEvent: 75, quantityAvailable: 4, sortOrder: 2 },
        { name: 'Powered Subwoofer (18")', description: '18-inch powered subwoofer, 2000W', ratePerEvent: 100, quantityAvailable: 4, sortOrder: 3 },
        { name: 'Stage Monitor (12")', description: '12-inch wedge stage monitor', ratePerEvent: 35, quantityAvailable: 6, sortOrder: 4 },
        { name: 'Small Bluetooth Speaker', description: 'Portable Bluetooth speaker for background music', ratePerEvent: 15, quantityAvailable: 4, sortOrder: 5 },
      ],
    },
    {
      name: 'Amplifier',
      sortOrder: 8,
      items: [
        { name: 'Power Amplifier (2-ch)', description: '2-channel power amplifier, 500W per channel', ratePerEvent: 50, quantityAvailable: 4, sortOrder: 1 },
        { name: 'Power Amplifier (4-ch)', description: '4-channel power amplifier, 300W per channel', ratePerEvent: 75, quantityAvailable: 2, sortOrder: 2 },
        { name: 'Monitor Amplifier', description: 'Dedicated monitor mix amplifier', ratePerEvent: 40, quantityAvailable: 2, sortOrder: 3 },
      ],
    },
    {
      name: 'Microphone',
      sortOrder: 9,
      items: [
        { name: 'Wireless Handheld Mic', description: 'UHF wireless handheld microphone system', ratePerEvent: 35, quantityAvailable: 8, sortOrder: 1 },
        { name: 'Wireless Lavalier Mic', description: 'UHF wireless lapel/lavalier microphone', ratePerEvent: 40, quantityAvailable: 4, sortOrder: 2 },
        { name: 'Wireless Headset Mic', description: 'UHF wireless headset microphone', ratePerEvent: 40, quantityAvailable: 4, sortOrder: 3 },
        { name: 'Wired Dynamic Mic (SM58)', description: 'Shure SM58 wired dynamic vocal mic', ratePerEvent: 15, quantityAvailable: 10, sortOrder: 4 },
        { name: 'Condenser Mic (instrument)', description: 'Small-diaphragm condenser for instruments', ratePerEvent: 20, quantityAvailable: 6, sortOrder: 5 },
      ],
    },
    {
      name: 'Control Board',
      sortOrder: 10,
      items: [
        { name: 'Digital Mixer (16-ch)', description: '16-channel digital mixing console', ratePerEvent: 75, quantityAvailable: 2, sortOrder: 1 },
        { name: 'Digital Mixer (32-ch)', description: '32-channel digital mixing console', ratePerEvent: 150, quantityAvailable: 1, sortOrder: 2 },
        { name: 'Analog Mixer (12-ch)', description: '12-channel analog mixer for small events', ratePerEvent: 35, quantityAvailable: 2, sortOrder: 3 },
        { name: 'Lighting Controller (DMX)', description: 'DMX lighting controller console', ratePerEvent: 50, quantityAvailable: 2, sortOrder: 4 },
      ],
    },
    {
      name: 'Specialty',
      sortOrder: 11,
      items: [
        { name: 'Projector (HD)', description: 'HD projector, 5000 lumens', ratePerEvent: 75, quantityAvailable: 2, sortOrder: 1 },
        { name: 'Projector Screen (10ft)', description: '10-foot portable projection screen', ratePerEvent: 35, quantityAvailable: 2, sortOrder: 2 },
        { name: 'LCD Monitor (55")', description: '55-inch LCD display on rolling stand', ratePerEvent: 50, quantityAvailable: 2, sortOrder: 3 },
        { name: 'Fog Machine', description: 'Professional fog/haze machine', ratePerEvent: 40, quantityAvailable: 2, sortOrder: 4 },
        { name: 'Photo Backdrop Frame', description: 'Adjustable backdrop frame with white drape', ratePerEvent: 30, quantityAvailable: 3, sortOrder: 5 },
      ],
    },
    {
      name: 'Adapter',
      sortOrder: 12,
      items: [
        { name: 'DI Box (Active)', description: 'Active direct injection box for instruments', ratePerEvent: 10, quantityAvailable: 8, sortOrder: 1 },
        { name: 'HDMI to VGA Adapter', description: 'HDMI to VGA converter', ratePerEvent: 5, quantityAvailable: 4, sortOrder: 2 },
        { name: 'USB-C Hub', description: 'Multi-port USB-C hub (HDMI, USB-A, SD)', ratePerEvent: 10, quantityAvailable: 4, sortOrder: 3 },
        { name: 'XLR Cable (25ft)', description: '25ft balanced XLR cable', ratePerEvent: 3, quantityAvailable: 20, sortOrder: 4 },
        { name: 'Snake Cable (16-ch, 100ft)', description: '16-channel audio snake, 100ft', ratePerEvent: 40, quantityAvailable: 2, sortOrder: 5 },
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
    { settingKey: 'annual_membership_fee', settingValue: '150', description: 'Annual temple membership fee in dollars' },
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
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@shoboji.org' },
    update: {},
    create: {
      email: 'admin@shoboji.org',
      passwordHash: await bcrypt.hash(adminPassword, 12),
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
