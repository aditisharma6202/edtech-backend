<<<<<<< HEAD
module.exports = (sequelize, DataTypes,student,course) => {
    const wishlistItem = sequelize.define('wishlist', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: student,
          key: 'student_id',
        },
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: course,
          key: 'course_id',
        },
      }, 
      
      
    }, {
      timestamps: false,
    });
  
    return wishlistItem;
  };
=======
module.exports = (sequelize, DataTypes,student,course) => {
    const wishlistItem = sequelize.define('wishlist', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: student,
          key: 'student_id',
        },
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: course,
          key: 'course_id',
        },
      }, 
      
      
    }, {
      timestamps: false,
    });
  
    return wishlistItem;
  };
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
  