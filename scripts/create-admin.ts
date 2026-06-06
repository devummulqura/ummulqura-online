import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function createAdmin() {
  try {
    const { default: connectToDatabase } = await import('../lib/db');
    const { default: User } = await import('../models/User');

    await connectToDatabase();
    
    const adminEmail = 'admin@ummul.edu';
    const adminPassword = 'adminpassword123';
    
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
