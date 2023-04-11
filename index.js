<<<<<<< HEAD

require("dotenv").config()

const express = require('express');

const app = express()
app.use(express.json());

const { isAuthorize } = require('./middleware/auth')


app.use(express.static('public'))

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest;
        if (file.mimetype.startsWith('video')) {
            dest = path.join(__dirname, 'public/videos');
        } else if (file.mimetype.startsWith('image')) {
            dest = path.join(__dirname, 'public/image');
        }
        else if (file.mimetype === 'application/pdf') {
            dest = path.join(__dirname, 'public/pdf');
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'video/mp4' || file.mimetype == 'video/avi' ||      file.mimetype == 'application/pdf' 
    ) ?
    // ||  file.mimetype == 'pdf/pdf'
        cb(null, true) : cb(null, false)
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;


const bodyParser = require('body-parser')
app.use(bodyParser.json())
require('./models/index')

var userContoller = require('./controller/student_controller')
var instructorContoller = require('./controller/instructor_controller')
// var courseController = require('./controller/course_controller')
// var studentCourse_controller = require('./controller/studentCourse_controller')
// var courseVideo_controller = require('./controller/courseVideo_controller')
// var courseProgress = require('./controller/courseProgress_controller')
// var certificate = require('./controller/certificate')





app.post('/addStudent', userContoller.addStudent)
app.get('/mail-verification', userContoller.verifyEmail)

app.get('/studentLogin', userContoller.studentLogin)
app.post('/addToCart', isAuthorize, userContoller.addToCart)
app.get('/getCart', isAuthorize, userContoller.getCartItemsByStudent)
app.delete('/RemoveCourseFromCart/:course_id', isAuthorize, userContoller.deleteCartItemByCourse_id)
app.post('/addToWishlist', isAuthorize, userContoller.addToWistlist)
app.get('/getWishList', isAuthorize, userContoller.getWishItems)
app.delete('/deleteCourseWishList/:course_id', isAuthorize, userContoller.deleteCourseWishlist)




app.post('/purchase/:course_id', isAuthorize, userContoller.purchase)
app.post('/Course_progress/:course_id', isAuthorize, userContoller.CourseProgress)


app.post('/addInstructor', instructorContoller.addInstructor)
app.get('/InstructorLogin', instructorContoller.loginInstructor)
app.post('/addCourse', upload.single('image'), isAuthorize, instructorContoller.addCourse)
app.get('/getCourseByInstructor', isAuthorize, instructorContoller.getCourseByInstructor)
app.get('/updateCourseByInstructor/:course_id', upload.single('image'), isAuthorize, instructorContoller.updateCourse)
app.delete('/Delete_course/:course_id', isAuthorize, instructorContoller.deleteCourse)
app.post('/create_course_cirriculum/:course_id', isAuthorize, instructorContoller.createCurriculum)
app.get('/get_cirriculum_by_course_id/:course_id', isAuthorize, instructorContoller.getCurriculum)
app.post('/create_section_in_curriculum/:curriculum_id/:course_id', isAuthorize, instructorContoller.createSection)
app.get('/get_Curriculum_details_With_Section/:course_id', isAuthorize, instructorContoller.getCurriculumdetailsWithSection)
app.post('/upload_video_in_section/:course_id/:section_id/:curriculum_id', upload.single('video_url'), isAuthorize, instructorContoller.uploadVideo)
app.get('/get_Videos_By_SectionId/:section_id', isAuthorize, instructorContoller.getVideosBySectionIdAndInstructor)
app.get('/get_Videos_By_SectionId/:section_id', instructorContoller.getVideosBySectionId)
app.post('/addAssignment/:course_id/:section_id',upload.single('assignment_file'), isAuthorize, instructorContoller.createAssignment)
app.get('/getAssignment/:course_id/:section_id', isAuthorize, instructorContoller.getAssignmentsBySectionAndCourse)











// app.post('/courseVideo/:course_id', upload.single('video_url'), instructorContoller.course_video)
app.get('/certificate/:course_id', isAuthorize, instructorContoller.generateCertificate)



// app.post('/addCourse', upload.single('image'), isAuthorize, instructorContoller.addCourse)
// app.get('/getCourse/:course_id', courseController.getCourse)













app.get('/', (req, res) => {
    res.send(' hello world')
})
const port = 4000
app.listen(port, () => {
    console.log('app will running on port 4000 ');
=======

require("dotenv").config()

const express = require('express');

const app = express()
app.use(express.json());

const { isAuthorize } = require('./middleware/auth')


app.use(express.static('public'))

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest;
        if (file.mimetype.startsWith('video')) {
            dest = path.join(__dirname, 'public/videos');
        } else if (file.mimetype.startsWith('image')) {
            dest = path.join(__dirname, 'public/image');
        }
        else if (file.mimetype === 'application/pdf') {
            dest = path.join(__dirname, 'public/pdf');
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'video/mp4' || file.mimetype == 'video/avi' ||      file.mimetype == 'application/pdf' 
    ) ?
    // ||  file.mimetype == 'pdf/pdf'
        cb(null, true) : cb(null, false)
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;


const bodyParser = require('body-parser')
app.use(bodyParser.json())
require('./models/index')

var userContoller = require('./controller/student_controller')
var instructorContoller = require('./controller/instructor_controller')
// var courseController = require('./controller/course_controller')
// var studentCourse_controller = require('./controller/studentCourse_controller')
// var courseVideo_controller = require('./controller/courseVideo_controller')
// var courseProgress = require('./controller/courseProgress_controller')
// var certificate = require('./controller/certificate')





app.post('/addStudent', userContoller.addStudent)
app.get('/mail-verification', userContoller.verifyEmail)

app.get('/studentLogin', userContoller.studentLogin)
app.post('/addToCart', isAuthorize, userContoller.addToCart)
app.get('/getCart', isAuthorize, userContoller.getCartItemsByStudent)
app.delete('/RemoveCourseFromCart/:course_id', isAuthorize, userContoller.deleteCartItemByCourse_id)
app.post('/addToWishlist', isAuthorize, userContoller.addToWistlist)
app.get('/getWishList', isAuthorize, userContoller.getWishItems)
app.delete('/deleteCourseWishList/:course_id', isAuthorize, userContoller.deleteCourseWishlist)
app.post('/purchase/:course_id', isAuthorize, userContoller.purchase)
app.post('/Course_progress/:course_id/:video_id', isAuthorize, userContoller.CourseProgress)
app.post('/generateCertificate/:course_id', isAuthorize, userContoller.generateCertificate)
app.post('/updateVideoProgressDirectComplete/:course_id/:video_id', isAuthorize, userContoller.updateVideoProgressDirectComplete)





app.post('/addInstructor', instructorContoller.addInstructor)
app.get('/InstructorLogin', instructorContoller.loginInstructor)
app.post('/addCourse', upload.single('image'), isAuthorize, instructorContoller.addCourse)
app.get('/getCourseByInstructor', isAuthorize, instructorContoller.getCourseByInstructor)
app.get('/updateCourseByInstructor/:course_id', upload.single('image'), isAuthorize, instructorContoller.updateCourse)
app.delete('/Delete_course/:course_id', isAuthorize, instructorContoller.deleteCourse)
app.post('/create_course_cirriculum/:course_id', isAuthorize, instructorContoller.createCurriculum)
app.get('/get_cirriculum_by_course_id/:course_id', isAuthorize, instructorContoller.getCurriculum)
app.post('/create_section_in_curriculum/:curriculum_id/:course_id', isAuthorize, instructorContoller.createSection)
app.get('/get_Curriculum_details_With_Section/:course_id', isAuthorize, instructorContoller.getCurriculumdetailsWithSection)
app.post('/upload_video_in_section/:course_id/:section_id/:curriculum_id', upload.single('video_url'), isAuthorize, instructorContoller.uploadVideo)
app.get('/get_Videos_By_SectionId/:section_id', isAuthorize, instructorContoller.getVideosBySectionIdAndInstructor)
app.get('/get_Videos_By_SectionId/:section_id', instructorContoller.getVideosBySectionId)
app.post('/addAssignment/:course_id/:section_id',upload.single('assignment_file'), isAuthorize, instructorContoller.createAssignment)
app.get('/getAssignment/:course_id/:section_id', isAuthorize, instructorContoller.getAssignmentsBySectionAndCourse)











// app.post('/courseVideo/:course_id', upload.single('video_url'), instructorContoller.course_video)
app.get('/certificate/:course_id', isAuthorize, instructorContoller.generateCertificate)



// app.post('/addCourse', upload.single('image'), isAuthorize, instructorContoller.addCourse)
// app.get('/getCourse/:course_id', courseController.getCourse)













app.get('/', (req, res) => {
    res.send(' hello world')
})
const port = 4000
app.listen(port, () => {
    console.log('app will running on port 4000 ');
>>>>>>> 05c9d8a0b5f5dec2f8e900d688a51e2b01a70d06
})