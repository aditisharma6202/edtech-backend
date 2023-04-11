<<<<<<< HEAD
var db = require('../models/index')
const moment = require('moment');

var Instructor = db.instructor
var course = db.course
var courseVideo = db.courseVideo
var courseProgress = db.courseProgress
var Certificate = db.certificate
var Curriculum = db.courseCurriculum
var Section = db.curriculumSection
var sectionVideo = db.sectionVideo
var assignments = db.assignments







const bcrypt = require('bcrypt');
const randomstring = require('randomstring');



const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env

const generateToken = (student_id) => {
  try {
    const token = jwt.sign({ student_id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate token');
  }
};

  const saltRounds = 10; 



  const addInstructor = async (req, res) => {
    const { name, email, password,is_verified  } = req.body;
    try {
      const salt = await bcrypt.genSalt(saltRounds); // generate a salt
      const hashedPassword = await bcrypt.hash(password, salt); // hash the password with the salt
  
      const instructor = await Instructor.create({ name, email, password: hashedPassword ,is_verified,}); // save the hashed password
      console.log(`Student ${instructor.name} added with ID ${instructor.Instructor_id}`);
      res.status(201).json(instructor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding instructor' });
    }
  };


  const loginInstructor = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    Instructor.findOne({ where: { email } })
      .then((instructor) => {
        if (!instructor) {
          return res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
        }
  
        bcrypt.compare(password, instructor.password, (err, result) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return res.status(500).json({ message: 'Error authenticating instructor.' });
          }
  
          if (result) {
            if (!instructor.is_verified) {
              return res.status(401).json({ message: 'Authentication failed. Instructor not verified.' });
            }
  
            const token = jwt.sign({ instructor_id: instructor.instructor_id }, process.env.JWT_SECRET);
            const userData = { instructor_id: instructor.instructor_id, name: instructor.name, email: instructor.email, course: instructor.course };
            res.status(200).json({ message: 'Authentication successful.', token, instructor: userData });
          } else {
            res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
          }
        });
      })
      .catch((error) => {
        console.error('Error finding instructor:', error);
        res.status(500).json({ message: 'Error authenticating instructor.' });
      });
  };


  const addCourse = async (req, res) => {
    try {

    
      const { course_name, description, language, price, rating,requirement } = req.body;
  
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }      

        
        const instructor_id = decodedToken.instructor_id;
        const instructor_name = decodedToken.name;
        console.log(instructor_name);

        if (!course_name || !description || !language || !price || !rating || !req.file || !requirement) {
          return res.status(400).send({ message: 'All fields are required' });
        }
  
        const newCourse = await course.create({
          course_name,
          description,
          image: req.file.filename,
          instructor_id,
          language,
          price,
          rating,
          requirement
        });
  
        res.status(201).send({ message: 'Course created successfully', course: newCourse });
      });
    } catch (error) {
      console.error(error);
  
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
  
      res.status(500).send({ message: 'Error creating course' });
    }
  };
  


  const getCourseByInstructor = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const instructorId = decoded.instructor_id;
  
      const courses = await course.findAll({
        where: { instructor_id: instructorId },
        attributes: ['course_name', 'description', 'price', 'image', 'rating', 'language'],
        include: {
          model: Instructor,
          attributes: ['name']
        }
      });
  
      return res.status(200).json({ success: true, courses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

  const updateCourse = async (req, res) => {
    try {
      const courseId = req.params.course_id;
      const { course_name, description, language, price, rating } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        const instructor_id = decodedToken.instructor_id;
        const existingCourse = await course.findOne({ where: { course_id: courseId } });
        if (!existingCourse) {
          return res.status(404).send({ message: 'Course not found' });
        }
        if (existingCourse.instructor_id !== instructor_id) {
          return res.status(401).send({ message: 'Unauthorized access.' });
        }
        if (!course_name && !description && !language && !price && !rating && !req.file) {
          return res.status(400).send({ message: 'No data provided to update' });
        }
        let updatedData = {};
        if (course_name) updatedData.course_name = course_name;
        if (description) updatedData.description = description;
        if (language) updatedData.language = language;
        if (price) updatedData.price = price;
        if (rating) updatedData.rating = rating;
        if (req.file) updatedData.image = req.file.filename;
        const updatedCourse = await existingCourse.update(updatedData);
        res.status(200).send({ message: 'Course updated successfully', course: updatedCourse });
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
      res.status(500).send({ message: 'Error updating course' });
    }
  };


  const deleteCourse = async (req, res) => {
    try {
      const id = req.params.course_id;
  
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }      
  
        const courseToDelete = await course.findByPk(id);
  
        if (!courseToDelete) {
          return res.status(404).send({ message: 'Course not found' });
        }
  
        const instructor_id = decodedToken.instructor_id;
  
        if (courseToDelete.instructor_id !== instructor_id) {
          return res.status(401).send({ message: 'Unauthorized access.' });
        }
  
        await courseToDelete.destroy();
  
        res.status(200).send({ message: 'Course deleted successfully' });
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).send({ message: 'Error deleting course' });
    }
  };
  

  const createCurriculum = async (req, res) => {
    try {
      const { section, lecture, total_length } = req.body;
      const { course_id } = req.params;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        const instructor_name = decodedToken.name;
        console.log(instructor_name);
        
        const Course = await course.findOne({ where: { course_id, instructor_id } });
        if (!Course) {
          return res.status(404).send({ message: 'Course not found or unauthorized access.' });
        }
    

        const newCurriculum = await Curriculum.create({
          section,
          lecture,
          total_length,
          course_id,
          instructor_id
        });
        
        res.status(201).send({ message: 'Curriculum created successfully', curriculum: newCurriculum });
      });
    } catch (error) {
      console.error(error);
    
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
    
      res.status(500).send({ message: 'Error creating curriculum' });
    }
  };
  


  

  const getCurriculum = async (req, res) => {
    try {
      const { course_id } = req.params;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        
        const curriculums = await Curriculum.findAll({
          where: { course_id },
          include: [{
            model: course,
            where: { instructor_id },
            attributes: ['course_name'],
            include: [{
              model: Instructor,
              attributes: ['name']
            }]
          }]
        });
        
        if (curriculums.length === 0) {
          return res.status(404).send({ message: 'Curriculum not found or unauthorized access.' });
        }
        
        res.status(200).send({ 
          message: 'Curriculums retrieved successfully',
          course_name: curriculums[0].course.course_name,
          instructor_name: curriculums[0].course.instructor.name,
          curriculums 
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error retrieving curriculums' });
    }
  };



const createSection = async (req, res) => {
    try {
      const { curriculum_id, course_id } = req.params;
      const { title } = req.body;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        
        const curriculum = await Curriculum.findOne({ where: { curriculum_id, instructor_id } });
        if (!curriculum) {
          return res.status(404).send({ message: 'Curriculum not found or unauthorized access.' });
        }
        
        const newSection = await Section.create({
          title,
          curriculum_id,
          course_id,
          instructor_id
        });
        
        res.status(201).send({ message: 'Section created successfully', section: newSection });
      });
    } catch (error) {
      console.error(error);
    
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
    
      res.status(500).send({ message: 'Error creating section' });
    }
  };
  


  const getCurriculumdetailsWithSection = async (req, res) => {
    try {
      const { course_id } = req.params;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        
        const Course = await course.findOne({ where: { course_id, instructor_id } });
        if (!Course) {
          return res.status(404).send({ message: 'Course not found or unauthorized access.' });
        }
        
        const curriculums = await Curriculum.findAll({ 
          where: { course_id },
          include: [{ model: Section, attributes: ['section_id', 'title'] }, { model: Instructor, attributes: ['name'] }] 
        });
        
        res.status(200).send({ 
          message: 'Curriculums retrieved successfully',
          course_name: Course.course_name,
          curriculums 
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error retrieving curriculums' });
    }
  };




  async function uploadVideo(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }
      const instructorId = decodedToken.instructor_id;
  
      // Get course_id and section_id from request params
      const { course_id, section_id, curriculum_id } = req.params;
  
      // Check if the instructor is the owner of the course
      const Course = await Section.findOne({
        where: {
          section_id: section_id,
          course_id: course_id
        },
        include: {
          model: Curriculum,
          where: {
            curriculum_id: curriculum_id,
          },
        },
      });
      
  
      if (!Course) {
        return res.status(401).json({ message: "You don't have permission to upload videos to this course" });
      }
  
      const { title,  duration } = req.body;
            const video_url = req.file.filename;


  
      if (!title || !video_url || !duration) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      try {
        const newVideo = await sectionVideo.create({
          course_id,
          section_id,
          curriculum_id,
          title,
          video_url,
          duration,
        });
  
        return res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  }
  
  async function getVideosBySectionId(req, res) {
    try {
      const sectionId = parseInt(req.params.section_id);
  
      if (isNaN(sectionId)) {
        return res.status(400).json({ message: 'Invalid section ID' });
      }
  
      const videos = await sectionVideo.findAll({
        where: {
          section_id: sectionId,
        },
      });
  
      if (!videos || videos.length === 0) {
        return res.status(404).json({ message: 'No videos found for section ID' });
      }
  
      return res.status(200).json({ videos });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  


  async function getVideosBySectionIdAndInstructor(req, res) {
    const sectionId = parseInt(req.params.section_id);
  
    if (isNaN(sectionId)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
  
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }
      const instructorId = decodedToken.instructor_id;
  
      try {
        const videos = await sectionVideo.findAll({
          where: {
            section_id: sectionId,
          },
          include: [
            {
              model: Curriculum,
              include: [
                {
                  model: Section,
                  where: { section_id: sectionId },
                  include: [
                    {
                      model: course,
                      where: { instructor_id: instructorId },
                    },
                  ],
                },
              ],
            },
          ],
        });
  
        return res.status(200).json({ videos });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  }
  

// POST /courses/:courseId/sections/:sectionId/assignments
async function createAssignment(req, res) {
  const { course_id, section_id } = req.params;
  const { title } = req.body;
  const assignment_file = req.file.filename

  // Authenticate instructor using JWT
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ message: 'Unauthorized access.' });
    }
    const instructorId = decodedToken.instructor_id;

    // Check if the instructor is the owner of the course
    const section = await Section.findOne({
      where: {
        section_id: section_id,
        course_id: course_id,
      },
    });

    if (!section || section.instructor_id !== instructorId) {
      return res.status(401).json({ message: 'You do not have permission to create an assignment in this section.' });
    }

    try {
      const Assignment = await assignments.create({
        title,
        section_id: section_id,
        instructor_id: instructorId,
        course_id: course_id,
        assignment_file 
      });

      return res.status(201).json({ message: 'Assignment created successfully', Assignment });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}

async function getAssignmentsBySectionAndCourse(req, res) {
  const { course_id, section_id } = req.params;

  // Authenticate user using JWT
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    try {
      const Assignments = await assignments.findAll({
        where: {
          section_id: section_id,
          course_id: course_id,
        },
      });

      return res.status(200).json({ Assignments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}





  const generateCertificate = async (req, res) => {
    const courseId = req.params.course_id;
  
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
  
        const studentId = decodedToken.student_id;
  
        // Check if the student has completed the course
        const CourseProgress = await courseProgress.findAll({
          where: { student_id: studentId, course_id: courseId },
        });
  
        if (!CourseProgress || CourseProgress.length === 0) {
          return res.status(404).json({ message: 'No course progress found for this student and course' });
        }
  
        // Calculate the total duration of the course in seconds
        const CourseVideos = await courseVideo.findAll({
          where: { course_id: courseId },
        });
        const totalDurationSeconds = CourseVideos.reduce((total, video) => total + video.duration_seconds, 0);
  
        // Calculate the total time the student has watched in the course
        const watchedDurationSeconds = CourseProgress.reduce((total, progress) => total + progress.watched_duration_seconds, 0);
  
        // Check if the student has completed the course
        if (watchedDurationSeconds < totalDurationSeconds) {
          return res.status(401).json({ message: 'You have not completed this course yet.' });
        }
  
        // Generate a certificate for the student
        const certificate = await Certificate.create({
          student_id: studentId,
          course_id: courseId,
        });
  
        return res.status(200).json({ message: 'Certificate generated successfully', Certificate: certificate });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error generating certificate' });
    }
  };
  
  

  
  module.exports = {addInstructor,loginInstructor,addCourse,generateCertificate,getCourseByInstructor,
    updateCourse,deleteCourse,createCurriculum,getCurriculum,createSection,getCurriculumdetailsWithSection,
    uploadVideo,getVideosBySectionId,getVideosBySectionIdAndInstructor,createAssignment,getAssignmentsBySectionAndCourse}
=======
var db = require('../models/index')
const moment = require('moment');

var Instructor = db.instructor
var course = db.course
var courseVideo = db.courseVideo
var courseProgress = db.courseProgress
var CourseVideoProgress = db.CourseVideoProgress
var Certificate = db.certificate
var Curriculum = db.courseCurriculum
var Section = db.curriculumSection
var sectionVideo = db.sectionVideo
var assignments = db.assignments







const bcrypt = require('bcrypt');
const randomstring = require('randomstring');



const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env

const generateToken = (student_id) => {
  try {
    const token = jwt.sign({ student_id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate token');
  }
};

  const saltRounds = 10; 



  const addInstructor = async (req, res) => {
    const { name, email, password,is_verified  } = req.body;
    try {
      const salt = await bcrypt.genSalt(saltRounds); // generate a salt
      const hashedPassword = await bcrypt.hash(password, salt); // hash the password with the salt
  
      const instructor = await Instructor.create({ name, email, password: hashedPassword ,is_verified,}); // save the hashed password
      console.log(`Student ${instructor.name} added with ID ${instructor.Instructor_id}`);
      res.status(201).json(instructor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding instructor' });
    }
  };


  const loginInstructor = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    Instructor.findOne({ where: { email } })
      .then((instructor) => {
        if (!instructor) {
          return res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
        }
  
        bcrypt.compare(password, instructor.password, (err, result) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return res.status(500).json({ message: 'Error authenticating instructor.' });
          }
  
          if (result) {
            if (!instructor.is_verified) {
              return res.status(401).json({ message: 'Authentication failed. Instructor not verified.' });
            }
  
            const token = jwt.sign({ instructor_id: instructor.instructor_id }, process.env.JWT_SECRET);
            const userData = { instructor_id: instructor.instructor_id, name: instructor.name, email: instructor.email, course: instructor.course };
            res.status(200).json({ message: 'Authentication successful.', token, instructor: userData });
          } else {
            res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
          }
        });
      })
      .catch((error) => {
        console.error('Error finding instructor:', error);
        res.status(500).json({ message: 'Error authenticating instructor.' });
      });
  };


  const addCourse = async (req, res) => {
    try {

    
      const { course_name, description, language, price, rating,requirement } = req.body;
  
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }      

        
        const instructor_id = decodedToken.instructor_id;
        const instructor_name = decodedToken.name;
        console.log(instructor_name);

        if (!course_name || !description || !language || !price || !rating || !req.file || !requirement) {
          return res.status(400).send({ message: 'All fields are required' });
        }
  
        const newCourse = await course.create({
          course_name,
          description,
          image: req.file.filename,
          instructor_id,
          language,
          price,
          rating,
          requirement
        });
  
        res.status(201).send({ message: 'Course created successfully', course: newCourse });
      });
    } catch (error) {
      console.error(error);
  
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
  
      res.status(500).send({ message: 'Error creating course' });
    }
  };
  


  const getCourseByInstructor = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const instructorId = decoded.instructor_id;
  
      const courses = await course.findAll({
        where: { instructor_id: instructorId },
        attributes: ['course_name', 'description', 'price', 'image', 'rating', 'language'],
        include: {
          model: Instructor,
          attributes: ['name']
        }
      });
  
      return res.status(200).json({ success: true, courses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

  const updateCourse = async (req, res) => {
    try {
      const courseId = req.params.course_id;
      const { course_name, description, language, price, rating } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        const instructor_id = decodedToken.instructor_id;
        const existingCourse = await course.findOne({ where: { course_id: courseId } });
        if (!existingCourse) {
          return res.status(404).send({ message: 'Course not found' });
        }
        if (existingCourse.instructor_id !== instructor_id) {
          return res.status(401).send({ message: 'Unauthorized access.' });
        }
        if (!course_name && !description && !language && !price && !rating && !req.file) {
          return res.status(400).send({ message: 'No data provided to update' });
        }
        let updatedData = {};
        if (course_name) updatedData.course_name = course_name;
        if (description) updatedData.description = description;
        if (language) updatedData.language = language;
        if (price) updatedData.price = price;
        if (rating) updatedData.rating = rating;
        if (req.file) updatedData.image = req.file.filename;
        const updatedCourse = await existingCourse.update(updatedData);
        res.status(200).send({ message: 'Course updated successfully', course: updatedCourse });
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
      res.status(500).send({ message: 'Error updating course' });
    }
  };


  const deleteCourse = async (req, res) => {
    try {
      const id = req.params.course_id;
  
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }      
  
        const courseToDelete = await course.findByPk(id);
  
        if (!courseToDelete) {
          return res.status(404).send({ message: 'Course not found' });
        }
  
        const instructor_id = decodedToken.instructor_id;
  
        if (courseToDelete.instructor_id !== instructor_id) {
          return res.status(401).send({ message: 'Unauthorized access.' });
        }
  
        await courseToDelete.destroy();
  
        res.status(200).send({ message: 'Course deleted successfully' });
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).send({ message: 'Error deleting course' });
    }
  };
  

  const createCurriculum = async (req, res) => {
    try {
      const { section, lecture, total_length } = req.body;
      const { course_id } = req.params;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        const instructor_name = decodedToken.name;
        console.log(instructor_name);
        
        const Course = await course.findOne({ where: { course_id, instructor_id } });
        if (!Course) {
          return res.status(404).send({ message: 'Course not found or unauthorized access.' });
        }
    

        const newCurriculum = await Curriculum.create({
          section,
          lecture,
          total_length,
          course_id,
          instructor_id
        });
        
        res.status(201).send({ message: 'Curriculum created successfully', curriculum: newCurriculum });
      });
    } catch (error) {
      console.error(error);
    
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
    
      res.status(500).send({ message: 'Error creating curriculum' });
    }
  };
  


  

  const getCurriculum = async (req, res) => {
    try {
      const { course_id } = req.params;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        
        const curriculums = await Curriculum.findAll({
          where: { course_id },
          include: [{
            model: course,
            where: { instructor_id },
            attributes: ['course_name'],
            include: [{
              model: Instructor,
              attributes: ['name']
            }]
          }]
        });
        
        if (curriculums.length === 0) {
          return res.status(404).send({ message: 'Curriculum not found or unauthorized access.' });
        }
        
        res.status(200).send({ 
          message: 'Curriculums retrieved successfully',
          course_name: curriculums[0].course.course_name,
          instructor_name: curriculums[0].course.instructor.name,
          curriculums 
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error retrieving curriculums' });
    }
  };



const createSection = async (req, res) => {
    try {
      const { curriculum_id, course_id } = req.params;
      const { title } = req.body;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        
        const curriculum = await Curriculum.findOne({ where: { curriculum_id, instructor_id } });
        if (!curriculum) {
          return res.status(404).send({ message: 'Curriculum not found or unauthorized access.' });
        }
        
        const newSection = await Section.create({
          title,
          curriculum_id,
          course_id,
          instructor_id
        });
        
        res.status(201).send({ message: 'Section created successfully', section: newSection });
      });
    } catch (error) {
      console.error(error);
    
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).send({ message: 'Validation error', errors });
      }
    
      res.status(500).send({ message: 'Error creating section' });
    }
  };
  


  const getCurriculumdetailsWithSection = async (req, res) => {
    try {
      const { course_id } = req.params;
      
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
        
        const instructor_id = decodedToken.instructor_id;
        
        const Course = await course.findOne({ where: { course_id, instructor_id } });
        if (!Course) {
          return res.status(404).send({ message: 'Course not found or unauthorized access.' });
        }
        
        const curriculums = await Curriculum.findAll({ 
          where: { course_id },
          include: [{ model: Section, attributes: ['section_id', 'title'] }, { model: Instructor, attributes: ['name'] }] 
        });
        
        res.status(200).send({ 
          message: 'Curriculums retrieved successfully',
          course_name: Course.course_name,
          curriculums 
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error retrieving curriculums' });
    }
  };




  async function uploadVideo(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }
      const instructorId = decodedToken.instructor_id;
  
      // Get course_id and section_id from request params
      const { course_id, section_id, curriculum_id } = req.params;
  
      // Check if the instructor is the owner of the course
      const Course = await Section.findOne({
        where: {
          section_id: section_id,
          course_id: course_id
        },
        include: {
          model: Curriculum,
          where: {
            curriculum_id: curriculum_id,
          },
        },
      });
      
  
      if (!Course) {
        return res.status(401).json({ message: "You don't have permission to upload videos to this course" });
      }
  
      const { title,  duration } = req.body;
            const video_url = req.file.filename;


  
      if (!title || !video_url || !duration) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      try {
        const newVideo = await sectionVideo.create({
          course_id,
          section_id,
          curriculum_id,
          title,
          video_url,
          duration,
        });
  
        return res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  }
  
  async function getVideosBySectionId(req, res) {
    try {
      const sectionId = parseInt(req.params.section_id);
  
      if (isNaN(sectionId)) {
        return res.status(400).json({ message: 'Invalid section ID' });
      }
  
      const videos = await sectionVideo.findAll({
        where: {
          section_id: sectionId,
        },
      });
  
      if (!videos || videos.length === 0) {
        return res.status(404).json({ message: 'No videos found for section ID' });
      }
  
      return res.status(200).json({ videos });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  


  async function getVideosBySectionIdAndInstructor(req, res) {
    const sectionId = parseInt(req.params.section_id);
  
    if (isNaN(sectionId)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
  
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }
      const instructorId = decodedToken.instructor_id;
  
      try {
        const videos = await sectionVideo.findAll({
          where: {
            section_id: sectionId,
          },
          include: [
            {
              model: Curriculum,
              include: [
                {
                  model: Section,
                  where: { section_id: sectionId },
                  include: [
                    {
                      model: course,
                      where: { instructor_id: instructorId },
                    },
                  ],
                },
              ],
            },
          ],
        });
  
        return res.status(200).json({ videos });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  }
  

// POST /courses/:courseId/sections/:sectionId/assignments
async function createAssignment(req, res) {
  const { course_id, section_id } = req.params;
  const { title } = req.body;
  const assignment_file = req.file.filename

  // Authenticate instructor using JWT
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ message: 'Unauthorized access.' });
    }
    const instructorId = decodedToken.instructor_id;

    // Check if the instructor is the owner of the course
    const section = await Section.findOne({
      where: {
        section_id: section_id,
        course_id: course_id,
      },
    });

    if (!section || section.instructor_id !== instructorId) {
      return res.status(401).json({ message: 'You do not have permission to create an assignment in this section.' });
    }

    try {
      const Assignment = await assignments.create({
        title,
        section_id: section_id,
        instructor_id: instructorId,
        course_id: course_id,
        assignment_file 
      });

      return res.status(201).json({ message: 'Assignment created successfully', Assignment });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}

async function getAssignmentsBySectionAndCourse(req, res) {
  const { course_id, section_id } = req.params;

  // Authenticate user using JWT
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    try {
      const Assignments = await assignments.findAll({
        where: {
          section_id: section_id,
          course_id: course_id,
        },
      });

      return res.status(200).json({ Assignments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}





  const generateCertificate = async (req, res) => {
    const courseId = req.params.course_id;
  
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Unauthorized access.' });
        }
  
        const studentId = decodedToken.student_id;
  
        // Check if the student has completed the course
        const CourseProgress = await courseProgress.findAll({
          where: { student_id: studentId, course_id: courseId },
        });
  
        if (!CourseProgress || CourseProgress.length === 0) {
          return res.status(404).json({ message: 'No course progress found for this student and course' });
        }
  
        // Calculate the total duration of the course in seconds
        const CourseVideos = await courseVideo.findAll({
          where: { course_id: courseId },
        });
        const totalDurationSeconds = CourseVideos.reduce((total, video) => total + video.duration_seconds, 0);
  
        // Calculate the total time the student has watched in the course
        const watchedDurationSeconds = CourseProgress.reduce((total, progress) => total + progress.watched_duration_seconds, 0);
  
        // Check if the student has completed the course
        if (watchedDurationSeconds < totalDurationSeconds) {
          return res.status(401).json({ message: 'You have not completed this course yet.' });
        }
  
        // Generate a certificate for the student
        const certificate = await Certificate.create({
          student_id: studentId,
          course_id: courseId,
        });
  
        return res.status(200).json({ message: 'Certificate generated successfully', Certificate: certificate });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error generating certificate' });
    }
  };
  
  

  
  module.exports = {addInstructor,loginInstructor,addCourse,generateCertificate,getCourseByInstructor,
    updateCourse,deleteCourse,createCurriculum,getCurriculum,createSection,getCurriculumdetailsWithSection,
    uploadVideo,getVideosBySectionId,getVideosBySectionIdAndInstructor,createAssignment,getAssignmentsBySectionAndCourse}
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
