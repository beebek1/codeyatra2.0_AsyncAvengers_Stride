import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.js";
import Career from "../careers/career.model.js";

const Level = sequelize.define(
  "Level",
  {
    level_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    level_name: {
      type: DataTypes.ENUM("beginner", "intermediate", "advance"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("locked", "incomplete", "completed"),
      allowNull: false,
      defaultValue: "locked", // default when created
    },

    careerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Career,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "levels",
  }
);

export default Level;