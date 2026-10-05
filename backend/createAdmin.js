require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@studygem.com";
    const password = "Admin@12345";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      existingAdmin.isVerified = true;

      existingAdmin.password =
        await bcrypt.hash(password, 10);

      await existingAdmin.save();

      console.log("Admin updated successfully.");
    } else {
      const hashedPassword =
        await bcrypt.hash(password, 10);

      await User.create({
        name: "StudyGem Admin",
        email,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("Admin created successfully.");
    }

    console.log("");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error(
      "Admin creation error:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();