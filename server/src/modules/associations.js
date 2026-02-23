import Career from "./careers/career.model.js";
import Level from "./levels/level.model.js";
import Task from "./tasks/task.model.js";
import User from "./auth/auth.models.js";
import Interest from "./interest/interest.models.js";

// Career <--> Level
Career.hasMany(Level, {
  foreignKey: "careerId",
  as: "levels",
  onDelete: "CASCADE",
});
Level.belongsTo(Career, {
  foreignKey: "careerId",
  as: "career",
});

// Level <--> Task
Level.hasMany(Task, {
  foreignKey: "level_id",
  as: "tasks",
  onDelete: "CASCADE",
});
Task.belongsTo(Level, {
  foreignKey: "level_id",
  as: "level",
});

// User <--> Interest
User.hasMany(Interest, {
  foreignKey: "userId",
  as: "interests",
  onDelete: "CASCADE",
});
Interest.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export {
  Career,
  Level,
  Task,
  User,
  Interest,
};