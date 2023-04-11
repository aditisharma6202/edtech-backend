<<<<<<< HEAD

module.exports = (sequelize,DataTypes)=>{

  const CourseVideo = sequelize.define('course_video', {
    video_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    video_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: 'course_video',
    timestamps: false,
  });
  
  CourseVideo.beforeCreate((courseVideo, options) => {
    // Set the position to the current number of videos in the section plus one
    return CourseVideo.count({
      where: {
        section_id: courseVideo.section_id,
      },
      transaction: options.transaction,
    }).then(count => {
      courseVideo.position = count + 1;
    });
  });
  
  return CourseVideo;
  
=======

module.exports = (sequelize,DataTypes)=>{

  const CourseVideo = sequelize.define('course_video', {
    video_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    video_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: 'course_video',
    timestamps: false,
  });
  
  CourseVideo.beforeCreate((courseVideo, options) => {
    // Set the position to the current number of videos in the section plus one
    return CourseVideo.count({
      where: {
        section_id: courseVideo.section_id,
      },
      transaction: options.transaction,
    }).then(count => {
      courseVideo.position = count + 1;
    });
  });
  
  return CourseVideo;
  
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
}