const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for KING BARBAR SHOP...');

  // 1. Clean existing records in correct relation order
  await prisma.booking.deleteMany({});
  await prisma.blockedDate.deleteMany({});
  await prisma.timeSlot.deleteMany({});
  await prisma.hairstyle.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Hash default passwords
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const userPassword = await bcrypt.hash('User@123456', 10);

  // 3. Create Admin & Sample Customers
  const adminUser = await prisma.user.create({
    data: {
      name: 'Ajai Raja (Admin)',
      email: 'ajairaja2004@gmail.com',
      phone: '+91 98765 43210',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Vikram Malhotra',
      email: 'vikram@example.com',
      phone: '+91 98765 12345',
      password: userPassword,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98123 45678',
      password: userPassword,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Karan Patel',
      email: 'karan@example.com',
      phone: '+91 98234 56789',
      password: userPassword,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('✅ Users seeded successfully (Admin: ajairaja2004@gmail.com)');

  // 4. Seed Services
  const servicesData = [
    {
      name: 'Classic Haircut',
      category: 'Haircut',
      description: 'Traditional scissor and clipper haircut tailored to your face structure with hot lather neck shave and towel finish.',
      price: 250,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Premium Haircut & Styling',
      category: 'Haircut',
      description: 'Signature consultation, bespoke precision haircut, refreshing hair wash, blow-dry styling with matte clay.',
      price: 350,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Skin Fade & Taper Special',
      category: 'Haircut',
      description: 'Ultra-smooth low, mid, or high skin fade with sharp temple taper, foil finishing, and textured top finish.',
      price: 399,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Royal Beard Trim & Sculpt',
      category: 'Beard',
      description: 'Precision beard sculpting, straight razor line definition, hot towel aromatherapy, and organic beard oil treatment.',
      price: 180,
      duration: 25,
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Hair + Beard King\'s Combo',
      category: 'Combos',
      description: 'Complete grooming transformation: Signature haircut, beard sculpt, razor edge lineup, and invigorating face wash.',
      price: 480,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Luxury Hair Spa & Scalp Therapy',
      category: 'Spa & Care',
      description: 'Deep cleansing scalp detox, deep hydration steam, keratin infused nourishment mask, and tension relief massage.',
      price: 600,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Royal Scalp & Head Massage',
      category: 'Spa & Care',
      description: '30-minute stress-relief acupressure scalp and shoulder massage using cooling ayurvedic herbal oils.',
      price: 300,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Activated Charcoal Facial Cleanse',
      category: 'Spa & Care',
      description: 'Blackhead extraction, purifying charcoal scrub, steam therapy, cooling clay mask, and hydrating moisturizer.',
      price: 450,
      duration: 35,
      image: 'https://images.unsplash.com/photo-1512290900672-1f02e604f769?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Young Prince Kids Haircut',
      category: 'Haircut',
      description: 'Gentle, patient, and trendy haircut for boys under 12 with candy treat and refreshing spray finish.',
      price: 220,
      duration: 25,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'The Emperor VIP Grooming Package',
      category: 'Combos',
      description: 'The ultimate royal experience: Haircut, Beard Styling, Hair Spa, Charcoal Facial, Scalp Massage & Premium Espresso.',
      price: 999,
      duration: 90,
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
  ];

  const createdServices = [];
  for (const s of servicesData) {
    const service = await prisma.service.create({ data: s });
    createdServices.push(service);
  }
  console.log(`✅ Seeded ${createdServices.length} services.`);

  // 5. Seed Hairstyles Lookbook
  const hairstylesData = [
    {
      name: 'Low Drop Skin Fade',
      category: 'Fade',
      description: 'Seamless low fade dropping naturally behind the ear, paired with a textured crop on top.',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[2].id,
    },
    {
      name: 'Executive Textured Undercut',
      category: 'Undercut',
      description: 'Clean disconnected undercut with voluminous matte pompadour for a striking corporate gentleman look.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[1].id,
    },
    {
      name: 'Classic Side Part Pompadour',
      category: 'Classic',
      description: 'Timeless 1950s heritage silhouette with clean razor-part line and tapered clean neckline.',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[0].id,
    },
    {
      name: 'Modern Textured French Crop',
      category: 'Trending',
      description: 'Blunt micro fringe with heavy choppy texturizing, perfect for low-maintenance effortless everyday swagger.',
      image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[1].id,
    },
    {
      name: 'Royal Sculpted Beard & Fade',
      category: 'Beard Styles',
      description: 'Razor-sharp curved cheek lines, crisp neckline contour, and seamless blend into sideburns.',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[3].id,
    },
    {
      name: 'Mid Taper Flow with Waves',
      category: 'Trending',
      description: 'Mid taper around temples and nape leaving natural flow and texture through the crown and back.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[1].id,
    },
    {
      name: 'King\'s Luxury Signature Style',
      category: 'Premium Styles',
      description: 'The pinnacle of barbershop craftsmanship: Flawless high taper fade with full-sculpted beard integration.',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[4].id,
    },
    {
      name: 'Slick Back Undercut Fade',
      category: 'Undercut',
      description: 'High-contrast sharp undercut fade combed cleanly back with a natural semi-matte finish.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      recommendedServiceId: createdServices[1].id,
    },
  ];

  for (const h of hairstylesData) {
    await prisma.hairstyle.create({ data: h });
  }
  console.log(`✅ Seeded ${hairstylesData.length} hairstyles.`);

  // 6. Seed Time Slots
  const timeSlots = [
    { startTime: '10:00 AM', endTime: '10:30 AM' },
    { startTime: '10:30 AM', endTime: '11:00 AM' },
    { startTime: '11:00 AM', endTime: '11:30 AM' },
    { startTime: '11:30 AM', endTime: '12:00 PM' },
    { startTime: '12:00 PM', endTime: '12:30 PM' },
    { startTime: '12:30 PM', endTime: '01:00 PM' },
    { startTime: '02:00 PM', endTime: '02:30 PM' },
    { startTime: '02:30 PM', endTime: '03:00 PM' },
    { startTime: '03:00 PM', endTime: '03:30 PM' },
    { startTime: '03:30 PM', endTime: '04:00 PM' },
    { startTime: '04:00 PM', endTime: '04:30 PM' },
    { startTime: '04:30 PM', endTime: '05:00 PM' },
    { startTime: '05:00 PM', endTime: '05:30 PM' },
    { startTime: '05:30 PM', endTime: '06:00 PM' },
    { startTime: '06:00 PM', endTime: '06:30 PM' },
    { startTime: '06:30 PM', endTime: '07:00 PM' },
    { startTime: '07:00 PM', endTime: '07:30 PM' },
  ];

  for (const slot of timeSlots) {
    await prisma.timeSlot.create({ data: { ...slot, isActive: true } });
  }
  console.log(`✅ Seeded ${timeSlots.length} operating time slots.`);

  // 7. Seed Sample Bookings (Today & upcoming dates)
  const now = new Date();
  const formatDate = (offsetDays) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const sampleBookings = [
    {
      bookingNumber: 'KB-2026-X8R4A1',
      userId: customer1.id,
      serviceId: createdServices[1].id,
      date: formatDate(0),
      timeSlot: '11:00 AM',
      notes: 'Prefer extra texture on top with low taper.',
      status: 'CONFIRMED',
      totalAmount: createdServices[1].price,
    },
    {
      bookingNumber: 'KB-2026-P2Q9W4',
      userId: customer2.id,
      serviceId: createdServices[4].id,
      date: formatDate(0),
      timeSlot: '03:00 PM',
      notes: 'Getting ready for a wedding celebration.',
      status: 'CONFIRMED',
      totalAmount: createdServices[4].price,
    },
    {
      bookingNumber: 'KB-2026-L7M3K8',
      userId: customer3.id,
      serviceId: createdServices[2].id,
      date: formatDate(1),
      timeSlot: '02:30 PM',
      notes: 'Skin fade drop with razor lineup.',
      status: 'PENDING',
      totalAmount: createdServices[2].price,
    },
    {
      bookingNumber: 'KB-2026-V5T1J9',
      userId: customer1.id,
      serviceId: createdServices[5].id,
      date: formatDate(2),
      timeSlot: '05:00 PM',
      notes: 'Anti-dandruff treatment.',
      status: 'CONFIRMED',
      totalAmount: createdServices[5].price,
    },
    {
      bookingNumber: 'KB-2026-Z4C8N2',
      userId: customer2.id,
      serviceId: createdServices[0].id,
      date: formatDate(-2),
      timeSlot: '10:30 AM',
      notes: 'Regular maintenance haircut.',
      status: 'COMPLETED',
      totalAmount: createdServices[0].price,
    },
    {
      bookingNumber: 'KB-2026-B9Y6H5',
      userId: customer3.id,
      serviceId: createdServices[3].id,
      date: formatDate(-1),
      timeSlot: '04:00 PM',
      notes: 'Beard trim.',
      status: 'COMPLETED',
      totalAmount: createdServices[3].price,
    },
  ];

  for (const b of sampleBookings) {
    await prisma.booking.create({ data: b });
  }
  console.log(`✅ Seeded ${sampleBookings.length} initial bookings.`);

  console.log('🎉 KING BARBAR SHOP database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
