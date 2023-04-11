<<<<<<< HEAD
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('skilltangle', 'root', 'cprakhar999@gmail.com', {
  host: 'localhost',
  logging:false,
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  const db = {}
  db.Sequelize=Sequelize
  db.sequelize = sequelize
  db.Student = require('./student')(sequelize,DataTypes)
  db.instructor = require('./instructor')(sequelize,DataTypes)
  db.course = require('./course')(sequelize,DataTypes)
  db.Purchase = require('./studentCourse')(sequelize,DataTypes)
  db.courseVideo = require('./course_video')(sequelize,DataTypes)
  db.courseProgress = require('./courseProgress')(sequelize,DataTypes)
  db.certificate = require('./certificate')(sequelize,DataTypes)
  db.addToCart = require('./addToCart')(sequelize,DataTypes)
  db.StudentWishlist = require('./StudentWishlist')(sequelize,DataTypes)
  db.courseCurriculum = require('./courseCurriculum')(sequelize,DataTypes)
  db.curriculumSection = require('./curriculumSection')(sequelize,DataTypes)
  db.sectionVideo = require('./section_video')(sequelize,DataTypes)
  db.assignments = require('./assignments')(sequelize,DataTypes)








  





  db.instructor.hasMany(db.course, { foreignKey: 'instructor_id' });
  db.course.belongsTo(db.instructor, { foreignKey: 'instructor_id' });

  db.Student.hasMany( db.Purchase, { foreignKey: 'student_id' });
 db.Purchase.belongsTo(db.Student, { foreignKey: 'student_id' });

 db.course.hasMany( db.Purchase, { foreignKey: 'course_id' });
 db.Purchase.belongsTo( db.course, { foreignKey: 'course_id' });


 db.course.hasMany(  db.courseVideo, { foreignKey: 'course_id' });
 db.courseVideo.belongsTo( db.course, { foreignKey: 'course_id' });

 db.course.hasMany(  db.courseProgress, { foreignKey: 'course_id' });
 db.courseProgress.belongsTo( db.course, { foreignKey: 'course_id' });

 db.courseVideo.hasMany(db.courseProgress, { foreignKey: 'video_id' });
 db.courseProgress.belongsTo( db.courseVideo, { foreignKey: 'video_id' });

 db.Student.hasMany( db.courseProgress, { foreignKey: 'student_id' });
 db.courseProgress.belongsTo( db.Student, { foreignKey: 'student_id' });

 db.course.hasMany(  db.certificate, { foreignKey: 'course_id' });
 db.certificate.belongsTo( db.course, { foreignKey: 'course_id' });

 db.Student.hasMany( db.certificate, { foreignKey: 'student_id' });
 db.certificate.belongsTo( db.Student, { foreignKey: 'student_id' });

 db.Student.hasMany( db.addToCart, { foreignKey: 'student_id' });
 db.addToCart.belongsTo(db.Student, { foreignKey: 'student_id' });

 db.course.hasMany(  db.addToCart, { foreignKey: 'course_id' });
 db.addToCart.belongsTo( db.course, { foreignKey: 'course_id' });

 db.Student.hasMany( db.StudentWishlist, { foreignKey: 'student_id' });
 db.StudentWishlist.belongsTo(db.Student, { foreignKey: 'student_id' });

 db.course.hasMany(  db.StudentWishlist, { foreignKey: 'course_id' });
 db.StudentWishlist.belongsTo( db.course, { foreignKey: 'course_id' });

 db.course.hasMany(  db.courseCurriculum, { foreignKey: 'course_id' });
 db.courseCurriculum.belongsTo( db.course, { foreignKey: 'course_id' });

 db.instructor.hasMany(db.courseCurriculum, { foreignKey: 'instructor_id' });
 db.courseCurriculum.belongsTo(db.instructor, { foreignKey: 'instructor_id' });

 db.course.hasMany(  db.curriculumSection, { foreignKey: 'course_id' });
 db.curriculumSection.belongsTo( db.course, { foreignKey: 'course_id' });

 db.courseCurriculum.hasMany(  db.curriculumSection, { foreignKey: 'curriculum_id' });
 db.curriculumSection.belongsTo( db.courseCurriculum, { foreignKey: 'curriculum_id' });

 db.course.hasMany(  db.sectionVideo, { foreignKey: 'course_id' });
 db.sectionVideo.belongsTo( db.course, { foreignKey: 'course_id' });

 db.courseCurriculum.hasMany(  db.sectionVideo, { foreignKey: 'curriculum_id' });
 db.sectionVideo.belongsTo( db.courseCurriculum, { foreignKey: 'curriculum_id' });

 db.curriculumSection.hasMany(  db.sectionVideo, { foreignKey: 'section_id' });
 db.sectionVideo.belongsTo( db.curriculumSection, { foreignKey: 'section_id' });

 db.instructor.hasMany(db.assignments, { foreignKey: 'instructor_id' });
 db.assignments.belongsTo(db.instructor, { foreignKey: 'instructor_id' });

 db.curriculumSection.hasMany(  db.assignments, { foreignKey: 'section_id' });
 db.assignments.belongsTo( db.curriculumSection, { foreignKey: 'section_id' });

 db.course.hasMany(  db.assignments, { foreignKey: 'course_id' });
 db.assignments.belongsTo( db.course, { foreignKey: 'course_id' });







  sequelize.sync({force:false})
  module.exports = db
=======
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('skilltangle', 'root', 'cprakhar999@gmail.com', {
  host: 'localhost',
  logging:false,
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  const db = {}
  db.Sequelize=Sequelize
  db.sequelize = sequelize
  db.Student = require('./student')(sequelize,DataTypes)
  db.instructor = require('./instructor')(sequelize,DataTypes)
  db.course = require('./course')(sequelize,DataTypes)
  db.Purchase = require('./studentCourse')(sequelize,DataTypes)
  db.certificate = require('./certificate')(sequelize,DataTypes)
  db.addToCart = require('./addToCart')(sequelize,DataTypes)
  db.StudentWishlist = require('./StudentWishlist')(sequelize,DataTypes)
  db.courseCurriculum = require('./courseCurriculum')(sequelize,DataTypes)
  db.curriculumSection = require('./curriculumSection')(sequelize,DataTypes)
  db.sectionVideo = require('./section_video')(sequelize,DataTypes)
  db.assignments = require('./assignments')(sequelize,DataTypes)
  db.CourseVideoProgress = require('./CourseVideoProgress')(sequelize,DataTypes)









  





  db.instructor.hasMany(db.course, { foreignKey: 'instructor_id' });
  db.course.belongsTo(db.instructor, { foreignKey: 'instructor_id' });

  db.Student.hasMany( db.Purchase, { foreignKey: 'student_id' });
 db.Purchase.belongsTo(db.Student, { foreignKey: 'student_id' });

 db.course.hasMany( db.Purchase, { foreignKey: 'course_id' });
 db.Purchase.belongsTo( db.course, { foreignKey: 'course_id' });


//  db.course.hasMany(  db.courseVideo, { foreignKey: 'course_id' });
//  db.courseVideo.belongsTo( db.course, { foreignKey: 'course_id' });

 db.course.hasMany(  db.CourseVideoProgress, { foreignKey: 'course_id' });
 db.CourseVideoProgress.belongsTo( db.course, { foreignKey: 'course_id' });

 db.sectionVideo.hasMany(db.CourseVideoProgress, { foreignKey: 'video_id' });
 db.CourseVideoProgress.belongsTo( db.sectionVideo, { foreignKey: 'video_id' });

 db.Student.hasMany( db.CourseVideoProgress, { foreignKey: 'student_id' });
 db.CourseVideoProgress.belongsTo( db.Student, { foreignKey: 'student_id' });

 db.course.hasMany(  db.certificate, { foreignKey: 'course_id' });
 db.certificate.belongsTo( db.course, { foreignKey: 'course_id' });

 db.Student.hasMany( db.certificate, { foreignKey: 'student_id' });
 db.certificate.belongsTo( db.Student, { foreignKey: 'student_id' });

 db.Student.hasMany( db.addToCart, { foreignKey: 'student_id' });
 db.addToCart.belongsTo(db.Student, { foreignKey: 'student_id' });

 db.course.hasMany(  db.addToCart, { foreignKey: 'course_id' });
 db.addToCart.belongsTo( db.course, { foreignKey: 'course_id' });

 db.Student.hasMany( db.StudentWishlist, { foreignKey: 'student_id' });
 db.StudentWishlist.belongsTo(db.Student, { foreignKey: 'student_id' });

 db.course.hasMany(  db.StudentWishlist, { foreignKey: 'course_id' });
 db.StudentWishlist.belongsTo( db.course, { foreignKey: 'course_id' });

 db.course.hasMany(  db.courseCurriculum, { foreignKey: 'course_id' });
 db.courseCurriculum.belongsTo( db.course, { foreignKey: 'course_id' });

 db.instructor.hasMany(db.courseCurriculum, { foreignKey: 'instructor_id' });
 db.courseCurriculum.belongsTo(db.instructor, { foreignKey: 'instructor_id' });

 db.course.hasMany(  db.curriculumSection, { foreignKey: 'course_id' });
 db.curriculumSection.belongsTo( db.course, { foreignKey: 'course_id' });

 db.courseCurriculum.hasMany(  db.curriculumSection, { foreignKey: 'curriculum_id' });
 db.curriculumSection.belongsTo( db.courseCurriculum, { foreignKey: 'curriculum_id' });

 db.course.hasMany(  db.sectionVideo, { foreignKey: 'course_id' });
 db.sectionVideo.belongsTo( db.course, { foreignKey: 'course_id' });

 db.courseCurriculum.hasMany(  db.sectionVideo, { foreignKey: 'curriculum_id' });
 db.sectionVideo.belongsTo( db.courseCurriculum, { foreignKey: 'curriculum_id' });

 db.curriculumSection.hasMany(  db.sectionVideo, { foreignKey: 'section_id' });
 db.sectionVideo.belongsTo( db.curriculumSection, { foreignKey: 'section_id' });

 db.instructor.hasMany(db.assignments, { foreignKey: 'instructor_id' });
 db.assignments.belongsTo(db.instructor, { foreignKey: 'instructor_id' });

 db.curriculumSection.hasMany(  db.assignments, { foreignKey: 'section_id' });
 db.assignments.belongsTo( db.curriculumSection, { foreignKey: 'section_id' });

 db.course.hasMany(  db.assignments, { foreignKey: 'course_id' });
 db.assignments.belongsTo( db.course, { foreignKey: 'course_id' });







  sequelize.sync({force:false})
  module.exports = db
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
