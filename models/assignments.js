<<<<<<< HEAD

module.exports = (sequelize,DataTypes)=>{
const Assignment = sequelize.define('Assignment', {
  assignment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  assignment_file: {
    type: DataTypes.STRING,
    allowNull: false
  },

}, {
  tableName: 'Assignment',
  timestamps: false,
});
return Assignment

=======

module.exports = (sequelize,DataTypes)=>{
const Assignment = sequelize.define('Assignment', {
  assignment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  assignment_file: {
    type: DataTypes.STRING,
    allowNull: false
  },

}, {
  tableName: 'Assignment',
  timestamps: false,
});
return Assignment

>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
}