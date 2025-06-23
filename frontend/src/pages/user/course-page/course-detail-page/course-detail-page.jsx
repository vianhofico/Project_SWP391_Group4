"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react"
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/outline"
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";


// Mock data for course categories
const mockCategories = [
  { categoryId: 0, name: "All Categories" },
  { categoryId: 1, name: "Programming" },
  { categoryId: 2, name: "Web Development" },
  { categoryId: 3, name: "Data Science" },
  { categoryId: 4, name: "UI/UX Design" },
]

// Updated mockCourses with categoryId
const mockCourses = [
  {
    courseId: 1,
    title: "Master Java Programming",
    description:
      "Learn Java from basics to advanced concepts, including OOP, Spring, and Hibernate. This comprehensive course covers everything from fundamental programming concepts to advanced enterprise-level development. You'll build real-world projects, understand design patterns, and master the Java ecosystem including frameworks like Spring Boot, Hibernate, and Maven. Perfect for beginners and intermediate developers looking to advance their Java skills.",
    price: 1200000,
    createdAt: "2025-01-15T10:30:00",
    rating: 4.7,
    imageUrl:
      "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: true,
    categoryId: 1, // Programming category
  },
  {
    courseId: 2,
    title: "ReactJS for Beginners",
    description:
      "A comprehensive course to build modern web applications using ReactJS. Learn component-based architecture, state management, hooks, and modern React patterns. Build multiple projects including a todo app, weather dashboard, and e-commerce site. Master JSX, props, state, lifecycle methods, and advanced concepts like Context API and custom hooks.",
    price: 0,
    createdAt: "2025-02-20T14:45:00",
    rating: 4.5,
    imageUrl:
      "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: true,
    categoryId: 2, // Web Development category
  },
  {
    courseId: 3,
    title: "Advanced Python for Data Science",
    description:
      "Dive into Python for data analysis, machine learning, and visualization. Master pandas, NumPy, matplotlib, seaborn, and scikit-learn. Learn statistical analysis, data cleaning, feature engineering, and machine learning algorithms. Build end-to-end data science projects and create compelling visualizations.",
    price: 1500000,
    createdAt: "2025-03-10T09:15:00",
    rating: 4.8,
    imageUrl:
      "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: true,
    categoryId: 3, // Data Science category
  },
  {
    courseId: 4,
    title: "UI/UX Design Fundamentals",
    description:
      "Learn to create user-friendly interfaces with Figma and design principles. Master the design thinking process, user research, wireframing, prototyping, and usability testing. Create beautiful, functional designs that solve real user problems.",
    price: 800000,
    createdAt: "2025-04-05T16:20:00",
    rating: 4.3,
    imageUrl:
      "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: false,
    categoryId: 4, // UI/UX Design category
  },
  {
    courseId: 5,
    title: "Full-Stack Web Development",
    description:
      "Become a full-stack developer with Node.js, Express, and MongoDB. Learn both frontend and backend development, database design, API creation, authentication, deployment, and modern development workflows. Build complete web applications from scratch.",
    price: 2000000,
    createdAt: "2025-05-12T11:00:00",
    rating: 4.9,
    imageUrl:
      "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: true,
    categoryId: 2, // Web Development category
  },
]

const mockUser = {
  userId: 1,
  fullName: "Tran My Linh",
  password: "abc12345",
  email: "huytdnhe180756@fpt.edu.vn",
  birthDate: "01/01/2000",
  role: "USER",
  createdAt: "19/06/2025 11:58",
  status: "Active",
  reportCount: 0,
  imageUrl:
    "https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg",
}

export default function CourseDetailPage({ courseId = 1 }) {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [relatedCourses, setRelatedCourses] = useState([])
  const [openProfileDialog, setOpenProfileDialog] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: mockUser.fullName,
    birthDate: "2000-01-01",
    imageUrl: mockUser.imageUrl,
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  })
    const navigate = useNavigate();


  // Load course details and related courses
  useEffect(() => {
    const course = mockCourses.find((c) => c.courseId === courseId && c.status)
    setSelectedCourse(course)

    if (course) {
      // Get related courses from the same category (excluding current course)
      const related = mockCourses
        .filter((c) => c.categoryId === course.categoryId && c.courseId !== courseId && c.status)
        .slice(0, 3)
      setRelatedCourses(related)
    }
  }, [courseId])

  // Get category name by categoryId
  const getCategoryName = (categoryId) => {
    const category = mockCategories.find((cat) => cat.categoryId === categoryId)
    return category ? category.name : "Unknown"
  }

  // Get category color for chips
  const getCategoryColor = (categoryId) => {
    const colors = {
      1: "blue", // Programming
      2: "green", // Web Development
      3: "purple", // Data Science
      4: "orange", // UI/UX Design
    }
    return colors[categoryId] || "gray"
  }

  // Format price to VND
  const formatPrice = (price) => {
    if (price === 0) return "Free"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // Mock handlers
  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)
  const handleRegister = () => {
    console.log("Register clicked");
    navigate("/auth/sign-up");

  }
  const handleUpdateProfile = () => {
    console.log("Profile updated:", formData)
    setOpenUpdateModal(false)
  }
  const handleChangePassword = () => {
    console.log("Password changed:", passwordData)
    setOpenPasswordModal(false)
    setPasswordData({ oldPassword: "", newPassword: "" })
  }
  const handleEnrollNow = () => {
    console.log(`Enrolled in course: ${courseId}`)
    alert(`Successfully enrolled in: ${selectedCourse?.title}`)
  }
  const handleBackToCourses = () => {
    navigate("/test");
  }
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Redirecting to course list with search: ${searchQuery}`)
    }
  }

  // If course not found, show fallback UI
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Typography variant="h4" className="text-[#4e73df] font-bold">
                  CourseHub
                </Typography>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="!border-gray-300 focus:!border-[#4e73df] pl-10"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{
                      className: "min-w-0",
                    }}
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Right Side - Login/Register or User Menu */}
              <div className="flex items-center space-x-4">
                {!isLoggedIn ? (
                  <>
                    <Button
                      onClick={handleLogin}
                      variant="gradient"
                      className="bg-gradient-to-r from-[#4e73df] to-[#224abe]"
                      size="sm"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={handleRegister}
                      variant="outlined"
                      className="border-[#4e73df] text-[#4e73df] hover:bg-[#4e73df] hover:text-white"
                      size="sm"
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <Menu>
                    <MenuHandler>
                      <Button variant="text" className="flex items-center gap-2 p-2">
                        <Avatar src={mockUser.imageUrl} alt={mockUser.fullName} size="sm" variant="circular" />
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem onClick={() => setOpenProfileDialog(true)} className="flex items-center gap-2">
                        <UserCircleIcon className="h-4 w-4" />
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Course Not Found Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <Typography variant="h2" color="gray" className="mb-4">
              Course Not Found
            </Typography>
            <Typography variant="paragraph" color="gray" className="mb-8 text-lg">
              The course you're looking for doesn't exist or is no longer available.
            </Typography>
            <Button
              onClick={handleBackToCourses}
              variant="gradient"
              className="bg-gradient-to-r from-[#4e73df] to-[#224abe]"
              size="lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Course List
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Typography variant="h4" className="text-[#4e73df] font-bold">
                CourseHub
              </Typography>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="!border-gray-300 focus:!border-[#4e73df] pl-10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Right Side - Login/Register or User Menu */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    onClick={handleLogin}
                    variant="gradient"
                    className="bg-gradient-to-r from-[#4e73df] to-[#224abe]"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleRegister}
                    variant="outlined"
                    className="border-[#4e73df] text-[#4e73df] hover:bg-[#4e73df] hover:text-white"
                    size="sm"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Menu>
                  <MenuHandler>
                    <Button variant="text" className="flex items-center gap-2 p-2">
                      <Avatar src={mockUser.imageUrl} alt={mockUser.fullName} size="sm" variant="circular" />
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => setOpenProfileDialog(true)} className="flex items-center gap-2">
                      <UserCircleIcon className="h-4 w-4" />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBackToCourses}
            variant="text"
            className="flex items-center gap-2 text-[#4e73df] hover:bg-blue-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Course Information */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              {/* Course Image Banner */}
              <CardHeader className="relative h-64 lg:h-80">
                <img
                  src={selectedCourse.imageUrl || "/placeholder.svg"}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </CardHeader>

              <CardBody className="p-6">
                {/* Course Title and Category */}
                <div className="mb-4">
                  <Typography variant="h2" color="blue-gray" className="mb-3">
                    {selectedCourse.title}
                  </Typography>
                  <Chip
                    variant="gradient"
                    color={getCategoryColor(selectedCourse.categoryId)}
                    value={getCategoryName(selectedCourse.categoryId)}
                    className="py-2 px-4 text-sm font-medium w-fit"
                  />
                </div>

                {/* Course Meta Information */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <Typography variant="small" className="font-medium">
                      {selectedCourse.rating} Rating
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <Typography variant="small">Created: {formatDate(selectedCourse.createdAt)}</Typography>
                  </div>
                  <div>
                    <Chip
                      variant="gradient"
                      color={selectedCourse.price === 0 ? "green" : "blue"}
                      value={formatPrice(selectedCourse.price)}
                      className="py-1 px-3 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Course Description */}
                <div className="mb-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    Course Description
                  </Typography>
                  <Typography variant="paragraph" color="gray" className="text-base leading-relaxed">
                    {selectedCourse.description}
                  </Typography>
                </div>

                {/* Video Trailer */}
                <div className="mb-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    Course Preview
                  </Typography>
                  <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
                    <iframe
                      src={selectedCourse.videoTrailerUrl}
                      title="Course Trailer"
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <Card className="mb-6 sticky top-4">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    {formatPrice(selectedCourse.price)}
                  </Typography>
                  <Typography variant="small" color="gray">
                    One-time payment
                  </Typography>
                </div>

                <Button
                  onClick={handleEnrollNow}
                  variant="gradient"
                  className="bg-gradient-to-r from-[#4e73df] to-[#224abe] w-full mb-4 hover:scale-105 transform transition-transform"
                  size="lg"
                >
                  Enroll Now
                </Button>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Course Rating:</span>
                    <span className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      {selectedCourse.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{getCategoryName(selectedCourse.categoryId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(selectedCourse.createdAt)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <Card>
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-4">
                    Related Courses
                  </Typography>
                  <div className="space-y-4">
                    {relatedCourses.map((course) => (
                      <Card
                        key={course.courseId}
                        className="hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
                      >
                        <CardBody className="p-4">
                          <div className="flex gap-3">
                            <img
                              src={course.imageUrl || "/placeholder.svg"}
                              alt={course.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                                {course.title}
                              </Typography>
                              <div className="flex items-center justify-between">
                                <Chip
                                  variant="gradient"
                                  color={course.price === 0 ? "green" : "blue"}
                                  value={formatPrice(course.price)}
                                  className="py-0.5 px-2 text-xs"
                                />
                                <Typography variant="small" color="gray" className="flex items-center gap-1">
                                  <StarIcon className="h-3 w-3 text-yellow-500" />
                                  {course.rating}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} handler={() => setOpenProfileDialog(false)} size="md">
        <DialogHeader className="bg-gradient-to-r from-[#4e73df] to-[#224abe] text-white rounded-t-lg">
          User Profile
        </DialogHeader>
        <DialogBody className="text-center p-6">
          <Avatar
            src={mockUser.imageUrl}
            alt={mockUser.fullName}
            size="xxl"
            variant="circular"
            className="mb-4 mx-auto"
          />
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {mockUser.fullName}
          </Typography>
          <Typography variant="small" color="blue-gray" className="mb-2">
            {mockUser.email}
          </Typography>
          <Typography variant="small" color="gray" className="mb-6">
            Birth Date: {mockUser.birthDate}
          </Typography>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setOpenProfileDialog(false)
                setOpenUpdateModal(true)
              }}
              color="yellow"
              size="sm"
            >
              Update Information
            </Button>
            <Button
              onClick={() => {
                setOpenProfileDialog(false)
                setOpenPasswordModal(true)
              }}
              color="blue"
              size="sm"
            >
              Change Password
            </Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenProfileDialog(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Update Profile Modal */}
      <Dialog open={openUpdateModal} handler={() => setOpenUpdateModal(false)} size="sm">
        <DialogHeader>Update Profile Information</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} size="lg" />
            <Input
              label="Birth Date"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              size="lg"
            />
            <Input label="Avatar URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} size="lg" />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenUpdateModal(false)} className="mr-2">
            Cancel
          </Button>
          <Button color="green" onClick={handleUpdateProfile}>
            Update
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={openPasswordModal} handler={() => setOpenPasswordModal(false)} size="sm">
        <DialogHeader>Change Password</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Old Password"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              size="lg"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              size="lg"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenPasswordModal(false)} className="mr-2">
            Cancel
          </Button>
          <Button color="green" onClick={handleChangePassword}>
            Update Password
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
