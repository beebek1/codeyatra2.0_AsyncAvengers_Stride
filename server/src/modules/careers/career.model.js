import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.js";

const Career = sequelize.define(
  "Career",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Prevents duplicate career entries
    },

    description: {
      type: DataTypes.TEXT, // Changed from STRING to TEXT for longer career bios
      allowNull: true,
    },

    industry: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true, // Improves performance when filtering by industry
    },

    avg_salary: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    growth_rate: {
      type: DataTypes.STRING, // e.g., "+12% over 5 years"
      allowNull: true,
    },

    difficulty: {
      type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
      allowNull: false,
      defaultValue: "Beginner",
    },

    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    sponsorship_link: {
      type: DataTypes.STRING,
      allowNull: true, // Optional link
      validate: {
        isUrl: true, // Ensures only valid URLs are saved
      },
    },
  },
  {
    tableName: "career",
    underscored: true, // convert camelCase to snake_case
    timestamps: true,
  }
);

export default Career;