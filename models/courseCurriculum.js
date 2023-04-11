
const moment = require('moment');

module.exports = (sequelize,DataTypes)=>{

    const Curriculum = sequelize.define('curriculum', {
        curriculum_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
        section: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lecture: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        total_length: {
          type: DataTypes.STRING,
          allowNull: false,
      
        },
        course_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        instructor_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      }, {
        tableName: 'curriculum',
        timestamps: false,
      });
      return Curriculum
}
  