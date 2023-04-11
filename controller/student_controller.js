<<<<<<< HEAD
var db = require('../models/index')
var Student = db.Student
var course = db.course
var CoursePurchase = db.Purchase
var CartStudent = db.addToCart
var Instructor = db.instructor
var Wishlisht = db.StudentWishlist







var courseProgress = db.courseProgress
var courseVideo = db.courseVideo

const sendMail = require('../helper/sendMail')


const bcrypt = require('bcrypt');
const randomstring = require('randomstring');


const jwt = require('jsonwebtoken')
const student = require('../models/student')

const {JWT_SECRET} = process.env

const generateToken = (student_id) => {
  try {
    const token = jwt.sign({ student_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate token');
  }
};



  // const bcrypt = require('bcrypt');
  const saltRounds = 10; // define the number of salt rounds to use
  
  const addStudent = async (req, res) => {
   
    const email = req.body.email;
    Student.findOne({ where: { email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use. Please choose a different email.' });
        }
  
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Error creating user.' });
          }
  
          const verificationToken = randomstring.generate();
          let mailSubject = 'mail verification';
          let content = '<p>hii '+req.body.name+', please <a href = "http://localhost:4000/mail-verification?token='+verificationToken+'" >verify </a>your mail '
          sendMail(req.body.email,mailSubject,content)
            .then(() => {
              const student_data = Student.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                token: verificationToken
              })
              .then((student_data) => {
                console.log('New user created:', student_data.toJSON());
                res.status(201).json({ message: 'Student created successfully.' });
              })
              .catch((error) => {
                console.error('Error creating Student:', error);
                res.status(500).json({ message: 'Error creating user.' });
              });
            })
            .catch((error) => {
              console.error('Error sending email:', error);
              res.status(500).json({ message: 'Error sending email.' });
            });
        });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user.' });
      });


  };

  const verifyEmail = (req, res) => {
    const token = req.query.token;
    Student.findOne({ where: { token: token } })
      .then((Student) => {
        if (!Student) {
          return res.status(400).json({ message: 'Invalid verification token.' });
        }
  
        Student.update({ is_verified: true, token: null })
          .then(() => {
            console.log('user verified:', Student.toJSON());
            res.status(200).json({ message: 'Email verification successful. You can now log in.' });
          })
          .catch((error) => {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user.' });
          });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user.' });
      });
  };
  

  const studentLogin = (req, res) => {
    
      const email = req.body.email;
      const password = req.body.password;
    
      Student.findOne({ where: { email } })
        .then((Student) => {
          if (!Student) {
            return res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
          }
    
          bcrypt.compare(password, Student.password, (err, result) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              return res.status(500).json({ message: 'Error authenticating Student.' });
            }
    
            if (result) {
              if (!Student.is_verified) {
                return res.status(401).json({ message: 'Authentication failed. Please verify your email address.' });
              }
    
              const token = generateToken(Student.student_id);
              const userData = { student_id: Student.student_id, name: Student.name, email: Student.email, phone: Student.phone };
              res.status(200).json({ message: 'Authentication successful.', token ,Student: userData});
            } else {
              res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
            }
          });
        })
        .catch((error) => {
          console.error('Error finding Student:', error);
          res.status(500).json({ message: 'Error authenticating Student.' });
        });
    };






    const addToCart = async (req, res) => {
      const courseId = req.body.course_id;
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.student_id;
    
        const student = await Student.findByPk(studentId);
        const Course = await course.findByPk(courseId);
    
        if (!student || !Course) {
          return res.status(404).json({ success: false, message: 'student or course not found' });
        }
    
        const cartItem = await CartStudent.findOne({
          where: { course_id: courseId, student_id: studentId },
          include: [{ model: course, attributes: ['price'] }],
        });
    
        let totalPrice = 0;
        if (cartItem) {
          return res.status(200).json({ success: true, message: 'course is already in the cart', totalPrice: cartItem.total });
        } else {
          const cartItems = await CartStudent.findAll({
            where: { student_id: studentId },
            include: [{ model: course, attributes: ['price'] }],
          });
          totalPrice = cartItems.reduce((total, item) => total + item.course.price, 0) + Course.price;
          await CartStudent.create({
            student_id: studentId,
            course_id: courseId,
            total: totalPrice,
          });
        }
    
        return res.status(200).json({ success: true, message: 'course added to cart', totalPrice });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
    
    

    const getCartItemsByStudent = async (req, res) => {
      const token = req.headers.authorization.split(' ')[1];
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const studentId = decoded.student_id;
    
        const cartItems = await CartStudent.findAll({
          where: { student_id: studentId },
          include: [{
            model: course,
            attributes: ['course_name', 'description', 'price', 'image', 'rating'],
            include: [
              {
                model: Instructor,
                attributes: ['name']
              }
            ]
          }],
        });
    
        return res.status(200).json({ success: true, cartItems });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };





    const deleteCartItemByCourse_id = async (req, res) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // retrieve the token from the authorization header
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      const courseId = req.params.course_id;
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token and get the decoded payload
      const studentId = decoded.student_id;
    
      try {
        const cartItemToDelete = await CartStudent.findOne({
          where: { course_id: courseId, student_id: studentId },
          include: [{
            model: course,
            attributes: ['price'],
          }],
        });
    
        if (!cartItemToDelete) {
          return res.status(404).json({ success: false, message: `Cart item with product ID ${courseId} not found for user ${studentId}` });
        }
    
        const deletedCoursePrice = cartItemToDelete.course.price;
    
        await cartItemToDelete.destroy();
    
        const cartItems = await CartStudent.findAll({
          where: { student_id: studentId },
          include: [{
            model: course,
            attributes: ['price'],
          }],
        });
    
        const totalPrice = cartItems.reduce((total, item) => {
          return total + item.course.price;
        }, 0);
    
        const updatedTotalPrice = totalPrice - deletedCoursePrice;
    
        return res.status(200).json({ success: true, message: `Cart item with product ID ${courseId} has been deleted`, totalPrice: updatedTotalPrice });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };

    const addToWistlist = async (req, res) => {
      const courseId = req.body.course_id;
      try {
       
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.student_id;
    
        const student = await Student.findByPk(studentId);
        const Course = await course.findByPk(courseId);
    
        if (!Course || !student) {
          return res.status(404).json({ success: false, message: 'student or course not found' });
        }
    
        const wishListItem = await Wishlisht.create({
          student_id: studentId,
          course_id: courseId,
        });
    
        return res.status(200).json({ success: true, message: 'Item added to wishlist' });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
    


    const getWishItems = async (req, res) => {
      const token = req.headers.authorization.split(' ')[1];
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const studentId = decoded.student_id;
    
        const cartItems = await Wishlisht.findAll({
          where: { student_id: studentId },
          include: [{
            model: course,
            attributes: ['course_name', 'description', 'price', 'image', 'rating'],
            include: [
              {
                model: Instructor,
                attributes: ['name']
              }
            ]
          }],
        });
    
        return res.status(200).json({ success: true, cartItems });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
    
    const deleteCourseWishlist = async (req, res) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // retrieve the token from the authorization header
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      const courseId = req.params.course_id;
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token and get the decoded payload
      const studentId = decoded.student_id;
    
      try {
        const cartItemToDelete = await Wishlisht.findOne({
          where: { course_id: courseId, student_id: studentId }
        });
    
        if (!cartItemToDelete) {
          return res.status(404).json({ success: false, message: `Cart item with product ID ${courseId} not found for user ${studentId}` });
        }
    
        await cartItemToDelete.destroy();
    
        return res.status(200).json({ success: true, message: `Cart item with product ID ${courseId} has been deleted` });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
  



    const purchase = async (req, res) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
    
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
          if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Unauthorized access.' });
          }
          const studentId = decodedToken.student_id;
    
          // Check if the student with the given id exists
          const student = await Student.findOne({ where: { student_id: studentId } });
          if (!student) {
            return res.status(404).send({ message: 'Student not found' });
          }
    
          const courseId = req.params.course_id;
    
          // Check if the course with the given id exists
          const Course = await course.findOne({ where: { course_id: courseId } });
          if (!Course) {
            return res.status(404).send({ message: 'Course not found' });
          }
    
          // Check if the student has already purchased the course
          const existingPurchase = await CoursePurchase.findOne({
            where: { student_id: studentId, course_id: courseId },
          });
          if (existingPurchase) {
            return res.status(400).send({ message: 'Course already purchased' });
          }
    
          // Create a new purchase entry
          const newPurchase = await CoursePurchase.create({
            student_id: studentId,
            course_id: courseId,
          });
    
          res.status(201).send({ message: 'Course purchased successfully', purchase: newPurchase });
        });
      } catch (error) {
        console.error(error);
    
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).send({ message: 'Invalid token' });
        }
    
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
          return res.status(400).send({ message: 'Validation error', errors });
        }
    
        res.status(500).send({ message: 'Error purchasing course' });
      }
    };



    const CourseProgress = async (req, res) => {
      const courseId = req.params.course_id;
      const videoId = req.body.video_id;
      const currentTime = req.body.current_time;
    
      try {
        const token = req.headers.authorization.split(' ')[1];
    
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
          if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Unauthorized access.' });
          }
          const studentId = decodedToken.student_id;
    
          const coursePurchased = await CoursePurchase.findOne({
            where: { student_id: studentId, course_id: courseId },
          });
    
          if (!coursePurchased) {
            return res.status(401).json({ message: 'You have not purchased this course.' });
          }
    
          const CourseVideo = await courseVideo.findOne({
            where: { course_id: courseId, video_id: videoId },
          });
    
          if (!CourseVideo) {
            return res.status(404).json({ message: 'Video not found for this course' });
          }
    
          const courseprogress = await courseProgress.findOne({
            where: { student_id: studentId, course_id: courseId, video_id: videoId },
          });
    
          if (!courseprogress) {
            await courseProgress.create({
              student_id: studentId,
              course_id: courseId,
              video_id: videoId,
              watched_duration_seconds: currentTime,
            });
          } else {
            if (currentTime > courseprogress.watched_duration_seconds) {
              await courseProgress.update(
                { watched_duration_seconds: currentTime },
                { where: { student_id: studentId, course_id: courseId, video_id: videoId } }
              );
            }
          }
    
          res.status(200).send({ message: 'Course progress updated successfully' });
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating course progress' });
      }
    };



  module.exports = {addStudent,verifyEmail,studentLogin, purchase,CourseProgress,addToCart,getCartItemsByStudent,
    deleteCartItemByCourse_id ,addToWistlist,getWishItems,deleteCourseWishlist}
=======
var db = require('../models/index')
var Student = db.Student
var course = db.course
var CoursePurchase = db.Purchase
var CartStudent = db.addToCart
var Instructor = db.instructor
var Wishlisht = db.StudentWishlist
var sectionVideo = db.sectionVideo
var CourseVideoProgress = db.CourseVideoProgress
var Certificate = db.certificate
var curriculumSection = db.curriculumSection




const sendMail = require('../helper/sendMail')


const bcrypt = require('bcrypt');
const randomstring = require('randomstring');


const jwt = require('jsonwebtoken')
const student = require('../models/student')

const {JWT_SECRET} = process.env

const generateToken = (student_id) => {
  try {
    const token = jwt.sign({ student_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate token');
  }
};



  const saltRounds = 10; 
  
  const addStudent = async (req, res) => {
   
    const email = req.body.email;
    Student.findOne({ where: { email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use. Please choose a different email.' });
        }
  
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Error creating user.' });
          }
  
          const verificationToken = randomstring.generate();
          let mailSubject = 'mail verification';
          let content = '<p>hii '+req.body.name+', please <a href = "http://localhost:4000/mail-verification?token='+verificationToken+'" >verify </a>your mail '
          sendMail(req.body.email,mailSubject,content)
            .then(() => {
              const student_data = Student.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                token: verificationToken
              })
              .then((student_data) => {
                console.log('New user created:', student_data.toJSON());
                res.status(201).json({ message: 'Student created successfully.' });
              })
              .catch((error) => {
                console.error('Error creating Student:', error);
                res.status(500).json({ message: 'Error creating user.' });
              });
            })
            .catch((error) => {
              console.error('Error sending email:', error);
              res.status(500).json({ message: 'Error sending email.' });
            });
        });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user.' });
      });


  };

  const verifyEmail = (req, res) => {
    const token = req.query.token;
    Student.findOne({ where: { token: token } })
      .then((Student) => {
        if (!Student) {
          return res.status(400).json({ message: 'Invalid verification token.' });
        }
  
        Student.update({ is_verified: true, token: null })
          .then(() => {
            console.log('user verified:', Student.toJSON());
            res.status(200).json({ message: 'Email verification successful. You can now log in.' });
          })
          .catch((error) => {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user.' });
          });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user.' });
      });
  };
  

  const studentLogin = (req, res) => {
    
      const email = req.body.email;
      const password = req.body.password;
    
      Student.findOne({ where: { email } })
        .then((Student) => {
          if (!Student) {
            return res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
          }
    
          bcrypt.compare(password, Student.password, (err, result) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              return res.status(500).json({ message: 'Error authenticating Student.' });
            }
    
            if (result) {
              if (!Student.is_verified) {
                return res.status(401).json({ message: 'Authentication failed. Please verify your email address.' });
              }
    
              const token = generateToken(Student.student_id);
              const userData = { student_id: Student.student_id, name: Student.name, email: Student.email, phone: Student.phone };
              res.status(200).json({ message: 'Authentication successful.', token ,Student: userData});
            } else {
              res.status(401).json({ message: 'Authentication failed. Incorrect email or password.' });
            }
          });
        })
        .catch((error) => {
          console.error('Error finding Student:', error);
          res.status(500).json({ message: 'Error authenticating Student.' });
        });
    };






    const addToCart = async (req, res) => {
      const courseId = req.body.course_id;
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.student_id;
    
        const student = await Student.findByPk(studentId);
        const Course = await course.findByPk(courseId);
    
        if (!student || !Course) {
          return res.status(404).json({ success: false, message: 'student or course not found' });
        }
    
        const cartItem = await CartStudent.findOne({
          where: { course_id: courseId, student_id: studentId },
          include: [{ model: course, attributes: ['price'] }],
        });
    
        let totalPrice = 0;
        if (cartItem) {
          return res.status(200).json({ success: true, message: 'course is already in the cart', totalPrice: cartItem.total });
        } else {
          const cartItems = await CartStudent.findAll({
            where: { student_id: studentId },
            include: [{ model: course, attributes: ['price'] }],
          });
          totalPrice = cartItems.reduce((total, item) => total + item.course.price, 0) + Course.price;
          await CartStudent.create({
            student_id: studentId,
            course_id: courseId,
            total: totalPrice,
          });
        }
    
        return res.status(200).json({ success: true, message: 'course added to cart', totalPrice });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
    
    

    const getCartItemsByStudent = async (req, res) => {
      const token = req.headers.authorization.split(' ')[1];
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const studentId = decoded.student_id;
    
        const cartItems = await CartStudent.findAll({
          where: { student_id: studentId },
          include: [{
            model: course,
            attributes: ['course_name', 'description', 'price', 'image', 'rating'],
            include: [
              {
                model: Instructor,
                attributes: ['name']
              }
            ]
          }],
        });
    
        return res.status(200).json({ success: true, cartItems });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };





    const deleteCartItemByCourse_id = async (req, res) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // retrieve the token from the authorization header
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      const courseId = req.params.course_id;
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token and get the decoded payload
      const studentId = decoded.student_id;
    
      try {
        const cartItemToDelete = await CartStudent.findOne({
          where: { course_id: courseId, student_id: studentId },
          include: [{
            model: course,
            attributes: ['price'],
          }],
        });
    
        if (!cartItemToDelete) {
          return res.status(404).json({ success: false, message: `Cart item with product ID ${courseId} not found for user ${studentId}` });
        }
    
        const deletedCoursePrice = cartItemToDelete.course.price;
    
        await cartItemToDelete.destroy();
    
        const cartItems = await CartStudent.findAll({
          where: { student_id: studentId },
          include: [{
            model: course,
            attributes: ['price'],
          }],
        });
    
        const totalPrice = cartItems.reduce((total, item) => {
          return total + item.course.price;
        }, 0);
    
        const updatedTotalPrice = totalPrice - deletedCoursePrice;
    
        return res.status(200).json({ success: true, message: `Cart item with product ID ${courseId} has been deleted`, totalPrice: updatedTotalPrice });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };

    const addToWistlist = async (req, res) => {
      const courseId = req.body.course_id;
      try {
       
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.student_id;
    
        const student = await Student.findByPk(studentId);
        const Course = await course.findByPk(courseId);
    
        if (!Course || !student) {
          return res.status(404).json({ success: false, message: 'student or course not found' });
        }
    
        const wishListItem = await Wishlisht.create({
          student_id: studentId,
          course_id: courseId,
        });
    
        return res.status(200).json({ success: true, message: 'Item added to wishlist' });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
    


    const getWishItems = async (req, res) => {
      const token = req.headers.authorization.split(' ')[1];
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const studentId = decoded.student_id;
    
        const cartItems = await Wishlisht.findAll({
          where: { student_id: studentId },
          include: [{
            model: course,
            attributes: ['course_name', 'description', 'price', 'image', 'rating'],
            include: [
              {
                model: Instructor,
                attributes: ['name']
              }
            ]
          }],
        });
    
        return res.status(200).json({ success: true, cartItems });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
    
    const deleteCourseWishlist = async (req, res) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // retrieve the token from the authorization header
    
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Missing token' });
      }
    
      const courseId = req.params.course_id;
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token and get the decoded payload
      const studentId = decoded.student_id;
    
      try {
        const cartItemToDelete = await Wishlisht.findOne({
          where: { course_id: courseId, student_id: studentId }
        });
    
        if (!cartItemToDelete) {
          return res.status(404).json({ success: false, message: `Cart item with product ID ${courseId} not found for user ${studentId}` });
        }
    
        await cartItemToDelete.destroy();
    
        return res.status(200).json({ success: true, message: `Cart item with product ID ${courseId} has been deleted` });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
  



    const purchase = async (req, res) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
    
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
          if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Unauthorized access.' });
          }
          const studentId = decodedToken.student_id;
    
          // Check if the student with the given id exists
          const student = await Student.findOne({ where: { student_id: studentId } });
          if (!student) {
            return res.status(404).send({ message: 'Student not found' });
          }
    
          const courseId = req.params.course_id;
    
          // Check if the course with the given id exists
          const Course = await course.findOne({ where: { course_id: courseId } });
          if (!Course) {
            return res.status(404).send({ message: 'Course not found' });
          }
    
          // Check if the student has already purchased the course
          const existingPurchase = await CoursePurchase.findOne({
            where: { student_id: studentId, course_id: courseId },
          });
          if (existingPurchase) {
            return res.status(400).send({ message: 'Course already purchased' });
          }
    
          // Create a new purchase entry
          const newPurchase = await CoursePurchase.create({
            student_id: studentId,
            course_id: courseId,
          });
    
          res.status(201).send({ message: 'Course purchased successfully', purchase: newPurchase });
        });
      } catch (error) {
        console.error(error);
    
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).send({ message: 'Invalid token' });
        }
    
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
          return res.status(400).send({ message: 'Validation error', errors });
        }
    
        res.status(500).send({ message: 'Error purchasing course' });
      }
    };



const CourseProgress = async (req, res) => {
  const courseId = req.params.course_id;
  const videoId = req.params.video_id;
  const currentTime = req.body.current_time;

  try {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }
      const studentId = decodedToken.student_id;

      const coursePurchased = await CoursePurchase.findOne({
        where: { student_id: studentId, course_id: courseId },
      });

      if (!coursePurchased) {
        return res.status(401).json({ message: 'You have not purchased this course.' });
      }

      const courseVideo = await sectionVideo.findOne({
        where: { course_id: courseId, video_id: videoId },
      });

      if (!courseVideo) {
        return res.status(404).json({ message: 'Video not found for this course' });
      }

      const course_Progress = await CourseVideoProgress.findOne({
        where: { student_id: studentId, course_id: courseId, video_id: videoId },
      });

      if (!course_Progress) {
        await CourseVideoProgress.create({
          student_id: studentId,
          course_id: courseId,
          video_id: videoId,
          watched_duration_seconds: currentTime,
          video_duration_seconds: courseVideo.duration,
          is_complete: false,
        });
      } else {
        if (currentTime >= courseVideo.duration) {
          await CourseVideoProgress.update(
            { watched_duration_seconds: currentTime, is_complete: true },
            { where: { student_id: studentId, course_id: courseId, video_id: videoId } }
          );
        } else {
          await CourseVideoProgress.update(
            { watched_duration_seconds: currentTime },
            { where: { student_id: studentId, course_id: courseId, video_id: videoId } }
          );
        }
      }

      res.status(200).send({ message: 'Course progress updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating course progress' });
  }
};


const updateVideoProgressDirectComplete = async (req, res) => {
  const courseId = req.params.course_id;
  const videoId = req.params.video_id;

  try {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }
      const studentId = decodedToken.student_id;

      const coursePurchased = await CoursePurchase.findOne({
        where: { student_id: studentId, course_id: courseId },
      });

      if (!coursePurchased) {
        return res.status(401).json({ message: 'You have not purchased this course.' });
      }

      const courseVideo = await sectionVideo.findOne({
        where: { course_id: courseId, video_id: videoId },
      });

      if (!courseVideo) {
        return res.status(404).json({ message: 'Video not found for this course' });
      }

      const course_Progress = await CourseVideoProgress.findOne({
        where: { student_id: studentId, course_id: courseId, video_id: videoId },
      });

      if (!course_Progress) {
        await CourseVideoProgress.create({
          student_id: studentId,
          course_id: courseId,
          video_id: videoId,
          watched_duration_seconds: courseVideo.duration,
          video_duration_seconds: courseVideo.duration,
          is_complete: true,
        });
      } else {
        await CourseVideoProgress.update(
          { is_complete: true },
          { where: { student_id: studentId, course_id: courseId, video_id: videoId } }
        );
      }

      res.status(200).send({ message: 'Video progress updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating video progress' });
  }
};


const generateCertificate = async (req, res) => {
  const courseId = req.params.course_id;

  try {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }

      console.log('decodedToken:', decodedToken);

      const studentId = decodedToken.student_id;

      const sections = await curriculumSection.findAll({ where: { course_id: courseId } });

      for (const section of sections) {
        const sectionVideos = await sectionVideo.findAll({ where: { section_id: section.section_id } });

        for (const video of sectionVideos) {
          const videoProgress = await CourseVideoProgress.findOne({
            where: { student_id: studentId, video_id: video.video_id },
          });
          if (!videoProgress || !videoProgress.is_complete) {
            return res.status(401).json({ message: 'You have not completed all the videos in this course yet.' });
          }
        }
      }

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






  module.exports = {addStudent,verifyEmail,studentLogin, purchase,CourseProgress,addToCart,getCartItemsByStudent,
    deleteCartItemByCourse_id ,addToWistlist,getWishItems,deleteCourseWishlist,updateVideoProgressDirectComplete,generateCertificate}
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
