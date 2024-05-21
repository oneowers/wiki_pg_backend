const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phone_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "GHOST" },
  last_code: { type: DataTypes.STRING },
  last_code_time: { type: DataTypes.DATE },
  code_expiration_time: { type: DataTypes.DATE },
  BrandId: { type: DataTypes.INTEGER, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: true },
  first_name: { type: DataTypes.STRING, allowNull: true },
  profile_image: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
}); 

const Participant = sequelize.define("participant", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  state: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },
  phone_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: true } // Add the email field
});

// Run the migration command to apply the changes
sequelize.sync();


module.exports = Participant;


const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define("basket_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  views: { type: DataTypes.INTEGER, allowNull: false },
  device_comments: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true }, // Change to TEXT
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
});


const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  cover_image: { type: DataTypes.STRING, allowNull: true },
  street_address: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  zip: { type: DataTypes.INTEGER, allowNull: true },
  sms_message: { type: DataTypes.INTEGER, allowNull: true },
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
});

const DeviceInfo = sequelize.define("device_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const Comment = sequelize.define("comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.STRING, allowNull: false },
});

const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Furniture = sequelize.define("furniture", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Order = sequelize.define("оrder", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scene_size_x: { type: DataTypes.INTEGER, allowNull: false },
  scene_size_y: { type: DataTypes.INTEGER, allowNull: false },
  furniture_list: { type: DataTypes.JSON, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false }, // Проверьте, что это поле названо правильно
  brand_id: { type: DataTypes.INTEGER, allowNull: false }, // Проверьте, что это поле названо правильно
});

Order.belongsTo(User, { foreignKey: "user_id" });
Order.belongsTo(Brand, { foreignKey: "brand_id" });

User.hasMany(Order);
Brand.hasMany(Order);
Order.belongsToMany(Furniture, { through: "OrderFurniture" });
Furniture.belongsToMany(Order, { through: "OrderFurniture" });



User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: "info" });
DeviceInfo.belongsTo(Device);

Device.hasMany(Comment, { foreignKey: "device_id" });
Comment.belongsTo(Device, { foreignKey: "device_id" });

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

Device.belongsTo(User, { foreignKey: "owner_id" });
User.belongsTo(Brand, { foreignKey: "BrandId" });

module.exports = {
  User,
  Basket,
  BasketDevice,
  Device,
  Type,
  Brand,
  Rating,
  DeviceInfo,
  Comment,
  TypeBrand,
  Furniture,
  Order,
  Participant,
};


