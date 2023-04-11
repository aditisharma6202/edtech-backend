



module.exports = (sequelize,DataTypes)=>{


    const CourseVideoProgress = sequelize.define('CourseVideoProgress', {
        CourseProgress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
       
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      watched_duration_seconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        get() {
          const watchedDuration = this.getDataValue('watched_duration_seconds');
          if (watchedDuration) {
            const hours = Math.floor(watchedDuration / 3600);
            const minutes = Math.floor((watchedDuration - (hours * 3600)) / 60);
            const seconds = watchedDuration - (hours * 3600) - (minutes * 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
          return null;
        },
        set(watchedDuration) {
          if (watchedDuration) {
            const [hours, minutes, seconds] = watchedDuration.split(':');
            const durationInSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
            this.setDataValue('watched_duration_seconds', durationInSeconds);
          } else {
            this.setDataValue('watched_duration_seconds', 0);
          }
        },
      },
      is_complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
      
      
    }, {
        tableName: 'CourseVideoProgress',
        timestamps: false,
      
    });
    return CourseVideoProgress
    }
    
    