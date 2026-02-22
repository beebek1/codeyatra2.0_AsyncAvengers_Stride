import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.js";
import User from "../auth/auth.models.js"; // Import our User model

const Interest = sequelize.define(
  "Interest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE", // if user is deleted, delete interests
    },

    interests: {    
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    educationLevel: {
      type: DataTypes.ENUM("under_high_school","high_school", "undergraduate", "graduate"),
      allowNull: false,
      defaultValue: "high_school",
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "interests",
  }
);

export default Interest;