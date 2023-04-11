<<<<<<< HEAD


module.exports = (sequelize,DataTypes)=>{


const Instructor = sequelize.define('instructor', {
    instructor_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
   
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
  },{
    timestamps:false
});
  return Instructor

=======


module.exports = (sequelize,DataTypes)=>{


const Instructor = sequelize.define('instructor', {
    instructor_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
   
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
  },{
    timestamps:false
});
  return Instructor

>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
}