import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.js";
import Level from "../levels/level.model.js"; // Import Level model for association

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    level_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Level,
        key: "level_id",
      },
      onDelete: "CASCADE",
    },

    taskName: {
      type: DataTypes.STRING(200), // ✅ STRING (not array)
      allowNull: false,
    },

    timeline: {
      type: DataTypes.STRING(200), // weeks
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("completed", "incomplete", "locked"),
      allowNull: false,
      defaultValue: "locked",
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tasks",
  }
);

export default Task;