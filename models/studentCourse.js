<<<<<<< HEAD
module.exports = (sequelize,DataTypes)=>{



const Purchase = sequelize.define('purchase', {
    purchase_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1


    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  
  },{
    timestamps:false
});
  return Purchase
=======
module.exports = (sequelize,DataTypes)=>{



const Purchase = sequelize.define('purchase', {
    purchase_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1


    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  
  },{
    timestamps:false
});
  return Purchase
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
}