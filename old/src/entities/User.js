const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
    },
    unique: { type: "varchar" },
    email: { type: "varchar" },
    password: { type: "varchar" },
    names: { type: "varchar" },
    lastnames: { type: "varchar" },
    dob: { type: "date", nullable: true },
    changePassword: { type: "boolean", default: true },
    isActive: { type: "boolean", default: true },
    avatarURL: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    gender: {
      target: "Gender",
      type: "many-to-one",
      joinTable: true,
    },
    profile: {
      target: "Profile",
      type: "many-to-one",
      joinTable: true,
    },
    country: {
      target: "Country",
      type: "many-to-one",
      joinTable: true,
    },
    state: {
      target: "State",
      type: "many-to-one",
      joinTable: true,
    },
    city: {
      target: "City",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
