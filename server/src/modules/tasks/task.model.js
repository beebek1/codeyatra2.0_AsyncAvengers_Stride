import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import Level from "./level.model.js";

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
      type: DataTypes.STRING(150),
      allowNull: false,
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